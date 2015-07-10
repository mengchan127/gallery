/**************************************************************************
 * 全局变量
 *************************************************************************/
// 当前的“一级分类”
var curClass = 'default';
// 当前的“二级分类”
var curSubclass; 
// class="rmclass"的所有元素
var rmclass;
// 内容区显示的任务
var defTask;
// 要显示的任务集
var myTasks;
// 是否处于修改任务状态。默认否
var isRewriting = false;

/*************************************************************************
 * window.onload
 ************************************************************************/
window.onload = function() {
	if (initLocalStorage() === false) {
		return;
	}
	var storage = window.localStorage;
	// 获取页面布局初始数据
	var totalNum = parseInt(storage.totalNum);
	var defaultNum = parseInt(storage.defaultNum);
	var sortList = getData('sortList'); // 不包括“默认分类”
	var defaultTasks = getData('defaultTasks');
	// 所有未完成任务总数
	$('#total-num').innerHTML = totalNum;
	// 默认分类下未完成任务总数
	$('#default-num').innerHTML = defaultNum;

	/* 分类栏分类列表 */
	var listWrap = $('#list-wrap');
	for (var i = 0, len = sortList.length; i < len; i++) {
		// 过滤掉二级分类
		if (!sortList[i].parent) {
			var dl = document.createElement('dl');
			// 为每个dl设置data-name属性，值为分类名
			dl.setAttribute('data-name', sortList[i].name);
			var dt = document.createElement('dt');
			dt.setAttribute('data-state','');
			dt.innerHTML = sortList[i].name + ' (<span>' + sortList[i].num + '</span>)' + '<div class="rmclass" data-name=' + sortList[i].name + '></div>';
			dl.appendChild(dt);
			listWrap.appendChild(dl);
		}
	}

	/* 为内容区显示做准备，defTask保存第一个未完成任务的详细信息 */
	var flag = false;
	// 任务栏
	var taskbarContent = $('#taskbar-content');
	defaultTasks = clusterData('date', defaultTasks);
	for (var i = 0, len = defaultTasks.length; i < len; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		dt.innerHTML = defaultTasks[i][0];
		dl.appendChild(dt);
		for (var j = 1, l = defaultTasks[i].length; j < l; j++) {
			var dd = document.createElement('dd');
			if (defaultTasks[i][j].state === 'done') {
				dd.className = 'done';
			} else if (!flag && defaultTasks[i][j].state !== 'done') {
				defTask = defaultTasks[i][j];
				flag = true;
				dd.className = 'choosed';
			}
			dd.innerHTML = defaultTasks[i][j].name;
			dl.appendChild(dd);
		}
		taskbarContent.appendChild(dl);
	}

	/* 内容区，默认显示第一个undone任务 */
	if (!!defTask) {
		$('#task-title').innerHTML = defTask.name;
		$('#task-date').innerHTML = defTask.date;
		$('#task-content').innerHTML = '<p>' + defTask.content + '</p>';
	}

	myTasks = defaultTasks;

	// 绑定删除分类事件，每次更新分类列表都重新绑定一次
	bindRemove();
}; 

// 获取rmclass元素，并为它们绑定click事件
function bindRemove () {
	rmclass = document.querySelectorAll('.rmclass');
	for (var k = 0, lenk = rmclass.length; k < lenk; k++) {
		var target = rmclass[k];
		target.onclick = removeClassFunc;
	}
}
function removeClassFunc () {
	var str = '确定要删除该分类及分类下的所有任务？';
	displayFloat(str);
	var name = this.getAttribute('data-name');
	$('#confirmed').onclick = function () {
		var count = 0;
		var parent;
		var allTasks = getData('allTasks');
		var sortList = getData('sortList');

		// 处理分类列表sortList
		for (var i = 0, len = sortList.length; i < len; i++) {
			if (sortList[i].name === name) {
				count = sortList[i].num;
				parent = sortList[i].parent;
				sortList.splice(i, 1);
				break;
			}
		}
		// 如果删除的是二级分类，则修改一级分类“未完成任务数”
		if (parent) {
			for (i = 0, len = sortList.length; i < len; i++) {
				if (sortList[i].name === parent) {
					sortList[i].num = sortList[i].num - count;
					break;
				}
			}
		}
		window.localStorage.removeItem('sortList');
		saveData('sortList', sortList);

		// 处理totalNum
		var totalNum = window.localStorage.totalNum;
		totalNum = totalNum - count;
		window.localStorage.totalNum = totalNum;

		// 处理allTasks
		var temp = [];
		if (!parent) {
			for (var j = 0, len1 = allTasks.length; j < len1; j++) {
				if (allTasks[j].class != name) {
					temp.push(allTasks[j]);
				}
			}
		}
		else {
			for (var j = 0, len1 = allTasks.length; j < len1; j++) {
				if (allTasks[j].subclass != name) {
					temp.push(allTasks[j]);
				}
			}
		}
		
		window.localStorage.removeItem('allTasks');
		saveData('allTasks', temp);
		closeFloat();
		window.location.reload();
	}
	
}

