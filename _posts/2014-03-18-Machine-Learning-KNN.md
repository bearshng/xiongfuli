---
layout: post
title: 《机器学习实战》中的kNN算法中file2matrix运行出错的解决方案
date:   2014-03-18 12:53
categories: 机器学习
tags: [KNN,Python]
---

毕业设计进行到第二部分，学习机器学习。今天在看《机器学习实战》的KNN的时候，按照代码运行file2matrix的时候发现除了一下异常
<pre class="brush: text; gutter: true">ValueError: invalid literal for int() with base 10: &#039;largeDoses&#039;</pre>
很显然这里出现类型转换错误，然后我检查我的file2matrix的时候发现有这么一句。
<pre class="brush: python; gutter: true"> classLabelVector.append(int(listFromLine[-1]));</pre>
也就是说我尽力的把一个字符串转换成一个数字，显然这个是不正确的。我不知道为什么在《机器学习实战》中这么描述

<em>我们必须明确地通知解释器，告诉它列表中存储的元素为整型，否则Python语言会将这些元素当作字符串来处理。以前我们必须自己处理这些变量值类型问题，现在这些细节问题完全可以交给NumPy函数处理</em>

我也以为NumPy会自动地把其转换成为数字，但是结果不是这样的，最后我在http://www.manning-sandbox.com/thread.jspa?threadID=49258 找到了答案，别使用datingTestSet.txt使用datingTestSet2.txt就可以了。

再次运行
<pre class="brush: python; gutter: true">&#039;&#039;&#039;
Created on 2014-3-18

@author: bearshng
&#039;&#039;&#039;
from charpter2 import kNN;
datingDataMat, datingLabels = kNN.file2matrix(&#039;E:\Workspaces\eclipse\machinelearninginaction\Ch02\datingTestSet2.txt&#039;);
print(datingLabels[0:20]);</pre>
结果如下：


    [3, 2, 1, 1, 1, 1, 3, 3, 1, 3, 1, 1, 2, 1, 1, 1, 1, 1, 2, 3]