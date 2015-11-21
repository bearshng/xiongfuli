/*
Author:张超,燕红磊，熊凤超
编辑器核心
//实现内容：
一.样式的修改
类型一:文本的样式修改
类型二:生成Ol/Ul
类型三:段落的样式修改
其他的类型都可由这三种基本类型组合完成

二.
编辑框的事件绑定
click,keyup

*/

function ew(id){
    this.startId = 1;//标签id的起始号
    this.target = $byId(id);//编辑框
    this.selection = null;//选中的内容
    this.selparent = null;//父节点
    this.contain = document.createElement('div');//选中内容副本容器
};

//新建标签并赋予id号
ew.prototype.ct = function (tagName){
    var newTag = document.createElement(tagName);
    newTag.id = ++this.startId;
    return newTag;
}

//初始化
ew.prototype.init = function (){
    var _self = this;//用于作为事件传递参数
    this.target.onkeyup = function(e){
        try{
            _self.keyboardEventUp(e, _self);
        }catch(ep){
            return false;
        }
    };
    this.target.onclick = function(e){ 
        try{
            _self.linkClick(e);
            _self.setCmdState(e, _self);
        }catch(ep){
            return false;
        }
    };
    this.editable(true);//开启编辑功能
    this.setId(this.target, []);
};

//是否开启编辑
ew.prototype.editable = function (sign){
    this.target.setAttribute("contentEditable", sign.toString());
};

ew.prototype.keyboardEventUp = function (e, _self){
    //修改跳出ol,ul等标签而出现的一级标签不同步现象
    var e = window.event || arguments[0];
    var kCode = e.keyCode;
    
    if(13 == kCode){
        var children = _self.target.childNodes;
        if(!setLine(children, _self.startId)){
            var tdTags = _self.target.getElementsByTagName("td");
            for(var i = 0; i < tdTags.length; i++){
                if(setLine(tdTags[i].childNodes, _self.startId))
                    break;
            }
        }
    }
    
    if(kCode == 37 || kCode == 38 || kCode == 39 || kCode == 40){
        _self.setCmdState(e, _self);
    }
    
    _self.setId(_self.target, []);
};

//获取选择的内容
ew.prototype.getSelection = function (){
    if(browser().IE && 8 == browser().VERSION) this.target.focus();
    if(window.getSelection){//w3c
    
        this.selection = window.getSelection().getRangeAt(0);
        this.selparent = this.selection.commonAncestorContainer;
        if(this.selparent.nodeType == 3){
            this.selparent = this.selparent.parentNode;
        }
        this.contain.innerHTML = "";
        this.contain.appendChild(this.selection.cloneContents());
        
    }else if(document.selection && document.selection.createRange){//ie
        
        this.selection = document.selection.createRange();
        this.selparent = this.selection.parentElement();
        this.contain.innerHTML = this.selection.htmlText;
    }
    
    if(outHTML(this.target).indexOf(outHTML(this.selparent)) < 0)//选择的不是编辑框的内容
        return false;
    else
        return true;
};

/*整理选中的内容，并重新设置选中的内容
 *先修改第一和最后的文本节点，然后再统一整理为标准格式
 */
