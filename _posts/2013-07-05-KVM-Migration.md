---
layout: post
title:  KVM 虚拟机在物理主机之间迁移的实现(转)
date:   2013-07-05 12:53
categories: 虚拟化
tags: [KVM,迁移]
---

简介： 虚拟机的迁移使资源配置更加灵活，尤其是在线迁移技术，提高了虚拟服务器的可用性和可靠性。本文是虚拟机迁移技术漫谈系列的第二部分，详细介绍 KVM 虚拟机在物理主机之间的静态迁移和在线迁移特性，而且包括基于数据块的在线迁移实现。

## 前言 ##
虚拟机的迁移技术为服务器的虚拟化提供简便的方法。目前流行的虚拟化产品 VMware，Xen，Hyper-V，KVM 都提供各自的迁移工具。其中 Linux 平台上开源的虚拟化工具 KVM 发展迅速，基于 KVM 的虚拟机的迁移特性也日趋完善。本文全面介绍 KVM 虚拟机在不同的应用环境下的静态迁移（离线迁移）和动态迁移（在线迁移），并且在最新发布的 Suse Linux Enterprise Edition 11 SP1 上分别演示如何应用 libvirt/virt-manager 图形化工具和基于命令行的 qemu-kvm 工具进行迁移操作。


 

## V2V 虚拟机迁移的介绍 ##
V2V 虚拟机的迁移是指在 VMM（Virtual Machine Monitor）上运行的虚拟机系统，能够被转移到其他物理主机上的 VMM 上运行。VMM 对硬件资源进行抽象和隔离，屏蔽了底层硬件细节。而迁移技术的出现，使得操作系统能在不同的主机之间动态的转移，进一步解除软，硬件资源之间的相关性。本系列的第一篇文章“虚拟机迁移技术漫谈”中，介绍了 V2V 迁移的三种方式，本文将更加详细的说明三种方式的不同和实现方法。

## V2V 迁移方式的分类 ##

###静态迁移###

`静态迁移`：也叫做常规迁移、离线迁移（Offline Migration）。就是在虚拟机关机或暂停的情况下从一台物理机迁移到另一台物理机。因为虚拟机的文件系统建立在虚拟机镜像上面，所以在虚拟机关机的情况下，只需要简单的迁移虚拟机镜像和相应的配置文件到另外一台物理主机上；如果需要保存虚拟机迁移之前的状态，在迁移之前将虚拟机暂停，然后拷贝状态至目的主机，最后在目的主机重建虚拟机状态，恢复执行。这种方式的迁移过程需要显式的停止虚拟机的运行。从用户角度看，有明确的一段停机时间，虚拟机上的服务不可用。这种迁移方式简单易行，适用于对服务可用性要求不严格的场合。

###共享存储的动态迁移###

`动态迁移`（Live Migration）：也叫在线迁移（Online Migration）。就是在保证虚拟机上服务正常运行的同时，将一个虚拟机系统从一个物理主机移动到另一个物理主机的过程。该过程不会对最终用户造成明显的影响，从而使得管理员能够在不影响用户正常使用的情况下，对物理服务器进行离线维修或者升级。与静态迁移不同的是，为了保证迁移过程中虚拟机服务的可用，迁移过程仅有非常短暂的停机时间。迁移的前面阶段，服务在源主机的虚拟机上运行，当迁移进行到一定阶段，目的主机已经具备了运行虚拟机系统的必须资源，经过一个非常短暂的切换，源主机将控制权转移到目的主机，虚拟机系统在目的主机上继续运行。对于虚拟机服务本身而言，由于切换的时间非常短暂，用户感觉不到服务的中断，因而迁移过程对用户是透明的。动态迁移适用于对虚拟机服务可用性要求很高的场合。

目前主流的动态迁移工具，VMware 的 VMotion，Citrix 的 XenMotion，他们都依赖于物理机之间采用 SAN（storage area network）或 NAS（network-attached storage）之类的集中式共享外存设备，因而在迁移时只需要进行虚拟机系统内存执行状态的迁移，从而获得较好的迁移性能。


<img src="/assets/img/201307/001.jpg"    class ="myimage"   alt="图 1. 共享存储的动态迁移示意图"  />
图 1. 共享存储的动态迁移示意图

