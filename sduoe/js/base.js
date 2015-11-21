/**
Author:王若希，刘琦 
**/

var regStr = /[\t\n\x0B\f\r]/gi;//去处空白的正则表达式

var $byId = function (id) {
    return id ? document.getElementById(id) : null;
}

/**浏览器检测
通过正则表达式获得浏览器的类型
**/

var browser = function () {
	var na = navigator.userAgent.toLowerCase();
	return {
		VERSION: na.match(/(msie|firefox|webkit|opera)[\/:\s](\d+)/) ? RegExp.$2 : '0',
		IE: (na.indexOf('msie') > -1 && na.indexOf('opera') == -1),
		GECKO: (na.indexOf('gecko') > -1 && na.indexOf('khtml') == -1),
		WEBKIT: (na.indexOf('applewebkit') > -1),
		OPERA: (na.indexOf('opera') > -1)
	};
}

//获取outerHTML
function outHTML(tag){
    var tempTag = document.createElement('div');
    
    tempTag.appendChild(tag.cloneNode(true));
    return tempTag.innerHTML;
}

//获取下一标签节点
function nextTag (tag) {
    
    var nxTag = tag.nextSibling;
    
    if(nxTag){
        if(nxTag.nodeType == 1){
            return nxTag;
        }else if(nxTag.nodeType == 3){
            return nxTag.nextSibling;
        }else{
            return null;
        }
    }
    return null;
}

//获取前一标签节点
function previousTag (tag) {

    var pvTag = tag.previousSibling;
    
    if(pvTag){
        if(pvTag.nodeType == 1){
            return pvTag;
        }else if(pvTag.nodeType == 3){
            return pvTag.previousSibling;
        }else{
            return null;
        }
    }
    return null;
}

//获取第一个标签节点
function getFirstElement (tag) {
    
    var ftTag = tag.firstChild;
    
    if(ftTag){
        if(ftTag.nodeType == 1){
            return ftTag;
        }else if(ftTag.nodeType == 3){
            return ftTag.nextSibling;
        }else
            return null;
    }
    return null;
}

//获取最后一个标签节点
function getLastElement (tag) {
    
    var lsTag = tag.lastChild;
    
    if(lsTag){
        if(lsTag.nodeType == 1){
            return lsTag;
        }else if(lsTag.nodeType == 3){
            return lsTag.previousSibling;
        }else
            return null;
    }
    return null;
}

//设置选中内容
function setSelect(startTag, endTag, start, end, collapse, type) {
    var Range,selection;
    
    if(!startTag)
        return false;
    
	if(document.body.createTextRange){//IE浏览器
	    end = end > 0 ? end - 1 : end; 
        Range = document.body.createTextRange();
        Range.moveToElementText(startTag);
        Range.moveStart('character', start);
        Range.moveEnd('character', end);
        if(collapse)Range.collapse(false);//在结束点重叠
        Range.select();//显示光标
	}else{//w3c
        range = document.createRange();
        
        if(browser().GECKO && 3 == type){
            range.setStart(startTag.firstChild, start);
            range.setEnd(endTag.firstChild, endTag.innerHTML.length);
        }else{
            range.setStart(startTag, start);
            range.setEnd(endTag, end);
        }
        
        if(collapse)range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
	}
}

//阻止默认事件
function preventDefault () {

    var e = window.event || arguments[0];
    
    if (e.preventDefault){
        e.preventDefault();
        e.stopPropagation();
    }
    else{
        e.returnValue = false;
        window.event.cancelBubble = true;
    }
}

//替换选中内容
function replaceHTML (newContent, oldContent) {

    if(oldContent.pasteHTML){//ie
        oldContent.pasteHTML(newContent.innerHTML);
    }
    else{//w3c
        oldContent.deleteContents();
        for(var i = newContent.childNodes.length - 1; i >= 0; i--){
            oldContent.insertNode(newContent.childNodes[i].cloneNode(true));
        }
    }
}

//字符串反转
function strReverse (str) {
    return str.split('').reverse().join("");
}

//修改样式
function changeStyle (tagArr, styleType, styleValue) {
    
    for(var i = 0; i < tagArr.length && tagArr[i].nodeType == 1; i++){
        tagArr[i].style[styleType] = styleValue;
    }
}