ew.prototype.resetSelection = function (tag, isNeed){
    var tempDiv = document.createElement('div');
    if(tag.innerHTML == ""){
        if(!isNeed){
            var newSpan = this.ct('span');
            tempDiv.appendChild(newSpan);
            replaceHTML(tempDiv, this.selection);
            this.contain.innerHTML = outHTML($byId(newSpan.id));
            var ptag = $byId(newSpan.id).parentNode;
            if(ptag.nodeName.toLowerCase() == 'span'){
                this.apartTag(ptag);
            }
            this.addLi(tag);
        }
        return;
    }
    
    var firstTag = tag.firstChild;
    
    while(firstTag && firstTag.nodeType != 3){
        firstTag = firstTag.firstChild;
    }
    
    //先处理第一个文本节点
    if(firstTag != null){
        var ctParent = firstTag.parentNode;//在容器中的父节点
        var tempTextCon = document.createElement('span');
        tempTextCon.appendChild(firstTag.cloneNode(true));
        if(firstTag.parentNode != tag){
            var realParent = document.getElementById(ctParent.id);//真正的父节点
            var realName = realParent.nodeName.toLowerCase();
            if(realParent.innerHTML != tempTextCon.innerHTML){//内容一样的时候可进行统一处理
                var newSpan = realName == 'span' ? realParent.cloneNode(true) : document.createElement('span');
                newSpan.id = ++this.startId;
                var len = ctParent.innerHTML.length;
                newSpan.innerHTML = firstTag.nodeValue;
                tempDiv.appendChild(newSpan.cloneNode(true));
                var headHtml = realParent.innerHTML.substr(0, realParent.innerHTML.length - len);
                if(realName == 'span'){
                    realParent.innerHTML = headHtml;
                    insertAfter(newSpan.cloneNode(true), realParent);
                    ctParent.parentNode.replaceChild(newSpan, ctParent);
                }else{
                    realParent.innerHTML = headHtml +
                        ctParent.innerHTML.replace(firstTag.nodeValue, tempDiv.innerHTML);
                    firstTag.parentNode.replaceChild(newSpan, firstTag);
                }
                firstTag = newSpan.firstChild;
            }
        }else{
            var nspan = this.selparent.nodeName.toLowerCase() == 'span' ? this.selparent.cloneNode(true) : document.createElement('span');
            nspan.id = ++this.startId;
            nspan.innerHTML = "";
            nspan.innerHTML = firstTag.nodeValue;
            
            
            if(!nextTag(firstTag)){//只有一个文本标签
                tempDiv.appendChild(nspan.cloneNode(true));
                replaceHTML(tempDiv, this.selection);
            }else{
                var realfirst = $byId(nextTag(firstTag).id).previousSibling;
                realfirst.nodeValue = strReverse(strReverse(realfirst.nodeValue).replace(strReverse(firstTag.nodeValue), ""));
                insertAfter(nspan.cloneNode(true), realfirst);
                //realfirst.parentNode.replaceChild(nspan.cloneNode(true), realfirst);
            }
            tag.replaceChild(nspan, firstTag);
            firstTag = nspan.firstChild;
            if($byId(nspan.id).parentNode.nodeName.toLowerCase() == 'span'){//需要进行span标签的切分
                this.apartTag($byId(nspan.id).parentNode);
            }
        }
    }
    
    var lastTag = tag.lastChild;
    
    while(lastTag && lastTag.nodeType != 3){
        lastTag = lastTag.lastChild;
    }
    
    //处理第二个文本节点
    if(firstTag != lastTag && lastTag != null){
        var ctParent = lastTag.parentNode;//在容器中的父节点
        
        if(lastTag.parentNode != tag){
            var realparent = document.getElementById(ctParent.id);//真正的父节点
            var realName = realparent.nodeName.toLowerCase();
            var tempTextCon = document.createElement('span');
            tempTextCon.appendChild(lastTag.cloneNode(true));
            if(realparent.innerHTML != tempTextCon.innerHTML){//内容一样的时候可进行统一处理
                var newSpan = realName == 'span' ? realparent.cloneNode(true) : document.createElement('span');
                newSpan.id = ++this.startId;
                newSpan.innerHTML = lastTag.nodeValue;
                tempDiv.innerHTML = "";
                tempDiv.appendChild(newSpan.cloneNode(true));
                var len = ctParent.innerHTML.replace(/[\t\n\x0B\f\r]/gi, "").length;
                if(realName == 'span'){
                    realparent.innerHTML = realparent.innerHTML.replace(lastTag.nodeValue, "");
                    realparent.parentNode.insertBefore(newSpan.cloneNode(true), realparent);
                    ctParent.parentNode.replaceChild(newSpan, ctParent);
                }else{
                    realparent.innerHTML = realparent.innerHTML.replace(/[\t\n\x0B\f\r]/gi, "").replace(ctParent.innerHTML.replace(/[\t\n\x0B\f\r]/gi, ""), ctParent.innerHTML.replace(/[\t\n\x0B\f\r]/gi, "").substring(0,  len - lastTag.nodeValue.length) + tempDiv.innerHTML);
                    lastTag.parentNode.replaceChild(newSpan, lastTag);
                }
            }
        }else{//父标签为容器
            var nspan = this.ct('span');
            nspan.innerHTML = lastTag.nodeValue;
            
            if(!previousTag(lastTag)){//只有一个文本标签
                tempDiv.appendChild(nspan);
                replaceHTML(tempDiv, this.selection);
            }else{
                var reallast = $byId(previousTag(lastTag).id).nextSibling;
                reallast.nodeValue = reallast.nodeValue.replace(lastTag.nodeValue, "");
                insertAfter(nspan.cloneNode(true), $byId(previousTag(lastTag).id));
            }
            
            tag.replaceChild(nspan, lastTag);
            if($byId(nspan.id).parentNode.nodeName.toLowerCase() == 'span'){//需要进行span标签的切分
                this.apartTag($byId(nspan.id));
            }
        }
    }
    this.addSpan(tag);
    this.addLi(tag);
};

