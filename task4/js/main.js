window.onload = function () {
	// 页面显示状态标志，0-分类列表页面，1-任务列表页面，2-任务信息列表
	var flag = 0;
	var title = document.getElementById('title');
	var mainer = document.getElementById('mainer');
	var goback = document.getElementById('goback');

	// 分类列表
	var sorts = getData('sorts');
	// 当前分类下的任务列表
	var curTasks = [];
	// 当前分类名
	var curSort;
	// window.localStorage.clear();
	
	initLocalStorage();

	mainer.innerHTML = '<ul>';
	for (var i = 0, len = sorts.length; i < len; i++) {
		mainer.innerHTML += '<li>' + sorts[i] + '</li>';
	}
	mainer.innerHTML += '</ul>';

	addEvent(mainer, 'click', tapSort);
	addEvent(goback, 'click', tapBack);

	function tapSort(e) {
		e = e || window.e;
		var target = e.target ? e.target : e.srcElement;
		if (target.nodeName.toLowerCase() === 'li' && flag === 0) {
			curSort = target.innerHTML;
			curTasks = [];
			var tasks = getData('tasks');
			for (var i = 0, len = tasks.length; i < len; i++) {
				if (curSort === tasks[i].class) {
					curTasks.push(tasks[i].name);
				}
			}
			mainer.innerHTML = '<ul>';
			for (var i = 0, len = curTasks.length; i < len; i++) {
				mainer.innerHTML += '<li>' + curTasks[i] + '</li>';
			}
			mainer.innerHTML += '</ul>';

			title.innerHTML = curSort;
			flag = 1;
			changeBack();
			addEvent(mainer, 'click', tapTask);
		}
	}

	function tapTask(e) {
		e = e || window.e;
		var target = e.target ? e.target : e.srcElement;
		if (target.nodeName.toLowerCase() === 'li' && flag === 1) {
			var taskName = target.innerHTML;
			var tasks = getData('tasks');
			var result;

			for (var i = 0, len = tasks.length; i < len; i++) {
				if (tasks[i].name === taskName) {
					result = tasks[i];
					break;
				}
			}

			title.innerHTML = taskName;
			mainer.innerHTML = '<div id="task-title">' + result.name + '</div>';
			mainer.innerHTML += '<div id="task-date">' + result.date + '</div>';
			mainer.innerHTML += '<div id="task-content">' + result.content + '</div>';

			flag = 2;
			changeBack();
		} 
	}

	function tapBack() {
		flag--;
		changeBack();
		if (flag === 0) {
			title.innerHTML = 'to-do';

			mainer.innerHTML = '<ul>';
			for (var i = 0, len = sorts.length; i < len; i++) {
				mainer.innerHTML += '<li>' + sorts[i] + '</li>';
			}
			mainer.innerHTML += '</ul>';

			removeEvent(mainer, 'click', tapTask);
		}
		else if (flag === 1) {
			title.innerHTML = curSort;

			mainer.innerHTML = '<ul>';
			for (var i = 0, len = curTasks.length; i < len; i++) {
				mainer.innerHTML += '<li>' + curTasks[i] + '</li>';
			}
			mainer.innerHTML += '</ul>';
		}
	}

	function changeBack() {
		if (flag) {
			goback.innerHTML = '< 返回';
		}
		else {
			goback.innerHTML = '';
		}
	}
};

function initLocalStorage() {
	// 判断是否支持localStorage
	if (!window.localStorage) {
		return;
	}
	var storage = window.localStorage;
	// 分类列表
	if (!storage.sorts) {
		var sorts = ["默认分类", "论文工作", "项目任务", "生活安排", "其他"];
		storage.setItem('sorts', JSON.stringify(sorts));
	}

	// 全部任务信息
	if (!storage.tasks) {
		var tasks = [
						{
							name: "todo 1",
							class: "默认分类",
							date: "2015-05-08",
							content: "好好学习，天天向上"
						},
						{
							name: "todo 2",
							class: "默认分类",
							date: "2015-05-09",
							content: "开心学习"
						},
						{
							name: "todo 3",
							class: "论文工作",
							date: "2015-05-18",
							content: "小论文计划"
						},
						{
							name: "todo 4",
							class: "项目任务",
							date: "2015-06-08",
							content: "TO-DO"
						},
						{
							name: "todo 5",
							class: "生活安排",
							date: "2015-05-28",
							content: "平静内心，宽容淡定"
						},
						{
							name: "todo 6",
							class: "其他",
							date: "2015-05-29",
							content: "愿无岁月可回首，且以深情度余生。"
						},
						{
							name: "todo 7",
							class: "其他",
							date: "2015-05-08",
							content: "越努力，越幸运！"
						}
					];
		storage.setItem('tasks', JSON.stringify(tasks));
	}
}

function getData(key) {
	// 属性未定义，返回null
	if (window.localStorage[key] === undefined) {
		return null;
	}
	var result = window.localStorage.getItem(key);
	result = JSON.parse(result);
	return result;
}

function addEvent(element, event, listener) {
	if (element.addEventListener) {
		element.addEventListener(event, listener, false);
	}
	else {
		element.attachEvent('on'+event, listener);
	}
}

function removeEvent(element, event, listener) {
	if (listener === undefined) {
		element['on'+event] = null;
	}
	else if (element.removeEventListener) {
		element.removeEventListener(event, listener, false);
	}
	else {
		element.detachEvent("on" + event, listener);
	}
}
