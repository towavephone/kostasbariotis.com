---
title: 编译器之旅（五）——声明语句
date: 2020-3-3 10:44:03
categories:
- 计算机基础
tags: 编译原理, 声明语句
path: /tour-of-compiler-declarative-statement
---

# 需求

在语言中添加一些声明语句：

```
print 2 + 3 * 5;
print 18 - 6/3 + 4*2;
```

# 准备

## BNF语法说明

我们已经看到了表达式的 BNF 表示法，现在让我们为以上语句定义 BNF 语法：

```
statements: statement
     | statement statements
     ;

statement: 'print' expression ';'
     ;
```

输入文件由几个语句组成，它们可以是一个语句，也可以是后面跟有更多语句的语句，每个语句均以关键字开头 print，然后是一个表达式，然后是分号。

# 核心逻辑

## 词法扫描器的更改

在编写解析以上语法的代码之前，我们需要在现有代码中添加更多细节，让我们从词法扫描器开始。

为分号添加 print 元素很容易，稍后我们将在该语言中有很多关键字，以及变量的标识符，因此我们需要添加一些代码来帮助我们处理它们。

在 scan.c 中我添加了从 SubC 编译器搬来的这段代码，它将字母数字字符读入缓冲区，直到命中非字母数字字符为止。

```c
// Scan an identifier from the input file and
// store it in buf[]. Return the identifier's length
static int scanident(int c, char *buf, int lim) {
  int i = 0;

  // Allow digits, alpha and underscores
  while (isalpha(c) || isdigit(c) || '_' == c) {
    // Error if we hit the identifier length limit,
    // else append to buf[] and get next character
    if (lim - 1 == i) {
      printf("identifier too long on line %d\n", Line);
      exit(1);
    } else if (i < lim - 1) {
      buf[i++] = c;
    }
    c = next();
  }
  // We hit a non-valid character, put it back.
  // NUL-terminate the buf[] and return the length
  putback(c);
  buf[i] = '\0';
  return (i);
}
```

我们还需要一个功能来识别语言中的关键字，一种方法是拥有一个关键字列表，并将该列表和每个关键字逐个对比之后放在缓冲区中，SubC 的代码经过优化：在执行之前，与第一个字母匹配可以加快对数十个关键字的比较。现在，我们不需要此优化，但稍后将其放入其中：

```c
// Given a word from the input, return the matching
// keyword token number or 0 if it's not a keyword.
// Switch on the first letter so that we don't have
// to waste time strcmp()ing against all the keywords.
static int keyword(char *s) {
  switch (*s) {
    case 'p':
      if (!strcmp(s, "print"))
        return (T_PRINT);
      break;
  }
  return (0);
}
```

在 scan() 的 switch 语句的底部，我们添加以下代码以识别分号和关键字：

```c
case ';':
  t->token = T_SEMI;
  break;
default:

  // If it's a digit, scan the
  // literal integer value in
  if (isdigit(c)) {
    t->intvalue = scanint(c);
    t->token = T_INTLIT;
    break;
  } else if (isalpha(c) || '_' == c) {
    // Read in a keyword or identifier
    scanident(c, Text, TEXTLEN);

    // If it's a recognised keyword, return that token
    if (tokentype = keyword(Text)) {
      t->token = tokentype;
      break;
    }
    // Not a recognised keyword, so an error for now
    printf("Unrecognised symbol %s on line %d\n", Text, Line);
    exit(1);
  }
  // The character isn't part of any recognised token, error
  printf("Unrecognised character %c on line %d\n", c, Line);
  exit(1);
```

我还添加了一个全局 Text 缓冲区来存储关键字和标识符：

```c
#define TEXTLEN         512             // Length of symbols in input
extern_ char Text[TEXTLEN + 1];         // Last identifier scanned
```

## 对表达式解析器的更改

到目前为止我们的输入文件只包含一个表达式，因此在 binexpr()（expr.c）中的 Pratt 解析器代码中，我们有以下代码退出解析器：

```c
// If no tokens left, return just the left node
tokentype = Token.token;
if (tokentype == T_EOF)
  return (left);
```

使用我们的新语法每个表达式都以分号结尾（不是以文件结尾即 T_EOF），因此我们需要在表达式解析器中更改代码以发现 T_SEMI 标记并退出表达式解析：

