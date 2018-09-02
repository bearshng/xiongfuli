---
layout: post
title:  MatConvNet实现深度学习
date: '2018-8-10 10:23'
categories: 深度学习
tags: Matlab 深度学习 MatConvNet
---

这年头，没有深度学习经验找不到工作了。博士前三年半都是用Matlab，虽然转到Python大半年了，但是由于前3年多都是用Matlab编程，所以一直心仪着是否有Matlab适配的深度学习版本。直到我最近看到了西交孟德宇组出了一篇基于CNN的去噪文章(https://github.com/cszn/DnCNN) ，发现他们的CNN居然是用Matlab做的，于是本着求是精神看到了他们用的MatConvNet 包，打开之后发现真的是神器呀，下面这个博文就介绍一下这个工具包。

## MatConvNet是个啥

根据MatConvNet的[官网](http://www.vlfeat.org/matconvnet/)介绍，MatConvNet是一个基于适用在Matlab的卷积神经网络(CNN)的工具包，支持CPU和GPU。 事实上，这个工具包并不仅仅支持CNN，同时也支持一些其它的一些网络如RNN, LSTM等。 这个工具包包含了一些深度学习的基本操作如卷积，隔空卷积，池化，非线性激活函数等。安装起来也比较简单，直接在官网下载这个toolbox然后放在Matlab的path里面。接着在命令行中输入'vl_compilenn' 进行编译即可。 编译完成之后可以到example目录里面找一个case去测试是否安装成功。

MatConvNet里面有两个非常重要的部件，一个是`SimpleNN` 另外一个是 `DagNN`。 `SimpleNN`是一个简单的DNN的版本，主要适合一些简单的串行结构的也就是说一个卷集后面加上非线性激活最后pooling等。而`DagNN`可以实现更加复杂的网络结构，如实现两个层之间的skipping等等。 因为现在深度学习很多时候是改结构的，所以后面和 `DagNN`打交道会比较多。

MatConvNet也同时为我们提供了一些已经训练好的模型，比如说 `AlexNet`, `GoogleNet`， `VGG`等等。大家可以通过 `vlfeat`的[官网](http://www.vlfeat.org/matconvnet/pretrained/)下载模型。 另外，MatConvNet 在Github上也有自己的[开源主页](https://github.com/vlfeat/matconvnet-contrib)，同时也集成可一些优秀的第三方的代码，比如说 `autonn`, `mcnRFCN`, `mcnSSD`等。值得推荐的是`autonn`， 它对MatConvNet进行了更加高级的封装，可以让大家以更加简洁的代码来实现自己的网络，具体的文档可以参照`autonn` 的 [Tutorial](https://github.com/vlfeat/autonn/blob/master/doc/TUTORIAL.md)。

## Get Started with MatConvNet

好了，简单地知道了MatConvNet之后，我们先开始着手玩玩一下MatConvNet。 首先我们到官网下载已经训练好的[AlexNet模型](http://www.vlfeat.org/matconvnet/models/imagenet-matconvnet-alex.mat)。然后在Matlab中通过`net=dagnn.DagNN.loadobj('imagenet-matconvnet-alex.mat')` 导入这个模型。

首先我们在Matlab中输入`net.layers` 查看这个网络的每一层所包含的信息。得到输出结果如下：

```
    name
    inputs
    outputs
    params
    inputIndexes
    outputIndexes
    paramIndexes
    forwardTime
    backwardTime
    block

```

这里解释一下各个关键的几个名词的含义: `name`: 即网络的每一层起的名字，比如说第一层的卷积层(`conv1`)。 `inputs` 当前层的输入，对于第一层的话就是我们的数据集，对于后面的层来说是当前层的前一层。 `outputs` 当前层的输出，也即是下一个层的输入。 `params` 代表的是	需要确定的参数的列表，比如说对于卷积层它的参数就是卷积核的参数如果有bias 还有bias的信息。对于`relu`由于没有参数，所以参数为空。 `paramIndexes` 训练的参数的index比如说对于卷积层的话就是卷积核的参数和一些bias的参数。 

同时也可以通过输入`net.vars`查看各个层的变量信息。`net.params`查看需要确定的变量信息。可以通过`net.print()`查看整个网络的信息。比如说对于AlexNet它的输出如下：


```
   func|        conv1|relu1|  pool1|        conv2|relu2|  pool2|        conv3|relu3|        conv4|relu4|        conv5|relu5|  pool5|      fc6|relu6|      fc7|relu7|       fc8|
-------|-------------|-----|-------|-------------|-----|-------|-------------|-----|-------------|-----|-------------|-----|-------|---------|-----|---------|-----|----------|
   type|         Conv| ReLU|Pooling|         Conv| ReLU|Pooling|         Conv| ReLU|         Conv| ReLU|         Conv| ReLU|Pooling|     Conv| ReLU|     Conv| ReLU|      Conv|
 inputs|        input|   x1|     x3|           x4|   x5|     x7|           x8|   x9|          x11|  x12|          x14|  x15|    x17|      x18|  x19|      x21|  x22|       x24|
outputs|           x1|   x3|     x4|           x5|   x7|     x8|           x9|  x11|          x12|  x14|          x15|  x17|    x18|      x19|  x21|      x22|  x24|prediction|
 params|conv1f conv1b|     |       |conv2f conv2b|     |       |conv3f conv3b|     |conv4f conv4b|     |conv5f conv5b|     |       |fc6f fc6b|     |fc7f fc7b|     | fc8f fc8b|
    pad|            0|  n/a|      0|            2|  n/a|      0|            1|  n/a|            1|  n/a|            1|  n/a|      0|        0|  n/a|        0|  n/a|         0|
 stride|            4|  n/a|      2|            1|  n/a|      2|            1|  n/a|            1|  n/a|            1|  n/a|      2|        1|  n/a|        1|  n/a|         1|

   func|      prob|
-------|----------|
   type|   SoftMax|
 inputs|prediction|
outputs|      prob|
 params|          |
    pad|       n/a|
 stride|       n/a|


params|233MB|
  vars|   0B|
 total|233MB|


```

说了这么多了，我们可以输入一张图像来测试一下我们的网络。主要过程如下：

1. 读入图像。 我们就读入我们图像处理的peppers的图像，并且转换为single。`im = single(imread('peppers.png'));`
2. 然后对读入的图像进行resize：`im_ = imresize(im_,net.meta.normalization.imageSize(1:2));`
3. 接着减去训练集合的average image :`im_ = bsxfun(@minus, im_, net.meta.normalization.averageImage) ;
`
4. 接着用我们的网络对当前的输入进行评估：`net.eval({'input',im_});` 这里的`input`和我们在第一层定义的输入变量要一一对应。
5. 输出得到的概率数值`scores = net.vars(net.getVarIndex('prob')).value ;scores = squeeze(gather(scores)) ;` 同样，这里的`prob`也要和我们在最后一层定义的变量名称一致。
6. 得到得分最大的类别及其对应的标记信息。`[bestScore, best] = max(scores) ;
figure(1) ; clf ; imagesc(im) ;
title(sprintf('%s (%d), score %.3f',...
net.meta.classes.description{best}, best, bestScore)) ;` 

至此我们就完成了一个数据的测试过程。

## 用MatConvNet来训练自己定义的网络

下面我们将以Mnist数据为例，来看看用MatConvNet训练自己的网络过程。

### 准备数据集

首先我们从祖师爷的官网上下载[MNIST数据集](http://yann.lecun.com/exdb/mnist/)，主要有以下四个

```
train-images-idx3-ubyte.gz：训练集
train-labels-idx1-ubyte.gz：训练集标签
t10k-images-idx3-ubyte.gz：测试集
t10k-labels-idx1-ubyte.gz:测试集标签
```

然后通过下面的代码来构造我们的数据集：

```
f=fopen(fullfile(dataDir,'train-images-idx3-ubyte'),'r');
x1=fread(f,inf,'uint8');
fclose(f);
x1=permute(reshape(x1(17:end),28,28,60e3),[2 1 3]);
 


f=fopen(fullfile(dataDir,'t10k-images-idx3-ubyte'),'r');
x2=fread(f,inf,'uint8');
fclose(f);
x2=permute(reshape(x2(17:end),28,28,10e3),[2 1 3]);

f=fopen(fullfile(dataDir, 'train-labels-idx1-ubyte'),'r') ;                                                  % Open training labels file for reading 
y1=fread(f,inf,'uint8');                                                                                    % Read file and store
fclose(f) ;                                                                                                 % Close training labels
y1=double(y1(9:end)')+1 ;                                                                                   % Format and store

f=fopen(fullfile(dataDir, 't10k-labels-idx1-ubyte'),'r') ;                                                   % Open testing labels for reading
y2=fread(f,inf,'uint8');                                                                                    % Read file and store
fclose(f) ;                                                                                                 % Close testing labels
y2=double(y2(9:end)')+1 ; 

set = [ones(1,numel(y1)) 3*ones(1,numel(y2))];                                                              % Assign sets to the data (Training, Validation, Testing)
data = single(reshape(cat(3, x1, x2),28,28,1,[]));                                                          % Convert to single precision and reshape
dataMean = mean(data(:,:,:,set == 1), 4);                                                                   % Zero Mean
data = bsxfun(@minus, data, dataMean) ;                                                                     % Finalize Zero Mean

imdb.images.data = data ;                                                                                   % Assign IMDB images data 
imdb.images.data_mean = dataMean;                                                                           % Assign IMDB data mean 
imdb.images.labels = double(cat(2, y1, y2)) ;                                                               % Assign IMDB labels
imdb.images.set = set ;                                                                                     % Assign IMDB Set
imdb.meta.sets = {'train', 'val', 'test'} ;                                                                 % meta = miscellaneous, in this case set names 
imdb.meta.classes = arrayfun(@(x)sprintf('%d',x),0:9,'uniformoutput',false) ;    
fprintf('\n***** IMBD.mat has been created! *****\n');
save('imdb.mat', 'imdb', '-v7.3'); 
```

这里主要需要处理的有1. 计算图像的均值，并且对训练集进行归一化。 2.把数据集分成训练集，测试集和验证集三部分。3.对数据的类别标签进行统计

### 初始化网络的训练信息

有了我们自己的数据集之后，我们需要定义我们自己的网络结构信息主要是每一层的功能，输入输出和参数信息。同时我们也需要对优化的算法进行初始化比如说 `batchsize`， `epoch`， `learning rate` 是否用`GPU`等等。 


```
%--------------------------------------------------------------
% Initialize Parameters
%--------------------------------------------------------------

opts.train.batchSize = 80;                                                  % 设置网络的batchsize：主要指明了每个随机梯度下降（SGD）的样本大小。
opts.train.numEpochs = 15 ;                                                 % % 每一个Epochs表示所有数据访问。 这里的意思是所有数据被迭代15次之后，输出网络的权重。 其实这个就可以理解为做矩阵分解收敛所需要迭代的次数。
opts.train.continue = true ;                                                % 这里主要是为了出现突然间断电等情况下，网络接着上一轮的训练继续完成。
opts.train.gpus = [1] ;                                                     % 设置是否使用GPU 1 表示使用，[]表示不用
opts.train.learningRate = 1e-3;                                             % 
设置学习率，也可以对不同的Epochs设置不同的learning rate。比如说后面的Epochs的学习权值可以设置小一些。opts.train.learningRate =[0.001*ones(1,100), 0.1 *ones(1,200)];
opts.train.expDir = 'epoch_data';                                           % Directory for storing epoch files, will create if not already made
opts.train.numSubBatches = 1;                                               % Keep at 1
 
% opts.train.weightDecay  = 3e-4;                                          
% Weight decay value, usually set small. Default is present in cnn_train_dag.m
% opts.train.momentum = 0.9;                                                % Incorporate this, once convergence is reached, Default is present in cnn_train_dag.m

bopts.useGpu = numel(opts.train.gpus) >  0 ;                                % Usually keep at 0, seems to only work with 3D data.
load('imdb.mat');                                                           % 加载我们之前所构造的数据信息。


```

### 定义自己的网络结构

有了网络的一些训练信息之后，我们就要进入重点了。这个也是很多论文的重点，毕竟有些人黑深度学习是改结构，改Loss，网络拼接嘛。

首先我们声明一个网络:

```
net=dagnn.DagNN();
```
然后初始化每一层的网络结构信息，它的基本单元包括: 卷积层(Convolution layer), 反卷积层(Convolution transpose layer), 归一化层(Normalization layer), 激活函数(Activation functions)， 池化层( Pooling layer)，全连接层(Fully connected layer)，损失函数, ROI pooling等。

下面是我自己定义的网络结构信息：

```
net.addLayer('conv1', dagnn.Conv('size', [5 5 1 32], 'hasBias', true, 'stride', [1, 1], 'pad', [0 0 0 0]), {'input'}, {'conv1'},  {'conv1f'  'conv1b'}); 
% 一个卷积层，名字为conv1, 总共包括32个神经元每一个神经元的depth是1，大小为5X5.有bias，两个卷积之间的间隔为1X1,边缘部分补0， 输入的变量名字为input，输出的变量名字为conv1,输出的参数为conv1f:卷积核的信息， conv1b 卷积的bias信息。
net.addLayer('relu1', dagnn.ReLU(), {'conv1'}, {'relu1'}, {});
% 一个非线性激活函数Relu，只需要定义输入和输出即可
net.addLayer('pool1', dagnn.Pooling('method', 'max', 'poolSize', [2, 2], 'stride', [2 2], 'pad', [0 0 0 0]), {'relu1'}, {'pool1'}, {});
% 一个池化层。主要定义了池化的方法maxpooling, 每2x2个cell进行一次池化。 池化间隔为2x2. 边缘的填充为0. 接着就是输入和输出的变量信息。
% Block #2
net.addLayer('conv2', dagnn.Conv('size', [5 5 32 32], 'hasBias', true, 'stride', [1, 1], 'pad', [0 0 0 0]), {'pool1'}, {'conv2'},  {'conv2f'  'conv2b'});
net.addLayer('relu2', dagnn.ReLU(), {'conv2'}, {'relu2'}, {});
net.addLayer('pool2', dagnn.Pooling('method', 'max', 'poolSize', [2, 2], 'stride', [2 2], 'pad', [0 0 0 0]), {'relu2'}, {'pool2'}, {});

% Block #3
net.addLayer('conv3', dagnn.Conv('size', [4 4 32 64], 'hasBias', true, 'stride', [1, 1], 'pad', [0 0 0 0]), {'pool2'}, {'conv3'},  {'conv3f'  'conv3b'}); 

%Fully Connected Layer
net.addLayer('fc1', dagnn.Conv('size', [1 1 64 256], 'hasBias', true, 'stride', [1, 1], 'pad', [0 0 0 0]), {'conv3'}, {'fc1'},  {'conv5f'  'conv5b'});
%一个全连接层。采用的是1x1的卷积实现
net.addLayer('relu5', dagnn.ReLU(), {'fc1'}, {'relu5'}, {});

net.addLayer('classifier', dagnn.Conv('size', [1 1 256 10], 'hasBias', true, 'stride', [1, 1], 'pad', [0 0 0 0]), {'relu5'}, {'classifier'},  {'conv6f'  'conv6b'});
net.addLayer('prediction', dagnn.SoftMax(), {'classifier'}, {'prediction'}, {});% 将前面层得到的信息进行归一化转化为分类目标的概率信息。
     
net.addLayer('objective', dagnn.Loss('loss', 'log'), {'prediction', 'label'}, {'objective'}, {});                           % 定义训练损失函数为cross entropy
net.addLayer('error', dagnn.Loss('loss', 'classerror'), {'prediction','label'}, 'error') ; % 定义在验证集上的误差函数

```

### 网络权值初始化

有了网络结构，我们需要对网络中的参数进行初始化，主要是对网络的learningRate， weightDecay 和卷积的参数进行初始化。主要代码如下：


```
function initNet(net, f)                                                                                                    
   net.initParams();                                                                                                                                                                                                                % Initalize local weight decay

	for l=1:length(net.layers)                                                                                          
		if(strcmp(class(net.layers(l).block), 'dagnn.Conv'))                                                        
			f_ind = net.layers(l).paramIndexes(1);    % 得到第一层卷积层的卷积核参数                                                          
			b_ind = net.layers(l).paramIndexes(2);% 得到第一层bias的参数        
		% 初始化参数为一个高斯分布。
			net.params(f_ind).value = f*randn(size(net.params(f_ind).value), 'single');                        			net.params(f_ind).learningRate = 1;  	%设置预防overfitting的正则化参数                                                                 
			net.params(f_ind).weightDecay = 1;                                                                  
			net.params(b_ind).value = f*randn(size(net.params(b_ind).value), 'single');                        			net.params(b_ind).learningRate = 0.5;  
			net.params(b_ind).weightDecay = 1;
		end
	end
end

```

### 设置每一个batch的数据

这个步骤的目的是设置每一个batch的数据和相应的label信息。主要代码如下：

```
function inputs = getBatch(opts, imdb, batch)                                                                               % This fucntion is what generates new mini batch
	images = imdb.images.data(:,:,:,batch) ;                                                                                % Generates specified number of images 
	labels = imdb.images.labels(1,batch) ;                                                                                  % Gets the associated labels
	if opts.useGpu > 0
  		images = gpuArray(images) ;
	end

	inputs = {'input', images, 'label', labels} ;                                                                           % Assigns images and label to inputs
end

```

### 网络训练与测试
调用MatConvNet的`cnn_train_dag` 函数进行网络训练。 主要需要传入的参数有：网络结构信息，数据信息，每一个batch的信息， 训练参数信息，验证集信息。最后通过`saveobj`对训练好的网络进行保存。

```
info = cnn_train_dag(net, imdb, @(i,b) getBatch(bopts,i,b), opts.train, 'val', find(imdb.images.set == 3)) ;                % MatConvNet DagNN Training Function
 
myCNN = net.saveobj();                                                                                                      % Save the DagNN trained CNN
save('myCNNdag.mat', '-struct', 'myCNN')  
```
至此我们就完成了一个网络的训练过程。我们可以通过上面的AlexNet的测试步骤对输入的数据进行测试。

## 使用AutoNN简化训练过程
从前面的过程我们发现，训练一个自己的网络太麻烦了，要自己addLayer传太多的参数了。有人开始对MatConvNet进行封装，即AutoNN。 在AutoNN中，MatConvNet中一些基本的函数被重新定义，我们不需要指定各个层的名字和层的输入和输出，而且自动给网络的参数进行初始化(当然你也可以用Param原语对网络进行初始化)。另外，AutoNN也实现了一些经典网络ResNet等的架构。使用AutoNN，上面的网络训练代码可以改为：

```
	images = Input('images') ;
labels = Input('labels') ;


f=1/100;
%block one
x=vl_nnconv(images,'size',[5,5,1,32],'weightScale',f);
x=vl_nnrelu(x);
x=vl_nnpool(x,2,'method','max','stride',2);
%block 2
x=vl_nnpool(vl_nnrelu(vl_nnconv(x,'size',[5 5 32 32],'weightScale',f)),2,'method','max','stride',2);

%block 3
x=(vl_nnconv(x,'size',[4 4 32 64],'weightScale',f));% conv


x=vl_nnrelu(vl_nnconv(x,'size',[1 1 64, 256],'weightScale',f));% fc+relu

x=vl_nnconv(x,'size',[1 1 256 10]);
output=vl_nnsoftmax(x);

objective = vl_nnloss(output, labels, 'loss', 'log') ;
error = vl_nnloss(output, labels, 'loss', 'classerror') ;
Layer.workspaceNames() ;

net = Net(objective, error) ;
info = cnn_train_autonn(net, imdb, @(i,b) getBatch(bopts,i,b), opts.train, 'val', find(imdb.images.set == 3)) ;                % MatConvNet DagNN Training Function
myCNN = net.saveobj();
```
是不是感觉代码简洁了好多了。

## 最后的最后
虽然MatConvNet 提供了一个用Matlab训练deep learning的方法，但是建议还是用Python的一些库如Pytorch来进行训练，因为这些网络的开源社区的人更多，出了问题也更容易查到解决方案。
## 参考文献

1. http://www.vlfeat.org/matconvnet/
2. http://shanmo.github.io/2016/05/MatConvNet3
3. http://www.robots.ox.ac.uk/~vgg/practicals/cnn/index.html
4. https://www.youtube.com/watch?v=gsKCFHkQ-Ik