如图 1 中所示的动态迁移，为了缩短迁移时间和服务中断时间，源主机和目的主机共享了 SAN 存储。这样，动态迁移只需要考虑虚拟机系统内存执行状态的迁移，从而获得较好的性能。

### 本地存储的动态迁移 ###

动态迁移基于共享存储设备，为的是加速迁移的过程，尽量减少宕机时间。但是在某些情况下需要进行基于本地存储的虚拟机的动态迁移，这就需要存储块动态迁移技术，简称块迁移。

比如某些服务器没有使用 SAN 存储，而且迁移的频率很小，虚拟机上的服务对迁移时间的要求不严格，则可以使用存储块动态迁移技术；另一方面，SAN 存储的价格比较高，尽管 SAN 存储能够提高迁移性能和系统的稳定性，对于中小企业仅仅为了加快迁移速度而配置昂贵的 SAN 存储，性价比不高。
在集中式共享外部存储的环境下，基于共享存储的动态迁移技术无疑能够工作得很好。但是，考虑到目前一些计算机集群并没有采用共享式外存，而是各自独立拥有本地外存的物理主机构成。基于共享存储的迁移技术在这种场合下受到限制，虚拟机迁移到目的主机后，不能访问其原有的外存设备，或者需要源主机为其外存访问提供支持。
为了拓宽动态迁移技术的应用范围，有必要实现一个包括虚拟机外存迁移在内的全系统动态迁移方案。使得在采用分散式本地存储的计算机集群环境下，仍然能够利用迁移技术转移虚拟机环境，并且保证迁移过程中虚拟机系统服务的可用性。
<img src="/assets/img/201307/001.jpg"    class ="myimage"   alt="图 2. 本地存储的动态迁移示意图"  />

图 2. 本地存储的动态迁移示意图

相比较基于共享存储的动态迁移，数据块动态迁移的需要同时迁移虚拟机磁盘镜像和虚拟机系统内存状态，延长了迁移时间，在迁移性能上打了折扣。


 

## KVM 虚拟机的管理工具 ##

准确来说，KVM 仅仅是 Linux 内核的一个模块。管理和创建完整的 KVM 虚拟机，需要更多的辅助工具。



- QEMU-KVM：在 Linux 系统中，首先我们可以用 modprobe 系统工具去加载 KVM 模块，如果用 RPM 安装 KVM 软件包，系统会在启动时自动加载模块。加载了模块后，才能进一步通过其他工具创建虚拟机。但仅有 KVM 模块是远远不够的，因为用户无法直接控制内核模块去做事情，还必须有一个用户空间的工具。关于用户空间的工具，KVM 的开发者选择了已经成型的开源虚拟化软件 QEMU。QEMU 是一个强大的虚拟化软件，它可以虚拟不同的 CPU 构架。比如说在 x86 的 CPU 上虚拟一个 Power 的 CPU，并利用它编译出可运行在 Power 上的程序。KVM 使用了 QEMU 的基于 x86 的部分，并稍加改造，形成可控制 KVM 内核模块的用户空间工具 QEMU-KVM。所以 Linux 发行版中分为 kernel 部分的 KVM 内核模块和 QEMU-KVM 工具。这就是 KVM 和 QEMU 的关系。


- Libvirt、virsh、virt-manager：尽管 QEMU-KVM 工具可以创建和管理 KVM 虚拟机，RedHat 为 KVM 开发了更多的辅助工具，比如 libvirt、libguestfs 等。原因是 QEMU 工具效率不高，不易于使用。Libvirt 是一套提供了多种语言接口的 API，为各种虚拟化工具提供一套方便、可靠的编程接口，不仅支持 KVM，而且支持 Xen 等其他虚拟机。使用 libvirt，你只需要通过 libvirt 提供的函数连接到 KVM 或 Xen 宿主机，便可以用同样的命令控制不同的虚拟机了。Libvirt 不仅提供了 API，还自带一套基于文本的管理虚拟机的命令—— virsh，你可以通过使用 virsh 命令来使用 libvirt 的全部功能。但最终用户更渴望的是图形用户界面，这就是 virt-manager。他是一套用 python 编写的虚拟机管理图形界面，用户可以通过它直观地操作不同的虚拟机。Virt-manager 就是利用 libvirt 的 API 实现的。

