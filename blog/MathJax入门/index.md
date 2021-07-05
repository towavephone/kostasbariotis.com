---
title: MathJax 入门
date: 2018-3-27 17:10:57
categories:
  - Markdown
path: /mathjax-usage/
tags: Markdown, mathjax
---

## 基础语法

### 显示公式

- 在行中显示的 (inline mode)，就用 `$...$`
- 单独一行显示 (display mode)，则用 `$$...$$`

### 希腊字母

- 要显示希腊字母，可以用 `\alpha, \beta, …, \omega`，输出`α,β,…ω`
- 想要显示大写的话，就用 `\Gamma, \Delta, …, \Omega`, 输出 `Γ,Δ,…,Ω`

### 上下标

- 上下标可用 `^` 和 `_`, 比如`\log_2 x` 显示 $\log_2 x$
- 上下标符号只能用于接下来一个 `Group`，即单个字符，或一组花括号内的东西，比如 $10^{10}$ 要写成`10^{10}`

### 括号

- 小括号、方括号直接输，花括号要用 `\{` 和 `\}`
- 括号不会伸缩，如写 `(\frac{\sqrt x}{y^3})` 会得到 $(\frac{\sqrt x}{y^3})$
- 如果需要伸缩，就需要用 `\left(…\right)` 来进行自动伸缩，如写 `\left(\frac{\sqrt x}{y^3}\right)` 得到 $\left(\frac{\sqrt x}{y^3}\right)$
- `\left` 和 `\right` 的用法在这些中有用：三种括号，绝对值符号，范数符号 `\vert x \vert` $\vert x \vert$，`\Vert x \Vert` $\Vert x \Vert$，尖角符号 `\langle` 和 `\rangle` $\langle x \rangle$，向上下取整符号 `\lceil \rceil` 和 `\lfloor \rfloor`。如果只需显示一半的符号，可以用 `.` 来表示另一边为空，如`\left. \frac 1 2 \right \rbrace` 就是 $\left. \frac 1 2 \right \rbrace$
- 当然也可以手动调整括号的大小，如`\Biggl(\biggl(\Bigl(\bigl((x)\bigr)\Bigr)\biggr)\Biggr)` 会得到 $\Biggl(\biggl(\Bigl(\bigl((x)\bigr)\Bigr)\biggr)\Biggr)$

### 求和与积分

- `\sum_1^n` 显示 $\sum_1^n$, `\int_1^n` 显示 $\int_1^n$，当然也有`Group`的概念，不止一位时需要花括号。
- 类似的还有连乘号 `\prod` $\prod$、并集`\bigcup` $\bigcup$、交集`\bigcap`$\bigcap$ 、多重积分 `\iint` $\iint$等。

### 分数

有两种方法来显示分数，一种是 `\frac a b` 来显示$\frac a b$，另一种是用 `\over`， 如`{a+1 \over b+1}` 显示 ${a+1 \over b+1}$

### 字体

1. 用 `\mathbb` 或 `\Bbb` 选择`blackboard bold` 字体，如`\mathbb {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ \\ abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz}：` $\mathbb {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$
2. 用 `\mathbf` 选择 `boldface` 字体： $$\mathbf {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
3. 用 `\mathtt` 选择 `typewriter` 字体： $$\mathtt {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
4. 用 `\mathrm` 选择 `roman` 字体： $$\mathrm {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
5. 用 `\mathsf` 选择`sans-serif`字体： $$\mathsf {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
6. 用 `\mathcal` 选择 `calligraphic` 字体： $$\mathcal {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
7. 用 `\mathscr` 选择 `script` 字体： $$\mathscr {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$
8. 用 `\mathfrak` 选择 `Fraktur` 字体： $$\mathfrak {ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ}$$

### 根号

`\sqrt {x^3}`可显示根号$\sqrt {x^3}$，`\sqrt[3] {\frac x y}` 显示三次根号 $\sqrt[3] {\frac x y}$

### 三角函数、极限和对数

像 “lim”, “sin”, “max”, “ln”等符号，已包括在 roman 字体中，用 `\lim`等即可，极限可用`\lim_{x\to 0}`来表示： $$\lim_{x\to 0}$$

### 特殊符号和记号

有很多，以下是一小部分：

- `\lt \gt \le \ge \neq` 表示 $\lt \gt \le \ge \neq$，还可以在不等号上加`\not`，如 `\not\lt` 表示 $\not\lt$
- `\times \div \pm \mp` 表示 $\times \div \pm \mp$，点乘用`\cdot`表示,如 `x \cdot y` 表示 $x \cdot y$
- 集合类符号，`\cup \cap \setminus \subset \subseteq \subsetneq \supset \in \notin \emptyset \varnothing` 表示 $\cup \cap \setminus \subset \subseteq \subsetneq \supset \in \notin \emptyset \varnothing$
- 组合数，`{n+1 \choose 2k}` 或 `\binom{n+1}{2k}` 表示$\binom{n+1}{2k}$
- 箭头，`\to \rightarrow \leftarrow \Rightarrow \Leftarrow \mapsto` 表示 $\to \rightarrow \leftarrow \Rightarrow \Leftarrow \mapsto$
- `\land \lor \lnot \forall \exists \top \bot \vdash \vDash` 表示 $\land \lor \lnot \forall \exists \top \bot \vdash \vDash$
- `\star \ast \oplus \circ \bullet` 表示 $\star \ast \oplus \circ \bullet$
- `\approx \sim \simeq \cong \equiv \prec \lhd` 表示 $\approx \sim \simeq \cong \equiv \prec \lhd$
- `\infty \aleph_0` 表示 $\infty \aleph_0$，`\nabla \partial` 表示 $\nabla \partial$，`\Im \Re` 表示 $\Im \Re$
- 取模，用`\pmod`，如`a \equiv b\pmod n` 表示 $a \equiv b\pmod n$
- 省略号，底一点的中的省略用`\ldots`，如`a_1, a_2, \ldots ,a_n`表示 $a_1, a_2, \ldots ,a_n $，中间位置的的省略用`\cdots`，如`a_1 + a_2 + \ldots + a_n` 表示 $a_1 + a_2 + \ldots + a_n$

### 空格

MathJax 中加入空格不会改变表达式，如果想在表达式中加空格，根据空格的不同，可用`\, \; \quad \qquad`，如 $a\,b,a\;b,a\quad b,a\qquad b$ 如果想加入一段文字，可用`\text{…}`，如`\{x \in s \mid x \text{ is extra large}\}`表示 $\{x \in s \mid x \text{ is extra large}\}$，在`\text{…}`里面还可以嵌套`$…$`

### Accents (重音符) and diacritical (变音符) marks

- 重音符可用`\hat`，如`\hat x`表示 $\hat x$
- 变音符可用`\widehat`，如`\widehat {xy}`表示 $\widehat {xy}$
- `\bar x` 表示 $\bar x$，`\overline {xyz}` 表示 $\overline {xyz}$
- `\vec x`表示$\vec x$ ，`\overrightarrow {xy}` 表示 $\overrightarrow {xy}$，`\overleftrightarrow {xy}` 表示 $\overleftrightarrow {xy}$
- 如果用点号，可用`\dot`和`\ddot`，如可用`\frac d{dx}x\dot x = \dot x^2 + x\ddot x` 表示 $\frac d{dx}x\dot x = \dot x^2 + x\ddot x$

### 转义符

一般情况下可用`\`来作转义，但如果想要表示`\`本身，需要用`\backslash`，因为`\\`表示换行。