/****************************************************************************
 * 事件处理
 ****************************************************************************/
// 点击分类列表
$('#sort-list').onclick = function() {
	if (this.className === 'changebg') {
		this.className = '';
	} else {
		this.className = 'changebg';
		curClass = 'sortList';
	}
}
// 点击改变布局，并设置curClass、curSubclass全局变量的值,事件代理
$('#list-wrap').onclick = function(e) {
	e = e || window.e;
	var target = e.target ? e.target : e.srcElement;
	var taskbarContent = $('#taskbar-content');

	// 默认选中“所有”
	$('#all').className = 'selected';
	$('#undone').className = '';
	$('#done').className = '';

	$('#show-task').style.display = 'block';
	$('#edit-task').style.display = 'none';

	/* 一级分类 */
	if (target.nodeName.toLowerCase() === 'dt') {
		// 先清空任务栏列表
		while (taskbarContent.lastChild) {
			taskbarContent.removeChild(taskbarContent.lastChild);
		}
		myTasks = [];
		defTask = '';
		$('#sort-list').className = '';
		
		// 默认列表 单独处理
		if (target.id === 'default') {
			curClass = 'default';
			if (target.getAttribute('data-state') == 'open') {
				target.setAttribute('data-state', '');
				target.className = '';
				$('#taskbar-content').style.display = 'none';
				$('#task-title').innerHTML = '任务名称';
				$('#task-date').innerHTML = null;
				$('#task-content').innerHTML = null;
			}
			else {
				target.setAttribute('data-state', 'open');
				target.className = 'cur-class';
				$('#taskbar-content').style.display = 'block';
			}

			// 获取默认分类下的所有任务，显示在列表中
			var defaultTasks = getData('defaultTasks');
			myTasks = clusterData('date', defaultTasks);
		} 
		// 其他列表
		else {
			var sortName = target.innerHTML;
			sortName = sortName.split('(')[0];
			sortName = trim(sortName);
			curClass = sortName;
			var parent = findDl(sortName);
			// 分类当下的状态是打开，单击时关闭该分类
			if (target.getAttribute('data-state') == 'open') {
				while (parent.lastChild.nodeName.toLowerCase() === 'dd') {
					parent.removeChild(parent.lastChild);
				}
				target.setAttribute('data-state', '');
				target.className = '';
				// 只有在分类打开的情况下才选中该分类，才能为其添加子类
				curClass = null;
				$('#taskbar-content').style.display = 'none';
				$('#task-title').innerHTML = '任务名称';
				$('#task-date').innerHTML = null;
				$('#task-content').innerHTML = null;
			}
			// 分类当下的状态是非打开，单击时打开该分类
			else {
				var subclass = findSubclass(sortName);
				for (var i = 0, len = subclass.length; i < len; i++) {
					var dd = document.createElement('dd');
					dd.setAttribute('data-name', subclass[i].name);
					dd.innerHTML =   subclass[i].name
								   + ' (<span>' + subclass[i].num + '</span>)'
								   + '<div class="rmclass" data-name=' + subclass[i].name + '></div>';
					dd.style.display = 'block';
					parent.appendChild(dd);
				}
				target.setAttribute('data-state', 'open');
				target.className = 'cur-class';

				// 分类列表内容
				var allTasks = getData('allTasks');
				
				for (var i = 0, len = allTasks.length; i < len; i++) {
					if (allTasks[i].class === curClass) {
						myTasks.push(allTasks[i]);
					}
				}
				myTasks = clusterData('date', myTasks);
				$('#taskbar-content').style.display = 'block';

				bindRemove();
			}
		}
	}
	/* 二级分类 */
	else if (target.nodeName.toLowerCase() === 'dd') {
		myTasks = [];
		defTask = '';
		// 先清空任务栏列表
		while (taskbarContent.lastChild) {
			taskbarContent.removeChild(taskbarContent.lastChild);
		}

		curSubclass = target.innerHTML.split('(')[0];
		curSubclass = trim(curSubclass);

		curClass = findParent(curSubclass);

		var dds = $('#list-wrap').getElementsByTagName('dd');
		for (var i = 0, len =dds.length; i < len; i++) {
			if (dds[i].className === 'curSubclass'){
				dds[i].className = '';
				break;
			}
		}
		target.className = 'curSubclass';

		// 分类列表内容
		var allTasks = getData('allTasks');
		for (var i = 0, len = allTasks.length; i < len; i++) {
			if (allTasks[i].subclass === curSubclass && allTasks[i].class === curClass) {
				myTasks.push(allTasks[i]);
			}
		}
		myTasks = clusterData('date', myTasks);
		$('#taskbar-content').style.display = 'block';
	}
	// 显示任务列表
	if (target.nodeName.toLowerCase() === 'dt' || target.nodeName.toLowerCase() === 'dd') {


	var flag = false;
	for (var i = 0, len = myTasks.length; i < len; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		dt.innerHTML = myTasks[i][0];
		dl.appendChild(dt);
		for (var j = 1, l = myTasks[i].length; j < l; j++) {
			var dd = document.createElement('dd');
			if (myTasks[i][j].state === 'done') {
				dd.className = 'done';
			} 
			else if (!flag && myTasks[i][j].state !== 'done') {
				defTask = myTasks[i][j];
				flag = true;
				dd.className = 'choosed';
			}
			dd.innerHTML = myTasks[i][j].name;
			dl.appendChild(dd);
		}
		taskbarContent.appendChild(dl);
	}
	/* 内容区，默认显示第一个undone任务 */
	if (!defTask && $('#taskbar-content').style.display === 'none') {
		$('#task-title').innerHTML = '任务名称';
		$('#task-date').innerHTML = null;
		$('#task-content').innerHTML = null;
	}
	else if (!!defTask && $('#taskbar-content').style.display === 'block') {
		$('#task-title').innerHTML = defTask.name;
		$('#task-date').innerHTML = defTask.date;
		$('#task-content').innerHTML = '<p>' + defTask.content + '</p>';
	}}
}
//// 点击“所有”、“未完成”、“已完成”时的显示
$('#all').onclick = function () {
	$('#all').className = 'selected';
	$('#undone').className = '';
	$('#done').className = '';

	var taskbarContent = $('#taskbar-content');

	while (taskbarContent.lastChild) {
		taskbarContent.removeChild(taskbarContent.lastChild);
	}
	var showTasks = myTasks;
	var flag = false;
	defTask = '';
	for (var i = 0, len = showTasks.length; i < len; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		dt.innerHTML = showTasks[i][0];
		dl.appendChild(dt);
		for (var j = 1, l = showTasks[i].length; j < l; j++) {
			var dd = document.createElement('dd');
			if (showTasks[i][j].state === 'done') {
				dd.className = 'done';
			} 
			else if (!flag && showTasks[i][j].state !== 'done') {
				defTask = showTasks[i][j];
				flag = true;
				dd.className = 'choosed';
			}
			dd.innerHTML = showTasks[i][j].name;
			dl.appendChild(dd);
		}
		taskbarContent.appendChild(dl);
	}
	if (!defTask) {
		$('#task-title').innerHTML = '任务名称';
		$('#task-date').innerHTML = null;
		$('#task-content').innerHTML = null;
	}
	else if (!!defTask && $('#taskbar-content').style.display === 'block') {
		$('#task-title').innerHTML = defTask.name;
		$('#task-date').innerHTML = defTask.date;
		$('#task-content').innerHTML = '<p>' + defTask.content + '</p>';
	}
}
$('#undone').onclick = function () {
	$('#all').className = '';
	$('#undone').className = 'selected';
	$('#done').className = '';

	var taskbarContent = $('#taskbar-content');

	while (taskbarContent.lastChild) {
		taskbarContent.removeChild(taskbarContent.lastChild);
	}

	var showTasks = myTasks;
	var flag = false;
	defTask = '';
	for (var i = 0, len = showTasks.length; i < len; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		dt.innerHTML = showTasks[i][0];
		dl.appendChild(dt);

		for (var j = 1, l = showTasks[i].length; j < l; j++) {
			var dd = document.createElement('dd');
			if (!flag && showTasks[i][j].state === 'undone') {
				dd.innerHTML = showTasks[i][j].name;
				dl.appendChild(dd);

				defTask = showTasks[i][j];
				flag = true;
				dd.className = 'choosed';
			} 
			else if (showTasks[i][j].state === 'undone') {
				dd.innerHTML = showTasks[i][j].name;
				dl.appendChild(dd);
			}
		}
		if (dl.lastChild.nodeName.toLowerCase() === 'dd') {
			taskbarContent.appendChild(dl);
		}
	}
	if (!defTask) {
		$('#task-title').innerHTML = '任务名称';
		$('#task-date').innerHTML = null;
		$('#task-content').innerHTML = null;
	}
	else if (!!defTask && $('#taskbar-content').style.display === 'block') {
		$('#task-title').innerHTML = defTask.name;
		$('#task-date').innerHTML = defTask.date;
		$('#task-content').innerHTML = '<p>' + defTask.content + '</p>';
	}
}
$('#done').onclick = function () {
	$('#all').className = '';
	$('#undone').className = '';
	$('#done').className = 'selected';

	var taskbarContent = $('#taskbar-content');

	while (taskbarContent.lastChild) {
		taskbarContent.removeChild(taskbarContent.lastChild);
	}

	var showTasks = myTasks;
	var flag = false;
	defTask = '';
	for (var i = 0, len = showTasks.length; i < len; i++) {
		var dl = document.createElement('dl');
		var dt = document.createElement('dt');
		dt.innerHTML = showTasks[i][0];
		dl.appendChild(dt);

		for (var j = 1, l = showTasks[i].length; j < l; j++) {
			var dd = document.createElement('dd');
			if (!flag && showTasks[i][j].state === 'done') {
				dd.innerHTML = showTasks[i][j].name;
				dl.appendChild(dd);

				defTask = showTasks[i][j];
				flag = true;
				dd.className = 'choosed done';
			} 
			else if (showTasks[i][j].state === 'done') {
				dd.innerHTML = showTasks[i][j].name;
				dd.className = 'done';
				dl.appendChild(dd);
			}
		}
		if (dl.lastChild.nodeName.toLowerCase() === 'dd') {
			taskbarContent.appendChild(dl);
		}
	}
	if (!defTask) {
			$('#task-title').innerHTML = '任务名称';
			$('#task-date').innerHTML = null;
			$('#task-content').innerHTML = null;
		}
		else if (!!defTask && $('#taskbar-content').style.display === 'block') {
			$('#task-title').innerHTML = defTask.name;
			$('#task-date').innerHTML = defTask.date;
			$('#task-content').innerHTML = '<p>' + defTask.content + '</p>';
		}
}

