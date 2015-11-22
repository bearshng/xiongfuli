---
layout: post
title: Windows Server 2008无法ping通解决方案
date:   2014-03-19 12:53
categories: 服务器
tags: [Windows,Server]
---


今天在一个软件公司实习的时候需要去配置Windows Server 2008的时候发现SQL Server 2008无法访问，在网上搜了一下解决方案如下：

一、原因

出于安全因素考虑，在Windows 2008 R2上是不允许从外部对其Ping指令，如果需要配置允许被Ping，必须通过“高级安全Windows防火墙”进行配置。

二、解决方案

1. 打开管理工具中的"高级安全 Windows 防火墙";

2. 在左侧导航窗体中定位到"入站规则"，之后在入站规则中找到配置文件类型为"公共"的"文件和打印共享(回显请求 - ICMPv4-In)"规则，设置为允许。

<a href="/assets/img/201403/windows-server.jpg"><img class="alignnone size-full wp-image-710" src="/assets/img/201403/windows-server.jpg" alt="windows server" width="480" height="339" /></a>

&nbsp;

注：我们可以根据需要选择在何种网络环境中(域、专用或公共)允许该规则，如果网络使用了IPv6，则同时要允许 ICMPv6-In 的规则。

3.启动ICMP：

<a href="/assets/img/201403/icmp.jpg"><img class="alignnone size-full wp-image-711" src="/assets/img/201403/icmp.jpg" alt="icmp" width="435" height="514" /></a>

勾选“已启动(E)”， 根据具体情况选择并启动相应的ICMP即可。

&nbsp;