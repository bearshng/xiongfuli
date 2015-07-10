---
layout: post
title:  一步一步教你在本地搭建Jekyll环境
date:   2015-07-10 11:19
categories: web
tags: Jekyll
---

我们知道Github上面博客使用Jekyll是生成的，我们在写博客的时候博客采用markdown语言进行编辑，然后commit到github上面，然而每一次修改都需要一次commit因此会导致一篇博文会有大量的commit记录，导致文章不是那么的雅观。本文将一步步教你如何在本地搭建Jekyll环境以避免在Github上面多次commit。

## 要使用到的软件及下载链接 ##
1. Ruby：下载链接:[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)
2. RubyDevKit:下载链接:[http://rubyinstaller.org/downloads/](http://rubyinstaller.org/downloads/)
3. Rubygems:下载链接：[http://rubyforge.org/frs/?group_id=126](http://rubyforge.org/frs/?group_id=126)


## 安装上述软件 ##

- Ruby的安装

Jekyll本身基于Ruby开发，因此，想要在本地构建一个测试环境需要具有Ruby的开发和运行环境。windows的安装还是一如既往的“无脑”，不多说了。

- RubyDevKit安装

下载RubyDevKit解压完成之后，用cmd进入到刚才解压的目录下，运行`$ruby dk.rb init`检测系统安装的ruby的位置。具体截图如下：
![](/assets/img/20150710/rubyInit.png)
然后执行`dk.rb install`命令进行安装,具体截图如图所示。
![](/assets/img/20150710/dkInstall.png)

- Rubygems安装

RubygemsRubygems是类似Radhat的RPM、centOS的Yum、Ubuntu的apt-get的应用程序打包部署解决方案。Rubygems本身基于Ruby开发，在Ruby命令行中执行。我们需要它主要是因为jekyll的执行需要依赖很多Ruby应用程序，如果一个个手动安装比较繁琐。[下载]([http://rubyforge.org/frs/?group_id=126](http://rubyforge.org/frs/?group_id=126) "下载")解压后，用cmd进入到解压后的目录，执行`ruby setup.rb`命令即可。具体截图如下：![](/assets/img/20150710/rubyGemInstall.png)

##安装Jekyll##

执行gem命令`$gem install jekyll`安装jekyll.然而由于某些原因，你会发现如下Error。

    ERROR: While executing gem ... (Gem::RemoteFetcher::FetchError)

这样的一种解决方案是翻墙，另一种解决方案是将Gemfile中的source改到国内的`source 'https://ruby.taobao.org/'`。即可。具体操作如下：

1.列出目前的所有source

    $ gem sources -l

结果：

    *** CURRENT SOURCES ***
    https://rubygems.org/


2.移除`https://rubygems.org的source`


    $ gem sources --remove https://rubygems.org/

结果：


    https://rubygems.org/ removed from sources

3.添加`https://ruby.taobao.org/的source`

    $ gem sources -a https://ruby.taobao.org/
    
结果：

    https://ruby.taobao.org/ added to sources

4.查看修改source是否成功

    $ gem sources -l

结果：

    *** CURRENT SOURCES ***
    https://ruby.taobao.org/

这样再次执行gem命令`$gem install jekyll`即可安装jekyll

##测试Jekyll服务##

安装好之后就可以测试我们的环境了。用cmd进入到我们创建的github目录，执行下面命令：


    $jekyll serve --safe --watch

这样就完成了整个本地环境的配置过程。



