var container = $('.container');
var input = $('input');
var ol = $('ol');
var lis = [];
var len = 0; // lis.length
var index = -1; // 当前选中的li元素的索引
var database = ['text', 'text12', 'text123', 'texthaha', 'textlala', 
				'apple', 'apple6', 'apple6 plus',
				'Erik', 'Erik127', 'Simon', 'Kener'];

// 进入页面 input自动获取焦点
input.focus();

input.onkeyup = function (e) {	
	// 提示列表
	var keyword = input.value;
	keyword = trim1(keyword);
	// 删除ol所有子节点
	while (ol.hasChildNodes()) {
		ol.removeChild(ol.firstChild);
	}
	// 创建 li
	var suggestdata = findSuggest(keyword);
	for (var i = 0, len = suggestdata.length; i < len; i++) {
		var li = document.createElement('li');
		var extra = suggestdata[i].replace(keyword, '');
		li.innerHTML = ''
					 + '<span>'
					 + keyword
					 + '</span>'
					 + extra;
		ol.appendChild(li);
	}
	// console.log(ol.childNodes.length);
	if (ol.hasChildNodes()) {
		ol.style.display = 'block';
	}
	else {
		ol.style.display = 'none';
	}

	lis = ol.getElementsByTagName('li');
	len = lis.length;
	// 这种实现鼠标和上下键不统一
	// for (var i = 0; i < len; i++) {
	// 	// 绑定鼠标事件
	// 	lis[i].onmouseover = function () {
	// 		this.style.background = '#CCC';
	// 	}
	// 	lis[i].onmouseout = function () {
	// 		this.style.background = '#FFF';
	// 	}
	// 	lis[i].onclick = function () {
	// 		var val = this.innerHTML;
	// 		val = val.replace('<span>', '');
	// 		val = val.replace('</span>', '');
	// 		input.value = val;
	// 		ol.style.display = 'none';
	// 	}		
	// }
	for (var i = 0; i < len; i++) {
		(function (j) {
			lis[j].onmouseover = function () {
				this.style.background = '#CCC';
				if (index !== -1) {
					lis[index].style.background = '#FFF';
				}
				index = j;
			}
			lis[i].onmouseout = function () {
				this.style.background = '#FFF';
			}
			lis[i].onclick = function () {
				var val = this.innerHTML;
				val = val.replace('<span>', '');
				val = val.replace('</span>', '');
				input.value = val;
				ol.style.display = 'none';
			}
		})(i);
	}
	// 上下键回车事件 && 在lis中有元素的时候上下键才有效
	if (e.keyCode === 40 && len > 0) {
		if (index >= 0) {
			lis[index].style.background = '#FFF';
		}
		index = index + 1;
		if (index >= len) {
			index = 0;
		}
		lis[index].style.background = '#CCC';
	}
	if (e.keyCode === 38 && len > 0) {
		if (index >= 0) {
			lis[index].style.background ='#FFF';
		}
		index--;
		if (index < 0) {
			index = len-1;
		}
		lis[index].style.background = '#CCC';
	}
	if (e.keyCode === 13 && len > 0) {
		var val = lis[index].innerHTML;
		val = val.replace('<span>', '');
		val = val.replace('</span>', '');
		input.value = val;
		ol.style.display = 'none';
	}
}

// 查找匹配数据
function findSuggest(keyword) {
	var suggestdata = [];
	if (keyword) {
		for (var i = 0, len = database.length; i < len; i++) {
			if (database[i].indexOf(keyword) === 0) {
				suggestdata.push(database[i]);
			}
		}
	}
	return suggestdata;
}
