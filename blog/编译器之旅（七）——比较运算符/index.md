---
title: 编译器之旅（七）——比较运算符
date: 2020-3-11 10:03:11
categories:
  - 计算机基础
tags: 编译原理, 比较运算符
path: /tour-of-compiler-comparison-operators/
---

# 需求

接下来我要添加 IF 语句，但是后来我意识到最好先添加一些比较运算符。事实证明这很容易，因为它们像现有的一样是二进制运算符。

因此让我们赶紧看看增加六个比较符有什么变化：==，!=，<，>，<= 和 >=。

# 核心逻辑

## 添加新令牌

我们有六个新令牌，所以我们将它们添加到 defs.h：

```c
// Token types
enum {
  T_EOF,
  T_PLUS, T_MINUS,
  T_STAR, T_SLASH,
  T_EQ, T_NE,
  T_LT, T_GT, T_LE, T_GE,
  T_INTLIT, T_SEMI, T_ASSIGN, T_IDENT,
  // Keywords
  T_PRINT, T_INT
};
```

我已经重新排列了令牌，以便让令牌从低到高的优先级顺序出现。

## 扫描令牌

现在我们必须扫描它们，请注意我们必须区分 = 和 ==，< 和 <=，> 和 >=。因此我们将需要从输入中读取一个额外的字符，然后在不需要时将其放回原处，下面是来自 scan.c 新的代码 scan()：

```c
case '=':
  if ((c = next()) == '=') {
    t->token = T_EQ;
  } else {
    putback(c);
    t->token = T_ASSIGN;
  }
  break;
case '!':
  if ((c = next()) == '=') {
    t->token = T_NE;
  } else {
    fatalc("Unrecognised character", c);
  }
  break;
case '<':
  if ((c = next()) == '=') {
    t->token = T_LE;
  } else {
    putback(c);
    t->token = T_LT;
  }
  break;
case '>':
  if ((c = next()) == '=') {
    t->token = T_GE;
  } else {
    putback(c);
    t->token = T_GT;
  }
  break;
```

我还将 = 令牌的名称更改为 T_ASSIGN，以确保不会与新的 T_EQ 令牌混淆。

## 新的表达代码

现在我们可以扫描六个新令牌，因此我们必须解析它们何时出现在表达式中，并强制其运算符优先级。

到现在为止，您已经知道：

- 我正在构建将成为自编译器的东西
- 用 C 语言
- 使用 SubC 编译器作为参考

这意味着我正在为足够一部分 C 的子集（就像 SubC）编写一个编译器，以便它可以自己编译。因此我应该使用普通的 C 运算符优先顺序，这意味着比较运算符的优先级高于乘法和除法。

我还意识到我用来将令牌映射到 AST 节点类型的 switch 语句只会变得更大，因此我决定重新排列 AST 节点类型，以便所有二进制运算符（在 defs.h 中）之间都具有 1:1 的映射：

```c
// AST node types. The first few line up
// with the related tokens
enum {
  A_ADD=1, A_SUBTRACT, A_MULTIPLY, A_DIVIDE,
  A_EQ, A_NE, A_LT, A_GT, A_LE, A_GE,
  A_INTLIT,
  A_IDENT, A_LVIDENT, A_ASSIGN
};
```

在 expr.c 中我可以简化令牌到 AST 节点的转换，还可以添加新令牌的优先级：

```c
// Convert a binary operator token into an AST operation.
// We rely on a 1:1 mapping from token to AST operation
static int arithop(int tokentype) {
  if (tokentype > T_EOF && tokentype < T_INTLIT)
    return(tokentype);
  fatald("Syntax error, token", tokentype);
}

// Operator precedence for each token. Must
// match up with the order of tokens in defs.h
static int OpPrec[] = {
  0, 10, 10,                    // T_EOF, T_PLUS, T_MINUS
  20, 20,                       // T_STAR, T_SLASH
  30, 30,                       // T_EQ, T_NE
  40, 40, 40, 40                // T_LT, T_GT, T_LE, T_GE
};
```

解析和运算符优先级就到此了！

## 代码生成

由于这六个新运算符是二进制运算符，因此很容易修改通用代码生成器 gen.c 来处理它们：

```c
case A_EQ:
  return (cgequal(leftreg, rightreg));
case A_NE:
  return (cgnotequal(leftreg, rightreg));
case A_LT:
  return (cglessthan(leftreg, rightreg));
case A_GT:
  return (cggreaterthan(leftreg, rightreg));
case A_LE:
  return (cglessequal(leftreg, rightreg));
case A_GE:
  return (cggreaterequal(leftreg, rightreg));
```

## x86-64 代码生成

在 C 中比较麻烦的是，比较运算符返回一个值，如果它们的执行结果为 true，则结果为 1。如果它们的执行结果为 false，则结果为 0。我们需要编写 x86-64 汇编代码来反映这一点。

幸运的是有一些 x86-64 指令可以做到这一点，不幸的是在此过程中需要处理一些问题，考虑以下 x86-64 指令：

```c
cmpq %r8,%r9
```

