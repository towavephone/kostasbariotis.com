---
title: 编译器之旅（三）——运算符优先级
date: 2020-3-2 12:06:36
categories:
  - 计算机基础
tags: 编译原理, 语法分析
path: /tour-of-compiler-operator-precedence/
---

# 需求

我们在上一部分中看到，解析器不一定强制执行我们语言的语义，它仅强制执行语法的语法和结构规则。

我们最终得到了计算表达式错误值（如 2 _ 3 + 4 _ 5）的代码，因为该代码创建了一个如下所示的 AST：

```
 *
/ \
2  +
  / \
  3  *
    / \
   4   5
```

为了解决这个问题，我们必须向解析器添加代码以执行运算符优先级。

# 准备

有（至少）两种方法：

- 在语言的语法中明确运算符的优先级
- 用运算符优先级表影响现有解析器

## 明确运算符优先级

这是旅程最后一部分的语法：

```
expression: number
          | expression '*' expression
          | expression '/' expression
          | expression '+' expression
          | expression '-' expression
          ;

number:  T_INTLIT
         ;
```

请注意这四个数学运算符之间没有区别。让我们调整语法，以便有所不同：

```
expression: additive_expression
    ;

additive_expression:
      multiplicative_expression
    | additive_expression '+' multiplicative_expression
    | additive_expression '-' multiplicative_expression
    ;

multiplicative_expression:
      number
    | number '*' multiplicative_expression
    | number '/' multiplicative_expression
    ;

number:  T_INTLIT
         ;
```

现在，我们有两种类型的表达式：加法表达式和乘法表达式。请注意，语法现在强制数字仅作为乘法表达式的一部分。这迫使'\*'和'/'运算符更紧密地绑定到任一侧的数字，因此具有更高的优先级。

任何加法表达式实际上要么本身就是乘法表达式，要么是加法（即乘法）表达式，后跟“ +”或“-”运算符，然后是另一个乘法表达式。现在，加性表达式的出现率比乘法表达式低得多。

# 核心逻辑

## 在递归下降解析器中执行上述操作

我们如何将语法的上述版本实现到递归下降解析器中？我已在文件中完成此操作，expr2.c 下面将介绍代码。

答案是拥有一个 multiplicative_expr()处理'\*'和'/'运算符的 additive_expr()函数，以及一个处理优先级较低的'+'和'-'运算符的函数。

这两个函数都将读入某些内容和一个运算符。然后，尽管后面的运算符具有相同的优先级，但是每个函数都会解析更多的输入，并将左半部分和右半部分与第一个运算符组合在一起。

但是，additive_expr()必须遵循更高优先级的 multiplicative_expr()功能。这是如何完成的。

## additive_expr()

```c
// 返回一个AST树，其根是一个“+”或“-”二进制运算符
struct ASTnode *additive_expr(void) {
  struct ASTnode *left, *right;
  int tokentype;

  // 获得比我们的左子树更高的优先级
  left = multiplicative_expr();

  // 如果没有剩余令牌，则仅返回左侧节点
  tokentype = Token.token;
  if (tokentype == T_EOF)
    return (left);

  // Cache the '+' or '-' token type

  // 以优先级循环处理令牌
  while (1) {
    // 获取下一个整数文字
    scan(&Token);

    // 获得比我们的右子树更高的优先级
    right = multiplicative_expr();

    // 使用低优先级运算符将两个子树连接起来
    left = mkastnode(arithop(tokentype), left, right, 0);

    // 并以优先级获取下一个令牌
    tokentype = Token.token;
    if (tokentype == T_EOF)
      break;
  }

  // Return whatever tree we have created
  return (left);
}
```

从头开始，multiplicative_expr() 如果第一个运算符为高优先级'\*'或'/' ，我们立即调用。该函数仅在遇到低优先级的“+”或“-”运算符时返回。

在循环内部 multiplicative_expr()，如果将来有任何运算符的优先级高于现有的，我们将再次调用。

