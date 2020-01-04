---
title: Git忽略规则及.gitignore规则不生效的解决办法
original: http://www.pfeng.org/archives/840
date: 2017-11-20 00:15:59
categories:
- 版本控制工具
path: /gitignore-invalid/
tags: Git, gitignore
---
## 案例

>在git中如果想忽略掉某个文件，不让这个文件提交到版本库中，可以使用修改根目录中 .gitignore 文件的方法（如无，则需自己手工建立此文件）。这个文件每一行保存了一个匹配的规则例如：

```bash
# 此为注释 – 将被 Git 忽略
*.a       # 忽略所有 .a 结尾的文件
!lib.a    # 但 lib.a 除外
/TODO     # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/    # 忽略 build/ 目录下的所有文件
doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
```



>规则很简单，不做过多解释，但是有时候在项目开发过程中，突然心血来潮想把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效，原因是.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交：

```bash
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

>如果有些文件已经被你忽略了，当你使用git add时是无法添加的，比如我忽略了*.class，现在我想把HelloWorld.class添加到git中去：git会提示我们这个文件已经被我们忽略了，需要加上-f参数才能强制添加到git中去：

```bash
$ git add HelloWorld.class
The following paths are ignored by one of your .gitignore files:
HelloWorld.class
Use -f if you really want to add them.
```

>如果我们意外的将想要忽略的文件添加到缓存中去了，我们可以使用rm命令将其从中移除，不会删除本地文件：

```bash
$ git rm HelloWorld.class --cached
rm 'HelloWorld.class'
```

## 查看gitignore规则

>如果你发现.gitignore写得有问题，需要找出来到底哪个规则写错了，可以用git check-ignore命令检查：

```bash
$ git check-ignore -v HelloWorld.class
.gitignore:1:*.class HelloWorld.class
```

>可以看到HelloWorld.class匹配到了我们的第一条*.class的忽略规则所以文件被忽略了。