// 点击“新增分类”
$('.sortbar-footer').onclick = function () {
	if (curClass === null) {
		alert('请先选择分类！');
	}
	else if (curClass === 'default') {
		alert('不能为“默认分类”添加子类！');
	} 
	else {
		var str = '<p>分类名：' + '<input type="text" placeholder="不超过12个字" id="input-name">' + '</p>';
		displayFloat(str);
		var inputName = '';
		$('#confirmed').onclick = function () {
			inputName = $('#input-name').value;
			if (inputName !== '') {
				if (inputName.length <= 12) {
					// 给“分类列表”添加分类
					if (curClass === 'sortList') {
						// 检查名字在当前分类下是否唯一
						if (checkUnique(inputName, 'sortList')) {
							var temp = {
								'name': inputName,
								'num': 0
							};
							if (saveData('sortList', temp)) {
								var listWrap = $('#list-wrap');
								var dl = document.createElement('dl');
								dl.setAttribute('data-name', inputName);
								var dt = document.createElement('dt');
								dt.innerHTML = inputName + ' (<span>0</span>)' + '<div class="rmclass" data-name=' + inputName + '></div>';
								dl.appendChild(dt);
								listWrap.appendChild(dl);
							}
							closeFloat();
						} 
						else {
							alert('分类列表中已有该名字');
						}
					}
					// 给“默认分类”以外的分类添加分类
					else {
						// 检查分类名是否唯一
						// var subclass = findSubclass(curClass);
						// if (subclass.length !== 0 && !checkName(inputName, subclass)) {
						if (!checkUnique(inputName, 'sortList')) {
							alert('分类列表中已有该名字');
						}
						else {
							temp = {
								'name': inputName,
								'num': 0,
								'parent': curClass
							};
							if (saveData('sortList', temp)) {
								// 根据分类名查找dl
								var parent = findDl(curClass);
								var dd = document.createElement('dd');
								dd.setAttribute('data-name', inputName);
								dd.innerHTML =   inputName
											   + ' (<span>0</span>)'
											   + '<div class="rmclass" data-name=' + inputName + '></div>';
								dd.style.display = 'block';
								parent.appendChild(dd);
								closeFloat();
							}
						}
					}
				} 
				else {
					alert('名称不能超过12个字');
				}
			}
		};
	}
};
$('#cancled').onclick = closeFloat;
$('.close').onclick = closeFloat;

