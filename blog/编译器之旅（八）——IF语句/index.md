---
title: 编译器之旅（八）——IF语句
date: 2020-3-16 17:22:09
categories:
  - 计算机基础
tags: 编译原理, IF语句
path: /tour-of-compiler-if-statements/
---

# 需求

现在我们可以比较值了，是时候在我们的语言中添加 IF 语句了，因此让我们看一下 IF 语句的一般语法以及如何将它们转换为汇编语言。

# 准备

## IF 语法

IF 语句的语法为：

```
if (condition is true)
  perform this first block of code
else
  perform this other block of code
```

通常如何将其转换为汇编语言？事实证明如果相反的比较成立，我们将执行相反的比较并跳转：

```
       perform the opposite comparison
       jump to L1 if true
       perform the first block of code
       jump to L2
L1:
       perform the other block of code
L2:
```

其中 L1 和 L2 是汇编语言标签。

## 在我们的编译器中生成程序集

现在我们输出代码以基于比较来设置寄存器，例如

```c
int x; x= 7 < 9;         From input04
```

变成

```
movq    $7, %r8
movq    $9, %r9
cmpq    %r9, %r8
setl    %r9b        Set if less than
andq    $255,%r9
```

但是对于 IF 语句，我们需要进行相反的比较：

```c
if (7 < 9)
```

应该变成：

```
        movq    $7, %r8
        movq    $9, %r9
        cmpq    %r9, %r8
        jge     L1         Jump if greater then or equal to
        ....
L1:
```

因此在这一部分中，我已经实现了 IF 语句。作为旅程的一部分，由于这是一个正在工作的项目，因此我确实必须撤消一些操作并将其重构。在此过程中，我将尝试介绍所做的更改以及添加的内容。

## 新元素和其他悬空元素

我们将需要使用我们的语言的一堆新元素，我暂时也想避免其他问题。为此我更改了语法，以便所有语句组都用 `{...}` 大括号括起来；我称这种分组为 `复合语句`。我们还需要使用括号 `(...)` 来容纳 IF 表达式以及关键字 if 和 else，因此新元素为（defs.h 中的代码）：

```
T_LBRACE, T_RBRACE, T_LPAREN, T_RPAREN,
// Keywords
..., T_IF, T_ELSE
```

# 核心逻辑

## 扫描令牌

单字符元素应该很明显，我不会给出扫描它们的代码。关键字也应该是很明显的，但我会从 scan.c 中给出扫描代码 keyword()：

```c
switch (*s) {
  case 'e':
    if (!strcmp(s, "else"))
      return (T_ELSE);
    break;
  case 'i':
    if (!strcmp(s, "if"))
      return (T_IF);
    if (!strcmp(s, "int"))
      return (T_INT);
    break;
  case 'p':
    if (!strcmp(s, "print"))
      return (T_PRINT);
    break;
}
```

## 新的 BNF 语法

我们的语法开始变得越来越大，因此我对其进行了一些重写：

```
compound_statement: '{' '}'          // empty, i.e. no statement
    |      '{' statement '}'
    |      '{' statement statements '}'
    ;

statement: print_statement
    |     declaration
    |     assignment_statement
    |     if_statement
    ;

print_statement: 'print' expression ';'  ;

declaration: 'int' identifier ';'  ;

assignment_statement: identifier '=' expression ';'   ;

if_statement: if_head
    |        if_head 'else' compound_statement
    ;

if_head: 'if' '(' true_false_expression ')' compound_statement  ;

identifier: T_IDENT ;
```

我省略了定义 true_false_expression，但是在某些时候我们添加了更多运算符时我会添加它。

请注意 IF 语句的语法：它是 if_head（没有 else 子句），或 if_head 后跟 else 和 a compound_statement。

我已经分离出所有不同的语句类型以拥有自己的非终端名称，而且以前的 statements 非终结点现在 compound_statement 是非终结点，这要求在语句周围使用 `{...}`。

这意味着 compound_statement 头部中的被 `{...}` 包围，compound_statement else 关键字之后的任何字符也被包围。因此如果我们嵌套了 IF 语句，它们必须看起来像：

```c
if (condition1 is true) {
  if (condition2 is true) {
    statements;
  } else {
    statements;
  }
} else {
  statements;
}
```

并且每个 else 属于哪个 if 没有任何歧义，这解决了悬而未决的问题，稍后我将使 `{...}` 为可选。

## 解析复合语句

现在的旧 void statements() 函数 compound_statement() 如下所示：

