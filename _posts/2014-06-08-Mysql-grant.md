---
layout: post
title: Mysql在命令行下授权与数据导入
date:   2014-06-08 12:53
categories: 数据库
tags: [Mysql]
---
从找服务器到导数据终于把博客从SAE上迁了出来，不过迁的不彻底，具体在哪，稍微懂点技术的人都知道，这里不再累述。在迁移的过程中用了大量的Mysql命令行，下面对于其中几个进行简要介绍。
<h1>Mysql登录</h1>
在命令行下mysql登录的操作为：
<pre class="brush: powershell; gutter: true">mysql -u username -p</pre>
然后系统会提示输入密码，这个输入密码的过程比较严格，只能输对，不能进行删除。
<h1>Mysql数据导入</h1>
在进行数据导入之前，需要有一个数据导入的sql可执行文件，如2010.sql ，现在要把数据导入则只需要输入下面命令即可。
<pre class="brush: powershell; gutter: true">source C:\Users\bearshng\Desktop\2010.sql</pre>
这样就完成了对数据的导入过程。
<h1>Mysql用户添加与授权</h1>
<h2 style="color: #454545;"><strong>创建用户</strong><strong>命令</strong></h2>

<pre class="brush: shell; gutter: true"></pre>
<span style="color: #454545;">说明:username – 你将创建的用户名, host – 指定该用户在哪个主机上可以登陆,如果是本地用户可用localhost,  如果想让该用户可以从任意远程主机登陆,可以使用通配符%. password –  该用户的登陆密码,密码可以为空,如果为空则该用户可以不需要密码登陆服务器.</span>
<h3><strong style="color: #454545;">例子</strong></h3>
&nbsp;
<pre class="brush: sql; gutter: true">CREATE USER 'dog'@'localhost' IDENTIFIED BY '123456'; 
CREATE USER 'pig'@'192.168.1.101_' IDENDIFIED BY '123456'; 
CREATE USER 'pig'@'%' IDENTIFIED BY '123456'; 
CREATE USER 'pig'@'%' IDENTIFIED BY ''; 
CREATE USER 'pig'@'%';</pre>
<h2 style="color: #454545;"><strong>授权</strong><strong>命令</strong></h2>
<pre class="brush: sql; gutter: true">GRANT privileges ON databasename.tablename TO 'username'@'host'</pre>
<span style="color: #454545;">说明: privileges – 用户的操作权限,如SELECT , INSERT , UPDATE  等(详细列表见该文最后面).如果要授予所的权限则使用ALL.;databasename –  数据库名,tablename-表名,如果要授予该用户对所有数据库和表的相应操作权限则可用*表示, 如*.*.</span>
<h3>例子</h3>
<pre class="brush: sql; gutter: true">GRANT SELECT, INSERT ON test.user TO 'pig'@'%'; 
GRANT ALL ON *.* TO 'pig'@'%';</pre>
<h2><strong>取消授权命令:</strong></h2>
<pre class="brush: sql; gutter: true">revoke privileges on databasename.tablename from user@localhost;</pre>
说明：databasename为数据库名称 ，tablename为表名称 user为用户名
<h3><strong>例子</strong></h3>
<pre class="brush: sql; gutter: true">revoke all on *.* from dba@localhost;</pre>
数据备份命令

&nbsp;
<pre class="brush: shell; gutter: true">mysqldump -u username -p databasename &gt; databasename.sql</pre>
例子
<pre class="brush: actionscript3; gutter: true">mysqldump -u fuli -p fuli &gt; fuli.sql</pre>
<p class="mb-5"><span class="ask-title  ">mysql 批量修改 字段内容中的 一部分内容</span></p>

<pre class="brush: sql; gutter: true">update table set field=replace(field,'oldString','newString')</pre>
例子
<pre class="brush: sql; gutter: true"> update wp_posts set post_content=replace(post_content,'http://xiongfengchao-wordpress.stor.sinaapp.com','http://www.xiongfuli.com')</pre>
修改表wp_posta中的post_content字段中的
<pre class="brush: text; gutter: true">http://xiongfengchao-wordpress.stor.sinaapp.com</pre>
为
<pre class="brush: text; gutter: true">'http://www.xiongfuli.com/wp-content'</pre>
以下语句具有和ROOT用户一样的权限。root用户的mysql，只可以本地连，对外拒绝连接。
以下方法可以帮助你解决这个问题了，下面的语句功能是，建立一个用户为monitor密码admin权限为和root一样。
允许任意主机连接。这样你可以方便进行在本地远程操作数据库了。
<pre class="brush: sql; gutter: true">CREATE USER 'monitor'@'%' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON *.* TO 'monitor'@'%' IDENTIFIED BY 'admin'WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;</pre>