// 点击“新增任务”
$('.taskbar-footer').onclick = function () {
	if (curClass !== 'sortList') {
		curSubclass = curSubclass || curClass;
		$('#show-task').style.display = 'none';
		$('#edit-task').style.display = 'block';
	}
}
// 名字超过12个字显示span
var flagArr = [1, 1, 1];
$('#in-title').onkeyup = function () {
	var title = $('#in-title').value;
	if (title.length > 12) {
		$('#tip1').innerHTML =   '<span class="tip">'
							   + '不能超过12个字'
							   + '</span>';
		$('#tip1').style.display = 'block';
		flagArr[0] = 0;
	}
	else {
		$('#tip1').style.display = 'none';
		flagArr[0] = 1;
	}
}
// 检测命名是否重复, 所有任务全部不重名
$('#in-title').onchange = function () {
	var title = $('#in-title').value;
	if (!checkUnique(title, 'defaultTasks') || !checkUnique(title, 'allTasks')) {
		$('#tip1').innerHTML =   '<span class="tip">'
							   + '该名字已存在'
							   + '</span>';
		$('#tip1').style.display = 'block';
		flagArr[0] = 0;
	}
}
// 检测日期格式
$('#in-date').onchange = function () {
	var date = $('#in-date').value;
	var re = /^20[1-9][5-9]-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
	if (!re.test(date)) {
		$('#tip2').innerHTML =   '<span class="tip">'
							   + '格式错误，正确格式：yyyy-mm-dd'
							   + '</span>';
		$('#tip2').style.display = 'block';
		flagArr[1] = 0;
	}
	else {
		$('#tip2').style.display = 'none';
		flagArr[1] = 1;
	}
}
// 内容区剩余字数输出
$('#in-content').onkeyup = function () {
	var content = $('#in-content').value;
	var wordNum = $('#word-num');
	
	wordNum.innerHTML = 400 - content.length;
	if (content.length > 400) {
		wordNum.style.color = 'red';
		flagArr[2] = 0;
	}
	else {
		wordNum.style.color = '#666';
		flagArr[2] = 1;
	}
}

