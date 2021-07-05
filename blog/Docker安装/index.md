---
title: Docker安装（Ubuntu16.04版）
date: 2017-12-11 23:04:12
categories:
  - 运维
path: /docker-install/
tags: 后端, Docker, Docker安装
---

## 安装环境

- Ubuntu16.04（Xenial LTS）

## 使用存储库进行安装

### 设置存储库

1. 更新`apt`软件包索引：
   ```sh
   $ sudo apt-get update
   ```
2. 安装软件包允许`apt`通过`HTTPS`使用存储库：
   ```sh
   $ sudo apt-get install \
       apt-transport-https \
       ca-certificates \
       curl \
       software-properties-common
   ```
3. 添加`Docker`官方`GPG`密钥：

   ```sh
   $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
   ```

   `9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88`通过搜索指纹的最后 8 个字符，确认您现在拥有指纹的密钥 。

   ```sh
   $ sudo apt-key fingerprint 0EBFCD88

   pub   4096R/0EBFCD88 2017-02-22
       Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
   uid                  Docker Release (CE deb) <docker@docker.com>
   sub   4096R/F273FCD8 2017-02-22
   ```

4. 使用以下命令来设置稳定的存储库：

   ```sh
   $ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
   ```

### 安装 DOCKER CE

1. 更新`apt`软件包索引。
   ```sh
   $ sudo apt-get update
   ```
2. 安装最新版本的`Docker CE`，任何现有的`Docker`安装都将被替换。
   ```sh
   $ sudo apt-get install docker-ce
   ```
3. 通过运行`hello-world`镜像验证是否正确安装了`Docker CE`。
   ```sh
   $ sudo docker run hello-world
   ```
   这个命令下载一个测试并在容器中运行。容器运行时，会打印一条信息消息并退出。

## 升级 DOCKER CE

要升级`Docker CE`，首先运行`sudo apt-get update`，然后按照安装说明选择要安装的新版本。

## 卸载 Docker CE

1. 卸载`Docker CE`软件包：
   ```sh
   $ sudo apt-get purge docker-ce
   ```
2. 主机上的镜像，容器，卷或自定义配置文件不会自动删除，必须手动删除任何已编辑的配置文件：
   ```sh
   $ sudo rm -rf /var/lib/docker
   ```