```c
// Parse a compound statement
// and return its AST
struct ASTnode *compound_statement(void) {
  struct ASTnode *left = NULL;
  struct ASTnode *tree;

  // Require a left curly bracket
  lbrace();

  while (1) {
    switch (Token.token) {
      case T_PRINT:
        tree = print_statement();
        break;
      case T_INT:
        var_declaration();
        tree = NULL;            // No AST generated here
        break;
      case T_IDENT:
        tree = assignment_statement();
        break;
      case T_IF:
        tree = if_statement();
        break;
    case T_RBRACE:
        // When we hit a right curly bracket,
        // skip past it and return the AST
        rbrace();
        return (left);
      default:
        fatald("Syntax error, token", Token.token);
    }

    // For each new tree, either save it in left
    // if left is empty, or glue the left and the
    // new tree together
    if (tree) {
      if (left == NULL)
        left = tree;
      else
        left = mkastnode(A_GLUE, left, NULL, tree, 0);
    }
  }
```

首先请注意代码强制解析器在复合语句的开头与 lbrace() 匹配，而我们仅在将结尾的 `}` 与匹配时退出 rbrace()。

其次请注意 print_statement()、assignment_statement() 和 if_statement() 一样都返回 AST 树 compound_statement()。在我们的旧代码中，print_statement() 本身调用 genAST() 来求值表达式然后调用 genprintint()，类似地 assignment_statement() 也调用 genAST() 来执行赋值。

这意味着我们在这里有 AST 树，在那儿还有其他树。只生成一个 AST 树，并调用 genAST() 一次性为其生成汇编代码是有意义的。

这不是强制性的，例如 SubC 只为表达式生成 AST，对于语言的结构部分（如语句），SubC 像在以前版本的编译器中一样，对代码生成器进行特定的调用。

我现在决定使用解析器为整个输入生成一个 AST 树，解析输入后就可以从一棵 AST 树中生成程序集输出。

稍后我可能会为每个函数生成一个 AST 树。

## 解析 IF 语法

因为我们是递归下降解析器，所以解析 IF 语句还不错：

```c
// Parse an IF statement including
// any optional ELSE clause
// and return its AST
struct ASTnode *if_statement(void) {
  struct ASTnode *condAST, *trueAST, *falseAST = NULL;

  // Ensure we have 'if' '('
  match(T_IF, "if");
  lparen();

  // Parse the following expression
  // and the ')' following. Ensure
  // the tree's operation is a comparison.
  condAST = binexpr(0);

  if (condAST->op < A_EQ || condAST->op > A_GE)
    fatal("Bad comparison operator");
  rparen();

  // Get the AST for the compound statement
  trueAST = compound_statement();

  // If we have an 'else', skip it
  // and get the AST for the compound statement
  if (Token.token == T_ELSE) {
    scan(&Token);
    falseAST = compound_statement();
  }
  // Build and return the AST for this statement
  return (mkastnode(A_IF, condAST, trueAST, falseAST, 0));
}
```

现在我不想处理类似的输入 if (x-2)，因此我已经限制了二进制表达式 binexpr() 只能具有一个根，该根是六个比较运算符 A_EQ，A_NE，A_LT，A_GT，A_LE 或 A_GE 之一。

## 三个子树

在 if_statement() 我的最后一行中，我建立了一个 AST 节点：

```c
mkastnode(A_IF, condAST, trueAST, falseAST, 0);
```

那是三个 AST 子树！这里发生了什么？如您所见，IF 语句将具有三个子树：

- 执行条件的子树
- 紧随其后的复合语句
- else 关键字之后的可选复合语句

因此我们现在需要具有三个子节点的 AST 节点结构（在 defs.h 中）：

```c
// AST node types.
enum {
  ...
  A_GLUE, A_IF
};

// Abstract Syntax Tree structure
struct ASTnode {
  int op;                       // "Operation" to be performed on this tree
  struct ASTnode *left;         // Left, middle and right child trees
  struct ASTnode *mid;
  struct ASTnode *right;
  union {
    int intvalue;               // For A_INTLIT, the integer value
    int id;                     // For A_IDENT, the symbol slot number
  } v;
};
```

因此 A_IF 树如下所示：

```
                      IF
                    / |  \
                   /  |   \
                  /   |    \
                 /    |     \
                /     |      \
               /      |       \
      condition   statements   statements
```

## 组装 AST 节点

还有一个新的 A_GLUE AST 节点类型，这是做什么用的？现在我们用很多语句构建一个 AST 树，因此我们需要一种将它们组装在一起的方法。

