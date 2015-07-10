// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
	return arr instanceof Array;
}
// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
	if (typeof(fn) == "function") 
		return true;
	else
		return false;
}
function isFunction1(fn) {
	return fn instanceof Function;
}
// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
	var result;
	switch (typeof src) {
		case 'number':
			result = +src;
			break;
		case 'string':
			result = src + '';
			break;
		case 'boolean':
			result = src;
			break;
		case 'object':
			if (src === null) {
				result = null;
			}
			else if (src instanceof Array) {
				result = [];
				for (var i = 0, len = src.length; i < len; i++) {
					result.push(src[i]);
				}
			}
			else if (src instanceof Date) {
				result = new Date(src);
			}
			else {
				result = {};
				for (var key in src) {
					if (src.hasOwnProperty(key)) {
						result[key] = cloneObject(src[j]);
					}
				}
			}
	}
	return result;
}
// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
	var result = [];
	if (arr[i] !== '' && result.indexOf(arr[i]) === -1) {
		result.push(arr[i]);
	} 
}
function uniqArray1(arr) { //仅对数组中的元素去重，保持原有顺序
	var i, tmp;
	for (i = 0; i < arr.length; i++) {
		tmp = arr[i];
		var del = arr.indexOf(tmp, i+1);
		while (del != -1) {
			arr.splice(del, 1);
			del = arr.indexOf(tmp, i+1);
		}
	}
	return arr;
}
function uniqArray2(arr) { //对数组中元素排序去重
	arr.sort();
	var i = 0;
	var len = arr.length;
	while (i < len) {
		if (arr[i] == arr[i+1]) {
			arr.splice(i, 1);
		}
		else i++;
	}
	return arr;
}
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 先暂时不要简单的用一句正则表达式来实现
function trim2(str) {
	var tmp = str[0];
	while(tmp == " " || tmp == "\t" || tmp == "　" || tmp == "\n" || tmp =="\r") {
		str = str.substring(1);
		tmp = str[0];
	}
	tmp = str[str.length-1];
	while(tmp == " " || tmp == "\t" || tmp == "　" || tmp == "\n" || tmp =="\r") {
		str = str.substring(0, str.length-1);
		tmp = str[str.length-1];
	}
	return str;
}
function trim(str) {
	var re = /\s/;
	while (re.test(str[0])) {
		str = str.substring(1);
	}
	while (re.test(str[str.length-1])) {
		str = str.substring(0, str.length-1);
	}
	return str;
}
// ！有问题，会把字符's'去掉
// function trim(str) {
//     //my implement
//     var result = [];
//     for (var i = 0; i < str.length; i++) {
//         if (str[i].indexOf("\t") === -1 //制表符
//             && str[i].indexOf("\n") === -1
//             && str[i].indexOf(" ") === -1
//             && str[i].indexOf("\s") === -1  //uncion空白字符
//             && str[i].indexOf("\r") === -1
//             && str[i].indexOf("\f") === -1
//             && str[i].indexOf("\v") === -1) {
//             result.push(str[i]);
//         }
//     }
//     return result.join("");
// }
// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
	for (var i = 0, len = arr.length; i < len; i++) {
		fn(arr[i], i);
	}
}
// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
	var len = 0;
	for (var i in obj) {
		if (obj.hasOwnProperty(i)) {
			len++;
		}
	}
	return len;
}
/**
 * 正则表达式
 */
