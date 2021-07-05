---
title: 编译器之旅（二）——解析简介
date: 2020-2-27 09:57:06
categories:
  - 计算机基础
tags: 编译原理, 语法分析
path: /tour-of-compiler-analysis-introduction/
---

# 需求

为上一节识别的语言定义一个语法

# 准备

## BNF

这是语法的 BNF 描述

```bash
expression: number
          | expression '*' expression
          | expression '/' expression
          | expression '+' expression
          | expression '-' expression
          ;

number:  T_INTLIT
         ;
```

竖线将语法中的选项分开，因此含义是：

- 表达式可以只是一个数字，或者
- 一个表达式是两个用'\*'标记分隔的表达式，或者
- 一个表达式是两个用'/'标记分隔的表达式，或者
- 一个表达式是两个用'+'标记分隔的表达式，或者
- 一个表达式是两个由'-'标记分隔的表达式
- 数字始终是 T_INTLIT

语法的 BNF 定义是递归的，这很明显：通过引用其他表达式来定义一个表达式。但是，有一种方法可以“自下而上”递归：当一个表达式证明是一个数字时，它始终是 T_INTLIT，因此不是递归的。

在 BNF 中，我们说“表达式”和“数字” 是非终结符，因为它们是由语法规则产生的。但是，T_INTLIT 是终端符号，因为它没有任何规则定义。相反，它是该语言中已经被认可的。同样，四个数学运算符也是终端符号。

## 递归下降解析

鉴于我们语言的语法是递归的，因此尝试递归解析它是有意义的。我们需要做的是读入令牌，然后向前看下一个令牌。根据下一个标记是什么，然后我们可以决定解析输入所需要的路径。这可能需要我们递归调用已被调用的函数。

在我们的例子中，任何表达式中的第一个标记都是数字，数学运算符可以跟在后面。之后，可能只有一个数字，或者可能是一个全新表达式的开始。我们如何递归解析呢？

我们可以编写如下的伪代码：

```
function expression() {
  Scan and check the first token is a number. Error if it's not
  Get the next token
  If we have reached the end of the input, return, i.e. base case

  Otherwise, call expression()
}
```

该函数能够递归地解析输入 2 + 3 - 5 T_EOF。

当然，我们对输入没有做任何事情，但这不是解析器的工作。解析器的工作是识别输入，并警告任何语法错误。然后对输入进行语义分析，即理解并执行该输入的含义。

## 抽象语法树

要进行语义分析，我们需要用于解释识别的输入或将其转换为另一种格式的代码，例如汇编代码。这一部分我们将为输入内容构建一个解释器，但是要到达那里，我们首先将输入转换为抽象语法树，也称为 AST。

我们将在 AST 中构建的每个节点的结构描述如下：（defs.h）

```c
// AST node types
enum {
  A_ADD, A_SUBTRACT, A_MULTIPLY, A_DIVIDE, A_INTLIT
};

// Abstract Syntax Tree structure
struct ASTnode {
  int op; // 对应结点的类型
  struct ASTnode *left; // 左子树右子树
  struct ASTnode *right;
  int intvalue; // 代表整数值，没有子树
};
```

## 建立 AST 节点和树

tree.c 具有构建 AST 的功能，最通用的函数 mkastnode() 接受 AST 节点中四个字段的值。它分配节点，填充字段值并返回指向该节点的指针：

```c
#include "defs.h"
#include "data.h"
#include "decl.h"

// AST tree functions
// Build and return a generic AST node
struct ASTnode *mkastnode(
  int op,
  struct ASTnode *left,
  struct ASTnode *right,
  int intvalue
) {
  struct ASTnode *n;

  // Malloc a new ASTnode
  n = (struct ASTnode *) malloc(sizeof(struct ASTnode));
  if (n == NULL) {
    fprintf(stderr, "Unable to malloc in mkastnode()\n");
    exit(1);
  }
  // Copy in the field values and return it
  n->op = op;
  n->left = left;
  n->right = right;
  n->intvalue = intvalue;
  return n;
}

// 创建 AST 叶子节点
struct ASTnode *mkastleaf(int op, int intvalue) {
  return mkastnode(op, NULL, NULL, intvalue);
}

// 创建一个有单个子节点的 AST 节点
struct ASTnode *mkastunary(int op, struct ASTnode *left, int intvalue) {
  return mkastnode(op, left, NULL, intvalue);
}
```

## AST 的目的

我们将使用 AST 来存储我们认识的每个表达式，以便以后可以递归遍历它以计算表达式的最终值，但需要处理数学运算符的优先级，这是一个例子。

考虑一下表达式 2 _ 3 + 4 _ 5。现在，乘法比加法具有更高的优先级。因此，我们希望将乘法操作数绑定在一起并在执行加法之前执行这些操作。

如果我们生成的 AST 树看起来像这样：

```
      +
     / \
    /   \
   /     \
  *       *
 / \     / \
2   3   4   5
```

然后当遍历树时，我们将 2*3 首先执行，然后执行 4*5。获得这些结果后，便可以将它们传递到树的根部以执行加法。

# 核心逻辑

## 表达式解析器

现在，我们可以将扫描仪中的令牌值重新用作 AST 节点操作值，但是我想将令牌和 AST 节点的概念分开。因此，首先我将具有一个将令牌值映射到 AST 节点操作值的函数与解析器的其余部分一起位于 expr.c：

```c
// 把 token 元素转换为 AST 操作
int arithop(int tok) {
  switch (tok) {
    case T_PLUS:
      return A_ADD;
    case T_MINUS:
      return A_SUBTRACT;
    case T_STAR:
      return A_MULTIPLY;
    case T_SLASH:
      return A_DIVIDE;
    default:
      fprintf(stderr, "unknown token in arithop() on line %d\n", Line);
      exit(1);
  }
}
```

