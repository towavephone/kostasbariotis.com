---
title: 编译器之旅（六）——变量
date: 2020-3-5 10:24:51
categories:
- 计算机基础
tags: 编译原理, 变量
path: /tour-of-compiler-variables/
---

# 需求

在语言中添加变量，希望能够做到

- 声明变量
- 使用变量获取存储的值
- 分配给变量

这是 input02 输入文件的内容：

```
int fred;
int jim;
fred = 5;
jim = 12;
print fred + jim;
```

最明显的变化是在表达式中具有变量声明，赋值语句和变量名称。但是在开始之前，让我们先看看如何实现变量。


# 准备

## BNF语法

```
statements: statement
    |      statement statements
    ;

statement: 'print' expression ';'
    |     'int'   identifier ';'
    |     identifier '=' expression ';'
    ;

identifier: T_IDENT
    ;
```

# 核心逻辑

## 符号表

每个编译器都需要一个符号表，稍后我们将不仅仅持有全局变量，但现在这是表中的一项的结构（来自defs.h）：

```c
// Symbol table structure
struct symtable {
  char *name;                   // Name of a symbol
};
```

我们在 data.h 中有一个符号数组：

```c
#define NSYMBOLS        1024            // Number of symbol table entries
extern_ struct symtable Gsym[NSYMBOLS]; // Global symbol table
static int Globs = 0;                   // Position of next free global symbol slot
```

Globs 实际上是位于 sym.c 中用于管理符号表的文件，具有以下功能：

- int findglob(char *s)：确定符号 s 是否在全局符号表中，返回其插槽位置；如果找不到，则返回 -1。
- static int newglob(void)：获取新的全局符号槽的位置，否则如果我们用完所有位置则结束。
- int addglob(char *name)：将全局符号添加到符号表，返回符号表中的插槽号。

该代码相当简单，因此我不会在这里给出代码。使用这些功能，我们可以找到符号并将新符号添加到符号表中。

## 扫描和新令牌

如果查看示例输入文件，我们需要一些新标记：

- 'int'，称为 T_INT
- '='，称为 T_EQUALS
- 标识符名称，称为 T_IDENT

'=' 很容易添加到 scan()：

```c
case '=':
  t->token = T_EQUALS;
  break;
```

我们可以将 'int' 关键字添加到 keyword()：

```c
case 'i':
  if (!strcmp(s, "int"))
    return (T_INT);
  break;
```

对于标识符，我们已经在 scanident() 将单词存储到 Text 变量中了，我们可以返回一个 T_IDENT 令牌：

```c
if (isalpha(c) || '_' == c) {
  // Read in a keyword or identifier
  scanident(c, Text, TEXTLEN);

  // If it's a recognised keyword, return that token
  if (tokentype = keyword(Text)) {
    t->token = tokentype;
    break;
  }
  // Not a recognised keyword, so it must be an identifier
  t->token = T_IDENT;
  break;
}
```

## 新语法

标识符作为 T_IDENT 令牌返回，并且我们已经有了解析打印语句的代码。但是由于我们现在拥有三种类型的语句，因此编写一个处理每种类型的函数是有意义的，现在我们的顶级 statements() 函数 stmt.c 如下所示：

```c
// Parse one or more statements
void statements(void) {

  while (1) {
    switch (Token.token) {
    case T_PRINT:
      print_statement();
      break;
    case T_INT:
      var_declaration();
      break;
    case T_IDENT:
      assignment_statement();
      break;
    case T_EOF:
      return;
    default:
      fatald("Syntax error, token", Token.token);
    }
  }
}
```

## 变量声明

让我们看一下变量声明，这是在一个新文件 decl.c 中 ，因为将来我们将有许多其他类型的声明。

```c
// Parse the declaration of a variable
void var_declaration(void) {

  // Ensure we have an 'int' token followed by an identifier
  // and a semicolon. Text now has the identifier's name.
  // Add it as a known identifier
  match(T_INT, "int");
  ident();
  addglob(Text);
  genglobsym(Text);
  semi();
}
```

在 ident() 和 semi() 函数中包装 match()：

```c
void semi(void)  { match(T_SEMI, ";"); }
void ident(void) { match(T_IDENT, "identifier"); }
```

返回 var_declaration()，一旦我们将标识符扫描到 Text 缓冲区中，就可以使用将其添加到全局符号表中 addglob(Text)，那里的代码允许多次声明一个变量。

## 赋值声明

这是 stmt.c 中的 assignment_statement()：

```c
void assignment_statement(void) {
  struct ASTnode *left, *right, *tree;
  int id;

  // Ensure we have an identifier
  ident();

  // Check it's been defined then make a leaf node for it
  if ((id = findglob(Text)) == -1) {
    fatals("Undeclared variable", Text);
  }
  right = mkastleaf(A_LVIDENT, id);

  // Ensure we have an equals sign
  match(T_EQUALS, "=");

  // Parse the following expression
  left = binexpr(0);

  // Make an assignment AST tree
  tree = mkastnode(A_ASSIGN, left, right, 0);

  // Generate the assembly code for the assignment
  genAST(tree, -1);
  genfreeregs();

  // Match the following semicolon
  semi();
}
```