一旦有了左右子树，我们就可以将它们与最后一次绕过循环的运算符结合起来。重复此操作，以便如果我们有表达式 2 + 4 + 6，我们将得到 AST 树：

```
    +
   / \
  +   6
 / \
2   4
```

但是，如果 multiplicative_expr() 拥有自己的更高优先级运算符，我们将合并其中具有多个节点的子树。

## multiplicative_expr()

```c
// 返回根为'*'或'/'二进制运算符的AST树
struct ASTnode *multiplicative_expr(void) {
  struct ASTnode *left, *right;
  int tokentype;

  // 获取左侧的整数文字
  // 同时获取下一个令牌
  left = primary();

  tokentype = Token.token;
  if (tokentype == T_EOF)
    return (left);

  // While the token is a '*' or '/'
  while ((tokentype == T_STAR) || (tokentype == T_SLASH)) {
    // Fetch in the next integer literal
    scan(&Token);
    right = primary();

    // Join that with the left integer literal
    left = mkastnode(arithop(tokentype), left, right, 0);

    // Update the details of the current token.
    // If no tokens left, return just the left node
    tokentype = Token.token;
    if (tokentype == T_EOF)
      break;
  }

  // Return whatever tree we have created
  return (left);
}
```

该代码与 additive_expr() 相似，不同之处在于我们需要调用 primary() 以获得整数元素，我们也只有在具有较高优先级的运算符（即'\*'和'/'运算符）时循环。遇到低优先级运算符后，我们只需返回到此为止构建的子树即可，再返回 additive_expr() 处理低优先级运算符。

## 上面的缺点

由于要达到正确的优先级，需要进行所有的函数调用，因此以显式的运算符优先级构造递归下降解析器的上述方法效率低下，还必须有函数来处理每个级别的运算符优先级，因此我们最终需要编写许多行代码。

## 替代方案：Pratt 解析

减少代码量的一种方法是使用 Pratt 解析器 ，该解析器具有与每个标记关联的优先级值表，而不是使用具有在语法中复制显式优先级的函数。

在这一点上，我强烈建议您阅读 Bob Nystrom 撰写的 Pratt Parsers：轻松进行表达式解析。

## expr.c: 普拉特解析

我已经实现了 Pratt 解析，expr.c 是用来替代 expr2.c 的。

首先，我们需要一些代码来确定每个令牌的优先级：

```c
// Operator precedence for each token
// enum {
//   A_ADD, A_SUBTRACT, A_MULTIPLY, A_DIVIDE, A_INTLIT
// };
static int OpPrec[] = { 0, 10, 10, 20, 20, 0 };

// Check that we have a binary operator and
// return its precedence.
static int op_precedence(int tokentype) {
  int prec = OpPrec[tokentype];
  if (prec == 0) {
    fprintf(stderr, "syntax error on line %d, token %d\n", Line, tokentype);
    exit(1);
  }
  return (prec);
}
```

较高的数字（例如 20）表示优先级高于较低的数字（例如 10）。

现在您可能会问：当您有一个查找表时，为什么要有一个函数 OpPrec[]？答案是：发现语法错误。

考虑一个看起来像的输入 234 101 + 12。我们可以扫描前两个标记。但是，如果我们只是简单地获取第二个 101 令牌的优先级，我们不会注意到它不是运算符。因此，该 op_precedence() 函数强制执行正确的语法语法。

现在，我们不再为每个优先级都拥有一个函数，而是拥有一个使用运算符优先级表的单一表达式函数：