// 判断是否为邮箱地址
function isEmail(emailStr) {
	var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/i; //var re = /^[\da-z]+@[a-z]+.[a-z]+$/i;
	return re.test(emailStr);
}
// 判断是否为手机号
function isMobilePhone(phone) {
	var re = /^1[0-9]{10}$/;  // /^1\d{10}$/ or /^\d{11}$/
	return re.test(phone);
}
/**
 * 3
 */
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
	if (element.className === null || element.className === '') {
		element.className = newClassName;
	}
	else {
		if (element.className.indexOf(newClassName) === -1) {
			element.className += ' ' + newClassName;
		}
	}
}
function addClass1(element, newClassName) {
	var classNames = element.getAttribute("class");
	if (classNames) {
		classNames = classNames + " " + newClassName;
	} else {
		classNames = newClassName;
	}
	element.setAttribute("class", classNames);
}
// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
	if (element.className && element.className !== '') {
		var pos = element.className.indexOf(oldClassName);
		if (pos !== -1) {
			element.className.splice(pos, 1);
		}
	}
}
function removeClass1(element, oldClassName) {
	var oldClass = element.className.split(/\s+|\t/);
	var newClass = [];
	for (var i = 0, len = oldClass.length; i < len; i++) {
		if (oldClass[i] !== oldClassName) {
			newClass.push(oldClass[i]);
		}
	}
	element.className = newClass.join(' ');
}
// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
	return element.parentNode === siblingNode.parentNode;
}
function isSiblingNode1(element, siblingNode) {
	var tmp = element.previousSibling;
	while (tmp) {
		if (tmp == siblingNode) {
			return true;
		} else {
			tmp = tmp.previousSibling;
		}
	}
	tmp = element.nextSibling;
	while (tmp) {
		if (tmp == siblingNode)  return true;
		else tmp = element.nextSibling;
	}
	return false;//不是兄弟
}
// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
	return {
		x: element.getBoundingClientRect().left,
		y: element.getBoundingClientRect().top
	};
}
/**
 * @ mini $
 * @ 单个选择器选择匹配的第一个元素，
 * @ 组合选择器选择的是上个选择器选出元素的子元素中第一个匹配的元素
 */
// 参考别人的
function $(selector) {
	// 之前没有考虑到
	if (selector === null || selector === undefined) {
		return document;
	}
	// 去首尾空白
	selector = trim(selector); 
	var selectors = selector.split(/\s+|\t+/);
	var domObject = document;

	var scanElement = function(element, oneSelector) {
		var temp;
		if (oneSelector.indexOf('.') === 0) {
			temp = oneSelector.replace('.', '');
			if (element.nodeType == 1 && element.className !== undefined && element.className.indexOf(temp) !== -1) {
				return element;
			}
		}
		else if (oneSelector.indexOf('[') === 0) {
			temp = oneSelector.replace('[', '').replace(']', '');
			if (temp.indexOf('=') === -1) {
				if (element.nodeType == 1 && element.attributes[temp] !== undefined) {
					return element;
				}
			}
			else {
				temp = temp.split('=');
				if (element.nodeType == 1 && element.attributes[temp[0]] !== undefined && element.attributes[temp[0]].value === temp[1]) {
					return element;
				}
			}
		}
		if (element.childNodes.length === 0) {
			return null;
		}
		else {
            for (var j = 0, len = element.childNodes.length; j < len; j++) {
                //元素节点
                if (element.childNodes[j].nodeType == 1) {
                    var result = scanElement(element.childNodes[j], oneSelector);
                    if(result !== null && result !== undefined) {
                        return result;
                    }
                }
            }
        }
	};
	for (var i = 0, len = selectors.length; i < len; i++) {
		var temp;
		// id选择器
		if (selectors[i].indexOf('#') === 0) {
			temp = selectors[i].replace('#', '');
			// temp = selectors[i].substring(1);
			domObject = domObject.getElementById(temp);
		}
		// 标签选择器
		else if ((selectors[i].indexOf('.') !== 0) && (selectors[i].indexOf('[') !== 0)) {
			temp = selectors[i];
			domObject = domObject.getElementsByTagName(temp)[0];
		}
		else {
			// 类选择器及属性选择器
			var result = scanElement(domObject, selectors[i]);
			if (domObject != result) {
				domObject = result;
			}
			else {
				domObject = undefined;
			}
		}	
	}
	return domObject;
}