//再为文本节点加上span标签
ew.prototype.addSpan = function(tag){
    var regStr = /[\t\n\x0B\f\r]/gi;
    var tagArr = tag.childNodes;
    
    for(var i = 0; i < tagArr.length; i++){
        var curTag = tagArr[i];
        var ctParent = curTag.parentNode;
        var ctPre = previousTag(curTag);
        var ctNext = nextTag(curTag);
        
        if(curTag.nodeType == 3 && curTag.nodeValue.replace(regStr, "") != "" && ctParent.nodeName.toLowerCase() != 'span' ){
            
            var realTag = $byId(ctParent.id);
            var newSpan = this.ct('span');
            var tempDiv = document.createElement('div');
            var len = curTag.nodeValue.length;
            newSpan.innerHTML = curTag.nodeValue;
            tempDiv.appendChild(newSpan.cloneNode(true));
            ctParent.replaceChild(newSpan.cloneNode(true), curTag);
            
            if(ctPre){
                var realPre = $byId(ctPre.id);
                realTag = $byId(ctPre.id).parentNode;
                insertAfter(newSpan.cloneNode(true), realPre);
                var tempTag = document.createElement('div');
                tempTag.appendChild(newSpan);
                var htmlArr = realTag.innerHTML.split(tempTag.innerHTML);
                realTag.innerHTML = htmlArr[0] + tempTag.innerHTML + htmlArr[1].replace(curTag.nodeValue, "");
            }else if(ctNext){
                var realNext = $byId(ctNext.id);
                realTag = $byId(ctNext.id).parentNode;
                realTag.insertBefore(newSpan.cloneNode(true), realNext);
                var tempTag = document.createElement('div');
                tempTag.appendChild(newSpan);
                var htmlArr = realTag.innerHTML.split(tempTag.innerHTML);
                realTag.innerHTML = htmlArr[0].substr(0, htmlArr[0].length - len) + tempTag.innerHTML + htmlArr[1];
            }else{
                realTag.innerHTML = tempDiv.innerHTML;
            }
            
        }else if(curTag.nodeType == 1){
            this.addSpan(curTag);
        }
    }
};

//再为span标签添加li标签
ew.prototype.addLi = function (tag){
    var regStr = /[\t\n\x0B\f\r]/gi;
    var spanArr = tag.getElementsByTagName('span');
    
    for(var i = 0; i < spanArr.length; i++){
        var curTag = spanArr[i];
        var curParent = curTag.parentNode;
        var realTag = $byId(curTag.id);
        var realParent = realTag.parentNode;
        var realName = realParent.nodeName.toLowerCase();
        
        if(realName != 'p' && realName != 'li'){
            var newLi = this.ct('p');
            
            newLi.appendChild(curTag.cloneNode(true));
            curParent.replaceChild(newLi.cloneNode(true), curTag);
            newLi.innerHTML = "";
            newLi.appendChild(realTag.cloneNode(true));
            realTag.parentNode.replaceChild(newLi, realTag);
            while(newLi.previousSibling && (newLi.previousSibling.nodeType == 3 || newLi.previousSibling.nodeName.toLowerCase() == 'span')){
                if(newLi.previousSibling.nodeValue.replace(regStr, "") != ""){
                    newLi.insertBefore(newLi.previousSibling, newLi.firstChild);
                }else{
                    newLi.parentNode.removeChild(newLi.previousSibling);
                }
            }
            
            while(newLi.nextSibling && (newLi.nextSibling.nodeType == 3 || newLi.nextSibling.nodeName.toLowerCase() == 'span')){
                if(newLi.nextSibling.nodeValue.replace(regStr, "") != ""){
                    newLi.appendChild(newLi.nextSibling);
                }else{
                    newLi.parentNode.removeChild(newLi.nextSibling);
                }
            }
        }
    }
};

