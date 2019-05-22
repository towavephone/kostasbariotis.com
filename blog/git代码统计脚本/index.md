---
title: git代码统计脚本
categories:
  - 版本控制工具
path: /git-code-statistics-script/
tags: Git, git 代码统计
date: 2019-5-22 10:04:47
---

# 需求背景

由于每个周末放假前都要给出代码量的统计，如果是手动统计的话需要到各个开发过的项目下运行相应的脚本，太过繁琐。故写出以下第一版统计代码量的脚本

# 代码展示

以下是统计 G:/project/tungee/ 目录下的从星期一到今天的代码量，其中标红部分需要修改为自己的项目路径和git邮箱

```bash{25,29,33,40}
#!/bin/sh
# 能够检测一些错误，并在错误发生时中断程序并输出信息
# 使用 set -e 令脚本在发生错误时退出而不是继续运行；使用 set -u 来检查是否使用了未赋值的变量；试试 set -o pipefail，它可以监测管道中的错误。
set -euo pipefail
trap "echo 'error: Script failed: see failed command above'" ERR
# {} 防止下载不完全代码被执行
{
  function to_array(){
    x=$1
    OLD_IFS="$IFS" 
    IFS=","
    array=($x) 
    IFS="$OLD_IFS" 
    for each in ${array[*]}
    do
    echo $each
    done
  }
  echo "输入项目名，以英文逗号分隔，不能有空格"
  read input
  files=($(to_array $input))
  echo -e "\n"
  for file in ${files[@]}
  do
    if [ ! -d "G:/project/tungee/$file" ]; then
      echo -e "$file 目录不存在。"
      continue;
    fi
    if [ ! -d "G:/project/tungee/$file/.git" ]; then
      echo -e "$file 不是git仓库。"
      continue;
    fi
    cd "G:/project/tungee/$file"
    echo "$file 代码量统计："
    i=`date +%w`
    while [ $i -ge 1 ]
    do
      sinceDate=`date -d "-$i day" +%Y-%m-%d`
      untilDate=`date -d "-$(($i-1)) day" +%Y-%m-%d`
      git log --author="634407147@qq.com" --since=$sinceDate --until=$untilDate --pretty=tformat: --numstat | gawk '{ add += $1 ; subs += $2 ; loc += $1 - $2 } END { printf "'$untilDate' 增加行总数：%s，删除行总数：%s，总代码行：%s\n", add, subs, loc }'
      i=$(($i-1))
    done
    echo -e "\n"
  done
}
```

以上更新于`2019-5-22 22:17:24`

---

# 运行效果

![](2019-05-22-22-18-59.png)