以上这些就是 Linux 系统上 KVM 虚拟化技术的大致架构了。本文正是演示了如何使用这些工具实现了 KVM 虚拟机的迁移操作。

## 本文的实验环境介绍 ##

本文中的 KVM 虚拟机软件基于 Novell 公司的 Suse Linux Enterprise Server 11 Service Pack 1 发行版。SLES11 SP1 发布于 2010 年 5 月 19 日，基于 Linux 内核 2.6.32.12，包含了 kvm-0.12.3，libvirt-0.7.6，virt-manager-0.8.4，全面支持 KVM 虚拟机。本文中的物理服务器和外部共享存储配置如下表：


<a name="minor3.1"></a><b>表 1. 硬件配置</b>
<table border="0" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<th><strong>物理主机</strong></th>
<th><strong>硬件配置</strong></th>
<th><strong>Host OS</strong></th>
<th><strong>Host Name</strong></th>
<th><strong>IP Address</strong></th>
</tr>
<tr>
<td>源主机
Source Host</td>
<td>Xeon(R) E5506 x 4 core
MEM: 10GB</td>
<td>SLES11 SP1</td>
<td>vicorty3</td>
<td>192.168.0.73</td>
</tr>
<tr>
<td>目的主机
Destination Host</td>
<td>Xeon(R) E5506 x 8 core
MEM: 18GB</td>
<td>SLES11 SP1</td>
<td>victory4</td>
<td>192.168.0.74</td>
</tr>
<tr>
<td>NFS Server</td>
<td>Pentium(R) D x 2 core
MEM: 2G</td>
<td>SLES11 SP1</td>
<td>server17</td>
<td>192.168.0.17</td>
</tr>
</tbody>
</table>
&nbsp;

## 创建 KVM 虚拟机 ##

迁移虚拟机之前，我们需要创建虚拟机。创建虚拟机可以使用 QEMU-KVM 命令或者通过 virt-manager 图形化管理工具。

QEMU-KVM 创建虚拟机镜像文件：见本文的参考资源“KVM 虚拟机在 IBM System x 上应用”。
virt-manager 创建虚拟机：参考 virt-manager 帮助手册。

 

## KVM 虚拟机静态迁移 ##

静态迁移由于允许中断虚拟机的运行，所以相对简单。首先在源主机上关闭虚拟机，然后移动虚拟机的存储镜像和配置文件到目的主机，最后在目的主机上启动虚拟机，恢复服务。根据虚拟机镜像存储方式的不同，静态迁移的实现方法稍有不同。

### 虚拟机之间使用共享存储 ###

如果源主机和目的主机都能够访问虚拟机的镜像，则只需要迁移虚拟机配置文件。比如在本例中的 SLES11 SP1 系统，virt-manager 管理的虚拟机配置文件在 /etc/libvirt/qemu/”your vm name.xml”。拷贝 XML 配置文件到目的主机的相同目录后，进行适当的修改，比如：与源主机相关的文件或路径等。无论你何时在 /etc/libvirt/qemu/ 中修改了虚拟机的 XML 文件，必须重新运行 define 命令，以激活新的虚拟机配置文件。

**清单 1. 激活虚拟机配置文件**	
		
 	# virsh define /etc/libvirt/qemu/”your vm name.xml”
 

### 虚拟机镜像使用本地存储 ###


本地存储是指虚拟机的文件系统建立在本地硬盘上，可以是文件或者磁盘分区。




- 本地文件存储：如果虚拟机是基于镜像文件，直接从源主机拷贝镜像文件和 XML 配置文件到目的主机中，然后对 XML 进行适当的修改并激活。


- 本地磁盘分区：如果虚拟机使用了磁盘分区（物理分区或者逻辑分区）为存储设备，首先用 dump 工具把磁盘分区转换成镜像文件再拷贝到目的主机。在目的主机恢复虚拟机时，把镜像文件恢复到目的主机的磁盘分区中去。对于虚拟机系统使用了多个磁盘分区的，需要每个分区单独 dump 成镜像文件。例如使用“/dev/VolGroup00/lv001” LVM 逻辑卷作为存储设备，可以使用下面的命令输出成镜像文件：

		清单 2. 转换逻辑卷为镜像文件
	 	dd if=/dev/VolGroup00/lv001 of=lv001.img bs=1M
 

