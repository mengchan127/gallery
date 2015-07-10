var wrapper_left = $('#wrapper-left');
var wrapper_right = $('#wrapper-right');
var wraps_l = wrapper_left.getElementsByTagName('div');
var wraps_r = wrapper_right.getElementsByTagName('div');

// 先把各个wrap改为absolute
addPos(wraps_l);
addPos(wraps_r);

bindDrag(wrapper_left, wrapper_right);
bindDrag(wrapper_right, wrapper_left);

// 使用事件代理，为各wrap绑定drag事件
function bindDrag (nowParent, targetParent) {
	nowParent.onmousedown = function (e) {
		e = e || window.e;
		var target = e.srcElement ? e.srcElement : e.target;

		if (target.className.toLowerCase() === 'wrap') {
			target.style.background = '#D4B4B4';
			// target z-index 升高
			target.style.zIndex = 99;

			// 鼠标相对wrap左上角的距离
			var disX = e.clientX - target.offsetLeft;
			var disY = e.clientY - target.offsetTop;

			// 鼠标移动
			document.onmousemove = function (e) {
				e = e || window.e;
				target.style.left = e.clientX - disX + 'px';
				target.style.top = e.clientY - disY + 'px';

				// 检测是不是可释放位置
				if (isReleasePos(target, targetParent)) {
					target.innerHTML = '可以释放鼠标啦';
				}
				else {
					target.innerHTML = '';
				}
			};

			// 左键释放
			document.onmouseup = function (e) {
				e = e || window.e;
				if (isReleasePos(target, targetParent)) {
					targetParent.appendChild(target);
					target.style.background = '#C964CF';
				}
				else {
					nowParent.appendChild(target);
					target.style.background = 'pink';
				}

				removePos(targetParent);
				removePos(nowParent);

				target.innerHTML = '';
				target.style.zIndex = 0;

				// 置空
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
	}
}

// position改为absolute
function addPos (wraps) {
	var arr = [];
	var i;
	var len = wraps.length;
	for (i = 0; i < len; i++) {
		arr.push([wraps[i].offsetLeft, wraps[i].offsetTop]);
	}
	for (i = 0; i < len; i++) {
		wraps[i].style.position = 'absolute';
		wraps[i].style.left = arr[i][0] + 'px';
		wraps[i].style.top = arr[i][1] + 'px';
	}
}
// 去除absolute
function removePos (wrapper) {
	var wraps = wrapper.getElementsByTagName('div');
	for (var i = 0, len = wraps.length; i < len; i++) {
		wraps[i].style.position = '';
	}
	addPos(wraps);
}

// 释放位置判定
function isReleasePos(wrap, parent) {
	var minL = parent.offsetLeft - wrap.offsetWidth;
	var maxL = parent.offsetLeft + parent.offsetWidth;
	var minT = parent.offsetTop - wrap.offsetHeight;
	var maxT = parent.offsetTop + parent.offsetHeight;

	if (wrap.offsetLeft >= minL && wrap.offsetLeft <= maxL && wrap.offsetTop >= minT && wrap.offsetTop <= maxT){
		return true;
	}
	else {
		return false;
	}
}
// 窗口大小调整时，保证wrap和wrapper的相对位置不变
window.onresize = function () {
	removePos(wrapper_left);
	removePos(wrapper_right);
}