$('#finish-edit').onclick = function () {
	// 检查名字不为空
	var title = $('#in-title').value;
	if (title.length === 0) {
		$('#tip1').innerHTML =   '<span class="tip">'
							   + '不能为空'
							   + '</span>';
		$('#tip1').style.display = 'block';
		flagArr[0] = 0;
	}
	// 在检查一下是否重名
	if (!checkUnique(title, 'defaultTasks') || !checkUnique(title, 'allTasks')) {
		$('#tip1').innerHTML =   '<span class="tip">'
							   + '该名字已存在'
							   + '</span>';
		$('#tip1').style.display = 'block';
		flagArr[0] = 0;
	}
	// 检查日期不为空
	var date = $('#in-date').value;
	if (date.length === 0) {
		$('#tip2').innerHTML =   '<span class="tip">'
							   + '不能为空'
							   + '</span>';
		$('#tip2').style.display = 'block';
		flagArr[1] = 0;
	}
	// 检查内容不能为空
	var content = $('#in-content').value;
	if (content.length === 0) {
		alert('内容不能为空');
		flagArr[2] = 0;
	}
	// 检查日期格式，以及日期必须是未来时间
	// 以上条件都满足了，显示浮层
	if (flagArr[0] && flagArr[1] && flagArr[2]) {
		var str = '完成编辑并保存？';
		displayFloat(str);
		$('#confirmed').onclick = function () {
			if (curClass === 'sortList') {
				alert('请选择分类');
				closeFloat();
				return;
			}
			// 修改所有未完成任务总数
			if (!isRewriting) {
				var totalNum = parseInt(window.localStorage.totalNum);
				totalNum = totalNum + 1;
				window.localStorage.totalNum = totalNum;
			}
			
			// default class
			if (curClass === 'default') {
				if (!isRewriting) {
					var defaultNum = parseInt(window.localStorage.defaultNum);
					defaultNum = defaultNum + 1;
					window.localStorage.defaultNum = defaultNum;
				}
				var task = {
					'date': date,
					'name': title,
					'state': 'undone',
					'content': content,
				};
				saveData('defaultTasks', task);
			}
			else {
				var task = {
					'date': date,
					'name': title,
					'state': 'undone',
					'content': content,
					'subclass': curSubclass,
					'class': curClass
				};
				saveData('allTasks', task);
				if (!isRewriting) {
					// 修改大分类未完成任务数
					var sortList = getData('sortList');
					for (var i = 0, len = sortList.length; i < len; i++) {
						if (sortList[i].name === curClass && !sortList[i].parent) {
							sortList[i].num += 1;
							break;
						}
					}
					window.localStorage.removeItem('sortList');
					saveData('sortList', sortList);
					// 修改小分类未完成任务数
					if (curClass !== curSubclass) {
						for (var i = 0, len = sortList.length; i < len; i++) {
							if (sortList[i].name === curSubclass && sortList[i].parent === curClass) {
								sortList[i].num += 1;
								break;
							}
						}
						window.localStorage.removeItem('sortList');
						saveData('sortList', sortList);
					}
				}
			}
			closeFloat();
			if (isRewriting) {
				isRewriting = false;
			}
			// 添加完数据，重新加载下页面
			window.location.reload();
		}
	}
}
$('#cancel-edit').onclick = function () {
	if (isRewriting) {
		if (curClass === 'default') {
			saveData('defaultTasks', defTask);
		}
		else {
			saveData('allTasks', defTask);
		}
		isRewriting = false;
	}
	window.location.reload();
}

