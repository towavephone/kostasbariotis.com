---
title: Docker源国内加速
date: 2017-12-11 23:37:24
categories:
  - 运维
path: /docker-origin-guonei/
tags: 后端, Docker, Docker源
---

- 安装／升级你的 Docker 客户端

- 推荐安装 1.10.0 以上版本的 Docker，参考文档[Docker 安装](/2017/12/11/Docker%E5%AE%89%E8%A3%85/)

## 如何配置镜像加速器

- 针对 Docker 客户端版本大于 1.10.0 的用户

* 您可以通过修改 daemon 配置文件/etc/docker/daemon.json 来使用加速器：

```sh
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://cfyic0ek.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docke
```
