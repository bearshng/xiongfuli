---
layout: post
title:  Matlab K-means 异常解决方案
date:   2016-04-01 16:36
categories: ML
tags: K-means
---

最近在做一些简单的工程项目，用到了高斯混合模型(GMM)，我们知道高斯混合模型的初始化方式随机初始化和基于K-means初始化的两种方式。一般来说基于K-means的初始化的效果会好一些。但是我在用matlab的K-means的函数的时候遇到了下面的Error：

```matlab
	Error using kmeans/loopBody/batchUpdate (line 452)
	Empty cluster created at iteration 1.
	
	Error in kmeans/loopBody (line 377)
	            converged = batchUpdate();
	
	Error in internal.stats.parallel.smartForReduce (line 128)
	            reduce = loopbody(iter, S);
	
	Error in kmeans (line 295)
	ClusterBest = internal.stats.parallel.smartForReduce(...
	
	Error in EM_init_kmeans (line 27)
	[Data_id, Centers] = kmeans(Data', nbStates);

```

这个Error表示我的K-menas有两个聚类中心跑到同一个点了，导致在计算其中一个簇的中心和簇的中心到其它点的距离的时候出错。我用`doc kmeans` 命令得到下面的解决方案：



<img src="/assets/img/201604/kmeans.png"    class ="myimage"   alt="Nexus基本配置"  />

也就是说我们可以对Kmeans算法的进行参数设置，其中`emptyaction` 参数可以设置为三种方式：

1. `error` matlab 默认处理方式直接抛错即可。
2. `drop` 丢弃一个聚类中心即将K-means的K设置为K-1
3. `singleton` 重新选择一个点作为其中一个簇的聚类中心

在实验中我采用了第三种方式即:`[Data_id, Centers] = kmeans(Data', nbStates,'emptyaction','singleton'); ` 成功解决了这个问题。