//文字样式修改
ew.prototype.fontStyleChange = function (style, value){
    
    if(!this.getSelection())return false;
    this.resetSelection(this.contain);
    var spanArr = this.contain.getElementsByTagName('span');
    var styleChange = true;//样式是否需要修改的标志
        
    for(var i = 0; i < spanArr.length; i++){
        if(!hasStyle(spanArr[i], style) || spanArr[i].style[style].toLowerCase() == value[1].toLowerCase()){
            styleChange = false;
            break;
        }
    }
    
    if(styleChange){
        for(var j = 0; j < spanArr.length; j++){
            $byId(spanArr[j].id).style[style] = value[1];
        }
    }else{
        for(var k = 0; k < spanArr.length; k++){
            $byId(spanArr[k].id).style[style] = value[0];
        }
    }
    
    this.reSelect();
};

/*ul或者ol的修改
 *含有p标签，全部修改
 *或者li标签的父节点标签名不一样，全部修改
 *li标签父节点标签名一样，又与要修改的tagName一样，则修改为p标签，否则修改为tagName指示的标签
 */
ew.prototype.ouListChange = function (style, value, tagName){
    if(!this.getSelection())return false;
    this.resetSelection(this.contain);
    var allIdArr = [];
    var liArr = this.contain.getElementsByTagName('li');
    var pArr = this.contain.getElementsByTagName('p');
    var spanArr = this.contain.getElementsByTagName('span');
    
    if(liArr.length == 0 && pArr.length == 0){
        liArr = [];
        pArr = [];
        var ptag = $byId(spanArr[0].id).parentNode;
        ptag.nodeName.toLowerCase() == 'li' ? liArr.push($byId(spanArr[0].id).parentNode.cloneNode(true)) : pArr.push($byId(spanArr[0].id).parentNode.cloneNode(true));
        var tempTag = ptag.cloneNode(true);
        tempTag.innerHTML = this.contain.innerHTML;
        this.contain.innerHTML = "";
        this.contain.appendChild(tempTag);
    }
    
    var plen = pArr.length;
    var pArr = this.contain.getElementsByTagName('p');
    for(var i = 0; i != pArr.length; ++i){
        var realp = $byId(pArr[i].id);
        var newLi = this.ct('li');
        var sv = realp.getAttribute('style');
        if(sv != null) newLi.setAttribute('style', sv);
        newLi.innerHTML = realp.innerHTML;
        pArr[i].setAttribute('id', this.startId);
        realp.parentNode.replaceChild(newLi, realp);
    }
    
    this.contain.innerHTML = this.contain.innerHTML.replace(/<p/gi, '<li').replace(/<\/p/gi, "</li");
    var liArr = this.contain.getElementsByTagName('li');
    if(liArr.length > 0){
        var frtLi = liArr[0];
        var idArr = [];
        for(var i = 1; i < liArr.length; i++){
            idArr.push(frtLi.id);
            if(nextTag(frtLi) != liArr[i]){
                allIdArr.push(idArr);
                idArr = [];
            }
            frtLi = liArr[i];
        }
        idArr.push(liArr[--i].id);
        allIdArr.push(idArr);
    }
    
    if(plen == 0 && allIdArr.length == 1){
        if($byId(allIdArr[0][0]).parentNode.nodeName.toLowerCase() == tagName){
            for(var i = 0; i != liArr.length; ++i){
                var newp = this.ct('p');
                var realLi = $byId(liArr[i].id);
                var sv = realLi.getAttribute('style');
                if(sv != "") newp.setAttribute('style', sv);
                newp.innerHTML = realLi.innerHTML;
                realLi.parentNode.replaceChild(newp, realLi);
            }
        }else{
            var newparent = this.ct(tagName);
            $byId(liArr[0].id).parentNode.insertBefore(newparent, $byId(liArr[0].id));
            for(var i = 0; i != liArr.length; ++i){
                newparent.appendChild($byId(liArr[i].id));
            }
            var pname = newparent.parentNode.nodeName.toLowerCase();
            if(pname == 'ul' || pname == 'ol')
                this.target.innerHTML = this.target.innerHTML.replace(outHTML(newparent), '</' +
                    pname + '>' + outHTML(newparent) + '<' + pname + '>');
        }
    }else{
        for(var j = 0; j != allIdArr.length; ++j){
            var newTag = this.ct(tagName);
            var oriName = $byId(allIdArr[j][0]).parentNode.nodeName;
            insertAfter(newTag, $byId(allIdArr[j][0]));
            for(var k = 0; k != allIdArr[j].length; k++){
                newTag.appendChild($byId(allIdArr[j][k]));
            }
            var pname = newTag.parentNode.nodeName.toLowerCase();
            if(pname == 'ul' || pname == 'ol')
            this.target.innerHTML = this.target.innerHTML.replace(outHTML(newTag), '</' +
                pname + '>' + outHTML(newTag) + '<' + pname + '>');
        }
    }
    this.target.innerHTML = this.target.innerHTML.replace(/<ol[^>]*?>\s*?<\/ol>/gi, "").replace(/<\/ol>\s*?<ol[^>]*?>/gi, "").replace(/<ul[^>]*?>\s*?<\/ul>/gi, "").replace(/<\/ul>\s*?<ul[^>]*?>/gi, "");
    this.reSelect();
};