### 保存虚拟机的运行状态 ###

静态迁移虚拟的过程中，虚拟机系统处于关机状态，这样虚拟机关机前的运行状态不会保留。如果希望保留迁移前的系统状态，并且在迁移后能够恢复，需要对虚拟机做快照备份或者以休眠的方式关闭系统，详细内容和实现方法将在本系列文章的第五部分介绍。


## 基于共享存储的动态迁移 ##

本文前面“V2V 迁移方式的分类”小节中介绍过，跟据虚拟机连接存储方式的不同，动态迁移分为基于共享存储的动态迁移和基于本地存储的存储块迁移。本小节实现了目前使用最广泛的基于共享存储的动态迁移。实现这种实时迁移的条件之一就是把虚拟机存储文件存放在公共的存储空间。因此需要设定一个共享存储空间，让源主机和目的主机都能够连接到共享存储空间上的虚拟媒体文件，包括虚拟磁盘、虚拟光盘和虚拟软盘。否则，即使迁移完成以后，也会因为无法连接虚拟设备，导致无法启动迁移后的虚拟机。

### 设置实验环境 ###

动态迁移实际上是把虚拟机的配置封装在一个文件中，然后通过高速网络，把虚拟机配置和内存运行状态从一台物理机迅速传送到另外一台物理机上，期间虚拟机一直保持运行状态。现有技术条件下，大多虚拟机软件如 VMware、Hyper-V、Xen 进行动态迁移都需要共享存储的支持。典型的共享存储包括 NFS 和 SMB/CIFS 协议的网络文件系统，或者通过 iSCSI 连接到 SAN 网络。选用哪一种网络文件系统，需要根据具体情况而定。本文的实验采用了 NFS 文件系统作为源主机和目的主机之间的共享存储。
<img src="/assets/img/201307/003.jpg"    class ="myimage"   alt="图 3. 共享存储的动态迁移实验配置图"  />


确保网络连接正确，源主机、目的主机和 NFS 服务器之间可以互相访问。
确保源主机和目的主机上的 VMM 运行正常。
设置 NFS 服务器的共享目录。本文的 NFS 服务器也安装了 SLES11 SP1 操作系统。

**清单 3. 配置 NFS 服务		**		

修改 `/etc/exports` 文件，添加

		 /home/image *(rw,sync,no_root_squash) 
		
		 rw：可读写的权限；
		 ro：只读的权限；
		 no_root_squash：登入到 NFS 主机的用户如果是 ROOT 用户，他就拥有 ROOT 权限，此参数很不安全，建议不要使用。
		 sync：资料同步写入存储器中。
		 async：资料会先暂时存放在内存中，不会直接写入硬盘。 


重新启动 nfsserver 服务

 		# service nfsserver restart
 

### 使用 virt-manager 进行动态迁移 ###

virt-manager 是基于 libvirt 的图像化虚拟机管理软件，请注意不同的发行版上 virt-manager 的版本可能不同，图形界面和操作方法也可能不同。本文使用了 SLES11 SP1 发行版上的 virt-manager-0.8.4。

首先在源主机和目的主机上添加共享存储。这里以源主机为例，目的主机做相同的配置。

添加 NFS 存储池到源主机和目的主机的 vit-manager 中。点击 Edit menu->Host Details->Storage tab。
<img src="/assets/img/201307/004.jpg"    class ="myimage"   alt="图 4. 存储池配置图"  />


添加一个新的存储池。点击左下角的“+”号，弹出一个新的窗口。输入以下参数：

Name：存储池的名字。

Type：选择 netfs：Network Exported Directory。因为本文使用了 NFS 作为共享存储协议。

<img src="/assets/img/201307/005.jpg"    class ="myimage"   alt="图 5. 添加共享存储池"  />

图 5. 添加共享存储池


点击“Forward”后，输入以下参数：

		Target Path：共享存储在本地的映射目录。本文中这个目录在源主机和目的主机上必须一致。
		Format：选择存储类型。这里必须是 nfs。
		Host Name：输入共享存储服务器，也就是 NFS 服务器的 IP 地址或 hostname。
		Source Path：NFS 服务器上输出的共享目录。