// 之前自己写得，根据标签选择存在问题
function $1(selector) {
	var idRe = /^#/;
	var classRe = /^\./;
	var attrRe = /^\[[a-zA-Z_]+[a-zA-Z0-9_\-]*\]$/; //属性名

	var result = null;
	var obj = document;
	selector = trim(selector);
	var selectors = selector.split(/\s+/); //对选择器以空格为切割符进行切割

	for (var i = 0; i < selectors.length; i++) {
		// 根据id查找
		if (idRe.test(selectors[i]))		result = idSelector(selectors[i], obj);
		// 根据class查找
		else if (classRe.test(selectors[i]))	result = classSelector(selectors[i], obj);
		// 根据属性查找
		else if (attrRe.test(selectors[i]))	result = attrSelector(selectors[i], obj);
		//根据tagName查找
		else result = tagNameSelector(selectors[i], obj);
		
		obj = result;
	}
	return result;
}

// 根据id查找
function idSelector(selector, obj) {
	var result = null;
	var selectStr = selector.substring(1);
	result = obj.getElementById(selectStr);
	return result;
}
// 根据tagName查找，返回第一个匹配的元素
function tagNameSelector(selector, obj) {
	var result = null;
	result = obj.getElementsByTagName(selector);
	return result;
}
// 根据class查找，返回第一个匹配的元素
function classSelector(selector, obj) {
	var result = null;
	// console.log(selector);
	var selectStr = selector.substring(1);
	var allElements = obj.getElementsByTagName("*");
	for (var i = 0; i < allElements.length; i++) {
		// var elementClass = allElements[i].getAttribute("class");
		var elementClass = allElements[i].className;
		if (elementClass) { //class属性值非null
			if(elementClass.indexOf(selectStr) != -1) { //selecStr是的elementClass的子字符串
				result = allElements[i];
				break;
			}
		}
	}
	return result;
}
// 根据属性查找，返回第一个匹配的元素
function attrSelector(selector, obj) {
	var selectStr = selector.substring(1, selector.length-1);
	var attrName = selectStr.split(/\s*=\s*/)[0];
	var attrValue = selectStr.split(/\s*=\s*/)[1];
	var allElements = obj.getElementsByTagName("*");
	var result = null;
	if (attrValue == undefined) { //仅根据属性名查找
		for (var i = 0; i < allElements.length; i++) {
			if (allElements[i].getAttribute(attrName)) {
				result = allElements[i];
				break;
			}
		}
	} else { //根据属性值查找，不赋属性值但是出现"="的在这里找到，如type=""
		for (var i = 0; i < allElements.length; i++) {
			if (allElements[i].getAttribute(attrName) == attrValue) {
				result = allElements[i];
				break;
			}
		}
	}
	return result;
}
/**
 * @ 4.事件
 */
function addEvent(element, event, listener) {
	if (element.addEventListener) {
		element.addEventListener(event, listener, false);
	} else {
		element.attachEvent("on"+event, listener);
	}
}
// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, event, listener) {
	if (listener === undefined) {
		element['on' + event] = null;
	}
	else if (element.removeEventListener) {
		element.removeEventListener(event, listener, false);
	} else {
		element.detachEvent("on" + event, listener);
	}
}
// 实现对click事件的绑定
function addClickEvent(element, listener) {
	addEvent(element, "click", listener);
}
// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
	if (element.addEventListener) {
		element.addEventListener('keydown', function(event) {
			if (event.keyCode === 13) {
				listener();
			}
		},false);
	}
	else {
		element.attachEvent('onkeydown', function(event) {
			if (event.keyCode === 13) {
				listener();
			}
		});
	}
}

