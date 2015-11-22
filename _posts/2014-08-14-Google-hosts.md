---
layout: post
title: 手机上自动获得Google的hosts获得方法(包括PC，持续更新)
date:   2014-09-14 12:53
categories: Google
tags: [Google-hosts]
---

**算起来google被封已经大约有2个半月了吧，至今未见到解封迹象。去年为了更好的体验google服务，故而在淘宝上买了Nexus 4，用起来很不错，google now 也很给力。然而随着离开大学校园网，现在手机上的各种google服务已经不能访问，前一段时间采用这个<a href="/assets/img/201408/hosts.txt">hosts</a>文件，虽然能够访问诸如google scholar ，google plus，google map等，但是作为一个google now的重度患者，没有google now的日子很难过。故而采用了一下几种方式进行了访问。
<h1><span style="color: #000000;">采用pennyjob提供的VPN进行访问</span></h1>
微信上面有一个公共主页，主要提供一些求职和招聘信息，而且不定时的发放一些语料，给码农研究生提供云主机和VPN账号。直接关注pennyjob，回复VPN即可获得VPN账号和密码。但是这种方式有弊端，主要是访问速度上，因为这个微信的公共账号订阅人数还是很多的，有时候存在连不上和访问速度慢的问题。
<h1>采用轮子的fqrouter.apk软件进行代理访问</h1>
这个软件是轮子自己开发的用于代理的一个软件可以访问国外绝大多数的网站包括google，但是存在一个问题是在使用google play进行软件下载的时候会出现错误495，主要原因是提供的缓存不够，导致5M以上的软件下载不下来。
<h1>采用Android Hosts-L V2.20.apk软件修改手机hosts进行访问</h1>
Android Hosts-L V2.20这个软件就是以前还算是比较火的软件<a title="smarthosts" href="http://code.google.com/p/smarthosts/issues/detail?id=564">smarthosts</a>的团队开发的，现在的网站是<a href="https://projecth.us/">这个</a>，这个论坛的宗旨是可以访问任何网站。采用Android Hosts-L V2.20进行访问的步骤如下：
<ol>
	<li>下载安装<a title="云更新安装版" href="http://pan.baidu.com/s/1qWk9IYo">Android Hosts-L</a>(持续更新)，安装完成之后的截图如下：
<a href="/assets/img/201408/20140814-hosts/" rel="attachment wp-att-934"><img class="aligncenter size-medium wp-image-934" src="/assets/img/201408/20140814-hosts.jpg" alt="hosts" width="168" height="300" /></a>

</li>
	<li>选择下载并应用Imouto.host，得到如下图
<a href="/assets/img/201408/20140814-hosts2.jpg/" rel="attachment wp-att-935"><img class="aligncenter size-medium wp-image-935" src="/assets/img/201408/20140814-hosts2-168x300.jpg" alt="hosts2" width="168" height="300" /></a>

</li>
</ol>
这样就完成了手机hosts的修改过程，此时你打开google服务就可以畅通无阻了，而且你也可以顺便访问一下dropbox，facebook twitter等网站了。当然你也可以把手机里面的hosts给copy出来，对应修改电脑的hosts这样电脑也可以访问这些网站了。这种访问方式同样存在google play的软件同样下载不下来问题，开发人员也很头疼见<a style="color: #222222;" title="修改hosts 后 Google play 无法下载app，怎么破" href="https://projecth.us/t/hosts-google-play-app/1170">这个</a>博客。但是这种方式访问速度很快，而且可以自动更新hosts。附更新之后的<a title="hosts" href="/assets/img/201408/host%E2%81%ACs1.txt">hosts</a>。

在伟大的自由组织联盟的支持下新版的hosts已经能够下载Google Play 软件，具体hosts见附件。如果各位有问题可以发邮件给我获取最新的hosts文件。

附件：

hosts-2014-10-30:<a href="/assets/img/201408/2014-10-30-hosts.txt">2014-10-30-hosts</a>**