// 点击任务名，显示任务内容
$('#taskbar-content').onclick = function (e) {
	e = e || window.e;
	var target = e.target ? e.target : e.srcElement;
	if (target.nodeName.toLowerCase() === 'dd') {
		var name = target.innerHTML;
		var tasks = [];
		var temp;
		if (curClass === 'default') {
			tasks = getData('defaultTasks');
		} 
		else if (curClass !== 'sortList') {
			tasks = getData('allTasks');
		}
		for (var i = 0, len = tasks.length; i < len; i++) {
			if (tasks[i].name === name) {
				temp = tasks[i];
				break;
			}
		}
		if (!!temp) {
			$('#task-title').innerHTML = temp.name;
			$('#task-date').innerHTML = temp.date;
			$('#task-content').innerHTML = '<p>' + temp.content + '</p>';

			defTask = temp;
			curSubclass = temp.subclass;
		}

		var dds = $('#taskbar-content').getElementsByTagName('dd');
		for (i = 0, len = dds.length; i < len; i++) {
			if (dds[i].className.indexOf('choosed') !== -1) {
				dds[i].className = dds[i].className.split('choosed')[0];
				break;
			}
		}
		target.className = target.className + ' choosed';
	}
}

// 将任务状态改为“done”，同时修改任务数量
$('#finish-task').onclick = function (e) {
	var str = '<p>确定已完成该任务？</p>';
	if (defTask === undefined || defTask.state === 'done') {
		str = '该任务已是完成状态';
	}
	displayFloat(str);
	$('#confirmed').onclick = function () {
		if (!!defTask && defTask.state === 'undone') {
			// 任务名
			var name = defTask.name;

			// 一级分类下的任务
			if (curSubclass === undefined) {
				// 默认分类下的任务
				if (curClass === 'default') {
					var defaultTasks = getData('defaultTasks');
					for (var i = 0, len = defaultTasks.length; i < len; i++) {
						if (defaultTasks[i].name === name) {
							defaultTasks[i].state = 'done';
						}
					}
					window.localStorage.removeItem('defaultTasks');
					saveData('defaultTasks', defaultTasks);
					window.localStorage.defaultNum = window.localStorage.defaultNum - 1;
				}
				// 其他分类下的任务
				else {
					var allTasks = getData('allTasks');
					var sortList = getData('sortList');
					for (var i = 0, len = allTasks.length; i < len; i++) {
						if (allTasks[i].name === name) {
							allTasks[i].state = 'done';
						}
					}
					for (var j = 0, len1 = sortList.length; j < len1; j++) {
						if (sortList[j].name === curClass) {
							sortList[j].num = sortList[j].num - 1;
						}
					}
					window.localStorage.removeItem('allTasks');
					saveData('allTasks', allTasks);
					window.localStorage.removeItem('sortList');
					saveData('sortList', sortList);
				}
			}
			// 二级分类下的任务
			else {
				var allTasks = getData('allTasks');
				var sortList = getData('sortList');
				for (var i = 0, len = allTasks.length; i < len; i++) {
					if (allTasks[i].name === name) {
						allTasks[i].state = 'done';
					}
				}
				for (var j = 0, len1 = sortList.length; j < len1; j++) {
					if (sortList[j].name === curSubclass && sortList[j].parent === curClass) {
						sortList[j].num = sortList[j].num - 1;
					}
					else if (sortList[j].name === curClass && sortList[j].parent === undefined) {
						sortList[j].num = sortList[j].num - 1;
					}
				}
				window.localStorage.removeItem('allTasks');
				saveData('allTasks', allTasks);
				window.localStorage.removeItem('sortList');
				saveData('sortList', sortList);
			}
			// 修改totalNum
			window.localStorage.totalNum = window.localStorage.totalNum - 1;
			// 重新载入页面
			window.location.reload();
		}
		else {
			closeFloat();
		}
	}
}
// 删除任务，同时修改任务数量
$('#remove-task').onclick = function () {
	var str = '<p>确定删除该任务？</p>';
	displayFloat(str);
	$('#confirmed').onclick = function () {
		var name = defTask.name;
		// 先修改任务列表
		if (curClass === 'default') {
			var defaultTasks = getData('defaultTasks');
			for (var i = 0, len = defaultTasks.length; i < len; i++) {
				if (defaultTasks[i].name === name) {
					defaultTasks.splice(i, 1);
					break;
				}
			}
			window.localStorage.removeItem('defaultTasks');
			saveData('defaultTasks', defaultTasks);
		}
		else {
			var allTasks = getData('allTasks');
			for (var i = 0, len = allTasks.length; i < len; i++) {
				if (allTasks[i].name === name) {
					allTasks.splice(i, 1);
					break;
				}
			}
			window.localStorage.removeItem('allTasks');
			saveData('allTasks', allTasks);
		}
		
		// 如果任务是'undone'状态，还要修改未完成任务数量
		if (defTask.state === 'undone') {
			// 一级分类下的任务
			if (curSubclass === undefined) {
				// 默认分类下的任务
				if (curClass === 'default') {
					window.localStorage.defaultNum = window.localStorage.defaultNum - 1;
				}
				// 其他分类下的任务
				else {
					var sortList = getData('sortList');
					for (var j = 0, len1 = sortList.length; j < len1; j++) {
						if (sortList[j].name === curClass) {
							sortList[j].num = sortList[j].num - 1;
						}
					}
					window.localStorage.removeItem('sortList');
					saveData('sortList', sortList);
				}
			}
			// 二级分类下的任务
			else {
				var sortList = getData('sortList');
				for (var j = 0, len1 = sortList.length; j < len1; j++) {
					if (sortList[j].name === curSubclass && sortList[j].parent === curClass) {
						sortList[j].num = sortList[j].num - 1;
					}
					else if (sortList[j].name === curClass && sortList[j].parent === undefined) {
						sortList[j].num = sortList[j].num - 1;
					}
				}
				window.localStorage.removeItem('sortList');
				saveData('sortList', sortList);
			}
			// 修改totalNum
			window.localStorage.totalNum = window.localStorage.totalNum - 1;
		}
		window.location.reload();
	}
}
// 编辑任务,编辑到一半取消修改
$('#rewrite-task').onclick = function () {
	if (!defTask || defTask.state === 'done') {
		var str = '状态为“done”的任务不能再编辑啦';
		displayFloat(str);
	}
	else {
		$('#show-task').style.display = 'none';
		$('#edit-task').style.display = 'block';

		$('#in-title').value = defTask.name;
		$('#in-date').value = defTask.date;
		$('#in-content').value = defTask.content;

		// 先删除localStorage中要编辑的任务，再在完成编辑和取消编辑中都像内存中添加该任务
		if (curClass === 'default') {
			var defaultTasks = getData('defaultTasks');
			for (var i = 0, len = defaultTasks.length; i < len; i++) {
				if (defaultTasks[i].name === defTask.name) {
					defaultTasks.splice(i, 1);
					break;
				}
			}
			window.localStorage.removeItem('defaultTasks');
			saveData('defaultTasks', defaultTasks);
		}
		else {
			var allTasks = getData('allTasks');
			for (var i = 0, len = allTasks.length; i < len; i++) {
				if (allTasks[i].name === defTask.name) {
					allTasks.splice(i, 1);
					break;
				}
			}
			window.localStorage.removeItem('allTasks');
			saveData('allTasks', allTasks);
		}

		isRewriting = true;

	}
	// 弹出浮层，“确认”按钮
	$('#confirmed').onclick = function () {
		if (!defTask || defTask.state === 'done') {
			closeFloat();
		}
	}	
}

