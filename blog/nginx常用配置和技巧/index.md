---
title: nginx常用配置和技巧
date: 2019-6-6 15:03:49
path: /nginx-common-configurations-techniques/
tags: 后端, nginx
---

# 一个站点配置多个域名

```bash
server {
    listen       80;
    server_name  ops-coffee.cn b.ops-coffee.cn;
}
```

server_name 后跟多个域名即可，多个域名之间用空格分隔

# 一个服务配置多个站点

```bash
server {
    listen       80;
    server_name  a.ops-coffee.cn;

    location / {
        root /home/project/pa;
        index index.html;
    }
}

server {
    listen       80;
    server_name  ops-coffee.cn b.ops-coffee.cn;

    location / {
        root /home/project/pb;
        index index.html;
    }
}

server {
    listen       80;
    server_name  c.ops-coffee.cn;

    location / {
        root /home/project/pc;
        index index.html;
    }
}
```

基于 nginx 虚拟主机配置实现，nginx 有三种类型的虚拟主机

基于 ip 的虚拟主机：需要你的服务器上有多个地址，每个站点对应不同的地址，这种方式使用的比较少

基于端口的虚拟主机：每个站点对应不同的端口，访问的时候使用 ip:port 的方式访问，可以修改 listen 的端口来使用

基于域名的虚拟主机：使用最广的方式，上边例子中就是用了基于域名的虚拟主机，前提条件是你有多个域名分别对应每个站点，server_name 填写不同的域名即可

# nginx 添加账号密码验证

```bash
server {
    location / {
        auth_basic "please input user&passwd";
        auth_basic_user_file key/auth.key;
    }
}
```

有很多服务通过 nginx 访问，但本身没有提供账号认证的功能，就可以通过 nginx 提供的 authbase 账号密码认证来实现，可以用以下脚本来生成账号的密码

```bash
# cat pwd.pl
#!/usr/bin/perl
use strict;

my $pw=$ARGV[0] ;
print crypt($pw,$pw)."\n";
```

使用方法：

```bash
# perl pwd.pl ops-coffee.cn
opf8BImqCAXww
# echo "admin:opf8BImqCAXww" > key/auth.key
```

# nginx 开启列目录

当你想让 nginx 作为文件下载服务器存在时，需要开启 nginx 列目录

```bash
server {
    location download {
        autoindex on;

        autoindex_exact_size off;
        autoindex_localtime on;
    }
}
```

autoindex_exact_size：为 on（默认）时显示文件的确切大小，单位是 byte；改为 off 显示文件大概大小，单位 KB 或 MB 或 GB

autoindex_localtime：为 off（默认）时显示的文件时间为 GMT 时间；改为 on 后，显示的文件时间为服务器时间

默认当访问列出的 txt 等文件时会在浏览器上显示文件的内容，如果你想让浏览器直接下载，加上下边的配置

```bash
if ($request_filename ~* ^.*?\.(txt|pdf|jpg|png)$) {
    add_header Content-Disposition 'attachment';
}
```

# 配置默认站点

```bash
server {
    listen 80 default;
}
```

当一个 nginx 服务上创建了多个虚拟主机时默认会从上到下查找，如果匹配不到虚拟主机则会返回第一个虚拟主机的内容，如果你想指定一个默认站点时，可以将这个站点的虚拟主机放在配置文件中第一个虚拟主机的位置，或者在这个站点的虚拟主机上配置 listen default

# 不允许通过 IP 访问

```bash
server {
    listen       80 default;
    server_name  _;

    return      404;
}
```

可能有一些未备案的域名或者你不希望的域名将服务器地址指向了你的服务器，这时候就会对你的站点造成一定的影响，需要禁止 IP 或未配置的域名访问，我们利用上边所说的 default 规则，将默认流量都转到 404 去

上边这个方法比较粗暴，当然你也可以配置下所有未配置的地址访问时直接 301 重定向到你的网站去，也能为你的网站带来一定的流量

```bash
server {
    rewrite ^/(.*)$ https://ops-coffee.cn/$1    permanent;
}
```

# 直接返回验证文件

```bash
location = /XDFyle6tNA.txt {
    default_type text/plain;
    return 200 'd6296a84657eb275c05c31b10924f6ea';
}
```

很多时候微信等程序都需要我们放一个 txt 的文件到项目里以验证项目归属，我们可以直接通过上边这种方式修改 nginx 即可，无需真正的把文件给放到服务器上

# nginx 配置 upstream 反向代理

```bash
http {
    ...
    upstream tomcats {
        server 192.168.106.176 weight=1;
        server 192.168.106.177 weight=1;
    }

    server {
        location /ops-coffee/ {
            proxy_pass http://tomcats;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

}
```

稍不注意可能会落入一个 proxy_pass 加杠不加杠的陷阱，这里详细说下 proxy_pass `http://tomcats` 与 proxy_pass `http://tomcats/` 的区别：

虽然只是一个 / 的区别但结果确千差万别。分为以下两种情况：

1. 目标地址中不带 uri(proxy_pass `http://tomcats`)。此时新的目标 url 中，匹配的 uri 部分不做修改，原来是什么就是什么。

   ```bash
   location /ops-coffee/ {
       proxy_pass  http://192.168.106.135:8181;
   }

   http://domain/ops-coffee/   -->     http://192.168.106.135:8181/ops-coffee/
   http://domain/ops-coffee/action/abc   -->     http://192.168.106.135:8181/ops-coffee/action/abc
   ```

2. 目标地址中带 uri (proxy_pass `http://tomcats/`，/也是 uri) ,此时新的目标 url 中，匹配的 uri 部分将会被修改为该参数中的 uri。

   ```bash
   location /ops-coffee/ {
       proxy_pass  http://192.168.106.135:8181/;
   }

   http://domain/ops-coffee/   -->     http://192.168.106.135:8181
   http://domain/ops-coffee/action/abc   -->     http://192.168.106.135:8181/action/abc
   ```

# nginx upstream 开启 keepalive

```bash
upstream tomcat {
    server ops-coffee.cn:8080;
    keepalive 1024;
}

server {
    location / {
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        proxy_pass http://tomcat;
    }
}
```

nginx 在项目中大多数情况下会作为反向代理使用，例如 nginx 后接 tomcat，nginx 后接 php 等，这时我们开启 nginx 和后端服务之间的 keepalive 能够减少频繁创建 TCP 连接造成的资源消耗，配置如上

keepalive: 指定每个 nginxworker 可以保持的最大连接数量为 1024，默认不设置，即 nginx 作为 client 时 keepalive 未生效

`proxy_http_version 1.1`: 开启 keepalive 要求 HTTP 协议版本为 HTTP 1.1

`proxy_set_header Connection ""`: 为了兼容老的协议以及防止 http 头中有 Connection close 导致的 keepalive 失效，这里需要及时清掉 HTTP 头部的 Connection

# 404 自动跳转到首页

```bash
server {
    location / {
       error_page 404 =  @ops-coffee;
    }

    location @ops-coffee {
       rewrite  .*  / permanent;
    }
}
```

网站出现 404 页面不是特别友好，我们可以通过上边的配置在出现 404 之后给自动跳转到首页去