// 事件代理
function delegateEvent(element, tag, eventName, listener) {
	element['on' + eventName] = function(e) {
		e = e || window.event;
		var target = e.srcElement ? e.srcElement : e.target;
		if (target.nodeName.toLowerCase() == tag) {
			listener(e);
		}
	}
}
// 更完整的参考代码
function delegateEvent1(element, tag, eventName, listener) {
	addEvent(element, eventName, function(e){
		e = e || window.event;
		var target = e.srcElement ? e.srcElement : e.target;
		// 对标签进行代理
		if (tag.indexOf('.') === -1) {
			if (target.nodeName.toLowerCase() === tag) {
				listener(e);
			}
		}
		// 对类进行代理
		else {
			var targetClassName = target.className;
			var className = tag.replace('.', '');
			if (targetClassName.indexOf(className) !== -1) {
				listener(e);
			}
		}
	});
}
/* @事件函数封装--------------------*/
$.on = function(selector, event, listener) {
	var element = $(selector);
	if (element) {
		addEvent(element, event, listener);
	}
}
$.click = function(selector, listener) {
	var element = $(selector);
	if (element) {
		addClickEvent(element, listener);
	}
}
$.un = function(selector, event, listener) {
	var element = $(selector);
	if (element) {
		removeEvent(element, event, listener);
	}
}
$.delegate = function(selector, tag, event, listener) {
	var element = $(selector);
	if (element) {
		delegateEvent(element, tag, event, listener);
	}
}
/* @ 5.BOM----------------------------------------------------------------------*/
// 判断是否为IE浏览器，返回-1或者版本号
// 参考别人
function isIE() {
    //navigator有四个主要的属性
    //appName:web浏览器全称，ie中，这就是microsoft internet explorer；firefox和其他浏览器也取值为netscape
    //appVersion:此属性通常数字开始，包含浏览器厂商和版本信息的详细字符串。但没有标准格式，没法直接用来判断
    //userAgent:浏览器在user-agent http头部中发送的字符串，没有标准格式。但包含绝大部分信息，因此浏览器弹休代码通常用它来嗅探
    //platform:自欺上运行浏览器的操作系统（并且可能是硬件）的字符串。
    return (function() {
        var s = navigator.userAgent.toLowerCase();
        //ie 10以前版本号在msie后，11则在rv后
        var match = /(msie)\s(\d+.\d)/.exec(s) || /(rv):(\d+.\d)/.exec(s);
        if(match) {
            return match[2];
        }
        else {
            return -1;
        }
    })();
}
// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
	var d = new Date();
	d.setTime(d.getTime() + (expiredays*24*60*60*1000));
	var expires = "expires" + d.toGMTString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expires;
}
// 获取cookie值
function getCookie(cookieName) {
	var name = cookieName + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == " ") 	c = c.substring(1);
		if (c.indexOf(name) != -1)  return c.substring(name.length, c.length);
	}
	return "";
}
/**
 * @ 6.Ajax----------------------------------------------------------------------
 */
// 创建XHR对象
function createXHR() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
	else if (typeof ActiveXObject != 'undefined') {
		var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
		var i, len;
		for (i = 0, len = versions.length; i < len; i++) {
			try {
				new ActiveXObject(versions[i]);
				arguments.callee.activeXString = versions[i];
				break;
			} catch (ex) {
				//跳过
			}
		}
		return new ActiveXObject(arguments.callee.activeXString);
	}
	else {
		throw new Error('No XHR object available.');
	}
}
function ajax(url, options) {
	var xhr = createXHR();
	var type = options.type;
	// 未指定类型，默认get
	if (!type) {
		type = 'get';
	}
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				options.onsuccess(xhr.responseText, xhr);
			}
			else {
				options.onfail(xhr);
			}
		}
	};
	if (type == "get") {
		var theUrl = url + '?';
		for (var p in options.data) {
			theUrl += p + '=' + options.data[p] + '&';
		}
		theUrl = theUrl.slice(0, theUrl.length-1);
		xhr.open(type, theUrl, true);
		xhr.send(null);
	}
	else if (type == "post") {
		var theData = '';
		for (var p in options.data) {
			theData += p + '=' + options.data[p] + '&';
		}
		theData = theData.slice(0, theData.length-1);
		xhr.open(type, url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(theData);
	}
}