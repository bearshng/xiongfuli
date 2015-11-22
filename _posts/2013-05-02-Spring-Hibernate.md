---
layout: post
title:  Spring3.1.3 + Hibernate4 事务管理简单例子(转)
date:   2013-05-02 12:53
categories: Web
tags: SSH
---

最近在联系SSH项目时候，遇到了点麻烦在csdn上看到一篇不错的日志，于是就给转过来了。

## 一 【起源】 ##

开始是因为对Spring的事务管理不太了解，想通过做一个小的CRUD demo来加深理解的。在做的过程中费尽周折花了不少力气，重要的是也有所收获。事务管理主要是Spring声明式的 `aop:config`配置方式

## 二 【结构及用到的jar包】 ##

 
<img src="/assets/img/201306/1359359018_8012.png" style="width:500px;vertical-align:middle;"alt="结构及用到的jar包"  />


## 三  【配置】 ##


1.web.xml


<img src="/assets/img/201306/1359359625_2603.png" style="width:500px;vertical-align:middle;"alt="结构及用到的jar包"  />



2.Spring 相关配置


	
	

2.1.   applicationContext.xml


<img src="/assets/img/201306/1359364281_7037.png" style="width:500px;vertical-align:middle;"alt="applicationContext.xml"  />

数据库的用户名 密码 地址是配置在这个文件里的。datasource用了两种配置方式 `jdbc` 以及 `proxool`在这里引用下网上对连接池的评论目前常用的连接池有：C3P0、DBCP、Proxool 网上的评价是：C3P0比较耗费资源，效率方面可能要低一点。DBCP在实践中存在BUG，在某些种情会产生很多空连接不能释放，Hibernate3.0已经放弃了对其的支持。Proxool的负面评价较少，现在比较推荐它，而且它还提供即时监控连接池状态的功能，便于发现连接泄漏的情况。




3.Spring MVC 配置

spring-servlet.xml
<img src="/assets/img/201306/1359363923_8591.png" style="width:500px;vertical-align:middle;"alt="spring-servlet.xml"  />


3.1 Hibernate配置

hibernate.cfg.xml
<img src="/assets/img/201306/1359364665_5601.png" style="width:500px;vertical-align:middle;"alt="hibernate.cfg.xml"  />


可见在这个文件里已无数据库 用户名 密码 地址 的配置了

## 四 【Service层】 ##

接口类IService
<img src="/assets/img/201306/1359364858_6002.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


接口实现类MyServiceImp.java

<img src="/assets/img/201306/1359365333_8644.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


主要的想法是用原生Sql而不是Hibernate sql，然后用Spring的事务管理去处理提交 回滚的操作