//段落的修改
ew.prototype.paraChange = function (style, value){
    if(!this.getSelection())return false;
    this.resetSelection(this.contain);
    var liArr = this.contain.getElementsByTagName('li');
    var pArr = this.contain.getElementsByTagName('p');
    var spanArr = this.contain.getElementsByTagName('span');
    
    if(liArr.length == 0 && pArr.length == 0){
        liArr = [];
        liArr.push($byId(spanArr[0].id).parentNode.cloneNode(true));
    }
    
    for(var i = 0; i < liArr.length; i++){
        changeLevel1Style($byId(liArr[i].id), style, value[0]);
    }
    
    for(var j = 0; j < pArr.length; j++){
        changeLevel1Style($byId(pArr[j].id), style, value[0]);
    }
    this.reSelect();
};

//为标签编号
ew.prototype.setId = function (target, arr) {
    
    var tags = target.childNodes;
    
    for(var i = 0; i < tags.length; i++){
    
        if(tags[i].nodeType == 1){
            
            if(tags[i].id == "" || isNaN(parseInt(tags[i].id)) || arr[parseInt(tags[i].id)] == 1){
                tags[i].setAttribute('id', ++this.startId);
            }
            arr[parseInt(tags[i].id)] = 1;
            this.setId(tags[i], arr);
        }
    }
}

//重新设置选中的内容
ew.prototype.reSelect = function (){
    var spanArr = this.contain.getElementsByTagName('span');
    if(getInnerText(this.contain) == "" || spanArr.length == 0 || this.contain.innerHTML == "")return false;
    if(!browser().IE)
        setSelect($byId(spanArr[0].id), $byId(spanArr[spanArr.length - 1].id), 0, 1, false, 1);
    else{
        setSelect($byId(spanArr[0].id), $byId(spanArr[spanArr.length - 1].id), 0, 1, false, 1);
        var firstRgn = document.body.createTextRange();
        firstRgn.moveToElementText($byId(spanArr[0].id));
        var lastRgn = document.body.createTextRange();
        lastRgn.moveToElementText($byId(spanArr[spanArr.length - 1].id));
        var tempRange = document.selection.createRange();
        var sts = tempRange.compareEndPoints("StartToStart",firstRgn);
        tempRange.setEndPoint("StartToStart", firstRgn);
        tempRange.setEndPoint("EndToEnd", lastRgn);
        tempRange.select();
    }
}

//为超链接标签添加事件，实际上是检测onclick事件
ew.prototype.linkClick = function (e){
    var e = window.event || arguments[0];
    var tag = e.target || e.srcElement;
    
    if(tag.getAttribute('name') != undefined && tag.getAttribute('name').toLowerCase() == 'link'){
        var address = tag.title.replace('单击访问链接', '');
        window.open(address, '', '', '');
    }
}

//分开标签
ew.prototype.apartTag = function (pTag) {

    for(var i = pTag.childNodes.length - 1; i >= 0; i--){
        if(3 == pTag.childNodes[i].nodeType){
            var tp = pTag.cloneNode(true);
            tp.setAttribute('id', ++this.startId);
            if(pTag.childNodes[i].nodeValue != ""){
                tp.innerHTML = pTag.childNodes[i].nodeValue;
                insertAfter(tp, pTag);
            }else{
                pTag.removeChild(pTag.childNodes[i]);
            }
            continue;
        }
        insertAfter(pTag.childNodes[i], pTag);
    }
    pTag.parentNode.removeChild(pTag);
}

