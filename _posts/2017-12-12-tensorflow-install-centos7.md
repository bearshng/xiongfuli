---
layout: post
title:  在Centos 7下的OpenCV，CUDA，Caffe以及Tensorflow的安装
date: '2017-12-12 10:23'
categories: 深度学习
tags: TensorFlow 深度学习 Centos Caffe CUDA OpenCV
---

博主可能是个闲不住的倒霉人吧，到新的学校没几天，重启了一下服务器，结果服务器崩了，主要是Ubuntu 16.04和英伟达显卡不兼容导致的。本来这个影响也不大，可是当要用图形界面的时候，就不行了，上网找各种解决方案，发现都不work，没有办法只能采用万能的重装系统来解决了，可是博主又不想用Ubuntu 因为它，太不稳定了。咨询一番后，发现Centos最合适，于是一系列的事情就来了。

## Centos的网络和图形界面配置

为了节省时间，我下载了一个最小版的Centos，安装完之后上不了网，连输入`ipconfig` 都显示无此命令。我心想肯定是网络没有配置好，于是在`/etc/sysconfig/network-scripts/ifcfg-enp0s25 `下进行了如下修改 

```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
PEERDNS=yes
PEERROUTES=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=enp0s25
UUID=634d9539-0433-4b97-ba9a-2f47ed0ea22f
ONBOOT=yes

```
最终终于可以上网了，当然也可以配置静态ip ，讲dhcp改为static即可。

然后就是图形界面，图形界面我这边用的是Gnome，直接在命令行输入

```
yum -y groups install "GNOME Desktop" 
startx
```
即可，当然，https://unix.stackexchange.com/questions/181503/how-to-install-desktop-environments-on-centos-7 也提供了更多选项.

## CUDA安装

CUDA安装，首先需要从NVIDIA官网下载以下文件备用

1. NVIDIA-Linux-x86_64-384.90.run 英伟达的显卡驱动，由于我是1080于是就下载了这个
2. cuda_8.0.44_linux.run：英伟达CUDA的驱动，使用这个是最为方便的。（注意最好是使用8，CUDA 9的坑太多了）
3. cudnn-8.0-linux-x64-v6.0.tgz CUDA的增强版本：

### 显卡驱动安装
下面就是安装过程了，首先安装Navida驱动，需要做如下两件事情
1. 禁用`nouveau`
	输入`vim /etc/modprobe.d/blacklist-nouveau.conf` 添加如下内容
	
	```
	blacklist nouveau
	options nouveau modeset=0
	```
退出后
`sudo dracut --force
sudo reboot`
检验是否禁用成功
`lsmod | grep nouveau` #如果没有输出就表示成功
2. 退出当前的图形界面: 输入`init 3` 即可

