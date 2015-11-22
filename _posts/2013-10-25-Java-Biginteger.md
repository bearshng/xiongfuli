---
layout: post
title:  BigInteger、BigDecimal详解
date:   2013-10-25 12:53
categories: Java
tags: [BigInteger,BigDecimal]
---

Java对BigInteger、BigDecimal两个类功能一直再做扩展与改进。主要原因是这两个数据类型很重要，在高精度的计算中全靠这两个数据类型了。BigInteger和BigDecimal分别表示任意精度的整数与浮点数。
<h1><strong>一、java.math.BigInteger</strong></h1>
<div></div>
<div>
<div>不可变的任意精度的整数。 此类的用法比较简单些，也不存在舍入等操作。</div>
<div>
<pre class="brush: java; gutter: true">

		package lavasoft; 
		import java.math.BigInteger; 
		import java.util.Random; 
		
		/** 
		* 测试BigInteger 
		* 
		* @author leizhimin 2009-11-17 12:49:41 
		*/ 
		public class TestBigInteger { 
		        public static void main(String[] args) { 
		                System.out.println(&quot;-------------------构造BigInteger---------------------&quot;); 
		                //通过byte数组来创建BigInteger 
		                BigInteger bi1 = new BigInteger(new byte[]{1, 1}); 
		                System.out.println(&quot;bi1=&quot; + bi1.toString()); 
		                //创建带符号的BigInteger 
		                BigInteger bi2 = new BigInteger(-1, new byte[]{1, 1}); 
		                System.out.println(&quot;bi2=&quot; + bi2.toString()); 
		                //创建带符号的BigInteger随机数 
		                BigInteger bi3 = new BigInteger(128, 20, new Random()); 
		                System.out.println(&quot;bi3=&quot; + bi3.toString()); 
		                //通过10进制字符串创建带符号的BigInteger 
		                BigInteger bi4 = new BigInteger(&quot;12342342342342123423423412341&quot;); 
		                System.out.println(&quot;bi4=&quot; + bi4.toString()); 
		                //通过10进制字符串创建带符号的BigInteger 
		                BigInteger bi5 = new BigInteger(&quot;88888888888888888888888888888&quot;, Character.digit(&#039;a&#039;, 33)); 
		                System.out.println(&quot;bi5=&quot; + bi5.toString()); 
		                System.out.println(&quot;BigInteger的常量：&quot;); 
		                System.out.println(&quot;BigInteger.ZERO=&quot; + BigInteger.ZERO); 
		                System.out.println(&quot;BigInteger.ONE=&quot; + BigInteger.ONE); 
		                System.out.println(&quot;BigInteger.TEN=&quot; + BigInteger.TEN); 
		
		                System.out.println(&quot;-------------------使用BigInteger---------------------&quot;); 
		                System.out.println(&quot;bi1的相反数=&quot; + bi1.negate()); 
		                System.out.println(&quot;bi1的相反数=&quot; + bi1.negate()); 
		                System.out.println(&quot;bi1+bi2=&quot; + bi1.add(bi2)); 
		                System.out.println(&quot;bi1-bi2=&quot; + bi1.subtract(bi2)); 
		                System.out.println(&quot;bi1*bi2=&quot; + bi1.multiply(bi2)); 
		                System.out.println(&quot;bi1/bi2=&quot; + bi1.divide(bi2)); 
		                System.out.println(&quot;bi1的10次方=&quot; + bi1.pow(10)); 
		                System.out.println(&quot;bi1的10次方=&quot; + bi1.pow(1)); 
		                BigInteger[] bx = bi4.divideAndRemainder(bi1); 
		                System.out.println(&quot;&gt;&gt;&gt;:bx[0]=&quot; + bx[0] + &quot;,bx[1]=&quot; + bx[1]); 
		                System.out.println(&quot;bi2的绝对值=&quot; + bi2.abs()); 
		        } 
		}
		
		运行结果：
		-------------------构造BigInteger--------------------- 
		bi1=257 
		bi2=-257 
		bi3=175952079487573456985958549621373190227 
		bi4=12342342342342123423423412341 
		bi5=88888888888888888888888888888 
		BigInteger的常量： 
		BigInteger.ZERO=0 
		BigInteger.ONE=1 
		BigInteger.TEN=10 
		-------------------使用BigInteger--------------------- 
		bi1的相反数=-257 
		bi1的相反数=-257 
		bi1+bi2=0 
		bi1-bi2=514 
		bi1*bi2=-66049 
		bi1/bi2=-1 
		bi1的10次方=1256988294225653106805249 
		bi1的10次方=257 
		&gt;&gt;&gt;:bx[0]=48024678374872075577523005,bx[1]=56 
		bi2的绝对值=257 
		
		Process finished with exit code 0
</pre>
</div>
</div>
<h1><strong>二、java.math.BigDecimal
</strong></h1>
不可变的、任意精度的有符号十进制数。与之相关的还有两个类：
<div>

java.math.MathContext：
<div>该对象是封装上下文设置的不可变对象，它描述数字运算符的某些规则，如数据的精度，舍入方式等。</div>
<div>java.math.RoundingMode：这是一种枚举类型，定义了很多常用的数据舍入方式。</div>
</div>
<div></div>
<div>这个类用起来还是很比较复杂的，原因在于舍入模式，数据运算规则太多太多，不是数学专业出身的人看着中文API都难以理解，这些规则在实际中使用的时候在翻阅都来得及。</div>
<div>
<pre class="brush: java; gutter: true">

		package lavasoft; 
		import java.math.BigDecimal; 
		import java.math.MathContext; 
		import java.math.RoundingMode; 
		
		/** 
		* 测试BigDecimal 
		* 
		* @author leizhimin 2009-11-17 12:50:03 
		*/ 
		public class TestBigDecimal { 
		
		        public static void main(String[] args) { 
		                System.out.println(&quot;------------构造BigDecimal-------------&quot;); 
		                //从char[]数组来创建BigDecimal 
		                BigDecimal bd1 = new BigDecimal(&quot;123456789.123456888&quot;.toCharArray(), 4, 12); 
		                System.out.println(&quot;bd1=&quot; + bd1); 
		                //从char[]数组来创建BigDecimal 
		                BigDecimal bd2 = new BigDecimal(&quot;123456789.123456111133333213&quot;.toCharArray(), 4, 18, MathContext.DECIMAL128); 
		                System.out.println(&quot;bd2=&quot; + bd2); 
		                //从字符串创建BigDecimal 
		                BigDecimal bd3 = new BigDecimal(&quot;123456789.123456111133333213&quot;); 
		                System.out.println(&quot;bd3=&quot; + bd3); 
		                //从字符串创建BigDecimal，3是有效数字个数 
		                BigDecimal bd4 = new BigDecimal(&quot;88.456&quot;, new MathContext(3, RoundingMode.UP)); 
		                System.out.println(&quot;bd4=&quot; + bd4); 
		                System.out.println(&quot;------------使用BigDecimal-------------&quot;); 
		                System.out.println(&quot;bd1+bd2=&quot; + bd1.add(bd2)); 
		                System.out.println(&quot;bd1+bd2=&quot; + bd1.add(bd2, new MathContext(24, RoundingMode.UP))); 
		                System.out.println(&quot;bd1-bd2=&quot; + bd1.subtract(bd2).toPlainString()); 
		                System.out.println(&quot;bd1-bd2=&quot; + bd1.subtract(bd2, new MathContext(24, RoundingMode.UP)).toPlainString()); 
		                System.out.println(&quot;bd1*bd2=&quot; + bd1.multiply(bd2)); 
		                System.out.println(&quot;bd1*bd2=&quot; + bd1.multiply(bd2, new MathContext(24, RoundingMode.UP))); 
		                System.out.println(&quot;bd1/bd4=&quot; + bd1.divideToIntegralValue(bd4)); 
		                System.out.println(&quot;bd1/bd4=&quot; + bd1.divideToIntegralValue(bd4, new MathContext(24, RoundingMode.UP))); 
		                System.out.println(&quot;bd1末位数据精度=&quot; + bd1.ulp()); 
		                System.out.println(&quot;bd2末位数据精度=&quot; + bd2.ulp()); 
		                System.out.println(&quot;bd2末位数据精度=&quot; + bd2.ulp().toPlainString()); 
		                System.out.println(&quot;bd1符号：&quot; + bd1.signum()); 
		                System.out.println(&quot;bd4的标度：&quot; + bd4.scale()); 
		        } 
		}
		
		运行结果：
		------------构造BigDecimal------------- 
		bd1=56789.123456 
		bd2=56789.123456111133 
		bd3=123456789.123456111133333213 
		bd4=88.5 
		------------使用BigDecimal------------- 
		bd1+bd2=113578.246912111133 
		bd1+bd2=113578.246912111133 
		bd1-bd2=-0.000000111133 
		bd1-bd2=-0.000000111133 
		bd1*bd2=3225004542.907120529593035648 
		bd1*bd2=3225004542.90712052959304 
		bd1/bd4=641.00000 
		bd1/bd4=641.00000 
		bd1末位数据精度=0.000001 
		bd2末位数据精度=1E-12 
		bd2末位数据精度=0.000000000001 
		bd1符号：1 
		bd4的标度：1 
		
		Process finished with exit code 0

</pre>
</div>
&nbsp;
<h2><strong> </strong></h2>