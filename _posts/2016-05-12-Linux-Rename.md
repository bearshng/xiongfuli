---
layout: post
title:  Linux批量修改文件名
date:   2016-05-12 16:36
categories: Linux
tags: Linux Rename
---


最近半个月在疯狂地做一些实验，然后需要批量地对一些文件的名字进行修改，而手工操作极其繁琐，在[之前的博](http://www.xiongfuli.com/linux/2015-11/cygwin.html)文中我说到我用了Cygwin软件，今天就告诉大家如何在Cygwin下批量修改文件名。


## mv命令 ##


我们知道在Linux下面 `mv` 命令有两个功能一个是用于修改文件的名字，另外一个就是移动文件。它有下面几个命令参数：

> -b ：若需覆盖文件，则覆盖前先行备份。
> 
> -f ：force 强制的意思，如果目标文件已经存在，不会询问而直接覆盖；
> 
> -i ：若目标文件 (destination) 已经存在时，就会询问是否覆盖！
> 
> -u ：若目标文件已经存在，且 source 比较新，才会更新(update)
> 
> -t  ： --target-directory=DIRECTORY move all SOURCE arguments into DIRECTORY，即指定mv的目标目录，该选项适用于移动多个源文件到一个目录的情况，此时目标目录在前，源文件在后。


下面举几个例子用于`mv` 命令


### 修改文件名 ###

1.显示当前文件

```shell
	ls -l
	total 2
	drwxr-xr-x+ 1 Administrator None   0 Nov 10  2015 snipmate.vim
	-rwxr-xr-x  1 Administrator None 567 Nov  9  2015 svn.exe.stackdump
	-rw-r--r--  1 Administrator None   5 May 12 17:16 test.txt
```

2.修改文件名


```shell
	mv test.txt test2.txt
```

3.显示当前文件

```shell
	$ ls -l
	total 2
	drwxr-xr-x+ 1 Administrator None   0 Nov 10  2015 snipmate.vim
	-rwxr-xr-x  1 Administrator None 567 Nov  9  2015 svn.exe.stackdump
	-rw-r--r--  1 Administrator None   5 May 12 17:16 test2.txt
```

我们发现文件名已经由`test.txt`变成`test2.txt`了。

### 移动文件 ###

1.显示当前文件

```shell
	ls -l
	total 2
	drwxr-xr-x+ 1 Administrator None   0 Nov 10  2015 snipmate.vim
	-rwxr-xr-x  1 Administrator None 567 Nov  9  2015 svn.exe.stackdump
	-rw-r--r--  1 Administrator None   5 May 12 17:16 test.txt
```

2.移动文件


```shell
	 mv test2.txt  /home
```

3.显示当前文件

```shell
	$ ls -l
	total 1
	drwxr-xr-x+ 1 Administrator None   0 Nov 10  2015 snipmate.vim
	-rwxr-xr-x  1 Administrator None 567 Nov  9  2015 svn.exe.stackdump
```

4.显示`/home` 目录下的文件

```shell
	$ ls -l /home
	total 241
	drwxr-xr-x+ 1 Administrator  None      0 May 12 18:11 Administrator
	drwxr-xr-x+ 1 bearshng       None      0 Dec 27 16:47 bearshng
	drwxr-xr-x+ 1 Administrator  None      0 Nov  9  2015 nerdtree
	-rw-r--r--  1 Administrator  None      5 May 12 17:16 test2.txt
	drwxr-xr-x+ 1 Administrators None      0 Nov 10  2015 vim_plug
	-rwxr-xr-x  1 Administrators None 234132 Nov  9  2015 vim_plug.zip
```
我们发现`/home`路径下有`test2.txt`了。

但是`mv`有一点就是不能批量修改文件，或者说是批量修改文件很麻烦，如果想批量修改文件的话我们可以使用`rename`命令

## rename命令 ##


[rename命令](http://tips.webdesign10.com/how-to-bulk-rename-files-in-linux-in-the-terminal) 提供了批量修改文件的功能，尤其是对正则表达式的支持，比如说我可以把当前文件夹下面的所有`.avi`数据中的`走向共和`修改为`建党伟业` 如果我们采用`mv` 命令我们可能需要很多操作甚至用`shell` 脚本，但是用`rename`命令我们一句话就可以完成。

```shell

	$ ls -l |grep '走向共和'
	-r-xr-x---+ 1 Administrators None            466607012 Apr 20 11:21 走向共和36.avi
	-r-xr-x---+ 1 Administrators None            421534578 Apr 20 11:21 走向共和37.avi
	-r-xr-x---+ 1 Administrators None            422871626 Apr 20 11:21 走向共和38.avi
	-r-xr-x---+ 1 Administrators None            428641100 Apr 20 11:21 走向共和39.avi
	-r-xr-x---+ 1 Administrators None            430550324 Apr 20 11:21 走向共和40.avi
	-r-xr-x---+ 1 Administrators None            424906206 Apr 20 11:21 走向共和41.avi
	-r-xr-x---+ 1 Administrators None            425702218 Apr 20 11:21 走向共和42.avi
	-r-xr-x---+ 1 Administrators None            419122882 Apr 20 11:20 走向共和43.avi
	-r-xr-x---+ 1 Administrators None            422362872 Apr 20 11:21 走向共和44.avi
	-r-xr-x---+ 1 Administrators None            419778994 Apr 20 11:21 走向共和45.avi
	-r-xr-x---+ 1 Administrators None            456214890 Apr 20 11:21 走向共和50.avi
	$ rename 走向共和 建党伟业 *.avi
	$ ls -l |grep '.avi'
	d---rwx---+ 1 Unknown+User   Unknown+Group           0 Nov 14  2014 $RECYCLE.aviBIN
	-rwxrwx---+ 1 Administrators None             11566013 Dec 11  2014 CF-Auto-Root-mako-occam-nexus4.avizi                               p
	-rwxrwx---+ 1 Administrators None            377477237 Jul  7  2014 adt-bundle-windows-x86_64-20140624.a                               vizip
	-r-xr-x---+ 1 Administrators None            466607012 Apr 20 11:21 建党伟业36.avi
	-r-xr-x---+ 1 Administrators None            421534578 Apr 20 11:21 建党伟业37.avi
	-r-xr-x---+ 1 Administrators None            422871626 Apr 20 11:21 建党伟业38.avi
	-r-xr-x---+ 1 Administrators None            428641100 Apr 20 11:21 建党伟业39.avi
	-r-xr-x---+ 1 Administrators None            430550324 Apr 20 11:21 建党伟业40.avi
	-r-xr-x---+ 1 Administrators None            424906206 Apr 20 11:21 建党伟业41.avi
	-r-xr-x---+ 1 Administrators None            425702218 Apr 20 11:21 建党伟业42.avi
	-r-xr-x---+ 1 Administrators None            419122882 Apr 20 11:20 建党伟业43.avi
	-r-xr-x---+ 1 Administrators None            422362872 Apr 20 11:21 建党伟业44.avi
	-r-xr-x---+ 1 Administrators None            419778994 Apr 20 11:21 建党伟业45.avi
	-r-xr-x---+ 1 Administrators None            456214890 Apr 20 11:21 建党伟业50.avi

```

`rename`命令有以下几个参数

> 
> Usage:
>  rename [options] <expression<replacement<file>...
> 
> Options:
>  -v, --verbose    explain what is being done
>  
>  -s, --symlink    act on the target of symlinks
> 
>  -h, --help     display this help and exit
>  
>  -V, --version  output version information and exit


即`rename 修改之前的内容 修改之后的内容 要操作的文件名` 其它的几个参数命令我现在还没有用到，先不解释。下面我们把`建党伟业`修改为`走向共和`

```shell

	$ rename 建党伟业  走向共和 *.avi
	$ ls -l |grep '.avi'
	d---rwx---+ 1 Unknown+User   Unknown+Group           0 Nov 14  2014 $RECYCLE.aviBIN
	-rwxrwx---+ 1 Administrators None             11566013 Dec 11  2014 CF-Auto-Root-mako-occam-nexus4.avizip
	-rwxrwx---+ 1 Administrators None            377477237 Jul  7  2014 adt-bundle-windows-x86_64-20140624.avizip
	-r-xr-x---+ 1 Administrators None            466607012 Apr 20 11:21 走向共和36.avi
	-r-xr-x---+ 1 Administrators None            421534578 Apr 20 11:21 走向共和37.avi
	-r-xr-x---+ 1 Administrators None            422871626 Apr 20 11:21 走向共和38.avi
	-r-xr-x---+ 1 Administrators None            428641100 Apr 20 11:21 走向共和39.avi
	-r-xr-x---+ 1 Administrators None            430550324 Apr 20 11:21 走向共和40.avi
	-r-xr-x---+ 1 Administrators None            424906206 Apr 20 11:21 走向共和41.avi
	-r-xr-x---+ 1 Administrators None            425702218 Apr 20 11:21 走向共和42.avi
	-r-xr-x---+ 1 Administrators None            419122882 Apr 20 11:20 走向共和43.avi
	-r-xr-x---+ 1 Administrators None            422362872 Apr 20 11:21 走向共和44.avi
	-r-xr-x---+ 1 Administrators None            419778994 Apr 20 11:21 走向共和45.avi
	-r-xr-x---+ 1 Administrators None            456214890 Apr 20 11:21 走向共和50.avi

```

这样以后批量修改文件名就简单多了，尤其是像我这种对`shell` 不太熟悉的人。