/**********************************************************************
 * 其他函数
 **********************************************************************/

// 显示浮层, str 浮层上显示的文本内容
function displayFloat(str) {
		$('.mask').style.display = 'block';
		$('#float-layer-content').innerHTML = str;
		var floatLayer = $('.float-layer');
		// 浏览器视口宽高
		var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		floatLayer.style.left = Math.floor((clientWidth - 350) / 2) + 'px';
		floatLayer.style.top = Math.floor((clientHeight - 220) / 2) + 'px';
		$('.float-layer').style.display = 'block';
}

// 关闭浮层
function closeFloat() {
	$('.mask').style.display = 'none';
	$('.float-layer').style.display = 'none';
}

/**
 * 检验key在list中的唯一性,调用的时候key是任务名或者分类名
 * list是分类名称 如sortList
 * @return boolean
 * @true 没有重复  false 发现重复
 */
function checkUnique(key, list) {
	var listData = getData(list);
	for (var i = 0, len = listData.length; i < len; i++) {
		if (key === listData[i].name) {
			return false;
		}
	}
	return true;
}

// 在list-wrap中，根据data-name查找dl，并返回该对象
function findDl(sortname) {
	var listWrap = $('#list-wrap');
	var dls = listWrap.getElementsByTagName('dl');
	for (var i = 0, len = dls.length; i < len; i++) {
		if (sortname === dls[i].getAttribute('data-name')) {
			return dls[i];
		}
	}
	return null;
}

