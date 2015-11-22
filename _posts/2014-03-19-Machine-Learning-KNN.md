---
layout: post
title: 《机器学习实战》--KNN算法
date:   2014-03-19 12:53
categories: 机器学习
tags: [KNN]
---

<h1>一、KNN算法的概念</h1>
KNN算法的定义很简单，就是找到一个和自己最相近的K个数据进行相比较提取K个数据中的相似数据最多的特征进行分类，作为新数据的分类。比如说现在有以下几个数据
<table width="1014" border="0" cellspacing="0" cellpadding="0"><colgroup> <col width="224" /> <col width="244" /> <col width="186" /> <col width="360" /> </colgroup>
<tbody>
<tr>
<td width="224" height="18">电影名称</td>
<td width="244">打斗镜头</td>
<td width="186">接吻镜头</td>
<td width="360">电影类型</td>
</tr>
<tr>
<td height="18">California Man</td>
<td align="right">3</td>
<td align="right">104</td>
<td>爱情片</td>
</tr>
<tr>
<td height="18">He's Not Really into Dudes</td>
<td align="right">2</td>
<td align="right">100</td>
<td>爱情片</td>
</tr>
<tr>
<td height="18">Beautiful Woman</td>
<td align="right">1</td>
<td align="right">81</td>
<td>爱情片</td>
</tr>
<tr>
<td height="18">Kevin Longblade</td>
<td align="right">101</td>
<td align="right">10</td>
<td>动作片</td>
</tr>
<tr>
<td height="18">Robo Slayer 3000</td>
<td align="right">99</td>
<td align="right">5</td>
<td>动作片</td>
</tr>
<tr>
<td height="18">Amped II</td>
<td align="right">98</td>
<td align="right">2</td>
<td>动作片</td>
</tr>
<tr>
<td height="18"></td>
<td align="right">18</td>
<td align="right">90</td>
<td>????</td>
</tr>
</tbody>
</table>
首先我们计算未知电影与样本集中的距离得到如下表格
<table width="468" border="0" cellspacing="0" cellpadding="0"><colgroup> <col width="224" /> <col width="244" /> </colgroup>
<tbody>
<tr>
<td width="224" height="18">电影名称</td>
<td width="244">与未知电影的距离</td>
</tr>
<tr>
<td height="18">California Man</td>
<td align="right">20.5</td>
</tr>
<tr>
<td height="18">He's Not Really into Dudes</td>
<td align="right">18.7</td>
</tr>
<tr>
<td height="18">Beautiful Woman</td>
<td align="right">19.2</td>
</tr>
<tr>
<td height="18">Kevin Longblade</td>
<td align="right">115.3</td>
</tr>
<tr>
<td height="18">Robo Slayer 3000</td>
<td align="right">117.4</td>
</tr>
<tr>
<td height="18">Amped II</td>
<td align="right">118.9</td>
</tr>
</tbody>
</table>
从表格中我们可以看出其余He's Not Really into Dudes、Beautiful Woman、California Man三个电影的距离最短，故而我们可以判断其为爱情片。其实KNN和我们生活也很近，所谓近朱者赤，近墨者黑，与谁距离近就具备与其相似的特征。
<h1>二、实现过程</h1>
<ol>
	<li><span style="line-height: 14px;">计算已知类别数据集中的点和当前点之间的距离</span></li>
	<li>按照距离递增次序进行排序</li>
	<li>选取与当前距离最小的k个点</li>
	<li>确定前k个点所在类别的出现频率</li>
	<li>返回k个点出现频率最该的类别作为当前点的预测分类。</li>
</ol>
距离：对于距离的定义有很多，比如说余弦距离，欧式距离等等，这里我们选用欧式距离。
<h1>三、具体代码</h1>
<h2>1.k-近邻算法</h2>
<pre class="brush: python; gutter: true">def classify0(inX, dataSet, labels, k):

    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    sqDistances = sqDiffMat.sum(axis=1)
    distances = sqDistances ** 0.5
    sortedDistIndicies = distances.argsort()     
    classCount = {}          
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel, 0) + 1
        sortedClassCount = sorted(iteritems(classCount), key=operator.itemgetter(1), reverse=True)
    return sortedClassCount[0][0]