<img src="/assets/img/201307/006.jpg"    class ="myimage"   alt="图 6. 存储池设置"  />


点击”Finish”后，共享存储添加成功。此时在物理机上查看 Linux 系统的文件系统列表，可以看到共享存储映射的目录。
源主机上创建基于共享存储的 KVM 虚拟机。

选择共享存储池，点击”New Volume”创建新的存储卷。
输入存储卷参数。本例为虚拟机创建了大小为 10G，格式为 qcow2 的存储卷。

<img src="/assets/img/201307/007.jpg"    class ="myimage"   alt="图 7. 添加存储卷"  />

图 7. 添加存储卷

在这个共享存储卷上创建虚拟机。本文创建了一个基于 Window 2008 R2 系统的虚拟机。创建虚拟机的具体步骤见本文前面“创建 KVM 虚拟机“小节。

连接远程物理主机上的 VMM。这里以源主机为例，目的主机做相同的配置。

在源主机上打开 virt-manager 应用程序，连接 localhost 本机虚拟机列表。点击 File->Add Connection，弹出添加连接窗口，输入以下各项：

		Hypervisor：选择 QEMU。
		Connection：选择连接方式 。本文选择 SSH 连接。
		Hostname：输入将要连接的主机名或 IP 地址，这里填写目的主机名 victory4。

<img src="/assets/img/201307/008.jpg"    class ="myimage"   alt="图 8. 添加远程 VMM 连接"  />



点击 Connect，输入 SSH 连接的密码后，将显示源主机和目的主机上的虚拟机列表。

<img src="/assets/img/201307/009.jpg"    class ="myimage"   alt="图 9. 管理远程 VMM"  />


图 9. 管理远程 VMM

### 从源主机动态迁移 KVM 虚拟机到目的主机。 ###

在源主机上启动虚拟机 Windwos 2008 R2。在虚拟机中，开启实时网络服务（用来验证迁移过程中服务的可用性）。
开启远程连接服务 remote access，在其他主机上远程连接此虚拟机。开启网络实时服务。例如打开浏览器并且播放一个实时网络视频。
准备动态迁移，确保所有的虚拟存储设备此时是共享的，包括 ISO 和 CDROM。
在源主机的 virt-manager 窗口中，右键点击等待迁移的虚拟机，选择“Migrate ”。

		New host：选择目的主机的 hostname。
		Address：填入目的主机的 IP 地址。
		Port and Bandwith：指定连接目的主机的端口和传输带宽，本文中没有设定，使用默认设置。

<img src="/assets/img/201307/010.jpg"    class ="myimage"   alt="图 10. 虚拟机迁移设置"  />

图 10. 虚拟机迁移设置

点击“Migrate”和“Yes”开始动态迁移虚拟机。

<img src="/assets/img/201307/011.jpg"    class ="myimage"   alt="图 11. 虚拟机迁移进度"  />

图 11. 虚拟机迁移进度

动态迁移的时间与网络带宽、物理主机的性能和虚拟机的配置相关。本实验中的网络连接基于 100Mbps 的以太网，整个迁移过程大约耗时 150 秒。使用 RDC（Remote Desktop Connection）远程连接虚拟机在迁移过程中没有中断；虚拟机中播放的实时网络视频基本流畅，停顿的时间很短，只有 1 秒左右。如果采用 1000Mbps 的以太网或者光纤网络，迁移时间将会大大减少，而虚拟机服务停顿的时间几乎可以忽略不计。
迁移完成后，目的主机的 VMM 中自动创建了一个同名的 Windows 2008 R2 虚拟机，并且继续提供远程连接服务和播放在线视频。源主机上的虚拟机变为暂停状态，不再提供服务。至此，动态迁移胜利完成。

 

