---
title: 编译器之旅（四）——真正的编译器
date: 2020-3-3 10:44:03
categories:
  - 计算机基础
tags: 编译原理, 代码生成
path: /tour-of-compiler-real-compiler/
---

# 需求

用生成 x86-64 汇编代码的代码替换程序中的解释器

# 核心逻辑

## 修改解释树

开始之前，先回顾以下解释器的代码：

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

该 interpretAST() 函数先走给定的 AST 树深度。它先遍历任何左子树，然后再遍历右子树，最后它使用 op 当前树的底部的值对这些子代进行操作。

如果该 op 值是四个数学运算符之一，则将执行此数学运算。如果该 op 值指示该节点只是简单的整数文字，则返回整数值。

该函数返回此树的最终值，并且由于它是递归的，它将一次为一棵子树计算整个树的最终值。

## 更改为汇编代码生成

我们将编写一个通用的汇编代码生成器。反过来，这将调出一组特定于 CPU 的代码生成功能。

这是通用汇编代码生成器 gen.c：

```c
// Given an AST, generate
// assembly code recursively
static int genAST(struct ASTnode *n) {
  int leftreg, rightreg;

  // Get the left and right sub-tree values
  if (n->left)
    leftreg = genAST(n->left);
  if (n->right)
    rightreg = genAST(n->right);

  switch (n->op) {
    case A_ADD:
      return (cgadd(leftreg,rightreg));
    case A_SUBTRACT:
      return (cgsub(leftreg,rightreg));
    case A_MULTIPLY:
      return (cgmul(leftreg,rightreg));
    case A_DIVIDE:
      return (cgdiv(leftreg,rightreg));
    case A_INTLIT:
      return (cgload(n->intvalue));
    default:
      fprintf(stderr, "Unknown AST operator %d\n", n->op);
      exit(1);
  }
}
```

看起来很熟吧？我们正在进行相同的深度优先树遍历。这次：

- A_INTLIT：使用文字值加载寄存器
- 其他运算符：在保存左子树和右子树的两个寄存器上执行数学函数

不是传递值而是通过代码 genAST() 传递寄存器标识符，例如 cgload() 将值加载到寄存器中，并返回具有已加载值的寄存器的标识。

genAST() 本身返回此时持有树的最终值的寄存器的标识，这就是为什么顶部的代码获取寄存器标识的原因：

```c
if (n->left) leftreg = genAST(n->left);
if (n->right) rightreg = genAST(n->right);
```

## 调用 genAST()

genAST() 只会计算赋予它的表达式的值，我们需要打印出最终的计算结果。我们还需要用一些前导代码（preamble）和一些尾随代码（postamble）包装生成的汇编代码，这是通过以下其他功能完成的 gen.c：

```c
void generatecode(struct ASTnode *n) {
  int reg;

  cgpreamble();
  reg= genAST(n);
  cgprintint(reg);
  cgpostamble();
}
```

## x86-64 代码生成器

那就是通用代码生成器，现在我们需要看看一些实际的汇编代码的生成。目前我的目标是 x86-64 CPU，因为它仍然是最常见的 Linux 平台之一，因此打开 cg.c 并开始浏览。

### 分配寄存器

任何 CPU 的寄存器数量都有限，我们将不得不分配一个寄存器来保存整数文字值，以及我们对它们执行的任何计算。但是一旦使用了一个值，我们通常可以丢弃该值，从而释放保存它的寄存器，然后我们可以将该寄存器重用于另一个值。

有三个函数处理寄存器分配：

- freeall_registers()：将所有寄存器设置为可用
- alloc_register()：分配寄存器
- free_register()：释放分配的寄存器

我不会通过代码使用因为它很简单，但是会进行一些错误检查。现在如果我用完了寄存器，程序将崩溃。稍后当自由寄存器用完时，我将处理这种情况。

该代码适用于通用寄存器：r0，r1，r2 和 r3，有一个带有实际寄存器名称的字符串表：

```c
static char *reglist[4]= { "%r8", "%r9", "%r10", "%r11" };
```

这使得这些功能相当独立于 CPU 体系结构。

### 加载寄存器

这是通过以下方式完成的 cgload()：分配了一个寄存器，然后一条 movq 指令将文字值加载到分配的寄存器中。

```c
// Load an integer literal value into a register.
// Return the number of the register
int cgload(int value) {

  // Get a new register
  int r = alloc_register();

  // Print out the code to initialise it
  fprintf(Outfile, "\tmovq\t$%d, %s\n", value, reglist[r]);
  return(r);
}
```

### 加法寄存器