```c
// Return an AST tree whose root is a binary operator.
// Parameter ptp is the previous token's precedence.
struct ASTnode *binexpr(int ptp) {
  struct ASTnode *left, *right;
  int tokentype;

  // Get the integer literal on the left.
  // Fetch the next token at the same time.
  left = primary();

  // If we hit a semicolon, return just the left node
  tokentype = Token.token;
  if (tokentype == T_SEMI)
    return (left);

    while (op_precedence(tokentype) > ptp) {
      ...

    // Update the details of the current token.
    // If we hit a semicolon, return just the left node
    tokentype = Token.token;
    if (tokentype == T_SEMI)
      return (left);
    }
}
```

## 对代码生成器的更改

我想将通用代码生成器 gen.c 与 CPU 中的特定代码分开 cg.c，这也意味着其余的编译器只能调用 gen.c 的代码，并且 gen.c 只可以调用 cg.c 中的代码。

为此我在 gen.c 中定义了一些新的函数：

```c
void genpreamble()        { cgpreamble(); }
void genpostamble()       { cgpostamble(); }
void genfreeregs()        { freeall_registers(); }
void genprintint(int reg) { cgprintint(reg); }
```

## 为语句添加解析器

stmt.c 将保存我们语言中所有主要语句的解析代码，现在我们需要解析 BNF 语法通过此单个功能即可完成，我已经将递归定义转换为循环：

```c
// Parse one or more statements
void statements(void) {
  struct ASTnode *tree;
  int reg;

  while (1) {
    // Match a 'print' as the first token
    match(T_PRINT, "print");

    // Parse the following expression and
    // generate the assembly code
    tree = binexpr(0);
    reg = genAST(tree);
    genprintint(reg);
    genfreeregs();

    // Match the following semicolon
    // and stop if we are at EOF
    semi();
    if (Token.token == T_EOF)
      return;
  }
}
```

在每个循环中代码都会找到一个 T_PRINT 元素，然后它调用 binexpr() 解析表达式，最后它找到 T_SEMI 元素，如果紧跟着 T_EOF 元素，我们就会跳出循环。

在每个表达式树之后，将 gen.c 调用的代码以将树转换为汇编代码，并调用 printint() 函数以打印出最终值。

## 一些辅助功能

上面的代码中有几个新的辅助函数，我将它们放入一个新文件中 misc.c：

```c
// Ensure that the current token is t,
// and fetch the next token. Otherwise
// throw an error
void match(int t, char *what) {
  if (Token.token == t) {
    scan(&Token);
  } else {
    printf("%s expected on line %d\n", what, Line);
    exit(1);
  }
}

// Match a semicon and fetch the next token
void semi(void) {
  match(T_SEMI, ";");
}
```

这些构成了解析器中语法检查的一部分，稍后我将添加更多简短函数 match() 以使我们的语法检查更加容易。

## 更改为 main()

main() 用于 binexpr() 直接调用以解析旧输入文件中的单个表达式，现在执行此操作：

```c
scan(&Token);                 // Get the first token from the input
genpreamble();                // Output the preamble
statements();                 // Parse the statements in the input
genpostamble();               // Output the postamble
fclose(Outfile);              // Close the output file and exit
exit(0);
```

# 运行结果

## 输入

```
print 12 * 3;
print 
   18 - 2
      * 4; print
1 + 2 +
  9 - 5/2 + 3*5;
```

## 输出

```bash
$ make test
# -o：编译可执行文件的地址 -g：便于调试
cc -o comp1 -g cg.c expr.c gen.c main.c misc.c scan.c stmt.c tree.c
# 执行并生成汇编文件
./comp1 input01
# 编译汇编文件 out.s 到可执行文件 out
cc -o out out.s 
./out 
36 
10 
25
```

# 结论

我们已经在语言中添加了第一个 “真实” 语句语法，我已经用 BNF 表示法定义了它，但是通过循环而不是递归地实现它更容易。不用担心，我们将尽快返回递归解析。

在此过程中，我们必须修改扫描程序，添加对关键字和标识符的支持，并更清晰地将通用代码生成器和特定于 CPU 的生成器分开。

在编译器编写过程的下一部分中，我们将向语言添加变量。这将需要大量的工作。