## 五 【Controller】 ##

	package cn.transaction.controller;
	
	import java.io.IOException;
	import java.util.ArrayList;
	import java.util.List;
	
	import javax.annotation.Resource;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	
	import net.sf.json.JSONObject;
	
	import org.springframework.stereotype.Controller;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestMethod;
	import org.springframework.web.servlet.ModelAndView;
	
	import cn.transaction.domain.User;
	import cn.transaction.service.IService;
	
	@Controller
	@RequestMapping("/crud.do")
	public class CrudDemoController {
	@Resource(name="service")
	private IService service;
	private String errorPage;

	public IService getService() {
		return service;
	}
	public void setService(IService service) {
		this.service = service;
	}
	public String getErrorPage() {
		return errorPage;
	}
	public void setErrorPage(String errorPage) {
		this.errorPage = errorPage;
	}

	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView list(HttpServletRequest request,
			HttpServletResponse response){
		ModelAndView view = null;
		List list = new ArrayList();

		try{
			list = service.listUser();
			view = new ModelAndView("/register");
			request.setAttribute("list", list);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}
		return view;
	}

	@RequestMapping(params = "method=listUserById")
	public ModelAndView listUserById(HttpServletRequest request,
			HttpServletResponse response){
		ModelAndView view = null;
		List list = new ArrayList();

		String idStr = request.getParameter("id");
		int userId = Integer.parseInt(idStr);

		try{
			list = service.listUserById(userId);
			view = new ModelAndView("/register");
			request.setAttribute("list", list);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}

		return view;

	}

	@RequestMapping(params = "method=delete")
	public ModelAndView delete(HttpServletRequest request,
			HttpServletResponse response){
		ModelAndView view = null;
		List list = new ArrayList();

		String idStr = request.getParameter("id");
		int userId = Integer.parseInt(idStr);

		try{
			service.deleteUser(userId);
			list = service.listUser();
			view = new ModelAndView("/register");
			request.setAttribute("list", list);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}

		return view;
	}

	@RequestMapping(params = "method=insert")
	public ModelAndView insert(HttpServletRequest request,
			HttpServletResponse response)throws IOException{
		ModelAndView view = null;
		List list = new ArrayList();

		String json = request.getParameter("user");
		/*
		BufferedReader br = new BufferedReader(new InputStreamReader(
                (ServletInputStream) request.getInputStream()));
		String line = null;
		StringBuilder sb = new StringBuilder();
		while ((line = br.readLine()) != null) {
		    sb.append(line);
		}
		*/
		JSONObject jsonObj = JSONObject.fromObject(json.toString());
        User user = (User)JSONObject.toBean(jsonObj, User.class);
        System.out.println("name==>"+user.getUsername());

		try{
			service.insertUser(user);
			list = service.listUser();
			view = new ModelAndView("/register");
			request.setAttribute("list", list);

		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}

		return view;
	}

	@RequestMapping(params = "method=edit")
	public ModelAndView edit(HttpServletRequest request,
			HttpServletResponse response){
		ModelAndView view = null;
		List list = new ArrayList();

		String json = request.getParameter("user");
		JSONObject jsonObj = JSONObject.fromObject(json.toString());
        User user = (User)JSONObject.toBean(jsonObj, User.class);
        System.out.println("idss==>"+user.getUserid());

		try{
			service.updateUser(user);
			list = service.listUser();
			view = new ModelAndView("/register");
			request.setAttribute("list", list);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}

		return view;
	}

	//点击编辑或新增按钮转向的页面
	@RequestMapping(params = "method=insertOrUpdate")
	public ModelAndView insertOrUpdate(HttpServletRequest request,
			HttpServletResponse response){
		ModelAndView view = null;
		List list = new ArrayList();
		String idStr = request.getParameter("id");
		int userId = -1;
		User user = null;

		if (null != idStr && !"".equals(idStr) ){
			userId = Integer.parseInt(idStr);
		}else{
			return null;
		}

		try{
			if (userId != -1)
				user = service.listUserById(userId).get(0);
			view = new ModelAndView("/userinfo");
			if (null != user)
				request.setAttribute("user", user);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			request.setAttribute("error", "系统错误!");
			request.setAttribute("exception", e);
		}

		return view;
	}

	}

## 六 【View 层】 ##

列表界面 register.jsp

<img src="/assets/img/201306/1359366502_5977.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


编辑界面 userinfo.jsp
<img src="/assets/img/201306/1359366758_3680.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


这个页面是把User 作为一个json对象 整个传递给了后台。
<img src="/assets/img/201306/1359366959_9166.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


后台对json的接收
<img src="/assets/img/201306/1359367058_5236.png" style="width:500px;vertical-align:middle;"alt="接口类IService"  />


## 七 【问题及解决】 ##

1.java.lang.ClassNotFoundException: org.springframework.web.context.ContextLoaderServlet

是由于我的配置文件还是按照老的spring2.x的方式配置的，后来根据reference和网上的资料按spring3.1的方法重新配置了`web.xml` applicationContext.xml, 问题解决

参考：[http://blog.csdn.net/xingfuzhijianxia/article/details/6433918](http://blog.csdn.net/xingfuzhijianxia/article/details/6433918 "http://blog.csdn.net/xingfuzhijianxia/article/details/6433918")

2.UnknownUnwrapTypeException: Cannot unwrap to requested type [javax.sql.DataSource]

错误信息：

	……
	
	onManager'; nested exception is org.springframework.beans.factory.BeanCreationEx
	ception: Error creating bean with name 'txManager' defined in ServletContext res
	ource [/WEB-INF/applicationContext.xml]: Invocation of init method failed; neste
	d exception is org.hibernate.service.UnknownUnwrapTypeException: Cannot unwrap t
	o requested type [javax.sql.DataSource]

这个错误是一开始我把datasource 也就是数据库的用户名 密码 地址配在Hibernate的配置文件里了。

applicationContext里面没有配datasource引起的。后来查阅资料得知Spring的配置文件里必须有datasource

才行，不然就会报这种错误。

3.json错误：


	net.sf.json.JSONException: A JSONObject text must begin with '{' at character 1 of object Object


错误原因是我jsp页面中生成的json字符串格式问题

解决参考：http://bbs.csdn.net/topics/350138016

 

4.org.hibernate.exception.SQLGrammarException: ORA-01747: user.table.column, table.column

这个问题是由于Sql中的查询字段与数据库表中的系统关键字冲突，或者

是因为`sql`语句写的有问题，把`sql` 拿到`sqlplus`中验证即可