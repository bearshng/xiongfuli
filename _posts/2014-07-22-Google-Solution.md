---
layout: post
title: google被封之后google在线字体解决方案
date:   2014-07-22 12:53
categories: Google
tags: [Google-Fonts]
---

我们知道google被封之后，给站长带来了麻烦就是google在线字体无法访问了，从而导致访问速度极慢。刚开始没有注意到因为我的电脑配置google访问的hosts了，可是在别人的电脑上访问速度就极其慢了。下面就对google在线字体极其解决方案进行介绍.
<h1><strong>google在线字体</strong></h1>
<span style="color: #494949;">字体使用是网页设计中不可或缺的一部分。经常地，我们希望在网页中使用某一特定的字体，</span><span style="color: #494949;"> </span><span style="color: #494949;">但是该字体并非主流操作系统的内置字体，我们常用的方法就是把特殊字体处理成图片，这样做有很多缺陷，</span><span style="color: #494949;"> </span><span style="color: #494949;">但是谷歌提供了Google在线字体库，这样在网站设计的时候只要调用Google在线字体库就可以让网页在客户端很好的显示，而不用只用枯版的字体了，实现字体多样化。</span>
<h2><strong>利用google在线的字体库优势</strong></h2>
<div style="color: #494949;">
<ol>
	<li><span style="color: #494949;">可继续使用html文本，比起自己自做字体库上传到自己的服务器可以减轻服务器负担</span></li>
	<li><span style="color: #494949;">兼用性好，不需担心像各个浏览器对 CSS 解析不同导致这样那样的 bug、HACK。</span></li>
	<li><span style="color: #494949;">无需引用js</span></li>
</ol>
</div>
<div style="color: #494949;">
<h2><strong>利用google在线的字体库弊端</strong></h2>
</div>
<div style="color: #494949;">
<ol>
	<li><span style="color: #494949;">只能引进英文的字体库，中文不支持</span></li>
	<li><span style="color: #494949;">随时有被墙外的可能性</span></li>
</ol>
</div>
<h1><strong>google被封之后的解决方案</strong></h1>
这不刚好第二条弊端显灵了，现在google在线字体无法访问了，在网上也找到了一些解决方案，其中这个<a title="方案1" href="http://www.hula8.net/article/3767.html" target="_blank">方案</a>尼，真如博主所说会<span style="color: #ff0000;">出现网站打不开的情况。</span>然后就在网上找到了这个方案具体如下：

打开wordpress代码中的文件wp-includes/script-loader.php文件，搜索：fonts.googleapis.com 找到这行代码：
<pre class="brush: php; gutter: true">$open_sans_font_url = &quot;//fonts.googleapis.com/css?family1=Open+Sans:300italic,400italic,600italic,300,400,600&amp;subset=$subsets&quot;;</pre>
把其中的
<pre class="brush: php; gutter: true">fonts.googleapis.com</pre>
替换成
<pre class="brush: php; gutter: true">fonts.useso.com</pre>
即可

其中fonts.use是360网站卫士常用前端公共库CDN服务，提供了由360网站卫士CDN驱动的常用前端公共库以及和谐使用Google公共库&amp;字体库的调用方法。主要包括常用前端公共库，google公共库和google字体库。