//判断样式是否存在
function hasStyle (tag, StyleItem) {
    return !(tag.style == undefined || tag.style[StyleItem] == undefined || tag.style[StyleItem] == "");
}

//修改一级标签的样式
function changeLevel1Style (tag, StyleItem, ValueItem) {
    var textIndentNum = "";
    if(hasStyle(tag, 'textIndent') && StyleItem == 'textIndent'){
         var tempNum = parseInt(tag.style[StyleItem]) + parseInt(ValueItem);
         if(tempNum >= 0)
            tag.style[StyleItem] = tempNum + "em";
        else
            tag.style[StyleItem] = parseInt(tag.style[StyleItem]) + "em";
    }else
        tag.style[StyleItem] = ValueItem;
}

//在节点后面插入节点
function insertAfter (newTag, refTag) {
    if(refTag.nextSibling == null){
        refTag.parentNode.appendChild(newTag);
    }else{
        refTag.nextSibling.parentNode.insertBefore(newTag, refTag.nextSibling);
    }
}

//设置ul,ol过行
function setLine (children, id) {
    var sign = false;
    var pTag = document.createElement("p");
    
    for(var i = children.length - 1; i >= 0; i--){
        var tagName = children[i].nodeName.toLowerCase();
        
        pTag.setAttribute('id', ++id);
        pTag.innerHTML = browser().IE ? "<span></span>" : "<span><br /></span>";;
        if(tagName == "br"){
            children[i].parentNode.replaceChild(pTag, children[i]);
            sign = true;
            break;
        }else if((tagName == "p" && children[i].innerText == "") || tagName == "div"){
            children[i].parentNode.replaceChild(pTag, children[i]);
            sign = true;
            break;
        }
    }
    
    if(sign){
        if(pTag.nextSibling != null && pTag.previousSibling.nodeName == pTag.nextSibling.nodeName){//证明不是在ul或者ol的结尾跳转
            pTag.previousSibling.appendChild(pTag.cloneNode(true));
            pTag.previousSibling.innerHTML += pTag.nextSibling.innerHTML;
            pTag.parentNode.removeChild(pTag.nextSibling);
            pTag.parentNode.removeChild(pTag);
        }
        setSelect($byId(id), $byId(id), 0, 0, true, 1);
        return true;
    }
    
    return false;
}

//遮罩层，即弹出一个层出来
function overLay (display, display2, sh, sw) {
    var h = $(document).height();
    var w = $(document).width();
    
    $(function() {
        
        $("body").append("<div id='overlay'></div>");

        $("#overlay")
            .height(h)
            .css({
                'opacity' : 0.4,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'background-color': '#eee',
                'display': display,
                'width': '100%',
                'z-index': 5000
            });
    });
    
    $(function() {
        
        $("body").append("<div id='overlay2'></div>");
        
        $("#overlay2")
            .height(sh + 10)
            .width(sw + 10)
            .css({
                'opacity' : 0.4,
                'position': 'absolute',
                'top': (h - sh)*0.4 - 5,
                'left': (w - sw)*0.5 - 5,
                'background-color': '#ccc',
                'display': display2,
                'z-index': 5001
            });
    });
}

//通过正则表达式判断是否为web地址
function isUrl(value){
    var reg = /http:\/\/[A-Za-z0-9\.-]+?\.[A-Za-z]{3}/;
    return reg.test(value);
}

//获取标签所含文本
function getInnerText (tag) {
    if(tag.innerText){
        return tag.innerText.replace(regStr, "");
    }else if(tag.textContent){
        return tag.textContent.replace(regStr, "");
    }else
        return "";
}

//是否都为同样名字的标签
function isSameParent (tagArr){
    
    if(tagArr.length == 0)return false;
    var parent = $byId(tagArr[0].id).parentNode;
    
    for(var i = 0; i < tagArr.length; i++){
        if($byId(tagArr[i].id).parentNode != parent)
            return false;
    }
    
    return true;
}

//设置控制按钮的标签样式
function cmdBtnStyle (id, bdc, bgc){
    $('#' + id).css({
        'border-width': '1px',
        'border-color': bdc,
        'border-style': 'solid',
        'background-color': bgc
    });
}