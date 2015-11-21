//Author:张超,燕红磊，熊凤超
var curEw;
var cmdIdItem = ['b', "i", "u", "superscript", "suffix", "algLf", "algCn",
                 "algRg", "addIndtat", "reduceIndtat", "ol", "ul"];//控制项id数组
var cmdTypeItem = [1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 2, 2];//控制项类型['8px', '8px'], ['Arial', 'Arial'], 
var cmdValueItem = [['700', 'normal'], ['italic', 'normal'], 
                    ['underline', 'none'], ['super', 'baseline'], ['sub', 'baseline'], 
                    ['left', 'left'], ['center', 'center'], ['right', 'right'], 
                    ['2em', '2em'], ['-2em', '-2em'], ['inherit', 'none'], ['disc', 'none']];//控制项值'fontSize', 'fontFamily', 
var cmdStyleItem = ['fontWeight', 'fontStyle', 'textDecoration',
                    'verticalAlign', 'verticalAlign', 'textAlign', 'textAlign', 'textAlign', 
                    'textIndent', 'textIndent', 'listStyleType', 'listStyleType'];

window.onload = function (){
    
    var fcItem = $byId('fcSel').getElementsByTagName('a');
    var bcItem = $byId('bcSel').getElementsByTagName('a');
    
    curEw = new ew('edit_box');
    curEw.init();
    for(var i = 0; i < cmdIdItem.length; i++){
        $byId(cmdIdItem[i]).onclick = exct(cmdTypeItem[i], cmdStyleItem[i], cmdValueItem[i], cmdIdItem[i]);
    }
    
    for(var j = 0; j < fcItem.length; j++){
        fcItem[j].onclick = exct(1, 'color', [fcItem[j].style['backgroundColor'] , fcItem[j].style['backgroundColor']]);
    }
    
    for(var k = 0; k < bcItem.length; k++){
        bcItem[k].onclick = exct(1, 'backgroundColor', [bcItem[k].style['backgroundColor'] , bcItem[k].style['backgroundColor']]);  
    }
    
    $byId('fS').onchange = fsReIndex;
    $byId('fF').onchange = ffReIndex;
    $byId('fontColor').onclick = setColor;
    $byId('bgColor').onclick = setColor;
    $byId('link').onclick = preInsertLink;
    $byId('tb').onclick = preInsertTable;
    
    this.document.body.onclick = hiddenDialogClick;
}

//隐藏颜色选择框
function hiddenDialogClick (e){
    var e = e || window.event;
    var tag = e.srcElement || e.target;
    if(tag == $byId('fontColor') || tag == $byId('bgColor')){
        return false;
    }
    setCBack();
}

function exct(type, style, value, tagName){
    
    switch(type){
        case 1:
            return function(){curEw.fontStyleChange(style, value); curEw.setCmdState(null, curEw);}
            
        case 2:
            return function(){curEw.ouListChange(style, value, tagName); curEw.setCmdState(null, curEw);}
            
        case 3:
            return function(){curEw.paraChange(style, value); curEw.setCmdState(null, curEw);}
    }
}

//准备插入超链接
function preInsertLink(){
    if(!curEw.getSelection())return false;
    linkDialog('block','block');
    curEw.resetSelection(curEw.contain);
    var frtTagName = curEw.contain.firstChild.nodeName.toLowerCase();
    var spanArr = curEw.contain.getElementsByTagName('span');
    if(frtTagName != 'span'){//选中的内容含有多个一级标签，链接文本不能修改
        if(spanArr.length == 1 && getInnerText(spanArr[0]) == "")
            $byId('linkText').removeAttribute('disabled');
        else
            $byId('linkText').setAttribute('disabled', 'disabled');
    }else{
        $byId('linkText').removeAttribute('disabled');
    }
    $byId('linkText').value = getInnerText(curEw.contain);
    curEw.reSelect();
}

//插入链接确认
function sureLink (){
    var linkText = $byId('linkText');
    var linkAddress = $byId('linkAddress');
    var titleText = '单击访问链接' + linkAddress.value;
    var sign = true;
    var tempA = curEw.ct('span');
    var spanArr = curEw.contain.getElementsByTagName('span');
    
    tempA.style['color'] = 'blue';
    tempA.style['textDecoration'] = 'underline';
    tempA.setAttribute('name', 'link');
    tempA.innerHTML = linkText.value;
    tempA.setAttribute('title', titleText);
    
    if(linkText.value == ""){
        $byId('tip').innerHTML = '显示的文本不能为空！';
        sign = false;
    }else if(!isUrl(linkAddress.value)){
        $byId('tip').innerHTML = '您输入的链接地址有误！';
        sign = false;
    }else if(linkText.getAttribute('disabled') != null && linkText.getAttribute('disabled').toLowerCase() == 'disabled'){//跨一级标签
        for(var i = 0; i < spanArr.length; i++){
            $byId(spanArr[i].id).style['color'] = 'blue';
            $byId(spanArr[i].id).style['textDecoration'] = 'underline';
            $byId(spanArr[i].id).setAttribute('title', titleText);
            $byId(spanArr[i].id).setAttribute('name', 'link');
        }
    }else{
        insertAfter(tempA, $byId(spanArr[0].id));
        for(var i = spanArr.length - 1; i >= 0; i--){
            $byId(spanArr[i].id).parentNode.removeChild($byId(spanArr[i].id));
        }
    }
    if(sign){
        linkDialog('none', 'none');
    }
}