我们有几个新的 AST 节点类型，`A_ASSIGN` 在左侧的子级中获取表达式，并将其分配给右侧的子级，右边的孩子将是一个 `A_LVIDENT` 节点。

为什么将这个节点称为 A_LVIDENT？因为它代表左值标识符，那么什么是左值？

左值是绑定到特定位置的值，在这里它是内存中保存变量值的地址。当我们这样做时：

```
area = width * height;
```

我们将右侧的结果（即rvalue）分配给左侧的变量（即lvalue），在右值不依赖于特定的位置，表达式结果可能在任意寄存器中。

还要注意，尽管赋值语句具有以下语法

```
identifier '=' expression ';'
```

我们将使表达式成为 `A_ASSIGN` 节点的左侧子树，并将 `A_LVIDENT` 详细信息保存在右侧子树中。为什么？因为我们需要先计算表达式，然后再将其保存到变量中。

## AST 结构的变化

现在我们需要在 `A_INTLIT AST` 节点中存储整数文字值，或者在 `A_IDENT AST` 节点中存储符号的详细信息，我在 AST 结构中添加了一个并集以执行此操作（在 defs.h 中）：

```c
// Abstract Syntax Tree structure
struct ASTnode {
  int op;                       // "Operation" to be performed on this tree
  struct ASTnode *left;         // Left and right child trees
  struct ASTnode *right;
  union {
    int intvalue;               // For A_INTLIT, the integer value
    int id;                     // For A_IDENT, the symbol slot number
  } v;
};
```

## 生成分配代码

现在让我们来看看 gen.c 中变化的 genAST()

```c
int genAST(struct ASTnode *n, int reg) {
  int leftreg, rightreg;

  // Get the left and right sub-tree values
  if (n->left)
    leftreg = genAST(n->left, -1);
  if (n->right)
    rightreg = genAST(n->right, leftreg);

  switch (n->op) {
    ...
    case A_INTLIT:
      return (cgloadint(n->v.intvalue));
    case A_IDENT:
      return (cgloadglob(Gsym[n->v.id].name));
    case A_LVIDENT:
      return (cgstorglob(reg, Gsym[n->v.id].name));
    case A_ASSIGN:
      // The work has already been done, return the result
      return (rightreg);
    default:
      fatald("Unknown AST operator", n->op);
  }
```

请注意我们首先执行左侧的 AST 子级，然后获取一个保存左侧子树值的寄存器号，现在我们将此寄存器号传递给右侧子树，我们需要对 A_LVIDENT 节点执行此操作，以便于让 cg.c 中的 cgstorglob() 函数知道哪个寄存器保存赋值表达式的右值结果。

因此，请考虑以下 AST 树：

```
           A_ASSIGN
          /        \
     A_INTLIT   A_LVIDENT
        (3)        (5)
```

我们调用 leftreg = genAST(n->left, -1); 以执行 `A_INTLIT` 操作，这将执行 return (cgloadint(n->v.intvalue)); 即加载值为 3 的寄存器并返回寄存器ID。

然后我们调用 rightreg = genAST(n->right, leftreg); 以执行 `A_LVIDENT` 操作，这将把 return (cgstorglob(reg, Gsym[n->v.id].name)); 返回的寄存器存储到名称为 Gsym[5] 的变量中。

然后我们切换到 `A_ASSIGN` 情况，我们所有的工作都已经完成，右值仍在寄存器中。因此让它保留在那里并返回它，稍后我们将能够执行以下表达式：

```
a = b = c = 0;
```

赋值不仅是语句，而且是表达式。

## 生成 x86-64 代码

您可能已经注意到，我将旧 cgload() 函数的名称更改为 cgloadint()，现在我们有一个函数可以从全局变量（在 cg.c 中）加载值：

```c
int cgloadglob(char *identifier) {
  // Get a new register
  int r = alloc_register();

  // Print out the code to initialise it
  fprintf(Outfile, "\tmovq\t%s(\%%rip), %s\n", identifier, reglist[r]);
  return (r);
}
```

同样我们需要一个函数来将寄存器保存到变量中：

```c
// Store a register's value into a variable
int cgstorglob(int r, char *identifier) {
  fprintf(Outfile, "\tmovq\t%s, %s(\%%rip)\n", reglist[r], identifier);
  return (r);
}
```

我们还需要一个函数来创建新的全局整数变量：

```c
// Generate a global symbol
void cgglobsym(char *sym) {
  fprintf(Outfile, "\t.comm\t%s,8,8\n", sym);
}
```

当然我们不能让解析器直接访问此代码，相反通用代码生成器中有一个函数 gen.c 充当接口：

```c
void genglobsym(char *s) { cgglobsym(s); }
```

## 表达式中的变量

现在我们可以分配变量了，但是我们如何将变量的值放入表达式中。我们已经有了一个 primary() 获取整数文字的函数，让我们对其进行修改以同时加载变量的值：