cgadd() 接受两个寄存器号并生成代码以将它们加在一起，结果保存在两个寄存器之一中，然后释放另一个以供将来使用：

```c
// Add two registers together and return
// the number of the register with the result
int cgadd(int r1, int r2) {
  fprintf(Outfile, "\taddq\t%s, %s\n", reglist[r1], reglist[r2]);
  free_register(r1);
  return(r2);
}
```

### 相乘寄存器

这与加法非常相似，并且操作也是可交换的，因此可以返回任何寄存器：

```c
// Multiply two registers together and return
// the number of the register with the result
int cgmul(int r1, int r2) {
  fprintf(Outfile, "\timulq\t%s, %s\n", reglist[r1], reglist[r2]);
  free_register(r1);
  return(r2);
}
```

### 减法寄存器

减法不是可交换的：我们必须使顺序正确，从第一个寄存器减去第二个寄存器，因此我们返回第一个寄存器并释放第二个寄存器：

```c
// Subtract the second register from the first and
// return the number of the register with the result
int cgsub(int r1, int r2) {
  fprintf(Outfile, "\tsubq\t%s, %s\n", reglist[r2], reglist[r1]);
  free_register(r2);
  return(r1);
}
```

### 除法寄存器

除法也不是可交换的，在 x86-64 上它比较复杂。

```c
// Divide the first register by the second and
// return the number of the register with the result
int cgdiv(int r1, int r2) {
  // movq 完成 8 个字节的复制
  fprintf(Outfile, "\tmovq\t%s,%%rax\n", reglist[r1]);
  // 将字转换为双字/将双字转换为四字
  fprintf(Outfile, "\tcqo\n");
  // idivq 除法，%rax保存商 %rdx保存余数
  fprintf(Outfile, "\tidivq\t%s\n", reglist[r2]);
  fprintf(Outfile, "\tmovq\t%%rax,%s\n", reglist[r1]);
  free_register(r2);
  return(r1);
}
```

### 打印寄存器

没有 x86-64 指令可将寄存器输出为十进制数字。为了解决此问题，汇编程序包含一个 printint() 的函数，该函数带有一个寄存器参数，并调用 printf() 以十进制格式将其打印出来。

我不会提供代码 cgpreamble()，但其中也包含开始代码 main()，以便我们可以汇编输出文件以获得完整的程序代码（cgpostamble() 此处也未提供）只是调用 exit(0) 以结束程序。

但是，这里是 cgprintint()：

```c
void cgprintint(int r) {
  fprintf(Outfile, "\tmovq\t%s, %%rdi\n", reglist[r]);
  fprintf(Outfile, "\tcall\tprintint\n");
  free_register(r);
}
```

Linux x86-64 期望函数的第一个参数在 %rdi 寄存器中，因此我们将寄存器移到 %rdi 之前调用 printint。

# 运行结果

## 输入

```
2 + 3 * 5 - 8 / 3
```

## 输出

```
cc -o comp1 -g cg.c expr.c gen.c interp.c main.c scan.c tree.c

$ make test
./comp1 input01
15
cc -o out out.s
./out
15
```

生成的 out.s 文件

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
        movq    $13, %r8
        movq    $6, %r9
        subq    %r9, %r8
        movq    $4, %r9
        movq    $5, %r10
        imulq   %r9, %r10
        addq    %r8, %r10
        movq    $8, %r8
        movq    $3, %r9
        movq    %r8,%rax
        cqo
        idivq   %r9
        movq    %rax,%r8
        addq    %r10, %r8
        movq    %r8, %rdi
        call    printint
        movl    $0, %eax
        popq    %rbp
        ret
```

优秀！现在，我们有了一个合法的编译器：一个程序以一种语言输入并生成另一种语言的翻译。

然后，我们仍然必须将输出组装成机器代码并将其与支持库链接，但这是我们现在可以手动执行的操作。稍后，我们将编写一些代码来自动执行此操作。

# 结论

从解释器更改为通用代码生成器是微不足道的，但是随后我们不得不编写一些代码以生成实际的程序集输出，为此我们必须考虑如何分配寄存器：目前我们有一个幼稚的解决方案。我们还必须处理一些 x86-64 的怪异 idivq 指令。

我还没有谈到的是：为什么要为表达式生成 AST 呢？当然，cgadd() 当我们在 Pratt 解析器中命中“+”令牌时，我们可能会调用，其他运算符也是如此。我要让您考虑一下，但是我将在一到两步之后再讲一遍。

在编译器编写过程的下一部分中，我们将在语言中添加一些语句，以使其开始类似于适当的计算机语言。