## 基于数据块的动态迁移 ##
从 qemu-kvm-0.12.2 版本，引入了 Block Migration （块迁移）的特性。上一小节“基于共享存储的动态迁移”中，为了实现动态迁移，源主机和目的主机需要连接共享存储服务。有了块迁移技术以后，可以在动态迁移过程中，把虚拟磁盘文件从源主机迁移至目的主机。QEMU-KVM 有了这个特性以后，共享存储不再是动态迁移的必要条件，从而降低了动态迁移的难度，扩大了动态迁移的应用范围。SLES11 SP1 集成了 kvm-0.12.3，支持块迁移特性。但是 SLES11 SP1 上的 libvirt-0.7.6、virt-manager-0.8.4 暂时没有引入块迁移的功能。所以本文下面的块迁移实验仅基于 QEMU-KVM 的命令行模式。

### 设置实验环境 ###

块迁移过程中，虚拟机只使用本地存储，因此物理环境非常简单。只需要源主机和目的主机通过以太网连接，如”图 2. 本地存储的动态迁移示意图”所示。

QEMU 的控制终端和迁移命令

QEMU 控制终端的开启，可以在 QEMQ-KVM 的命令中加参数“-monitor”。

	-monitor stdio： 输出到文本控制台。
	-monitor vc： 输出到图形控制台。
	图形控制台和虚拟机 VNC 窗口的切换命令是：
	Ctrl+Alt+1: VNC window
	Ctrl+Alt+2: monitor console
	Ctrl+Alt+3: serial0 console
	Ctrl+Alt+4: parallel0 console
QEMU-KVM 提供了的“-incoming”参数在指定的端口监听迁移数据。目的主机上需要此参数接收来自源主机的迁移数据。

**清单 4. 迁移相关的 QEMU 命令**

				
	 (qemu) help migrate 
	 migrate [-d] [-b] [-i] uri -- migrate to URI (using -d to not wait for completion) 
	                 -b for migration without shared storage with full copy of disk 
	                 -i for migration without shared storage with incremental copy of disk 
	                       (base image shared between src and destination)
 

使用 QEMU-KVM 进行数据块动态迁移

在源主机上创建和启动虚拟机。

在本地磁盘上创建虚拟机镜像文件。本文创建了大小为 10G，qcow2 格式的本地镜像文件。

**清单 5. 源主机上创建虚拟机**

						
	victory3:~ # qemu-img create -f qcow2 /var/lib/kvm/images/sles11.1ga/disk0.qcow2 10G

在镜像文件上安装虚拟机。本文在虚拟机中安装了 SLES11SP1 系统。

**清单 6. 源主机上安装虚拟机**

						
	 	victory3:~ #  /usr/bin/qemu-kvm -enable-kvm -m 512 -smp 4 -name sles11.1ga 
	    -monitor stdio -boot c -drive file=/var/lib/kvm/images/sles11.1ga/disk0.qcow2, 
	    if=none,id=drive-virtio-disk0,boot=on -device virtio-blk-pci,bus=pci.0, 
	    addr=0x4,drive=drive-virtio-disk0,id=virtio-disk0 -drive 
	    file=/media/83/software/Distro/SLES-11-SP1-DVD-x86_64-GM-DVD1.iso, 
	    if=none,media=cdrom,id=drive-ide0-1-0 -device ide-drive,bus=ide.1, 
	    unit=0,drive=drive-ide0-1-0,id=ide0-1-0 -device virtio-net-pci,vlan=0, 
	    id=net0,mac=52:54:00:13:08:96 -net tap -vnc 127.0.0.1:3


虚拟机安装完毕后，以下列命令启动虚拟机。添加了“-monitor stdio”是为了开启文本控制台；去掉了虚拟光驱中的 ISO 文件是为了保证迁移时，源主机和目的主机上虚拟设备的一致性。如果你在目的主机的相同路径下存在相同名字的 ISO 文件，则可以在迁移时保留 ISO 文件参数。

**清单 7. 源主机上启动虚拟机**

						
	 victory3:~ #  /usr/bin/qemu-kvm -enable-kvm -m 512 -smp 4 -name sles11.1ga 
	 -monitor stdio -boot c -drive file=/var/lib/kvm/images/sles11.1ga/disk0.qcow2, 
	 if=none,id=drive-virtio-disk0,boot=on -device virtio-blk-pci,bus=pci.0,addr=0x4, 
	 drive=drive-virtio-disk0,id=virtio-disk0 -drive if=none,media=cdrom, 
	 id=drive-ide0-1-0 -device ide-drive,bus=ide.1,unit=0,drive=drive-ide0-1-0, 
	 id=ide0-1-0 -device virtio-net-pci,vlan=0,id=net0,mac=52:54:00:13:08:96 
	 -net tap -vnc 127.0.0.1:3