</pre>
前七行代码是用来据算距离的，起哄inX是用于分类的输入向量，dataSet是输入的样本训练集，labels为标签向量，k为选择最近的邻居数目。for循环是用来计算距离最小的k个点，倒数第二句是用来进行排序，最后返回频率最高的元素标签。
<h2>2.将文本转换为NumPy的解析程序</h2>
<pre class="brush: python; gutter: true">
	
	def file2matrix(filename):
    fr = open(filename);
    arrayOlines = fr.readlines();
    numberOfLines = len(arrayOlines);
    returnMat = zeros((numberOfLines, 3));
    classLabelVector = [];
    index = 0;
    for line in arrayOlines:
        line = line.strip()
        listFromLine = line.split(&#039;\t&#039;);
        returnMat[index, :] = listFromLine[0:3];
        classLabelVector.append(int(listFromLine[-1]));
        index += 1;
    return returnMat, classLabelVector;

</pre>
前五句是读取文件，得到文件的行数，然后创建返回NumPy的矩阵接着就是对读取文件的每一行去掉换行符和制表符然后进行分割成一个列表，最后返回
<h2>3.归一化特征值</h2>
<pre class="brush: python; gutter: true">

	def autoNorm(dataSet):
    minVals = dataSet.min(0);
    maxVals = dataSet.max(0);
    ranges = maxVals - minVals;
    normalDataSet = zeros(shape(dataSet));
    m = dataSet.shape[0];
    normalDataSet = dataSet - tile(minVals, (m, 1));
    normalDataSet = normalDataSet / tile(ranges, (m, 1));
    return normalDataSet, ranges, minVals;

</pre>
采用newValue=(oldValue-min)/(max-min)进行数据的归一防止出现过大与过小的数据现象
<h2>4.测试算法</h2>
<pre class="brush: python; gutter: true">

	def datingClassTest():
    hoRatio = 0.10  # hold out 10%
    fig = plt.figure();
    ax = fig.add_subplot(111);

    datingDataMat, datingLabels = file2matrix(&#039;E:\Workspaces\eclipse\machinelearninginaction\Ch02\datingTestSet2.txt&#039;);  # load data setfrom file
	ax.scatter(datingDataMat[:, 0], datingDataMat[:, 1], 15.0 * array(datingLabels), 15.0 * array(datingLabels));
	plt.show();

    normMat, ranges, minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m * hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i, :], normMat[numTestVecs:m, :], datingLabels[numTestVecs:m], 3)
        print (&quot;the classifier came back with: %d, the real answer is: %d&quot; % (classifierResult, datingLabels[i]))
        if (classifierResult != datingLabels[i]): errorCount += 1.0
    print (&quot;the total error rate is: %f&quot; % (errorCount / float(numTestVecs)))
    print (errorCount)
	if __name__ == &#039;__main__&#039;:
    datingClassTest();

</pre>
for循环之前的都是做数据的准备和归一在for循环中进行分类计算错误的比率。

为了更好地看到数据的散点图可以用MatPlotLib创建一个散点图

代码如下：
<pre class="brush: python; gutter: true">&#039;&#039;&#039;

	Created on 2014-3-18
	@author: bearshng
	&#039;&#039;&#039;
	from numpy import  *;
	from charpter2 import kNN;
	import matplotlib;
	import matplotlib.pyplot as plt;
	from ctypes import ARRAY
	fig = plt.figure();
	ax = fig.add_subplot(111);
	
	datingDataMat, datingLabels = kNN.file2matrix(&#039;E:\Workspaces\eclipse\machinelearninginaction\Ch02\datingTestSet2.txt&#039;);
	ax.scatter(datingDataMat[:, 0], datingDataMat[:, 1], 15.0 * array(datingLabels), 15.0 * array(datingLabels));
	plt.show();

</pre>
结果图如下：

<a href="/assets/img/201403/figure_1.png"><img class="alignnone size-full wp-image-775" alt="figure_1" src="/assets/img/201403figure_1.png" width="815" height="615" /></a>

&nbsp;
<h1>四、KNN的优缺点</h1>
优点：简单，真的很简单就是计算距离然后找出K个最近的距离

缺点：1.在计算的过程中需要计算距离和开放，计算量大。

2.如果数据量大，数据所需要的储存量也大。