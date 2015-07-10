// 第一阶段
function clickFn1() {
	// 获取input文本值
	var str = $('#hobbies').value;
	var arr = str.split(',');
	// 去重
	arr = uniqArray1(arr);
	var text = arr.join(',');
	// 创建p节点
	var p = document.createElement('p');
	// 创建p的文本节点
	var textNode = document.createTextNode(text);
	var wrap = $('.wrap');
	wrap.appendChild(p);
	p.appendChild(textNode);
}
$.click('#btn1', clickFn1);

// 第二阶段
function clickFn2() {
	var str = $('#hobbies2').value;
	var re = /[\s,，、；;]+/;
	var arr = str.split(re);
	arr = uniqArray1(arr);
	var text = arr.join(',');
	var textNode = document.createTextNode(text);
	var p = document.createElement('p');
	p.appendChild(textNode);
	$('#wrap2').appendChild(p);
}
$.click('#btn2', clickFn2);

// 第三阶段
var reg = /[\s,，、；;]+/;
var array = [];
function keyFn(event) {
		var hobbies = $('#hobbies3').value;
		hobbies = trim1(hobbies); //去除首尾空白
		array = hobbies.split(reg);
		array = uniqArray1(array);
		if (array.length > 10) {
			$('#tip').innerHTML = '爱好不能超过10个';
			$('#tip').style.display = 'block';
		}
		if (array.length <= 10) {
			$('#tip').style.display = 'none';
		}
}
function clickFn3() {
	// 判断数组是否为[]，不能用 === 进行判断
	if (array == '') { 
		$('#tip').innerHTML = '输入不能为空';
		$('#tip').style.display = "block";
		return;
	}
	if (array.length > 10) {
		$('#tip').innerHTML = '爱好不能超过10个';
		$('#tip').style.display = 'block';
		return;
	}
	// 创建form
	var form = document.createElement('form');
	$('#wrap3').appendChild(form);
	for (var i = 0, len = array.length; i < len; i++) {
		var label = document.createElement('label');
		form.appendChild(label);
		var input = document.createElement('input');
		input.setAttribute('type', 'checkbox');
		label.appendChild(input);
		var text  = document.createTextNode(array[i]);
		label.appendChild(text);
	}
}
$.on('#hobbies3','keyup', keyFn);
$.click('#btn3', clickFn3);

