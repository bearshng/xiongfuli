---
layout: post
title:  Windows 8下audiodg.exe占用CPU很高的解决方法
date:   2013-08-28 12:53
categories: Windows
tags: audiodg
---

最近重装电脑系统之后，打开音频设备的时候，发现系统的CPU使用率为90%，打开资源管理器发现主要是因为audiodg.exe进程，为了电脑的安全就上网查找了一个解决方案，具体如下：
<h2>一、基本释义</h2>
<div>
<ol>
	<li>
进程文件：audiodg.exe
</li>
	<li>
所在路径： (系统安装目录盘)C:\Windows\System32\audiodg.exe
</li>
	<li>
中文名称： Windows音频设备管理程序
</li>
	<li>出品者：Microsoft Corp
</li>
	<li>属于：<b>Windows</b>音频设备图形隔离程序
</li>
	
</li>
</ol>

现阶段有关问题参考：

<span style="color: #000000;">一名安全研究人员近日表示，微软</span><span style="color: #000000;">新一代操作系统的Windows Vista进程保护功能存在严重安全隐患，而且已经有方式被恶意利用</span><span style="color: #000000; font-weight: bold;">。</span>Vista进程保护（Protected Process）原本为媒体路径、DRM文件设计，旨在防止未授权软件或硬件捕获高清晰度格式的内容，而用于进程保护的数字签名仅有微软以及合作媒体伙伴拥有。

</div>
<div>不过，从这名安全人员发布的概念性小程序来看，audiodg.exe以及mfpmp.exe两个Vista保护进程内信息已经能够被显示和调用，也就是说，只要恶意软件制造者获得相关数字签名，也可以编写出拥有进程保护能力的恶意代码一旦这种进程保护机制被恶意软件作者所利用，普通杀毒软件将束手无策。。</div>

<div>补充说明：这个进程在WIN7使用瑞昱（Realtek）声卡的时候可以对耳机音质进行大幅度的提升，具体设置如下：将耳机插上，点击音量图标，打开后点击上面的耳机图标，选择增强功能，内有三项设置：低音增强（有的版本可能没有）、耳机虚拟化、响度均衡，笔者建议大家把这三项全选，点击确定，重新启动音乐播放器，播放一首歌曲，你会发现一首原本普通的音质的歌曲现在几乎拥有了家庭影院级的音质！建议大家前后对比，笔者对比后音质增强效果非常明显！但是使用此项后，这个进程占用CPU会比平时稍高，请注意。</div>
<div>设置方法可以在realtek高清音频管理器（控制面板）也可以在系统音量设置里（右下角点喇叭 然后点扬声器的图标）。如果觉得不过瘾可以在realtek高清音频管理器的喇叭组态中直接选择5.1。</div>
<h2>二、解决方案</h2>
1.右击系统托盘处的喇叭图标，选择“播放设备”，系统将会弹出一个对话框，请双击你当前正在使用中的播放设备。
<div>
<p align="center"><a href="/assets/img/201306//Unnamed-QQ-Screenshot20130829225344.png"><img class="alignnone size-full wp-image-290" alt="声音" src="/assets/img/201306//Unnamed-QQ-Screenshot20130829225344.png" width="479" height="588" /></a></p>

2.双击当前使用的设备
<p align="center">在弹出的新对话框中，切换到“增强功能”标签，将系统默认未启用的“禁用所有增强性能”启用，最后保存设置退出</p>
<p align="center"><a href="/assets/img/201306//Unnamed-QQ-Screenshot20130829225600.png"><img class="alignnone size-full wp-image-291" alt="Unnamed QQ Screenshot20130829225600" src="/assets/img/201306//Unnamed-QQ-Screenshot20130829225600.png" width="479" height="588" /></a></p>
<p align="center"><a href="/assets/img/201306//Unnamed-QQ-Screenshot20130829225655.png"><img class="alignnone size-full wp-image-292" alt="Unnamed QQ Screenshot20130829225655" src="/assets/img/201306//Unnamed-QQ-Screenshot20130829225655.png" width="660" height="600" /></a></p>
<p align="center">这样就解决了Windows8系统<b>下</b><b>audiodg.exe占用CPU很高</b>，防止电脑运行速度慢和假死的状态。</p>

</div>