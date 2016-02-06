---
layout: page
description: "业余爱好的点滴记录，同时作为配置备份的存储地，好记性不如滥笔头。"

---
<style type="text/css" media="screen">
.wrap1 {
margin: 100px;
overflow: hidden;
position: relative;
height: 60%;
text-align: center;
}
.box {
text-align: center;
position: relative;
display: inline-block;
}
img {
width: 170px;
margin:0px auto;
position: relative;
border:0;
box-shadow: 0 0 1px #fff,0 0 6px rgba(0,0,0,0);
}
.wrap1 p{
font-size: 30px;
color: #6f6f6f;
}
.wrap1 a {
color: #D34848;
}
.wrap1 li{
display: list-item;
font-size: 15px;
}
.wrap1 ul {
margin-left: 1.35em;
}
.img-hidden {
opacity: 0;
}
hr {
border:0;
background-color:#F4F4F4;
height:1px;
}
#wrap-last{
margin-bottom:100px;
}
.left,
.right {
text-align: left;
margin: 0px 0px;
padding: 5% 5% 5% 20%;
float: left;
}
.project{

}
</style>

<script src="/assets/js/function_about.js"></script>
<script src="/assets/js/jquery.js"></script>
<script type="text/javascript" charset="utf-8">
$(document).ready(
function(){
var width = $(".box").width()/2 - 150;
$('#img-1').css({top:"100px", opacity:"0",left:width})
.animate({top:"-=100px"}, 1000)
.animate({left:"0", opacity:"1"}) ;
var width = ($(".box").width() - 180)/4;
$('#img-2').css({top:"100px", opacity:"0",left:width})
.animate({top:"-=100px"}, 1000)
.animate({left:"0", opacity:"1"}) ;
$('#img-3').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 1000)
.animate({left:"0"}) ;
var width = ($(".box").width() - 180)/4;
$('#img-4').css({top:"100px", opacity:"0",right:width})
.animate({top:"-=100px"}, 1000)
.animate({right:"0", opacity:"1"}) ;
var width = $(".box").width()/2 - 150;
$('#img-5').css({top:"100px", opacity:"0",right:width})
.animate({top:"-=100px"}, 1000)
.animate({right:"0", opacity:"1"}) ;
}
);

var skill = 1;
$(window).scroll(function() {
if($(document).scrollTop() > $("header").height() + $("#wrap-1").height()*2 && skill == 1){
skill = 0;
$('#img-6').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 400);
$('#img-7').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 600);
$('#img-8').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 800);
$('#img-9').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 1000);
}
});
var skill2 = 1;
$(window).scroll(function() {
if($(document).scrollTop() > $("header").height() + $("#wrap-1").height()*3 && skill2 == 1){
skill2 = 0;
$('#img-10').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 2000);
$('#img-11').css({top:"100px", opacity:"0"})
.animate({top:"-=100px",opacity:"1"}, 2000);
}
});
</script>


<body>
<div class="page-content">
<div class="wrap1">
<p>Education</p>
</div>
<div class='wrap1' id="wrap-1">
<div class="box">
<img id="img-1" src="/assets/img/about/macbook.png" alt=""/>
<a href="http://www.whu.edu.cn"><img id="img-2" src="/assets/img/about/whu.png" alt=""/></a>
<a href="http://www.zju.edu.cn"><img id="img-3" src="/assets/img/about/zju.jpg" alt=""/></a>
<a href="http://www.sdu.edu.cn"><img id="img-4" src="/assets/img/about/sdu.jpg" alt=""/></a>
<img id="img-5" src="/assets/img/about/keyboard.png" alt=""/>
</div>
</div>
<hr />
<div class="wrap1" id="skills">
<p>Skills</p>
</div>
<div class="wrap1">
<div class="box">
<img class="img-hidden" id="img-6" src="/assets/img/about/python.png" alt=""/>
<img class="img-hidden" id="img-7" src="/assets/img/about/C.png" alt=""/>
<img class="img-hidden" id="img-8" src="/assets/img/about/Java.jpg" alt=""/>
<img class="img-hidden" id="img-9" src="/assets/img/about/html5.png" alt=""/>
</div>
</div>
<hr />
<div class="wrap1" id="skills">
<p>Projects</p>
</div>
<div class="wrap1">
<div class="box">

<a class="project" href="https://github.com/bearshng/code/tree/master/SDUDesignLatex">
<img class="img-hidden" id="img-10" src="/assets/img/about/objectRecognition.jpg" style="width:200px;margin-right:40px" alt=""/>
</a>
<a class="project" href="https://github.com/bearshng/code/tree/master/object%20Recongnition"><img class="img-hidden" id="img-11" src="/assets/img/about/latex.jpg"  style="width:200px "  alt=""/></a>
</div>
</div>
<div class="wrap1" id="more">
<p>More?</p>
</div>
<div class="wrap1">
<div class="box">
<a href='/cv.pdf' style="font-size:30pt;color:#6F6F6F">CV</a>
</div>
</div>
<hr />