// 查找sortList中某一大分类下的子分类，并返回属于该分类的子分类数组
function findSubclass(sortname) {
	var result = [];
	var temp = getData('sortList');
	if (temp) {
		for (var i = 0, len = temp.length; i < len; i++) {
			if (sortname === temp[i].parent) {
				result.push(temp[i]);
			}
		}
	}
	return result;
}

/**
 * 根据dd名查找dl sortList中
 * 返回dl的 data-name 属性值，字符串
 */
function findParent(ddname) {
	var result = '';
	var temp = getData('sortList');
	if (temp) {
		for (var i = 0, len = temp.length; i < len; i++) {
			if (ddname === temp[i].name && temp[i].parent !== undefined) {
				result = temp[i].parent;
				break;
			}
		}
	}
	return result;
}

// 与localStorage相关的函数

/**
 * 检验浏览器是否支持localStorage，
 * 若支持，检验localStorage中是否已经存值，未存值则初始化
 * @return {[type]} [description]
 */
function initLocalStorage() {
	// 判断是否支持localStorage
	if (!window.localStorage) {
		console.log('该浏览器不支持localStorage');
		return false;
	}
	var storage = window.localStorage;

	// 未完成任务总数
	if (!storage.totalNum) {
		storage.totalNum = 0;
	}
	// 默认分类下未完成任务总数
	if (!storage.defaultNum) {
		storage.defaultNum = 0;
	}
	// 分类列表
	if (!storage.sortList) {
		var sortList = [];
		storage.setItem('sortList', JSON.stringify(sortList));
	}
	// 默认分类下的任务列表
	if (!storage.defaultTasks) {
		var defaultTasks = [];
		storage.setItem('defaultTasks', JSON.stringify(defaultTasks));
	}
	// 全部任务详细信息
	if (!storage.allTasks) {
		var allTasks = [];
		storage.setItem('allTasks', JSON.stringify(allTasks));
	}
	return true;
}

/**
 * 向一维数组中添加元素，元素类型或者是数组，或者是对象
 * @ key 要存放数据的属性
 * @ data 要存放的数据
 * @return boolean
 */
function saveData(key, data) {
	var mykey = key;
	var mydata = data;
	var curdata = getData(mykey); 

	// localStorage中没有当前属性，向其中存放
	if (curdata === null && !!mydata) {
		window.localStorage.setItem(mykey, JSON.stringify(mydata));
		return true;
	}
	else if (!!mydata) {
		curdata.push(mydata);
		window.localStorage.setItem(mykey, JSON.stringify(curdata));
		return true;
	}
	return false;
}

/**
 * @ 从localStorage中取JSON格式数据，并转换
 * @ 返回取到的数据
 */
function getData(key) {
	// 属性未定义，返回null
	if (window.localStorage[key] === undefined) {
		return null;
	}
	var result = window.localStorage.getItem(key);
	result = JSON.parse(result);
	return result;
}

/**
 * 按日期聚类任务
 * 返回按日期排好序的二维数组
 *
 * key  聚类的关键词
 * src  要被聚类的数组，数组中的元素是任务对象
 */
function clusterData(key, src) {
	var result = [];
	if (src.length === 0) {
		return result;
	}

	var arr = [];
	arr[0] = src[0][key];
	arr[1] = src[0];

	result.push(arr);
	for (var i = 1, len = src.length; i < len; i++) {
		var flag = false;
		for (var j = 0, len1 = result.length; j < len1; j++) {
			if (src[i][key] == result[j][0]) {
				result[j].push(src[i]);
				flag = true;
			}
		}
		if (!flag) {
			var temp = [];
			temp[0] = src[i][key];
			temp[1] = src[i];
			result.push(temp);
		}
	}

	//按日期升序排序
	result = sortArr(result);
	return result;
}


// 为二维数组排序,返回排好序的二维数组
function sortArr(src) {
	var result = [];
	if (!src) {
		return result;
	}
	result.push(src[0]);
	for (var i = 1, len = src.length; i < len; i++) {
		for (var j = result.length - 1; j >= 0; j--) {
			if (src[i][0] > result[j][0]) {
				result.splice(j + 1, 0, src[i]);
				j = -100; // 结束本次内循环
			}
		}
		if (j == -1) {
			result.unshift(src[i]); // 插在位置0处
		}
	}
	return result;
}
