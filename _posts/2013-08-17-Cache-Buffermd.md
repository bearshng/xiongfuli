---
layout: post
title:  cache 和 buffer的区别
date:   2013-08-17 12:53
categories: Web
tags: [Cache,Buffer]
---

其实对于二者之间的区别的话，从中文翻译表面意思来看，cache，缓存，他是一种硬件设备一种存储器，而buffer 缓冲，他是内存或者是外存甚至一个FIFO的管道都可以当作buffer，而从网上找到我认为比较好的解释如下：

<strong>Cache：高速缓存，是位于CPU与主内存间的一种容量较小但速度很高的存储器。</strong>由于CPU的速度远高于主内存，CPU直接从内存中存取数据要等待一定时间周期，Cache中保存着CPU刚用过或循环使用的一部分数据，当CPU再次使用该部分数据时可从Cache中直接调用,这样就减少了CPU的等待时间,提高了系统的效率。Cache又分为一级Cache(L1 Cache)和二级Cache(L2 Cache)，L1 Cache集成在CPU内部，L2 Cache早期一般是焊在主板上,现在也都集成在CPU内部，常见的容量有256KB或512KB L2 Cache。

<strong>Buffer：缓冲区，一个用于存储速度不同步的设备或优先级不同的设备之间传输数据的区域。</strong>通过缓冲区，可以使进程之间的相互等待变少，从而使从速度慢的设备读入数据时，速度快的设备的操作进程不发生间断。

Free中的buffer和cache：（它们都是占用内存）：

buffer : 作为buffer cache的内存，是块设备的读写缓冲区

cache: 作为page cache的内存, 文件系统的cache

如果 cache 的值很大，说明cache住的文件数很多。如果频繁访问到的文件都能被cache住，那么磁盘的读IO 必会非常小。