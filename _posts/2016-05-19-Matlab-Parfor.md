---
layout: post
title:  在Matlab里面使用parfor实现多核平台并行计算
date:   2016-05-18 16:36
categories: Linux
tags: Linux Rename
---


导师这几天要回国进行工作检查了，可是博主的实验还没有做完，而且每一个实验都特别地耗时(一个`张量分解`需要是5个小时)，可是CPU和内存的利用率没有达到`100%`，听师兄说`matlab`里面内置了`parfor`可以做一些并行的运算，可能速度会快一些于是就用了一下。

## parfor的简介 ##

`parfor`就是`paralle+for`，也就是并行的`for`循环，它的大致意思是会给你自动构造几个`matlab`的执行进程，并行地处理你的数据。这里的数目最大的数值是你的CPU的核数，比如说楼主的电脑是四核的，在任务管理器里面就看到了4个matlab的进程。

<img src="/assets/img/201605/parfor-Matlab.png" class="myimage" alt="Matlab进程" />

当你需要简单计算的多次循环迭代时，例如针对不同的参数对实验结果的影响等，`parfor`循环就很有用。`parfor`将循环迭代分组，那么每个worker执行迭代的一部分。当迭代耗时很长的时候`parfor`循环也是有用的，因为workers可以同时执行迭代，但是当你的CPU的利用率如果已经达到了100%，此时你这种并行是没有意义的，速度不会加快的。另外[这个博客](http://zhiqiang.org/blog/it/matlab-parfor-condition.html "这个博客")上指出了`Matlab`的`parfor`的使用条件即：

1. 大量的简单计算的循环。
2. 大量或少量的复杂计算的循环
3. 各个任务之间不会出现数据的依赖,比如说循环内部的变量之间不要存在数据传递等等。

## parfor的使用 ##

假如说函数$f$是一个非常耗时的函数，然后你想把矩阵$A$中的每一个元素传递到函数$f$中进行运算，运算结果保存在矩阵$B$里面，那么你可以这样操作。

```mtlab
	parfor i = 1:length(A)
	   B(i) = f(A(i));
	end
```

这样矩阵`A`各个元素的计算就可以并行操作而且可以节省很多时间。


## 在parfor里面保存数据文件 ##

Matlab默认是不允许在`parfor`里面使用`save`函数的,这个是[因为](http://cn.mathworks.com/matlabcentral/answers/135285-how-do-i-use-save-with-a-parfor-loop-using-parallel-computing-toolbox)：

> Transparency is violated by the SAVE command because in general MATLAB cannot determine which variables from
>  
> the workspace will be saved to a file.

也就是说Matlab不知道要把工作区里面的那个数据变量保存到内存中，但是在有些时候我们想保存一些中间的结果，那这个就很难办了。一种解决方案是我们把保存文件的操作放在另外一个函数里面进行操作，然后在当前的`parfor`循环体里面调用这个函数即`parsave`，另外一种方法是我们不适用`save`命令自己实现`保存`操作。

### 使用parsave保存数据 ###

前面我们讲到了我们把把保存文件的操作放在另外一个函数里面进行操作，然后在当前的`parfor`循环体里面调用这个函数，我们把这个函数起名为即`parsave`，它的具体代码如下：

```matlab
	function parfor_save(varargin)
	    fname=varargin{1};    
	    for i=2:nargin
	       eval([inputname(i),'=varargin{i};']);  
	       if i==2
	            save('-mat',fname,inputname(i));
	       else
	           save('-mat',fname,inputname(i),'-append');
	       end        
	end
```

我们在`parfor`里面采用下面的方式进行调用：

```matlab
	parfor ii = 1:4
	x = rand(10,10);
	y = ones(1,3);
	parsave(sprintf('output%d.mat', ii), x, y);
	end
```

但是在新版的matlab比如说matlab 2015b里面如果直接使用会抛出这个错误

> Error using parsave (line 27)
> 
> Transparency violation error.
> 
>  See Parallel Computing Toolbox documentation about Transparency

同样是`Workspace Transparency`的的错误，这个是因为在新版的`matlab`里面对`Workspace Transparency`的检查更加严格了，如果我们想保存数据可以自己实现`save`函数操作。

### 自己实现save函数进行数据保存 ###

这个意思就是指我们自己调用`matfile` 函数实现`save`的操作，在`matlab`里面敲`help matfile`我们可以得到下面的doc


> matfile Save and load parts of variables in MAT-files.
> 
> MATOBJ = matfile(FILENAME) constructs an object that can load or save
>     
>parts of variables in MAT-file FILENAME. MATLAB does not load any data
>     
>from the file into memory when creating the object. FILENAME can
>     
>include a full or partial path, otherwise matfile searches along the 
>     
> MATLAB path. If the file does not exist, matfile creates the file on
>     
>the first assignment to a variable.
>     
>MATOBJ = matfile(FILENAME,'Writable',ISWRITABLE) enables or disables
>     
>write access to the file. ISWRITABLE is logical TRUE (1) or FALSE (0).
>     
>By default, matfile opens existing files with read-only access, but
>
>creates new MAT-files with write access.
>
> Access variables in MAT-file FILENAME as properties of MATOBJ, with dot
> 
>notation similar to accessing fields of structs. The syntax for loading
>
>part of variable VARNAME into variable SMALLERVAR is 
>
>SMALLERVAR = MATOBJ.VARNAME(INDICES)
>
>Similarly, the syntax for saving NEWDATA into variable VARNAME is 
>
>MATOBJ.VARNAME(INDICES) = NEWDATA
>
>Specify part of a variable by defining indices for every dimension.
>
>Indices can be a single value, an equally spaced range of increasing
>
>values, or a colon (:), such as:
>
>MATOBJ.VARNAME(100:500, 200:600)
>
>MATOBJ.VARNAME(:, 501:1000)
>
>MATOBJ.VARNAME(1:2:1000, 80)


即我们可以用`matfile`命令去加载或者写一个mat文件，具体的变量使用方法和matlab的`struct`一样，我们使用`matfile`在`parfor`里面保存文件的具体代码如下：

```matlab
	parfor ii = 1:4
	m=matfile(sprintf('output%d.mat', ii),'writable',true)
	x = rand(10,10);
	y = ones(1,3);
	m.x=x;
	m.y=y;
	end
```
这样就可以实现在并行环境下的save操作了。但是这样就不会`violate  workspace Transparency`了吗?个人感觉这个可能在以后的版本中同样会被封,先这样使用再说吧。