//click事件时设置按钮的选中状态
ew.prototype.setCmdState = function (e, _self){

    var cmdItem = $byId('cmdItem').getElementsByTagName('a');
    var tags = null;
    var tags2 = null;
    
    for(var i = 0; i < cmdItem.length - 2; i++){
        if(cmdItem[i].getAttribute('style') != ''){
            cmdItem[i].removeAttribute('style');
        }
    }
    $byId('fS').getElementsByTagName('option')[0].selected = true;
    $byId('fF').getElementsByTagName('option')[0].selected = true;
    
    if(!_self.getSelection())return false;
    _self.resetSelection(_self.contain, true);
    
    var spanArr = _self.contain.getElementsByTagName('span');//span标签
    var liArr = _self.contain.getElementsByTagName('li');//li标签
    var pArr = _self.contain.getElementsByTagName('p');//p标签
    
    if(spanArr.length == 0){
        var selpname = _self.selparent.nodeName.toLowerCase();
        liArr = [];
        pArr = [];
        spanArr = [];
        if(selpname == 'span'){
            spanArr.push(_self.selparent.cloneNode(true));
            var selppname = _self.selparent.parentNode.nodeName.toLowerCase();
            if(selppname == 'li' || selppname == 'p')
                selppname == "li" ? liArr.push(_self.selparent.parentNode.cloneNode(true)) : pArr.push(_self.selparent.parentNode.cloneNode(true));
            
        }else if(selpname == 'li' || selpname == 'p'){
            selpname == "li" ? liArr.push(_self.selparent.cloneNode(true)) : pArr.push(_self.selparent.cloneNode(true));
        }
    }
    
    if(pArr.length == 0 && isSameParent(liArr)){
        cmdBtnStyle($byId(liArr[0].id).parentNode.nodeName.toLowerCase() == 'ol' ? 'ol' : 'ul', '#8397b2', '#d5e2f3');
    }
    
    var generalBtnArr = cmdIdItem.slice(0, 8).concat('fS', 'fF');
    var generalStyleArr = cmdStyleItem.slice(0, 8).concat('fontSize', 'fontFamily');
    
    for(var i = 0; i < generalBtnArr.length; i++){
        var cmdId = generalBtnArr[i];//控件的id
        var cmdStyle = generalStyleArr[i];//当前要检测的样式
        var sign = false, sign2 = false;//标志位,sign2为一级标签
        
        if(cmdStyle == 'fontSize' || cmdStyle == 'fontFamily'){
            for(var j = 0; j < spanArr.length; j++){
                sign = false;
                if(spanArr[j].style[cmdStyle] == "" || spanArr[j].style[cmdStyle] != spanArr[0].style[cmdStyle]){
                    break;
                }
                sign = true;
            }
        }else{
            for(var j = 0; j < spanArr.length; j++){
                sign = false;
                if(spanArr[j].style[cmdStyle] == "" || spanArr[j].style[cmdStyle] != cmdValueItem[i][0]){
                    break;
                }
                sign = true;
            }
        }
        
        for(var j = 0; j < liArr.length; j++){
            sign2 = false;
            
            if(liArr[j].style[cmdStyle] == "" || liArr[j].style[cmdStyle] != cmdValueItem[i][0]){
                break;
            }
            sign2 = true;
        }
        
        for(var j = 0; j < pArr.length; j++){
            sign2 = false;
            
            if(pArr[j].style[cmdStyle] == "" || pArr[j].style[cmdStyle] != cmdValueItem[i][0]){
                break;
            }
            sign2 = true;
        }
        
        //为真则设置为选中状态
        if(sign || sign2){
            
            if(cmdStyle == 'fontSize'){//字体大小状态设置
                var opts = $byId('fS').getElementsByTagName('option');
                for(var k = 0; k < opts.length; k++){
                    
                    if(opts[k].value == parseInt(spanArr[0].style['fontSize']) || opts[k].value == spanArr[0].style['fontSize']){
                        opts[k].selected = true;
                    }
                }
            }else if(cmdStyle == 'fontFamily'){//字体状态设置
                var opts = $byId('fF').getElementsByTagName('option');
                for(var k = 0; k < opts.length; k++){
                
                    if(opts[k].value.toLowerCase() == spanArr[0].style['fontFamily'].toLowerCase()){
                        opts[k].selected = true;
                    }
                }
            }else
                cmdBtnStyle(cmdId, '#8397b2', '#d5e2f3');
        }
    }
    _self.reSelect();
};