上面的 cmpq 指令执行 `%r9-%r8` 并设置几个状态标志，包括负标志和零标志，因此我们可以查看标志组合以查看比较结果：

| 比较       | 操作      | 执行结果       |
| ---------- | --------- | -------------- |
| %r8 == %r9 | %r9 - %r8 | 零             |
| %r8 != %r9 | %r9 - %r8 | 不为零         |
| %r8 > %r9  | %r9 - %r8 | 不为零，负数   |
| %r8 < %r9  | %r9 - %r8 | 不为零，不为负 |
| %r8 >= %r9 | %r9 - %r8 | 零或负         |
| %r8 <= %r9 | %r9 - %r8 | 零或非负       |

问题是这些指令仅设置寄存器的最低字节，如果寄存器的最低位之外的其他位已置 1，则它们将保持置位状态。因此我们可以将变量设置为 1，但是如果它已经具有值 1000（十进制），那么现在它将是 1001，这不是我们想要的。

解决方案是 andq 在 setX 指令后清除寄存器中不需要的，在 cg.c 中有一个比较功能可以做到这一点：

```c
// Compare two registers.
static int cgcompare(int r1, int r2, char *how) {
  fprintf(Outfile, "\tcmpq\t%s, %s\n", reglist[r2], reglist[r1]);
  fprintf(Outfile, "\t%s\t%s\n", how, breglist[r2]);
  fprintf(Outfile, "\tandq\t$255,%s\n", reglist[r2]);
  free_register(r1);
  return (r2);
}
```

指令 how 之一在哪里 setX，请注意我们执行

```c
cmpq reglist[r2], reglist[r1]
```

因为实际上 `reglist[r1] - reglist[r2]` 是我们真正想要的。

## x86-64 寄存器

我们需要在这里讨论 x86-64 体系结构中的寄存器，x86-64 有几个 64 位通用寄存器，但是我们也可以使用不同的寄存器名称来访问和处理这些寄存器的子部分。

![](2020-03-11-10-20-36.png)

上面来自 stack.imgur.com 的图片显示，对于 64 位 `r8` 寄存器，我们可以使用 `r8d` 寄存器访问该寄存器的低 32 位。同样 `r8w` 寄存器是 `r8` 寄存器的低 16 位，`r8b` 寄存器是 `r8` 寄存器的低 8 位。

在该 cgcompare() 函数中，代码使用 `reglist[]` 数组比较两个 64 位寄存器，然后通过使用 `breglist[]` 数组中的名称在第二个寄存器的 8 位版本中设置标志，x86-64 体系结构仅允许 setX 指令对 8 位寄存器名称进行操作，因此需要 `breglist[]` 阵列。

## 创建多个比较指令

现在我们有了这个通用功能，我们可以编写六个实际的比较功能：

```c
int cgequal(int r1, int r2) { return(cgcompare(r1, r2, "sete")); }
int cgnotequal(int r1, int r2) { return(cgcompare(r1, r2, "setne")); }
int cglessthan(int r1, int r2) { return(cgcompare(r1, r2, "setl")); }
int cggreaterthan(int r1, int r2) { return(cgcompare(r1, r2, "setg")); }
int cglessequal(int r1, int r2) { return(cgcompare(r1, r2, "setle")); }
int cggreaterequal(int r1, int r2) { return(cgcompare(r1, r2, "setge")); }
```

与其他二进制运算符函数一样，一个寄存器被释放，另一个寄存器返回结果。

# 运行结果

## 输入

input04

```
int x;
x= 7 < 9;  print x;
x= 7 <= 9; print x;
x= 7 != 9; print x;
x= 7 == 7; print x;
x= 7 >= 7; print x;
x= 7 <= 7; print x;
x= 9 > 7;  print x;
x= 9 >= 7; print x;
x= 9 != 7; print x;
```

## 输出

```bash
$ make test
cc -o comp1 -g cg.c decl.c expr.c gen.c main.c misc.c scan.c stmt.c sym.c tree.c
./comp1 input04
cc -o out out.s
./out
1
1
1
1
1
1
1
1
1
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
        .comm   x,8,8
        movq    $7, %r8
        movq    $9, %r9
        cmpq    %r9, %r8
        setl    %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $7, %r8
        movq    $9, %r9
        cmpq    %r9, %r8
        setle   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $7, %r8
        movq    $9, %r9
        cmpq    %r9, %r8
        setne   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $7, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        sete    %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $7, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        setge   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $7, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        setle   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $9, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        setg    %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $9, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        setge   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movq    $9, %r8
        movq    $7, %r9
        cmpq    %r9, %r8
        setne   %r9b
        andq    $255,%r9
        movq    %r9, x(%rip)
        movq    x(%rip), %r8
        movq    %r8, %rdi
        call    printint
        movl    $0, %eax
        popq    %rbp
        ret
```

# 结论

这是对编译器的一种很好而又轻松的添加，接下来的旅程将更加复杂。

在编译器编写过程的下一部分中，我们将 IF 语句添加到编译器中，并使用刚刚添加的比较运算符。