### 在目的主机上创建和启动虚拟机。 ###

在目的主机上为迁移后的系统创建镜像文件，文件的大小必须大于或等于源主机的镜像文件大小。

**清单 8. 目的主机上创建虚拟机**

						
	 victory4:~ #  qemu-img create -f qcow2 dest.img 20G 
	 Formatting 'dest.img', fmt=qcow2 size=21474836480 encryption=off cluster_size=0
	使用与源主机上相同的 qemu-kvm 参数，更改镜像文件为目的主机上创建的镜像文件，加上 -incoming 参数指定动态迁移所使用的协议、IP 地址和端口号。因为 -incoming 参数的作用是监听端口，所以目的主机上的虚拟机一启动就处于 paused 状态，等待源主机上虚拟机开始迁移。本例中块迁移使用 TCP 协议，目的主机上的监听端口是 8888 端口。

**清单 9. 目的主机上的迁移命令**

							
	 victory4:~ # /usr/bin/qemu-kvm -enable-kvm -m 512 -smp 4 -name sles11.1ga 
	 -monitor stdio -boot c -drive file=/root/dest.img,if=none,id=drive-virtio-disk0, 
	 boot=on -device virtio-blk-pci,bus=pci.0,addr=0x4,drive=drive-virtio-disk0, 
	 id=virtio-disk0 -drive if=none,media=cdrom,id=drive-ide0-1-0 -device ide-drive, 
	 bus=ide.1,unit=0,drive=drive-ide0-1-0,id=ide0-1-0 -device virtio-net-pci,vlan=0, 
	 id=net0,mac=52:54:00:13:08:96 -net tap -vnc 127.0.0.1:8 -incoming tcp:0:8888 
	 QEMU 0.12.3 monitor - type 'help' for more information 
	 (qemu) info status 
	 VM status: paused

迁移源主机上的虚拟机到目的主机。

回到源主机上，在等待迁移的虚拟机中开启一些实时服务以验证动态迁移不会中断服务的运行。本例中在虚拟机的终端窗口中用“top -d 1“命令开启 TOP 服务，每秒刷新一次系统进程的信息。

<img src="/assets/img/201307/012.jpg"    class ="myimage"   alt="图 12. 等待迁移的虚拟机中开启 TOP 服务"  />

图 12. 等待迁移的虚拟机中开启 TOP 服务

在源主机的 QEMU 控制台中输入以下迁移命令，迁移开始。

**清单 10. 源主机迁移命令**

						
 	(qemu) migrate -d -b tcp:victory4:8888 

 -d 可以在迁移的过程中查询迁移状态，否则只能在迁移结束后查询。

 -b 迁移虚拟机存储文件

 `tcp:ivctory4:8888` 数据迁移的协议、目的主机和端口。协议和端口必须和目的主机上虚拟机的 -incoming 参数一致。
动态迁移期间，源主机的虚拟机继续运行，TOP 服务没有中断。同时可以在源主机的 QEMU 控制台查询迁移的状态。目的主机的虚拟机处于 paused 状态，从目的主机的 QEMU 控制台可以看到迁移进度的百分比。

**清单 11. 监视虚拟机迁移过程**

						
源主机 QEMU 控制台显示正在迁移的数据

	 (qemu) info migrate 
	 Migration status: active 
	 transferred ram: 52 kbytes 
	 remaining ram: 541004 kbytes 
	 total ram: 541056 kbytes 
	 transferred disk: 2600960 kbytes 
	 remaining disk: 5787648 kbytes 
	 total disk: 8388608 kbytes 

目的主机 QEMU 控制台显示迁移完成的百分比

	 (qemu) Receiving block device images 
	 Completed 28 %

直到动态迁移完成，源主机的虚拟机变成 paused 状态而目的主机上的虚拟机由 paused 状态变成运行状态，TOP 服务继续运行且没有中断。
关闭源主机的虚拟机，所有服务已经迁移到了目的主机，至此迁移完成。