```c
// Parse a primary factor and return an
// AST node representing it.
static struct ASTnode *primary(void) {
  struct ASTnode *n;
  int id;

  switch (Token.token) {
    case T_INTLIT:
      // For an INTLIT token, make a leaf AST node for it.
      n = mkastleaf(A_INTLIT, Token.intvalue);
      break;

    case T_IDENT:
      // Check that this identifier exists
      id = findglob(Text);
      if (id == -1)
        fatals("Unknown variable", Text);

      // Make a leaf AST node for it
      n = mkastleaf(A_IDENT, id);
      break;

    default:
      fatald("Syntax error, token", Token.token);
  }

  // Scan in the next token and return the leaf node
  scan(&Token);
  return (n);
}
```

注意在 T_IDENT 情况下的语法检查，以确保在尝试使用变量之前已声明该变量。

还要注意检索变量值的 AST 叶节点是 `A_IDENT` 节点，保存到变量中的叶是 `A_LVIDENT` 节点，这是 rvalues 和 lvalues 之间的区别。

## 其他变化

我可能还做了其他一些更改，创建一些帮助器函数在 misc.c 中以便更轻松地报告致命错误：

```c
// Print out fatal messages
void fatal(char *s) {
  fprintf(stderr, "%s on line %d\n", s, Line); exit(1);
}

void fatals(char *s1, char *s2) {
  fprintf(stderr, "%s:%s on line %d\n", s1, s2, Line); exit(1);
}

void fatald(char *s, int d) {
  fprintf(stderr, "%s:%d on line %d\n", s, d, Line); exit(1);
}

void fatalc(char *s, int c) {
  fprintf(stderr, "%s:%c on line %d\n", s, c, Line); exit(1);
}
```

# 运行结果

## 输入

input01

```
print 12 * 3;
print
   18 - 2
      * 4; print
1 + 2 +
  9 - 5/2 + 3*5;
```

input02

```
int fred;
int jim;
fred= 5;
jim= 12;
print fred + jim;
```

## 输出

```bash
$ make test
cc -o comp1 -g cg.c decl.c expr.c gen.c main.c misc.c scan.c stmt.c sym.c tree.c
./comp1 input01
cc -o out out.s
./out
36
10
25
./comp1 input02
cc -o out out.s
./out
17
```

input01 生成的 out.s

```
	.text
.LC0:
	.string	"%d\n"
printint:
	pushq	%rbp
	movq	%rsp, %rbp
	subq	$16, %rsp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %eax
	movl	%eax, %esi
	leaq	.LC0(%rip), %rdi
	movl	$0, %eax
	call	printf@PLT
	nop
	leave
	ret

	.globl	main
	.type	main, @function
main:
	pushq	%rbp
	movq	%rsp, %rbp
	movq	$12, %r8
	movq	$3, %r9
	imulq	%r8, %r9
	movq	%r9, %rdi
	call	printint
	movq	$18, %r8
	movq	$2, %r9
	movq	$4, %r10
	imulq	%r9, %r10
	subq	%r10, %r8
	movq	%r8, %rdi
	call	printint
	movq	$1, %r8
	movq	$2, %r9
	addq	%r8, %r9
	movq	$9, %r8
	addq	%r9, %r8
	movq	$5, %r9
	movq	$2, %r10
	movq	%r9,%rax
	cqo
	idivq	%r10
	movq	%rax,%r9
	subq	%r9, %r8
	movq	$3, %r9
	movq	$5, %r10
	imulq	%r9, %r10
	addq	%r8, %r10
	movq	%r10, %rdi
	call	printint
	movl	$0, %eax
	popq	%rbp
	ret
```

input02 生成的 out.s

```
	.text
.LC0:
	.string	"%d\n"
printint:
	pushq	%rbp
	movq	%rsp, %rbp
	subq	$16, %rsp
	movl	%edi, -4(%rbp)
	movl	-4(%rbp), %eax
	movl	%eax, %esi
	leaq	.LC0(%rip), %rdi
	movl	$0, %eax
	call	printf@PLT
	nop
	leave
	ret

	.globl	main
	.type	main, @function
main:
	pushq	%rbp
	movq	%rsp, %rbp
	.comm	fred,8,8
	.comm	jim,8,8
	movq	$5, %r8
	movq	%r8, fred(%rip)
	movq	$12, %r8
	movq	%r8, jim(%rip)
	movq	fred(%rip), %r8
	movq	jim(%rip), %r9
	addq	%r8, %r9
	movq	%r9, %rdi
	call	printint
	movl	$0, %eax
	popq	%rbp
	ret
```

# 结论

我们必须写出符号表管理的开始，我们不得不处理两种新的语句类型，我们必须添加一些新的令牌和一些新的 AST 节点类型，最后我们必须添加一些代码以生成正确的 x86-64 程序集输出。

尝试编写一些示例输入文件，并查看编译器是否可以正常工作，特别是如果它检测到语法错误和语义错误（可使用而无需声明）。

在我们的编译器编写旅程的下一部分，我们将在我们的语言中添加六个比较运算符，这将使我们在此之后的部分开始控制结构。
