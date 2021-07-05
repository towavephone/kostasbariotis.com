---
title: 编译器之旅（一）——词法分析
date: 2020-2-26 11:15:59
categories:
  - 计算机基础
tags: 编译原理, 词法分析
path: /tour-of-compiler-lexical-analysis/
---

# 原理知识

可参考 [parsing techniques 中文译本——《解析技术》](http://parsing-techniques.duguying.net/)

# 目标

- 编写一个自编译的编译器：我认为如果编译器可以自行编译，就可以称其为真正的编译器。
- 针对至少一个真实的硬件平台：我见过一些为假设的机器生成代码的编译器，我希望我的编译器可以在真正的硬件上运行。另外，如果可能的话我想编写编译器，以便它可以为不同的硬件平台支持多个后端。
- 研究前实用：在编译器领域有很多研究，在此过程中我想从绝对零开始，因此我倾向于采用一种实用的方法，而不是理论繁重的方法，就是说有时候我需要介绍（并实现）一些基于理论的东西。
- 遵循 KISS 原则：保持简单，我肯定会在这里使用肯·汤普森的原则：“如有疑问，请使用蛮力。”
- 采取许多小步骤以达到最终目标：我将把旅程分解成许多简单的步骤，而不是进行大的飞跃。这将使编译器中的每个新添加内容都变成一口大小且易于消化的东西。
- 对其他语言的编译有所启发：了解真实语言的编译过程，有助于了解 babel 编译的过程

# 搭建开发环境

使用 Ubuntu 系统，运行以下命令安装软件包即可

```bash
 $ sudo apt-get install build-essential
```

# 需求

构造一个简单的词法扫描器，识别输入语言中的词法元素或标记

# 准备

我们将从只有五个词法元素的语言开始：

- 这四个基本的数学运算符：\*，/，+和-
- 具有 1 个或多个数字的十进制整数 0..9

扫描到的每个元素的结构如下：

```c
struct token {
  int token;
  int intvalue;
};
```

其中 token 字段可以为以下值之一：

```c
enum {
  T_PLUS, T_MINUS, T_STAR, T_SLASH, T_INTLIT
};
```

当 token 为 T_INTLIT 时，intvalue 将保存我们搜索到的整数值

# 核心逻辑

## scan.c

```c
#include "defs.h"
#include "data.h"
#include "decl.h"

// 词法分析
// 返回字符 c 在字符串 s 的位置
static int chrpos(char *s, int c) {
  char *p;

  p = strchr(s, c);
  return (p ? p - s : -1);
}

// 读取文件的每一个字符
static int next(void) {
  int c;

  if (Putback) {  // Putback 有值时，回退到字符 Putback
    c = Putback;
    Putback = 0;
    return c;
  }

  c = fgetc(Infile);  // 从文件指针 stream 指向的文件中读取一个字符，读取一个字节后，光标位置后移一个字节，Infile 是全局变量
  if ('\n' == c)
    Line++; //  记录行号
  return c;
}

// 回退到字符 c 处
static void putback(int c) {
  Putback = c;
}

// 跳过空白字符
static int skip(void) {
  int c;

  c = next(); // 读取第一个字符
  while (' ' == c || '\t' == c || '\n' == c || '\r' == c || '\f' == c) { // 遇到空白字符马上跳过
    c = next();
  }
  return c;
}

// 扫描字符串中的整数，注意整数的连续性
static int scanint(int c) {
  int k, val = 0;

  // 遇到整数字符累加，直至遇到非整数字符
  // 为什么不简单地从中减去 ASCII 值使 c 其成为整数？
  // 因为之后的 chrpos("0123456789abcdef") 能转换十六进制数字
  while ((k = chrpos("0123456789", c)) >= 0) {
    val = val * 10 + k;
    c = next();
  }

  // 此时已是非整数字符，回退到 c 字符
  putback(c);
  return val;
}

int scan(struct token *t) {
  int c;

  // 跳过空白，读取第一个非空字符
  c = skip();

  // 处理字符
  switch (c) {
    case EOF:
      return 0;
    case '+':
      t->token = T_PLUS;
      break;
    case '-':
      t->token = T_MINUS;
      break;
    case '*':
      t->token = T_STAR;
      break;
    case '/':
      t->token = T_SLASH;
      break;
    default:
      if (isdigit(c)) {
        t->intvalue = scanint(c);
        t->token = T_INTLIT;
        break;
    }

    printf("Unrecognised character %c on line %d\n", c, Line);
    exit(1);
  }

  // We found a token
  return 1;
}
```

## main.c

```c
#include "defs.h"
#define extern_
#include "data.h"
#undef extern_
#include "decl.h"
#include <errno.h>

static void init() {
  Line = 1;
  Putback = '\n';
}

// Print out a usage if started incorrectly
static void usage(char *prog) {
  fprintf(stderr, "Usage: %s infile\n", prog);
  exit(1);
}

// List of printable tokens
char *tokstr[] = { "+", "-", "*", "/", "intlit" };

static void scanfile() {
  struct token T;

  while (scan(&T)) {
    printf("Token %s", tokstr[T.token]);
    if (T.token == T_INTLIT)
      printf(", value %d", T.intvalue);
    printf("\n");
  }
}

void main(int argc, char *argv[]) {
  // 检查参数合法性
  if (argc != 2)
    usage(argv[0]);

  init();

  // 打不开文件错误处理
  if ((Infile = fopen(argv[1], "r")) == NULL) {
    fprintf(stderr, "Unable to open %s: %s\n", argv[1], strerror(errno));
    exit(1);
  }

  scanfile();
  exit(0);
}
```

# 运行结果

## 输入

```bash
23 +
18 -
45.6 * 2
/ 18
```

```bash
2 + 3 * 5 - 8 / 3
```

## 输出

```bash
Token intlit, value 23
Token +
Token intlit, value 18
Token -
Token intlit, value 45
Unrecognised character . on line 3
```

```bash
Token intlit, value 2
Token +
Token intlit, value 3
Token *
Token intlit, value 5
Token -
Token intlit, value 8
Token /
Token intlit, value 3
```