//打开插入表格对话框
function preInsertTable(){
    if(!curEw.getSelection())return false;
    curEw.resetSelection(curEw.contain);
    if(getInnerText(curEw.contain) != ""){
        alert('插入表格请勿选中内容！');
        return false;
    }
    tableDialog('block', 'block');
}

//插入表格确认
function sureTable (){
    var rs = $byId('rs').value;
    var cs = $byId('cs').value;
    var tb = curEw.ct('table');
    var tbody = curEw.ct('tbody');
    var np = null;
    var spanArr = curEw.contain.getElementsByTagName('span');
    
    for(var i = 0; i < rs; i++){
        var tr = curEw.ct('tr');
        
        for(var j = 0; j < cs; j++){
            var td = curEw.ct('td');
            var newp = curEw.ct('p');
            var newspan = curEw.ct('span');
            newspan.innerHTML = browser().IE ? "" : "<br />";
            newp.appendChild(newspan);
            td.appendChild(newp);
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    }
    tb.appendChild(tbody);
    $byId(spanArr[0].id).appendChild(tb);
    var tbp = $byId(spanArr[0].id);
    var tbpp = $byId(spanArr[0].id).parentNode;
    curEw.target.innerHTML = curEw.target.innerHTML.replace(outHTML($byId(tb.id)), "</span></"+ tbpp.nodeName +">" +
       outHTML($byId(tb.id)) + "<"+ tbpp.nodeName +" id=" + ++curEw.startId + " style="+ tbpp.getAttribute('style') +"><span id=" +
       ++curEw.startId + " style=" + tbp.getAttribute('style') + ">");
    setSelect($byId(tb.id).getElementsByTagName('span')[0], $byId(tb.id).getElementsByTagName('span')[0], 0, 1, true, 1);
    tableDialog('none', 'none');
}

//设置字体的颜色或者背景颜色
function setColor () {

    setCBack();
    
    var id = this.id;
    var top = $("#" + id).offset().top;
    var left = $("#" + id).offset().left;
    var height = $("#" + id).height();
    var width = $("#" + id).width();
    
    $('#' + id).css({
        'border-width': '1px',
        'border-color': '#8397b2',
        'border-style': 'solid',
        'background-color': '#d5e2f3'
    });
    
    $(id == 'fontColor' ? '#fcSel' : '#bcSel').css({
        'top': top + height + 4,
        'left': left,
        'display': 'block',
		'z-index':10000
    });
}

//改变文字大小的value
function fsReIndex (){
    var value = $byId('fS').value;
    curEw.fontStyleChange('fontSize', [value + 'px', value + 'px']);
}

//改变字体的value
function ffReIndex (){
    var value = $byId('fF').value;
    curEw.fontStyleChange('fontFamily', [value, value]);
}

//链接对话框
function linkDialog (display, display2){
    var h = $(document).height();
    var w = $(document).width();
    var sh = 170;
    var sw = 370;
    $(function() {
        
        $("#linkDiv")
            .height(sh)
            .width(sw)
            .css({
                'position': 'absolute',
                'top': (h - $('#linkDiv').height() - 22)*0.4,
                'left': (w - $('#linkDiv').width() - 22)*0.5,
                'background-color': 'white',
                'border': '1px solid #ccc',
                'display': display,
                'padding': '20px 0 0 20px',
                'font-size': '12px',
                'z-index': 5002
            });
    });
    
    overLay(display, display2, sh + 22, sw + 22);
}

//表格对话框
function tableDialog (display, display2){
    var h = $(document).height();
    var w = $(document).width();
    var sh = 130;
    var sw = 270;
    $(function() {
        
        $("#tableDiv")
            .height(sh)
            .width(sw)
            .css({
                'position': 'absolute',
                'top': (h - $('#tableDiv').height() - 32)*0.4,
                'left': (w - $('#tableDiv').width() - 22)*0.5,
                'background-color': 'white',
                'border': '1px solid #ccc',
                'display': display,
                'padding': '30px 0 0 20px',
                'font-size': '12px',
                'z-index': 5003
            });
    });
    
    overLay(display, display2, sh + 32, sw + 22);
}

//颜色设置失去焦点时恢复原状
function setCBack () {
	$byId('fontColor').setAttribute('style', "");
	$byId('bgColor').setAttribute('style', "");
    $byId('fcSel').style['display'] = 'none';
    $byId('bcSel').style['display'] = 'none';
}