当我们无法将给定令牌转换为 AST 节点类型时，将触发 switch 语句中的默认语句。这将成为解析器中语法检查的一部分。

我们需要一个函数来检查下一个标记是否为整数文字，并构建一个 AST 节点来保存文字值。

```c
// Parsing of expressions
// Parse a primary factor and return an
// AST node representing it.
static struct ASTnode *primary(void) {
  struct ASTnode *n;

  // 对于 INTLIT token 为其创建叶子结点然后扫描下一个 token，否则会报语法错误
  switch (Token.token) {
    case T_INTLIT:
      n = mkastleaf(A_INTLIT, Token.intvalue);
      scan(&Token);
      return n;
    default:
      fprintf(stderr, "syntax error on line %d\n", Line);
      exit(1);
  }
}
```

假设存在一个全局变量 Token，并且已经有从输入中扫描来的最新令牌，在 data.h：

```c
extern_ struct token Token;
```

main():

```c
scan(&Token);  // 得到输入的第一个元素
n = binexpr();  // 解析文件中的表达式
```

为解析器编写代码：

```c
// 返回一个以二元操作符为根的树
struct ASTnode *binexpr(void) {
  struct ASTnode *n, *left, *right;
  int nodetype;

  // 获取左结点的整数文字同时获取下一个元素
  left = primary();

  // 下一个元素是文件结尾，返回左节点
  if (Token.token == T_EOF)
    return left;

  // 转换元素到结点的类型
  nodetype = arithop(Token.token);

  // 获取下一个元素
  scan(&Token);

  // 递归右子树
  right = binexpr();

  n = mkastnode(nodetype, left, right, 0);
  return n;
}
```

请注意在此解析器代码中，没有任何地方可以处理不同的运算符优先级。就目前而言，该代码将所有运算符都视为具有相同的优先级。如果您在解析表达式时遵循代码 2 _ 3 + 4 _ 5，则会看到它构建了这个 AST：

```
  *
 / \
2   +
   / \
  3   *
     / \
    4   5
```

这绝对是不正确的。

那我为什么要这样做呢？我想向您展示，编写一个简单的解析器很容易，但是要使其同时进行语义分析也很困难。

## 解释树

现在我们有了（错误的）AST 树，让我们编写一些代码来解释它。同样，我们将编写递归代码遍历树。这是伪代码：

```
interpretTree:
  First, interpret the left-hand sub-tree and get its value
  Then, interpret the right-hand sub-tree and get its value
  Perform the operation in the node at the root of our tree
  on the two sub-tree values, and return this value
```

返回正确的 AST 树：

```
      +
     / \
    /   \
   /     \
  *       *
 / \     / \
2   3   4   5
```

调用结构如下所示：

```
interpretTree0(tree with +):
  Call interpretTree1(left tree with *):
     Call interpretTree2(tree with 2):
       No maths operation, just return 2
     Call interpretTree3(tree with 3):
       No maths operation, just return 3
     Perform 2 * 3, return 6

  Call interpretTree1(right tree with *):
     Call interpretTree2(tree with 4):
       No maths operation, just return 4
     Call interpretTree3(tree with 5):
       No maths operation, just return 5
     Perform 4 * 5, return 20

  Perform 6 + 20, return 26
```

## 解释树的代码

interp.c

```c
// AST tree interpreter
// Copyright (c) 2019 Warren Toomey, GPL3

// List of AST operators
static char *ASTop[] = { "+", "-", "*", "/" };

// 给一个 AST 树并做出解释得到最终值
int interpretAST(struct ASTnode *n) {
  int leftval, rightval;

  if (n->left)
    leftval = interpretAST(n->left);
  if (n->right)
    rightval = interpretAST(n->right);

  // 调试
  if (n->op == A_INTLIT)
    printf("int %d\n", n->intvalue);
  else
    printf("%d %s %d\n", leftval, ASTop[n->op], rightval);

  switch (n->op) {
    case A_ADD:
      return (leftval + rightval);
    case A_SUBTRACT:
      return (leftval - rightval);
    case A_MULTIPLY:
      return (leftval * rightval);
    case A_DIVIDE:
      return (leftval / rightval);
    case A_INTLIT:
      return (n->intvalue);
    default:
      fprintf(stderr, "Unknown AST operator %d\n", n->op);
      exit(1);
  }
}
```

同样，当我们无法解释 AST 节点类型时，switch 语句中的默认语句也会触发。这将成为解析器中语义检查的一部分。

## 构建解析器

这里还有其他一些代码，例如 main()对解释器的调用：

```c
scan(&Token); // Get the first token from the input
n = binexpr(); // Parse the expression in the file
printf("%d\n", interpretAST(n)); // Calculate the final result
exit(0);
```

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
int 2
int 3
int 5
int 8
int 3
8 / 3
5 - 2
3 * 3
2 + 9
11
```

```
int 13
int 6
int 4
int 5
int 8
int 3
8 / 3
5 + 2
4 * 7
6 + 28
13 - 34
-21
```

```
unknown token in arithop() on line 1
```

```
Unrecognised character . on line 3
```

# 结论

解析器识别该语言的语法，并检查编译器的输入是否符合该语法。如果不是，则解析器应打印出错误消息。由于我们的表达式语法是递归的，因此我们选择编写递归下降解析器来识别我们的表达式。

现在，解析器可以正常工作，如上面的输出所示，但是它无法获得正确语义。换句话说，它无法计算表达式的正确值。

在编译器编写过程的下一部分中，我们将修改解析器，以便它也对表达式进行语义分析以获得正确的数学结果。
