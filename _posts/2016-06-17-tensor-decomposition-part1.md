---
layout: post
title:  张量分解-张量介绍
date:   2016-06-17 16:36
categories: 机器学习
tags: Tensor Matrix Vector
---


## 张量介绍 ##
张量(tensor)是一个多维的数据存储形式，数据的的维度被称为张量的阶。它可以看成是向量和矩阵在多维空间中的推广,向量可以看成是一维张量,矩阵可以看成是两维的张量。下面是一个三阶张量的例子，它有三维即3个mode
<img src="/assets/img/201606/tensor.png" class="myimage" alt="三阶张量" />
值得注意的是这里说的张量是一个具有某种排列形式的数据的集合，它和物理中的张量场是不同的。

传统的方法（例如ICA,PCA、SVD和NMF）对于维数比较高的数据，一般将数据展成二维的数据形式（矩阵）进行处理，这种处理方式使得数据的结构信息丢失(比如说图像的邻域信息丢失),使得求解往往病态。而采用张量对数据进行存储，能够保留数据的结构信
息，因此近些年在图像处理以及计算机视觉等领域得到了一些广泛的应用。张量分解中常见的两种分解是CP分解(Canonical Polyadic Decomposition (CPD)和Tucker分解(Tucker Decomposition)。下面将重点介绍这两种分解，并且将他们在图像处理中的一些应用进行阐
述。


## 张量定义及运算 ##

### 张量(Tensor) ###

一个$N$阶$I_{1}\times I_{2}\times ... \times I_{N}$ 维的张量可以表示为$Y\in R^{I_{1}\times I_{2}\times ... \times I_{N}}$ 张量中的每一个元素可以由$y_{i_1i_2...i_n}$表示,其中($i_n \in {1,2,...,I_n}$)。

### 纤维(Fiber) ###

纤维是指从张量中抽取向量的操作。在矩阵中固定其中一个维度，可以得到行或者列。类似于矩阵操作，固定其它维度，只保留一个维度变化，可以得到有纤维的概念。比如说我们对上图中的三阶张量分别按照I,J,K 三个mode进行Fiber操作可以得到如图<a href="#fiber"></a>
所示的$x_{:jk}$,$x_{i:k}$,$x_{ij:}$三个维度的纤维。
<img src="/assets/img/201606/fiber.png" class="myimage" alt="三阶张量的Fiber" />

### 切片(Slice) ###

切片操作是指在张量中抽取矩阵的操作。在张量中如果保留两个维度变化，其它的维度变化可以得到一个矩阵，这个矩阵即为张量的切片。对图中的张量分别按照I,J,K三个方向进行操作可以得到如下图所示的$x_{i::}$,$x_{:j:}$,$x_{::k}$ 三个维度的切片。
<img src="/assets/img/201606/sclice.png" class="myimage" alt="三阶张量的Slice" />

### 内积(Inner product) ###


两个大小相同的张量$X,Y\in  R^{I_{1}\times I_{2}\times ... \times I_{N}}$定义为张量中相对应的元素的乘积之和形式，即:
\\[\langle X,Y \rangle =\sum \limits\_{i\_1=1}^{I\_1}\sum \limits\_{i\_2=1}^{I\_2}...\sum \limits\_{i\_N=1}^{I\_N}x\_{i\_1i\_2...i\_N}y\_{i\_1i\_2...i\_N}\\]

相应张量$X\in  R^{I_{1}\times I_{2}\times ... \times I_{N}}$的范数定义为:
\\[\\|X\\| =\sqrt{\sum \limits\_{i\_1=1}^{I_1}\sum \limits\_{i\_2=1}^{I\_2}...\sum \limits\_{i\_N=1}^{I\_N}x\_{i\_1i\_2...i_N}^{2}}\\]
，即所有元素的平方和的平方根。

### 矩阵展开(Unfolding-Matricization) ###


张量的矩阵展开是将一个张量的元素重新排列(即对张量的mode-n的纤维进行重新排列)，得到一个矩阵的过程，张量$X\in  R^{I_{1}\times I_{2}\times ... \times I_{N}}$在第$n$维度上展开矩阵表示为$X_{(n)}\in R^{I_n\times(I_{1}\times I_{2}\times ... I_{n-1}I_{n+1}...\times I_{N})}$。对一个三阶张量按照I,J,K三个方向进行矩阵展开得到的矩阵如下图
<img src="/assets/img/201606/unfolding.png" class="myimage" alt="三阶张量的矩阵展开" />

### 外积(Outer Product) ###

定义张量$X\in  R^{I\_{1}\times I\_{2}\times ... \times I_{N}}$和张量$Y\in  R^{J\_{1}\times J\_{2}\times ... \times J_{M}}$的外积为:
\\[Z=X\circ Y \in R^{I\_{1}\times I\_{2}\times ... \times I_{N}\times J\_{1}\times J\_{2}\times ... \times J\_{M}}\\]其中:
\\[z_{i\_1,i\_2,...,i_N,j_1,j_2,...,j_M}=x_{i\_1,i\_2,...,i_N}*y_{j\_1,j\_2,...,j\_M}\\] 即张量$Z$ 是张量$X$和张量$Y$ 中的每一个元素的乘积构成的。特别地如果$X$ 和$Y$ 分别是一个向量那么他们的外积是一个秩为1的矩阵，如果$X$ 和$Y$和$Z$ 分别是一个向量，那么他们的外积是一个秩为1三阶张量。


### Kronecker乘积(Kronecker Product) ###

Kronecker乘积定义在两个矩阵${\mathbf{A}} \in {\mathbb{R}^{I{\mathbf{ \times }}J}},{\mathbf{B}} \in {\mathbb{R}^{K{\mathbf{ \times }}L}}$上的运算:

<img src="/assets/img/201606/kron.png" class="myimage" alt="Kronecker乘积" />


### Hadamard乘积(Hadamard Product) ###

Hadamard 乘积定义在两个相同大小的矩阵${\mathbf{A}} \in {\mathbb{R}^{I{\mathbf{ \times \}\}J\}\},{\mathbf{B\}\} \in {\mathbb{R}^{I{\mathbf{ \times \}\}J\}\}$上的运算:

<img src="/assets/img/201606/hadamard.png" class="myimage" alt="Hadamard乘积" />

### Khatri-Rao乘积(Khatri-Rao Product) ###


Khatri-Rao乘积定义了两个相同列数的矩阵${\mathbf{A}} \in {\mathbb{R}^{I{\mathbf{ \times }}K}},{\mathbf{B}} \in {\mathbb{R}^{J{\mathbf{ \times }}K}}$上的操作,它的过程如下图所示。
\\[{\mathbf{A}} \odot {\mathbf{B}} = \left[ {\begin{array}{*{20}{l}}\{\{\{\mathbf\{a\}\}\_1} \otimes \{\{\mathbf{b\}\}\_1}}&\{\{\{\mathbf{a\}\}\_2} \otimes \{\{\mathbf{b\}\}_2}}& \cdots &\{\{\{\mathbf{a}}\_K} \otimes \{\{\mathbf{b\}\}\_K}}\end{array}} \right]\in {\mathbb{R}^{IJ{\mathbf{ \times }}K\}\}\\]

<img src="/assets/img/201606/kr.png" class="myimage" alt="三阶张量的Slice" />



### 张量与矩阵的模积(Mode-n Product) ###


张量与矩阵的模积定义了一个张量$X\in {\mathbb{R}^\{\{I\_1}{\mathbf{ \times \}\}{I\_2}{\mathbf{ \times \}\} \cdots {\mathbf{ \times \}\}{I\_N}}}$和一个矩阵${\mathbf{U}} \in {\mathbb{R}^{J{\mathbf{ \times }}{I\_n}}}$ 的n-mode乘积 $\left( {X{ \times\_n}{\mathbf{U\}\}\} \right) \in {\mathbb{R}^\{\{I\_1}{\mathbf{ \times \}\} \cdots {\mathbf{ \times \}\}{I\_{n - 1\}\}{\mathbf{ \times \}\}J{\mathbf{ \times \}\}{I\_{n + 1}}{\mathbf{ \times \}\} \cdots {\mathbf{ \times \}\}{I\_N\}\}\}$，其元素定义为
\\[{\left( {X{ \times\_n}{\mathbf{U\}\}\} \right)\_{\{i\_1} \cdots {i\_{n - 1}}j{i\_{n + 1}} \cdots {i\_N}\}\} = \sum\limits\_\{\{i_n} = 1}^\{\{I\_n\}\} \{\{x\_\{\{i\_1}{i\_2} \cdots {i\_N}}}{u\_{j{i\_n\}\}\}\} \\]

这个定义可以写成沿mode-n展开的形式为：
\\[Y =X{ \times\_n}{\mathbf{U}} \Leftrightarrow \{\{\mathbf{Y\}\}\_{(n)\}\} = {\mathbf{U\}\}\{\{\mathbf{X\}\}\_{(n)\}\}\\]

如果$J<I\_{n}$那么张量和矩阵的乘积可以看作是一个降维的过程，它把一个高维度的张量映射到一个低维度的张量空间。图
\ref{fig:tensorMatrixProduct}演示了一个张量$G\in R^{7\times5\times 8}$ 和一个矩阵$A\in R^{4\times 7}$的乘积最终得到张量$Y\in R^{4\times 5 \times 8}$,张量的第一个维度由7变成了4。

<img src="/assets/img/201606/mode1-product.png" class="myimage" alt="三阶张量的Slice" />

### 张量与向量的模积(Mode-n Product) ###



张量与向量的模积定义了一个张量$X \in {\mathbb{R}^\{\{I\_1}{\mathbf{ \times \}\}\{I\_2}{\mathbf{ \times \}\} \cdots {\mathbf{ \times \}\}{I\_N}}}$与向量${\mathbf{v\}\} \in {\mathbb{R}^\{\{I\_n\}\}\}$的运算为:

\\[{\left( {X\{\{\bar  \times }\_n}{\mathbf{v\}\}\} \right)\_\{\{i\_1} \cdots {i\_{n - 1\}\}{i\_{n + 1}} \cdots {i_N\}\}\} = \sum\limits\_{\{i\_n\} = 1\}^\{\{I_n\}\} \{\{x_{\{i\_1}{i_2} \cdots {i\_N}\}\}{v\_\{\{i\_n\}\}\}\} 
\\]

一个向量和一个张量进行模乘可以减少张量的阶数，下图演示了一个张量的阶数由3阶变为0阶的过程。
<img src="/assets/img/201606/tensorVectorProduct.png" class="myimage" alt="三阶张量的Slice" />

