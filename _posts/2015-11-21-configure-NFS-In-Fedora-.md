---
layout: post
title:  Fedora下配置NFS服务器
date:   2015-11-23 21:23
categories: Linux
tags: [Linux]
---

这篇博客是我在2013年参加学院的IBM暑期实训的时候写的，之前是发在CSDN上面的，最近心想还是搬过来吧。主要目的是为了实现KVM的虚拟化的文件共享好像，管它呢，先copy过来再说吧。

1. 下载并安装nfs组件

    	# su root
		# yum install portmap nfs-utils



2. 打开nfs配置文件

    	# vi /etc/exports


3. 添加1行如下

    	/study/upmagic *（sync,rw,no_root_squash）
    
	
	PS:*表示所有IP,如果指定IP访问，则可以直接替换为指定IP;rw表示可读写权限；no_root_squash表示当登陆nfs主机使用共享目录的使用者是root时，其权限将被转换成为匿名使用者（nobody）；

 
4. 保存exports

    	（：wq）



5. 创建共享目录，并设置权限

    	# mkdir /study/upmagic6410
    	# chmod 777 /study/upmagic6410




6. 禁用防火墙（也可以通过配置防火墙）

    	# setup

    将firewall选项中的enable取消调，然后保存退出


7. 配置开机启动及启动nfs-server


   		# systemctl enable nfs-server.service


    PS:nfs-server检查是否开启

    	# systemctl is-enabled nfs-server.service

    PS:手动开启、关闭nfs-server的命令为

	    # systemctl start nfs-server.service
	    # systemctl stop nfs-server.service



8. 在其他Linux主机上挂载nfs

    	# mount x.x.x.x:/study/upmagic /mnt/nfs

    PS:x.x.x.x是nfs服务的ip地址。
		

在使用fedora 的nfs服务的时候，它的配置与以前有了一定的区别，这里把fedora前的配置也列一下，安转nfs程序就不说了，在配置nfs的时候，只要在 /etc/exports文件里写入如：

		/root/work/nfs 192.168.1.*(rw,sync,no_root_squash)

保存后重启nfs服务就可以通过本地挂载测试了，但在fedora中这样还不行，fedora默认使用NFS4, 这时候挂载将会出下面的错误提示: 

		# mount -t nfs 192.168.1.103:/root/work/nfs /mnt 
		mount.nfs: access denied by server while mounting 192.168.1.103:/root/work/nfs

需要修改`/etc/sysconfig/nfs`文件，将 

		# Turn off v2 and v3 protocol support 
		#RPCNFSDARGS="-N 2 -N 3" 
		# Turn off v4 protocol support 
		#RPCNFSDARGS="-N 4"  
这几句前面的#去掉就可以了 