```c
// Return an AST tree whose root is a binary operator.
// Parameter ptp is the previous token's precedence.
struct ASTnode *binexpr(int ptp) {
  struct ASTnode *left, *right;
  int tokentype;

  // Get the integer literal on the left.
  // Fetch the next token at the same time.
  left = primary();

  // If no tokens left, return just the left node
  tokentype = Token.token;
  if (tokentype == T_EOF)
    return (left);

  // While the precedence of this token is
  // more than that of the previous token precedence
  while (op_precedence(tokentype) > ptp) {
    // Fetch in the next integer literal
    scan(&Token);

    // Recursively call binexpr() with the
    // precedence of our token to build a sub-tree
    // 优先级高的优先建立子树
    right = binexpr(OpPrec[tokentype]);

    // Join that sub-tree with ours. Convert the token
    // into an AST operation at the same time.
    // 同时转换左子树
    left = mkastnode(arithop(tokentype), left, right, 0);

    // Update the details of the current token.
    // If no tokens left, return just the left node
    tokentype = Token.token;
    if (tokentype == T_EOF)
      return (left);
  }

  // Return the tree we have when the precedence
  // is the same or lower
  return (left);
}
```

首先，请注意这仍然像以前的解析器函数一样是递归的。这次我们收到在调用之前找到的令牌的优先级。

您还应该发现代码与 multiplicative_expr() 功能非常相似：读取整数文字，获取运算符的令牌类型，然后循环构建树。

区别在于循环条件和主体：

```c
multiplicative_expr():
  while ((tokentype == T_STAR) || (tokentype == T_SLASH)) {
    scan(&Token); right = primary();

    left = mkastnode(arithop(tokentype), left, right, 0);

    tokentype = Token.token;
    if (tokentype == T_EOF) return (left);
  }

binexpr():
  while (op_precedence(tokentype) > ptp) {
    scan(&Token); right = binexpr(OpPrec[tokentype]);

    left = mkastnode(arithop(tokentype), left, right, 0);

    tokentype = Token.token;
    if (tokentype == T_EOF) return (left);
  }
```

使用 Pratt 解析器时，当下一个运算符的优先级高于我们当前的令牌时，我们不仅可以使用获取下一个整数文字 primary()，还可以调用自身 binexpr(OpPrec[tokentype]) 以提高运算符的优先级。

一旦我们达到或低于优先级的令牌，我们将简单地返回 left。

这将是一个具有许多节点和运算符的子树，其优先级高于调用我们的运算符，或者对于与我们相同的运算符，它可能是单个整数文字。

现在，我们有一个函数来进行表达式解析。它使用一个小的辅助函数来强制运算符优先级，从而实现我们语言的语义。

# 运行结果

## 输入

```
2 + 3 * 5 - 8 / 3
```

```
13 -6+  4*
5
       +
08 / 3
```

```
12 34 + -56 * / - - 8 + * 2
```

```
23 +
18 -
45.6 * 2
/ 18
```

## 输出

```
$ make test
cc -o parser -g expr.c interp.c main.c scan.c tree.c
(./parser input01; \
 ./parser input02; \
 ./parser input03; \
 ./parser input04; \
 ./parser input05)
int 2
int 3
int 5
3 * 5
2 + 15
int 8
int 3
8 / 3
17 - 2
15
int 13
int 6
13 - 6
int 4
int 5
4 * 5
7 + 20
int 8
int 3
8 / 3
27 + 2
29
syntax error on line 1, token 5
Unrecognised character . on line 3
Unrecognised character a on line 1
```

```
$ make test2
(./parser2 input01; \
 ./parser2 input02; \
 ./parser2 input03; \
 ./parser2 input04; \
 ./parser2 input05)
15                                       # input01 result
29                                       # input02 result
syntax error on line 1, token 5          # input03 result
Unrecognised character . on line 3       # input04 result
Unrecognised character a on line 1       # input05 result
```

# 结论

现在退后一步，看看我们要做什么。现在我们有：

- 识别并以我们的语言返回令牌的扫描仪
- 识别我们的语法，报告语法错误并构建抽象语法树的解析器
- 解析器的优先级表，用于实现我们语言的语义
- 深度优先遍历抽象语法树并在输入中计算表达式结果的解释器

我们还没有一个编译器。但是，我们非常接近制作第一个编译器！

在编译器编写过程的下一部分中，我们将替换解释器。取而代之的是我们将编写一个转换器，为具有数学运算符的每个 AST 节点生成 x86-64 汇编代码。我们还将生成一些汇编前同步码和后同步码，以支持生成器输出的汇编代码。