查看 compound_statement() 循环代码的结尾：

```c
if (left != NULL)
  left = mkastnode(A_GLUE, left, NULL, tree, 0);
```

每次获得新的子树时，我们会将其粘贴到现有树上。因此，对于此语句序列：

```
stmt1;
stmt2;
stmt3;
stmt4;
```

我们最终得到：

```
             A_GLUE
              /  \
          A_GLUE stmt4
            /  \
        A_GLUE stmt3
          /  \
      stmt1  stmt2
```

而且当我们从左到右先深度遍历树时，这仍然会以正确的顺序生成汇编代码。

## 通用代码生成器

现在我们的 AST 节点有多个子节点，我们的通用代码生成器将变得更加复杂。另外对于比较运算符，我们需要知道是否要在 IF 语句（相反的比较中为跳转）或正则表达式（正常的比较中将寄存器设置为 1 或 0）的一部分中进行比较。

为此我进行了修改 getAST() 以便我们可以传递父 AST 节点操作：

```c
// Given an AST, the register (if any) that holds
// the previous rvalue, and the AST op of the parent,
// generate assembly code recursively.
// Return the register id with the tree's final value
int genAST(struct ASTnode *n, int reg, int parentASTop) {
   ...
}
```

### 处理特定的 AST 节点

现在 genAST() 中的代码必须处理特定的 AST 节点：

```c
// We now have specific AST node handling at the top
switch (n->op) {
  case A_IF:
    return (genIFAST(n));
  case A_GLUE:
    // Do each child statement, and free the
    // registers after each child
    genAST(n->left, NOREG, n->op);
    genfreeregs();
    genAST(n->right, NOREG, n->op);
    genfreeregs();
    return (NOREG);
}
```

如果不返回则继续执行普通的二进制运算符 AST 节点，但有一个例外比较节点：

```c
case A_EQ:
case A_NE:
case A_LT:
case A_GT:
case A_LE:
case A_GE:
  // If the parent AST node is an A_IF, generate a compare
  // followed by a jump. Otherwise, compare registers and
  // set one to 1 or 0 based on the comparison.
  if (parentASTop == A_IF)
    return (cgcompare_and_jump(n->op, leftreg, rightreg, reg));
  else
    return (cgcompare_and_set(n->op, leftreg, rightreg));
```

我将介绍新的功能 cgcompare_and_jump() 和 cgcompare_and_set()。

### 生成 IF 汇编代码

我们使用特定函数处理 A_IF AST 节点，并使用一个函数来生成新标签号：

```c
// Generate and return a new label number
static int label(void) {
  static int id = 1;
  return (id++);
}

// Generate the code for an IF statement
// and an optional ELSE clause
static int genIFAST(struct ASTnode *n) {
  int Lfalse, Lend;

  // Generate two labels: one for the
  // false compound statement, and one
  // for the end of the overall IF statement.
  // When there is no ELSE clause, Lfalse _is_
  // the ending label!
  Lfalse = label();
  if (n->right)
    Lend = label();

  // Generate the condition code followed
  // by a zero jump to the false label.
  // We cheat by sending the Lfalse label as a register.
  genAST(n->left, Lfalse, n->op);
  genfreeregs();

  // Generate the true compound statement
  genAST(n->mid, NOREG, n->op);
  genfreeregs();

  // If there is an optional ELSE clause,
  // generate the jump to skip to the end
  if (n->right)
    cgjump(Lend);

  // Now the false label
  cglabel(Lfalse);

  // Optional ELSE clause: generate the
  // false compound statement and the
  // end label
  if (n->right) {
    genAST(n->right, NOREG, n->op);
    genfreeregs();
    cglabel(Lend);
  }

  return (NOREG);
}
```

实际上，代码正在执行以下操作：

```c
genAST(n->left, Lfalse, n->op);       // Condition and jump to Lfalse
genAST(n->mid, NOREG, n->op);         // Statements after 'if'
cgjump(Lend);                         // Jump to Lend
cglabel(Lfalse);                      // Lfalse: label
genAST(n->right, NOREG, n->op);       // Statements after 'else'
cglabel(Lend);
```

## x86-64 代码生成功能

因此，我们现在有了一些新的 x86-64 代码生成功能，其中一些替代了 cgXXX() 我们在旅程的最后部分中创建的六个比较功能。

对于正常的比较功能，我们现在传递 AST 操作以选择相关的 x86-64 set 指令：