接着直接输入`sh NVIDIA-Linux-x86_64-384.90.run` 即可，可能涉及到权限的问题，加上`sudo` 即可。安装完之后输入`nvidia-smi` 可以查看是否安装成功，在以后的使用中也可以查看显卡使用情况

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 384.90                 Driver Version: 384.90                    |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 00000000:03:00.0  On |                  N/A |
| 24%   43C    P8    13W / 180W |    141MiB /  8113MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0      1289      G   /usr/bin/X                                    74MiB |
|    0      5497      G   /usr/bin/gnome-shell                          64MiB |
+-----------------------------------------------------------------------------+
```

### CUDA安装

类似于显卡驱动，直接输入`sh cuda_8.0.44_linux.run`，里面需要设置一些东西，默认即可。然后需要配置两个环境变量分别如下

```
export LD_LIBRARY_PATH=/lib:/lib64:/usr/lib:/usr/lib64:/usr/local/lib:/usr/local/lib64
export PATH=/usr/local/cuda-8.0/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-8.0/lib64:$LD_LIBRARY_PATH
```

这里会让选择是否安装显卡驱动，由于我们已经安装了显卡驱动，故而这里一定要选择否，不然会导致GUI奔溃。

### 安装CUDNN
cudnn是比cuda更高级的GPU加速库，安装也十分简单，只要将文件移动到相应的位置就可以了

```
tar -zxvf cudnn-8.0-linux-x64-v6.0.tgz
sudo cp include/cudnn.h /usr/local/cuda/include/
sudo cp lib64/*  /usr/local/cuda/lib64/
```




接着更新库缓存输入

```
source /etc/profile
sudo ldconfig
```
这里可能会报`libcudnn.so is not a symbol link` 错误。主要原因是`lib` 目录下有两个 `libcudnn.so` 保留其中一个，然后重新链接即可。


## OpenCV安装

### 安装依赖

```
yum -y install cmake git pkgconfig libpng-devel libjpeg-turbo-devel jasper-devel openexr-devel libtiff-devel libwebp-devel  libdc1394-devel libv4l-devel gstreamer-plugins-base-devel  gtk2-devel tbb-devel eigen3-devel
pip install numpy 
yum install python-devel libgphoto2
```

 这里要是提示找不到库，可以使用`epel`库，直接在`install`前面加上`--enablerepo=epel` 即可。
 
###  安装ffmpeg

直接输入下面的命令

```
rpm --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro
rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-1.el7.nux.noarch.rpm
yum -y install ffmpeg ffmpeg-deve
```

### 编译安装OpenCV

```
$cd opencv
$madir release   
$cd release

$cmake -D WITH_TBB=ON -D WITH_EIGEN=ON ..  
$cmake -D BUILD_DOCS=ON -D BUILD_TESTS=OFF -D BUILD_PERF_TESTS=OFF -D BUILD_EXAMPLES=OFF ..  
$cmake -D WITH_OPENCN=OFF -D WITH_CUDA=ON -D BUILD_opencv_gpu=ON -D BUILD_opencv_gpuarithm=ON-D BUILD_opencv_gpubgsegm=ON -D BUILD_opencv_gpucodec=ON-D BUILD_opencv_gpufeatures2d=ON -D BUILD_opencv_gpufilters=ON  -D BUILD_opencv_gpuimgproc=ON -D BUILD_opencv_gpulegacy=ON -D BUILD_opencv_gpuoptflow=ON -D BUILD_opencv_gpustereo=ON -D BUILD_opencv_gpuwarping=ON ..  
$cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..

$make
$sudo make install
```
最后在Python下测试一下是否安装成功

```
#python
>>>import cv2
>>>cv2.__version__
3.3.0
```

## Caffe安装

### 安装依赖

Caffe的乱七八糟的依赖有很多，主要设置如下：
1. `sudo yum -y install protobuf-devel leveldb-devel snappy-devel opencv-devel  hdf5-devel openblas-devel
`
2. `sudo yum -y install gflags-devel glog-devel lmdb-devel`
3. `sudo yum -y install openblas-devel`
4. `for req in $(cat requirements.txt); do pip install $req; done`

5.  `sudo wget http://repo.enetres.net/enetres.repo -O /etc/yum.repos.d/enetres.repo
`

`sudo rpm -ivh lib64icu42-4.2.1-1mdv2010.0.x86_64.rpm
`

`sudo yum install boost-devel
`

### 修改Makefile.config 文件

首先`cp Makefile.config.example Makefile.config`，然后修改文件内容为：

```
## Refer to http://caffe.berkeleyvision.org/installation.html
# Contributions simplifying and improving our build system are welcome!

# cuDNN acceleration switch (uncomment to build with cuDNN).
USE_CUDNN := 1

# CPU-only switch (uncomment to build without GPU support).
# CPU_ONLY := 1

# uncomment to disable IO dependencies and corresponding data layers
# USE_OPENCV := 0
# USE_LEVELDB := 0
# USE_LMDB := 0

# uncomment to allow MDB_NOLOCK when reading LMDB files (only if necessary)
#	You should not set this flag if you will be reading LMDBs with any
#	possibility of simultaneous read and write
# ALLOW_LMDB_NOLOCK := 1

# Uncomment if you're using OpenCV 3
OPENCV_VERSION := 3

# To customize your choice of compiler, uncomment and set the following.
# N.B. the default for Linux is g++ and the default for OSX is clang++
# CUSTOM_CXX := g++

# CUDA directory contains bin/ and lib/ directories that we need.
CUDA_DIR := /usr/local/cuda
# On Ubuntu 14.04, if cuda tools are installed via
# "sudo apt-get install nvidia-cuda-toolkit" then use this instead:
# CUDA_DIR := /usr

# CUDA architecture setting: going with all of them.
# For CUDA < 6.0, comment the *_50 through *_61 lines for compatibility.
# For CUDA < 8.0, comment the *_60 and *_61 lines for compatibility.
# For CUDA >= 9.0, comment the *_20 and *_21 lines for compatibility.
CUDA_ARCH :=  	-gencode arch=compute_30,code=sm_30 \
		-gencode arch=compute_35,code=sm_35 \
		-gencode arch=compute_50,code=sm_50 \
		-gencode arch=compute_52,code=sm_52 \
		-gencode arch=compute_60,code=sm_60 \
		-gencode arch=compute_61,code=sm_61 \
		-gencode arch=compute_61,code=compute_61

# BLAS choice:
# atlas for ATLAS (default)
# mkl for MKL
# open for OpenBlas
BLAS := open
# Custom (MKL/ATLAS/OpenBLAS) include and lib directories.
# Leave commented to accept the defaults for your choice of BLAS
# (which should work)!
# BLAS_INCLUDE := /path/to/your/blas
# BLAS_LIB := /path/to/your/blas
BLAS_INCLUDE := /usr/include/openblas
# Homebrew puts openblas in a directory that is not on the standard search path
# BLAS_INCLUDE := $(shell brew --prefix openblas)/include
# BLAS_LIB := $(shell brew --prefix openblas)/lib

# This is required only if you will compile the matlab interface.
# MATLAB directory should contain the mex binary in /bin.
MATLAB_DIR := /usr/local/MATLAB/R2014a
# MATLAB_DIR := /Applications/MATLAB_R2012b.app
CXXFLAGS += -pthread -fPIC $(COMMON_FLAGS) $(WARNINGS)
CXXFLAGS += -std=c++11
NVCCFLAGS += -ccbin=$(CXX) -Xcompiler -fPIC $(COMMON_FLAGS)
# NOTE: this is required only if you will compile the python interface.
# We need to be able to find Python.h and numpy/arrayobject.h.
PYTHON_INCLUDE := /usr/include/python2.7 \
		/usr/lib/python2.7/site-packages/numpy/core/include
# Anaconda Python distribution is quite popular. Include path:
# Verify anaconda location, sometimes it's in root.
# ANACONDA_HOME := $(HOME)/anaconda
# PYTHON_INCLUDE := $(ANACONDA_HOME)/include \
		# $(ANACONDA_HOME)/include/python2.7 \
		# $(ANACONDA_HOME)/lib/python2.7/site-packages/numpy/core/include

# Uncomment to use Python 3 (default is Python 2)
# PYTHON_LIBRARIES := boost_python3 python3.4m
#PYTHON_INCLUDE := /usr/include/python3.4m \
               /usr/lib/python3.4/site-packages/numpy/core/include

# We need to be able to find libpythonX.X.so or .dylib.
PYTHON_LIB := /usr/lib
# PYTHON_LIB := $(ANACONDA_HOME)/lib

# Homebrew installs numpy in a non standard path (keg only)
# PYTHON_INCLUDE += $(dir $(shell python -c 'import numpy.core; print(numpy.core.__file__)'))/include
# PYTHON_LIB += $(shell brew --prefix numpy)/lib

# Uncomment to support layers written in Python (will link against Python libs)
 WITH_PYTHON_LAYER := 1

# Whatever else you find you need goes here.
INCLUDE_DIRS := $(PYTHON_INCLUDE) /usr/local/include
LIBRARY_DIRS := $(PYTHON_LIB) /usr/local/lib /usr/lib

# If Homebrew is installed at a non standard location (for example your home directory) and you use it for general dependencies
# INCLUDE_DIRS += $(shell brew --prefix)/include
# LIBRARY_DIRS += $(shell brew --prefix)/lib

# NCCL acceleration switch (uncomment to build with NCCL)
# https://github.com/NVIDIA/nccl (last tested version: v1.2.3-1+cuda8.0)
# USE_NCCL := 1

# Uncomment to use `pkg-config` to specify OpenCV library paths.
# (Usually not necessary -- OpenCV libraries are normally installed in one of the above $LIBRARY_DIRS.)
# USE_PKG_CONFIG := 1

# N.B. both build and distribute dirs are cleared on `make clean`
BUILD_DIR := build
DISTRIBUTE_DIR := distribute

# Uncomment for debugging. Does not work on OSX due to https://github.com/BVLC/caffe/issues/171
# DEBUG := 1

# The ID of the GPU that 'make runtest' will use to run unit tests.
TEST_GPUID := 0

# enable pretty build (comment to see full commands)
Q ?= @

```

主要需要注意的几点是

* Python的设置
* MATLAB设置
* CUDA的设置


### 编译验证

接着编译即可。

```
make -j32
make pycaffe
make matcaffe
make test -j24
make runtest -j24
```
在Caffe的Python目录下输入：

```
python
import caffe
caffe.__version__
```
能正确输出即为安装成功


## 安装Tensorflow

Caffe安装完之后，TensorFlow就很好安装了，直接通过pip安装即可。

### Python2.* 下安装

* CPU版本

```
wget https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-1.4.0-cp27-none-linux_x86_64.whl

pip install tensorflow-1.4.0-cp27-none-linux_x86_64.whl --ignore-installed six
```
*  GPU版本

```
wget https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow_gpu-1.4.0-cp27-none-linux_x86_64.whl

pip install tensorflow_gpu-1.4.0-cp27-none-linux_x86_64.whl --ignore-installed six
```

### Python3.*安装

* CPU版本

```
wget https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-1.4.0-cp34-cp34m-linux_x86_64.whl

pip3  install tensorflow-1.4.0-cp34-cp34m-linux_x86_64.whl --ignore-installed six
```

* GPU版本

```
https://storage.googleapis.com/tensorflow/linux/gpu/tensorflow_gpu-1.4.0-cp34-cp34m-linux_x86_64.whl

pip3  install tensorflow_gpu-1.4.0-cp34-cp34m-linux_x86_64.whl --ignore-installed six

```
## 参考文献

1. http://blog.csdn.net/kakitgogogo/article/details/52490010
2. http://www.jianshu.com/p/ea035240b956
3. https://www.tensorflow.org/install/install_linux#the_url_of_the_tensorflow_python_package
4. http://queirozf.com/entries/installing-cuda-tk-and-tensorflow-on-a-clean-ubuntu-16-04-install
5. https://stackoverflow.com/questions/33050113/how-to-install-boost-devel-1-59-in-centos7
6. http://www.cnblogs.com/balaamwe/p/3480430.html
7. https://github.com/ShaoqingRen/faster_rcnn/issues/151
8. https://stackoverflow.com/questions/20518632/importerror-numpy-core-multiarray-failed-to-import