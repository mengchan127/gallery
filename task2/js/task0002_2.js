var endDate = $('#endDate');
var arr = [];
var p = $('#tip');
function countDown() {
	var endStr = endDate.value;
	arr = endStr.split('-');
	var end = new Date(endStr); // 截止时间
	var start = new Date(); // 现在时间
	if (start >= end) {
		return false;
	}
	// ms => s
	var left = Math.floor((end - start)/1000);
	var d = Math.floor(left / (3600*24));
	var h = Math.floor((left - d*3600*24)/3600);
	var m = Math.floor((left - d*3600*24 - h*3600)/60);
	var s = left % 60;

	p.innerHTML = ''
	              + '距离' 
	              + arr[0]
	              + '年'
	              + arr[1]
	              + '月'
	              + arr[2]
	              + '日'
	              + '还有'
	              + d
	              + '天'
	              + h
	              + '小时'
	              + m
	              + '分'
	              + s
	              + '秒。';
}
function clickListener() {
	var timer = setInterval('countDown()',200);
	if (!countDown) {
		clearInterval(timer);
	}
}
$.click('#btn', clickListener);