```c
// List of comparison instructions,
// in AST order: A_EQ, A_NE, A_LT, A_GT, A_LE, A_GE
static char *cmplist[] =
  { "sete", "setne", "setl", "setg", "setle", "setge" };

// Compare two registers and set if true.
int cgcompare_and_set(int ASTop, int r1, int r2) {

  // Check the range of the AST operation
  if (ASTop < A_EQ || ASTop > A_GE)
    fatal("Bad ASTop in cgcompare_and_set()");

  fprintf(Outfile, "\tcmpq\t%s, %s\n", reglist[r2], reglist[r1]);
  fprintf(Outfile, "\t%s\t%s\n", cmplist[ASTop - A_EQ], breglist[r2]);
  fprintf(Outfile, "\tmovzbq\t%s, %s\n", breglist[r2], reglist[r2]);
  free_register(r1);
  return (r2);
}
```

我还发现了一条 x86-64 指令 movzbq，该指令将一个寄存器中的最低字节移出并将其扩展为适合 64 位寄存器，我现在正在使用它而不是旧代码中的 and \$255。

我们需要一个函数来生成标签并跳转到它：

```c
// Generate a label
void cglabel(int l) {
  fprintf(Outfile, "L%d:\n", l);
}

// Generate a jump to a label
void cgjump(int l) {
  fprintf(Outfile, "\tjmp\tL%d\n", l);
}
```

最后我们需要一个函数进行比较并根据相反的比较跳转，因此使用 AST 比较节点类型，我们进行相反的比较：

```c
// List of inverted jump instructions,
// in AST order: A_EQ, A_NE, A_LT, A_GT, A_LE, A_GE
static char *invcmplist[] = { "jne", "je", "jge", "jle", "jg", "jl" };

// Compare two registers and jump if false.
int cgcompare_and_jump(int ASTop, int r1, int r2, int label) {

  // Check the range of the AST operation
  if (ASTop < A_EQ || ASTop > A_GE)
    fatal("Bad ASTop in cgcompare_and_set()");

  fprintf(Outfile, "\tcmpq\t%s, %s\n", reglist[r2], reglist[r1]);
  fprintf(Outfile, "\t%s\tL%d\n", invcmplist[ASTop - A_EQ], label);
  freeall_registers();
  return (NOREG);
}
```

# 运行结果

## 输入

input05

```
{
  int i; int j;
  i=6; j=12;
  if (i < j) {
    print i;
  } else {
    print j;
  }
}
```

## 输出

```bash
$ make test
cc -o comp1 -g cg.c decl.c expr.c gen.c main.c misc.c scan.c stmt.c sym.c tree.c
./comp1 input05
cc -o out out.s
./out
6
```

out.s

```
        .text
.LC0:
        .string "%d\n"
printint:
        pushq   %rbp
        movq    %rsp, %rbp
        subq    $16, %rsp
        movl    %edi, -4(%rbp)
        movl    -4(%rbp), %eax
        movl    %eax, %esi
        leaq    .LC0(%rip), %rdi
        movl    $0, %eax
        call    printf@PLT
        nop
        leave
        ret

        .globl  main
        .type   main, @function
main:
        pushq   %rbp
        movq    %rsp, %rbp
        .comm   i,8,8
        .comm   j,8,8
        movq    $6, %r8
        movq    %r8, i(%rip)
        movq    $12, %r8
        movq    %r8, j(%rip)
        movq    i(%rip), %r8
        movq    j(%rip), %r9
        cmpq    %r9, %r8
        jge     L1
        movq    i(%rip), %r8
        movq    %r8, %rdi
        call    printint
        jmp     L2
L1:
        movq    j(%rip), %r8
        movq    %r8, %rdi
        call    printint
L2:
        movl    $0, %eax
        popq    %rbp
        ret
```

# 结论

我们已经使用 IF 语句在我们的语言中添加了第一个控制结构，在此过程中我不得不重写一些现有的内容，而且由于我脑子里还没有完整的架构计划，因此将来可能需要重写更多内容。

这段旅程的难处在于，对于 IF 决策我们必须执行与对普通比较运算符相反的比较，我的解决方案是通知每个 AST 节点其父节点的节点类型，比较节点现在可以查看父节点是否为 A_IF 节点。

我知道 Nils Holm 在实现 SubC 时选择了不同的方法，因此您应该查看他的代码，以便看到针对同一问题的不同解决方案。

在编译器编写过程的下一部分中，我们将添加另一个控制结构：WHILE 循环。
