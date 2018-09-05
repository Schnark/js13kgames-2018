(function(){
var prefix = 'schnark-js13k2018-', storage;

function get (key, defaultValue) {
	try {
		return JSON.parse(localStorage.getItem(prefix + key) || 'x');
	} catch (e) {
		return defaultValue;
	}
}

function set (key, value) {
	try {
		localStorage.setItem(prefix + key, JSON.stringify(value));
	} catch (e) {
	}
}

/*function remove (key) {
	try {
		localStorage.removeItem(prefix + key);
	} catch (e) {
	}
}*/

storage = {
	get: get,
	set: set
};var overlay = document.getElementById('overlay'),
	closeButton = document.getElementById('info-close'),
	infoCallback,
	codeMap = {
		'<': 'code-left',
		'>': 'code-right',
		'_': 'code-go',
		',': 'code-up',
		'.': 'code-down',
		')': 'code-repeat'
	}, display;

//Firefox can persist disabled state and can get confused by the level buttons that sometimes exist and sometimes don't
closeButton.disabled = false;

closeButton.addEventListener('click', function () {
	overlay.className = '';
	if (infoCallback) {
		infoCallback();
	}
});

function displayTitle (title) {
	document.getElementById('title').textContent = title;
}

function displayInfo (info, callback) {
	document.getElementById('info-box').innerHTML = info;
	overlay.className = 'visible';
	infoCallback = callback;
	closeButton.focus();
}

function displayError (error) {
	document.getElementById('error').textContent = error;
}

function displaySymbol (id, cls) {
	return '<svg class="' + (cls ? cls + ' ' : '') + id + '"><use xlink:href="#' + id + '"/></svg>';
}

function displayCode (code, highlight) {
	document.getElementById('code').innerHTML = code.split('').map(function (c, i) {
		if (c === ' ') {
			return '<svg class="highlight"></svg>';
		}
		return displaySymbol(codeMap[c] || 'code-' + c, (i === highlight) && 'highlight');
	}).join('');
}

function displayMapSymbol (c) {
	if (c === '_') {
		return '';
	}
	if (/[0-3]/.test(c)) {
		return displaySymbol('map-r' + c);
	}
	if (/[a-e]/.test(c)) {
		return displaySymbol('map-item-' + c);
	}
	return displaySymbol('map-tile-' + c.toLowerCase());
}

function displayMap (map) {
	document.getElementById('map').innerHTML = '<table><tr>' + map.split('').map(function (c) {
		if (c === '-') {
			return '</tr><tr>';
		}
		return '<td>' + displayMapSymbol(c) + '</td>';
	}).join('') + '</tr></table>';
}

display = {
	title: displayTitle,
	info: displayInfo,
	error: displayError,
	symbol: displaySymbol,
	code: displayCode,
	mapSymbol: displayMapSymbol,
	map: displayMap
};//based on https://github.com/foumart/JS.13kGames/blob/master/lib/SoundFX.js
var sound, ac, muted = false;

function playSound (freq, incr, delay, times, vol, type) {
	var i = 0, osc, g, interval;

	function stop () {
		clearInterval(interval);
		osc.stop();
	}

	function internalPlay () {
		osc.frequency.value = freq + incr * i;
		g.gain.value = (1 - (i / times)) * vol;
		i++;
		if (i > times) {
			setTimeout(stop, delay);
		}
	}

	if (!ac) {
		return;
	}
	osc = ac.createOscillator();
	g = ac.createGain();
	osc.connect(g);
	g.connect(ac.destination);

	osc.frequency.value = freq;
	osc.type = ['square', 'sawtooth', 'triangle', 'sine'][type || 0];
	g.gain.value = 0;
	osc.start();
	interval = setInterval(internalPlay, delay);
}

sound = {
	init: function () {
		var AC = window.AudioContext;
		if (!AC) {
			return;
		}
		ac = new AC();
	},
	setMuted: function (onoff) {
		muted = onoff;
	},
	play: function (sound) {
		if (muted) {
			return;
		}
		switch (sound) {
		case 'move':
			playSound(100, -10, 15, 15, 0.7, 2);
			break;
		case 'turn':
			playSound(260, -60, 15, 15, 0.4, 2);
			break;
		case 'take':
			playSound(220, 15, 15, 15, 0.3, 2);
			break;
		case 'drop':
			playSound(440, -15, 15, 15, 0.3, 2);
			break;
		case 'drop-final':
			playSound(510, 0, 15, 20, 0.05);
			break;
		case 'error':
			playSound(440, -15, 15, 15, 0.5);
			setTimeout(function () {
				playSound(100, -10, 10, 25, 0.5);
			}, 300);
			break;
		case 'win':
			playSound(510, 0, 15, 20, 0.1);
			setTimeout(function () {
				playSound(2600, 1, 10, 50, 0.2);
			}, 80);
		}
	}
};/*global display, storage*/
var info, infoCount = storage.get('info', -1), data = [
	'<p>Welcome! Your task is to program a robot to run <b>offline</b>. You enter the code, and once you start the robot, you can no longer change it. So you have to plan ahead how your robot should run. The tutorial levels will teach you how to do so.</p>',
	'<p>Use the virtual keyboard to enter the code for the robot. You have to <kbd>' + display.symbol('code-up') + '</kbd> take the <kbd>' + display.symbol('map-item-a') + '</kbd> item, <kbd>' + display.symbol('code-go') + '</kbd> advance one step, and <kbd>' + display.symbol('code-down') + '</kbd> drop it on the <kbd>' + display.symbol('map-tile-a') + '</kbd> target.</p><p>Then <kbd>' + display.symbol('go') + '</kbd> run the code. If the robot crashes, you have to <kbd>' + display.symbol('reset') + '</kbd> reset it. Use the slider to regulate its speed.</p><p>If you prefer your real keyboard, then type cursor up, underscore, cursor down, enter instead.</p>',
	'<p>You can also turn the robot and repeat parts of the code. For example <kbd>' + display.symbol('code-4') + display.symbol('code-right') + display.symbol('code-repeat') + '</kbd> will turn the robot four times clockwise, after which everything will be the same. To enter this code, use the <kbd>' + display.symbol('code-repeat') + '</kbd> key, increment using the <kbd>' + display.symbol('plus') + '</kbd> key, and insert the code to repeat in the middle (use <kbd>' + display.symbol('left') + '</kbd><kbd>' +  display.symbol('right') + '</kbd> to move the cursor).</p><p>Or again, if you prefer your real keyboard, type 4&gt; for the above code.</p>',
	'This time, you have three items and three targets. You must take the red item to the red target, and the blue items to the blue targets, but it doesn’t matter which blue item you take to which blue target, as long as you take one to each of them.</p><p>Note that the robot can only carry one item at a time, but that you can also drop an item on an empty place and pick it up again later.</p>',
	'<p>Congratulations! You just unlocked the editor. Now you can create your own levels, play them, and share them (just share the URL once you tested your level).</p>',
	'<p>First, decide on the size of the map (up to 10x10), and then fill it by selecting the tile and clicking on the map to place it there. Note that you need exactly one starting position, at least one target, and the items and targets must match.</p>'
];

info = {
	show: function (i) {
		if (infoCount < i) {
			display.info(data[i], function () {
				infoCount = i;
				storage.set('info', i);
			});
		}
	}
};/*global display*/
function CodeInput () {
	this.insertLeft = document.getElementById('insert-left');
	this.insertRight = document.getElementById('insert-right');
	this.insertGo = document.getElementById('insert-go');
	this.insertUp = document.getElementById('insert-up');
	this.insertDown = document.getElementById('insert-down');
	this.insertRepeat = document.getElementById('insert-repeat');

	this.leftButton = document.getElementById('button-left');
	this.rightButton = document.getElementById('button-right');
	this.delButton = document.getElementById('button-del');
	this.plusButton = document.getElementById('button-plus');
	this.minusButton = document.getElementById('button-minus');

	this.insertLeft.innerHTML = display.symbol('code-left');
	this.insertRight.innerHTML = display.symbol('code-right');
	this.insertGo.innerHTML = display.symbol('code-go');
	this.insertUp.innerHTML = display.symbol('code-up');
	this.insertDown.innerHTML = display.symbol('code-down');
	this.insertRepeat.innerHTML = display.symbol('code-repeat');

	this.insertLeft.addEventListener('click', this.onClick.bind(this));
	this.insertRight.addEventListener('click', this.onClick.bind(this));
	this.insertGo.addEventListener('click', this.onClick.bind(this));
	this.insertUp.addEventListener('click', this.onClick.bind(this));
	this.insertDown.addEventListener('click', this.onClick.bind(this));
	this.insertRepeat.addEventListener('click', this.onClick.bind(this));

	this.leftButton.addEventListener('click', this.onClick.bind(this));
	this.rightButton.addEventListener('click', this.onClick.bind(this));
	this.delButton.addEventListener('click', this.onClick.bind(this));
	this.plusButton.addEventListener('click', this.onClick.bind(this));
	this.minusButton.addEventListener('click', this.onClick.bind(this));

	document.body.addEventListener('keydown', this.onKey.bind(this));

	this.clear();
}

CodeInput.prototype.update = function () {
	var c = this.pre.slice(-1);
	display.code(this.pre + ' ' + this.post);
	this.leftButton.disabled = !this.pre;
	this.rightButton.disabled = !this.post;
	this.delButton.disabled = !this.pre;
	this.plusButton.disabled = (c < '2' || c > '8');
	this.minusButton.disabled = (c < '3' || c > '9');
};

CodeInput.prototype.get = function () {
	return this.pre + this.post;
};

CodeInput.prototype.clear = function () {
	this.pre = '';
	this.post = '';
	this.update();
};

CodeInput.prototype.enable = function () {
	this.insertLeft.disabled = false;
	this.insertRight.disabled = false;
	this.insertGo.disabled = false;
	this.insertUp.disabled = false;
	this.insertDown.disabled = false;
	this.insertRepeat.disabled = false;

	this.update();
};

CodeInput.prototype.disable = function () {
	this.insertLeft.disabled = true;
	this.insertRight.disabled = true;
	this.insertGo.disabled = true;
	this.insertUp.disabled = true;
	this.insertDown.disabled = true;
	this.insertRepeat.disabled = true;

	this.leftButton.disabled = true;
	this.rightButton.disabled = true;
	this.delButton.disabled = true;
	this.plusButton.disabled = true;
	this.minusButton.disabled = true;
};

CodeInput.prototype.pos1 = function () {
	this.post = this.pre + this.post;
	this.pre = '';
	this.update();
};

CodeInput.prototype.end = function () {
	this.pre = this.pre + this.post;
	this.post = '';
	this.update();
};

CodeInput.prototype.left = function () {
	this.post = this.pre.slice(-1) + this.post;
	this.pre = this.pre.slice(0, -1);
	this.update();
};

CodeInput.prototype.right = function () {
	this.pre = this.pre + this.post.slice(0, 1);
	this.post = this.post.slice(1);
	this.update();
};

CodeInput.prototype.plus = function () {
	this.pre = this.pre.slice(0, -1) + String(Number(this.pre.slice(-1)) + 1);
	this.update();
};

CodeInput.prototype.minus = function () {
	this.pre = this.pre.slice(0, -1) + String(Number(this.pre.slice(-1)) - 1);
	this.update();
};

CodeInput.prototype.insert = function (a, b) {
	this.pre += a;
	if (b) {
		this.post = b + this.post;
	}
	this.update();
};

CodeInput.prototype.del = function () {
	var c = this.pre.slice(-1), stack = 0, pos;
	if (c === ')') {
		pos = this.pre.length - 2;
		while (true) {
			c = this.pre.charAt(pos);
			if (c === ')') {
				stack++;
			} else if (c >= '2' && c <= '9') {
				if (stack === 0) {
					this.pre = this.pre.slice(0, pos) + this.pre.slice(pos + 1);
					break;
				} else {
					stack--;
				}
			}
			pos--;
		}
	} else if (c >= '2' && c <= '9') {
		pos = 0;
		while (true) {
			c = this.post.charAt(pos);
			if (c === ')') {
				if (stack === 0) {
					this.post = this.post.slice(0, pos) + this.post.slice(pos + 1);
					break;
				} else {
					stack--;
				}
			} else if (c >= '2' && c <= '9') {
				stack++;
			}
			pos++;
		}
	}
	this.pre = this.pre.slice(0, -1);
	this.update();
};

CodeInput.prototype.handleKey = function (key) {
	switch (key) {
	case 'pos1': this.pos1(); break;
	case 'end': this.end(); break;
	case 'left': this.left(); break;
	case 'right': this.right(); break;
	case 'del': this.del(); break;
	case 'plus': this.plus(); break;
	case 'minus': this.minus(); break;
	default: this.insert(key.slice(0, 1), key.slice(1));
	}
};

CodeInput.prototype.onClick = function (e) {
	var key = e.currentTarget.dataset.key;
	if (!key) {
		return;
	}
	this.handleKey(key);
};

CodeInput.prototype.onKey = function (e) {
	var c, key, el;
	if (this.insertLeft.disabled) {
		return;
	}
	c = e.key;
	switch (c) {
	case 'Enter': key = 'start'; break;
	case 'ArrowLeft': key = 'left'; break;
	case 'ArrowDown': key = '.'; break;
	case 'ArrowUp': key = ','; break;
	case 'ArrowRight': key = 'right'; break;
	case 'End': key = 'end'; break;
	case 'Home': key = 'pos1'; break;
	case 'Backspace': key = 'del'; break;
	case '+': key = 'plus'; break;
	case '-': key = 'minus'; break;
	default:
		if (/^[2-9]$/.test(c)) {
			key = c + ')';
		} else if (/^[_<>]$/.test(c)) {
			key = c;
		}
	}
	if (key) {
		e.preventDefault();
		if (key === 'start') {
			document.getElementById('run-button').click();
		} else {
			el = document.querySelector('[data-key="' + key + '"]');
			if (!el || !el.disabled) {
				this.handleKey(key);
			}
		}
	}
};/*global display*/
function Map (str) {
	this.grid = str.split('-').map(function (line, y) {
		var match = /(.*)([0-3])(.*)/.exec(line);
		if (match) {
			this.start = [match[1].length, y, Number(match[2])];
			line = match[1] + '_' + match[3];
		}
		return line.split('');
	}.bind(this));
}

Map.prototype.getStart = function () {
	return this.start;
};

Map.prototype.getType = function (x, y) {
	return (this.grid[y] || [])[x] || '';
};

Map.prototype.setType = function (x, y, type) {
	this.grid[y][x] = type;
};

Map.prototype.allDone = function () {
	return !/[A-E]/.test(this.grid.map(function (line) {
		return line.join('');
	}).join(''));
};

Map.prototype.draw = function (robot) {
	var pos = robot.getPos();
	display.map(this.grid.map(function (line, y) {
		var str = line.join('');
		if (y === pos[1]) {
			str = str.slice(0, pos[0]) + pos[2] + str.slice(pos[0] + 1);
		}
		return str;
	}).join('-'));
};/*global sound*/
function Robot (map) {
	var start = map.getStart();
	this.x = start[0];
	this.y = start[1];
	this.dir = start[2];
	this.map = map;
}

Robot.prototype.getPos = function () {
	return [this.x, this.y, this.dir];
};

Robot.prototype.setCode = function (code) {
	this.origCode = code;
	this.code = code;
	this.codePos = 0;
	this.stack = [];
};

Robot.prototype.getNextPos = function () {
	switch (this.dir) {
	case 0: return [this.x, this.y - 1];
	case 1: return [this.x + 1, this.y];
	case 2: return [this.x, this.y + 1];
	case 3: return [this.x - 1, this.y];
	}
};

Robot.prototype.move = function () {
	var newPos = this.getNextPos(), type;
	type = this.map.getType(newPos[0], newPos[1]);
	if (type !== '_') {
		if (/[A-EG]/.test(type)) {
			type = 'target';
		} else if (/[a-e]/.test(type)) {
			type = 'item';
		} else {
			type = 'wall';
		}
		throw 'Crashed into ' + type + '!';
	}
	this.x = newPos[0];
	this.y = newPos[1];
	sound.play('move');
};

Robot.prototype.turn = function (dir) {
	this.dir = (this.dir + dir + 4) % 4;
	sound.play('turn');
};

Robot.prototype.take = function () {
	var pos, type;
	if (this.item) {
		throw 'Can’t take two items!';
	}
	pos = this.getNextPos();
	type = this.map.getType(pos[0], pos[1]);
	if (!/[a-e]/.test(type)) {
		throw 'No item to take!';
	}
	this.item = type;
	this.map.setType(pos[0], pos[1], '_');
	sound.play('take');
};

Robot.prototype.drop = function () {
	var pos, type;
	if (!this.item) {
		throw 'No item to drop!';
	}
	pos = this.getNextPos();
	type = this.map.getType(pos[0], pos[1]);
	if (type !== '_' && type !== this.item.toUpperCase()) {
		throw 'Can’t drop item here!';
	}
	this.map.setType(pos[0], pos[1], type === '_' ? this.item : 'G');
	this.item = '';
	sound.play(type === '_' ? 'drop' : 'drop-final');
};

Robot.prototype.step = function () {
	var token, oldPos;
	token = this.code[this.codePos];
	switch (token) {
	case '<': this.turn(-1); break;
	case '>': this.turn(1); break;
	case '_': this.move(); break;
	case ',': this.take(); break;
	case '.': this.drop(); break;
	case ')':
		oldPos = this.stack.pop();
		if (oldPos !== -1) {
			this.codePos = oldPos - 1; //codePos will be incremented below, so subtrcat 1
		}
		break;
	case '1':
		//restore original number of repetitions
		this.code = this.code.slice(0, this.codePos) + this.origCode.charAt(this.codePos) + this.code.slice(this.codePos + 1);
		this.stack.push(-1);
		break;
	default:
		this.code = this.code.slice(0, this.codePos) + String(Number(token) - 1) + this.code.slice(this.codePos + 1);
		this.stack.push(this.codePos);
	}
	this.codePos++;
	return this.codePos;
};/*global Robot, Map, display, sound*/
function Run (mapStr, codeStr, onend) {
	this.map = new Map(mapStr);
	this.robot = new Robot(this.map);
	this.robot.setCode(codeStr);
	this.codeStr = codeStr;
	this.pos = 0;
	this.onend = onend;
	this.running = true;
	this.done = false;
	this.pause = 1000;
}

Run.prototype.showError = function (e) {
	display.error(e);
	if (e) {
		sound.play('error');
	}
};

Run.prototype.showCode = function () {
	display.code(this.codeStr, this.pos);
};

Run.prototype.step = function () {
	if (this.pos >= this.codeStr.length) {
		this.running = false;
		if (this.map.allDone()) {
			this.done = true;
			sound.play('win');
		} else {
			this.showError('Not all targets reached!');
		}
	} else {
		if (this.stepTypeShow) {
			this.showCode();
		} else {
			try {
				this.pos = this.robot.step();
			} catch (e) {
				this.showError(e);
				this.running = false;
			}
			this.map.draw(this.robot);
		}
	}
	if (this.running) {
		this.stepTypeShow = !this.stepTypeShow;
		this.timeoutId = setTimeout(this.step.bind(this), this.pause / 2);
	} else {
		this.onend(this.done);
	}
};

Run.prototype.cancel = function () {
	if (this.running) {
		clearTimeout(this.timeoutId);
		this.onend(false);
	}
};

Run.prototype.setPause = function (pause) {
	this.pause = pause;
};

Run.prototype.run = function () {
	this.showError('');
	this.map.draw(this.robot);
	this.stepTypeShow = true;
	this.step();
};/*global Run, codeInput, display, editor*/
function Level (title, mapStr, onend) {
	this.title = title;
	this.mapStr = mapStr;
	this.onend = onend;
	this.abortButton = document.getElementById('abort-button');
	this.runButton = document.getElementById('run-button');
	this.cancelButton = document.getElementById('cancel-button');
	this.resetButton = document.getElementById('reset-button');
	this.pauseInput = document.getElementById('pause-input');
	this.wrapper = document.getElementById('level-wrapper');

	this.boundOnAbort = this.onAbort.bind(this);
	this.boundOnStart = this.onStart.bind(this);
	this.boundOnCancel = this.onCancel.bind(this);
	this.boundOnReset = this.onReset.bind(this);
	this.boundOnUpdatePause = this.onUpdatePause.bind(this);
}

Level.prototype.bind = function () {
	this.abortButton.addEventListener('click', this.boundOnAbort);
	this.runButton.addEventListener('click', this.boundOnStart);
	this.cancelButton.addEventListener('click', this.boundOnCancel);
	this.resetButton.addEventListener('click', this.boundOnReset);
	this.pauseInput.addEventListener('change', this.boundOnUpdatePause);
};

Level.prototype.unbind = function () {
	this.abortButton.removeEventListener('click', this.boundOnAbort);
	this.runButton.removeEventListener('click', this.boundOnStart);
	this.cancelButton.removeEventListener('click', this.boundOnCancel);
	this.resetButton.removeEventListener('click', this.boundOnReset);
	this.pauseInput.removeEventListener('change', this.boundOnUpdatePause);
};

Level.prototype.show = function () {
	document.documentElement.scrollTop = 0;
	display.title(this.title);
	this.onReset();
	this.bind();
	this.wrapper.hidden = false;
	this.abortButton.hidden = false;
	codeInput.clear();
};

Level.prototype.showEditor = function () {
	document.documentElement.scrollTop = 0;
	display.title('Editor');
	this.bind();
	this.wrapper.hidden = false;
	this.abortButton.hidden = false;
	editor.show(this);
	codeInput.disable();
};

Level.prototype.end = function (result) {
	this.unbind();
	this.onend(result, function () {
		if (!this.title) {
			editor.hide();
		}
		this.wrapper.hidden = true;
		this.abortButton.hidden = true;
	}.bind(this));
};

Level.prototype.onAbort = function () {
	this.end(-1);
};

Level.prototype.onStart = function () {
	var input = codeInput.get();
	this.run = new Run(this.mapStr, input, function (done) {
		this.cancelButton.disabled = true;
		this.abortButton.disabled = false;
		if (done) {
			this.end(input.length);
		} else {
			this.resetButton.disabled = false;
			this.resetButton.focus();
		}
	}.bind(this));
	this.onUpdatePause();
	codeInput.disable();
	this.abortButton.disabled = true;
	this.runButton.disabled = true;
	this.cancelButton.disabled = false;
	this.run.run();
};

Level.prototype.onCancel = function () {
	this.run.cancel();
	this.cancelButton.disabled = true;
	this.abortButton.disabled = false;
};

Level.prototype.onReset = function () {
	display.map(this.mapStr);
	display.error('');
	display.code('');
	this.abortButton.disabled = false;
	this.runButton.disabled = false;
	this.cancelButton.disabled = true;
	this.resetButton.disabled = true;
	this.resetButton.blur();
	codeInput.enable();
};

Level.prototype.onUpdatePause = function () {
	if (this.run) {
		this.run.setPause(250 * Math.pow(2, 4 - this.pauseInput.value / 2));
	}
};/*global Level, display, sound, info, storage*/
function LevelCollection (levelGroups) {
	this.levelGroups = levelGroups;
	this.menuArea = document.getElementById('level-menu');
	this.menuArea.addEventListener('click', this.onclick.bind(this));
	this.scores = storage.get('scores', {});
	this.infoEntry = -1;
}

LevelCollection.prototype.init = function () {
	this.buildMenu();
	this.show();
};

LevelCollection.prototype.initSound = function () {
	if (!this.initSoundDone) {
		sound.init();
		this.initSoundDone = true;
	}
};

LevelCollection.prototype.getScore = function (map) {
	return this.scores[map] || -1;
};

LevelCollection.prototype.setScore = function (map, score) {
	this.scores[map] = score;
	storage.set('scores', this.scores);
};

LevelCollection.prototype.buildMenu = function () {
	var solved = 0;
	this.menuArea.innerHTML = this.levelGroups.map(function (group, i) {
		if (solved < group.req || 0) {
			return group.editor ? '' : '<h2>' + group.title + ' ' + display.symbol('lock') + '</h2>';
		}
		if ('info' in group) {
			this.infoEntry = group.info;
		}
		return '<h2>' + group.title + '</h2>' + group.levels.map(function (level, j) {
			var best, symbol, id;
			if (!level.map) {
				symbol = '';
			} else if (solved < level.req || 0) {
				symbol = 'lock';
			} else {
				best = this.getScore(level.map);
				if (best === -1) {
					symbol = '';
				} else if (best < (level.top || Infinity)) {
					symbol = 'star-2';
				} else if (best === level.top) {
					symbol = 'star';
				} else {
					symbol = 'ok';
				}
			}
			if (symbol !== '' && symbol !== 'lock') {
				solved++;
			}
			if (symbol === 'lock') {
				id = 'disabled';
			} else {
				id = level.map ? 'data-id="' + i + '|' + j + '"' : 'data-id="editor"';
			}
			return '<button ' + id + '>' + level.title + (symbol ? ' ' + display.symbol(symbol) : '') + '</button>';
		}.bind(this)).join('');
	}.bind(this)).join('');
};

LevelCollection.prototype.onclick = function (e) {
	var id = e.target.dataset.id;
	if (!id) {
		return;
	}
	this.initSound();
	if (id === 'editor') {
		this.showEditor();
		return;
	}
	id = id.split('|');
	this.startLevel(id[0], id[1]);
};

LevelCollection.prototype.show = function () {
	document.documentElement.scrollTop = 0;
	display.title('Robot Coder');
	this.menuArea.hidden = false;
	if (this.infoEntry > -1) {
		info.show(this.infoEntry);
	}
};

LevelCollection.prototype.startLevel = function (i, j) {
	var levelData = this.levelGroups[i].levels[j], level;
	level = new Level(levelData.title, levelData.map, function (result, callback) {
		this.endLevel(i, j, result, callback);
	}.bind(this));
	this.menuArea.hidden = true;
	level.show();
	if ('info' in levelData) {
		info.show(levelData.info);
	}
};

LevelCollection.prototype.showEditor = function () {
	var levelData, level = new Level(false, false, function (result, callback) {
		callback();
		if (result !== -1) {
			location = '#' + result;
			//The following assumes that the editor is in the last levelGroup.
			//This is true here, but could be changed in the config.
			this.levelGroups[this.levelGroups.length - 1].levels[1] = {
				title: 'Play level',
				map: result
			};
			this.buildMenu();
			this.startLevel(this.levelGroups.length - 1, 1);
		} else {
			this.show();
		}
	}.bind(this));
	this.menuArea.hidden = true;
	level.showEditor();
	levelData = this.levelGroups[this.levelGroups.length - 1].levels[0];
	if ('info' in levelData) {
		info.show(levelData.info);
	}
};

LevelCollection.prototype.endLevel = function (i, j, result, callback) {
	var map, oldResult, top, str, update = false;

	function done () {
		callback();
		this.show();
	}

	if (result > -1) {
		map = this.levelGroups[i].levels[j].map;
		oldResult = this.getScore(map);
		top = this.levelGroups[i].levels[j].top || Infinity;
		if (oldResult === -1) {
			str = 'Level solved!';
			if (result > top) {
				str += ' But there is a shorter solution, try to find it!';
			}
			update = true;
		} else {
			str = 'Level solved again!';
			if (result > oldResult) {
				str += ' But your previous solution was shorter!';
			} else if (result < oldResult) {
				str = 'Level solved again with a shorter solution than before!';
				update = true;
			}
			if (result <= oldResult && result > top) {
				str += ' But there is a shorter solution, try to find it!';
			}
		}
		display.info(str, done.bind(this));
		if (update) {
			this.setScore(map, result);
			this.buildMenu();
		}
	} else {
		callback();
		this.show();
	}
};/*global display*/
function Editor (mapStr) {
	this.grid = mapStr.split('-').map(function (line) {
		return line.split('');
	});

	document.getElementById('radio-input').innerHTML = '_FaAbBcCdDeE0123'
		.split('')
		.map(function (c) {
			return '<label>' +
				'<input type="radio" name="radios" value="' + c + '"' + (c === '_' ? ' checked' : '') + '>' +
				(display.mapSymbol(c) || '<svg></svg>') +
				'</label>';
		}).join('');

	this.radioInput = document.getElementById('radio-input').getElementsByTagName('input');
	this.editorArea = document.getElementById('editor-area');
	this.runArea = document.getElementById('run-area');
	this.mapTable = document.getElementById('map');
	this.playButton = document.getElementById('play-button');
	this.widthInput = document.getElementById('width-input');
	this.heightInput = document.getElementById('height-input');

	this.widthInput.value = this.grid[0].length;
	this.heightInput.value = this.grid.length;

	this.boundOnSizeChange = this.onSizeChange.bind(this);
	this.boundOnMapClick = this.onMapClick.bind(this);
	this.boundOnPlayClick = this.onPlayClick.bind(this);
}

Editor.isValid = function (map) {
	//Checks for external data only
	map = map.split('-');
	//height
	if (map.length > 10) {
		return false;
	}
	//width
	if (map[0].length === 0 || map[0].length > 10) {
		return false;
	}
	if (
		!map.every(function (line) {
			return line.length === map[0].length;
		})
	) {
		return false;
	}
	map = map.join('');
	//only allowed elements
	if (/[^a-eA-F0-3_]/.test(map)) {
		return false;
	}
	//Checks for both internal and external data
	//exactly one starting point
	if (map.replace(/[^0-3]/g, '').length !== 1) {
		return false;
	}
	//at least one item
	if (!/[a-e]/.test(map)) {
		return false;
	}
	//items and targets match
	if (
		map.replace(/[^a-e]/g, '').split('').sort().join('') !==
		map.replace(/[^A-E]/g, '').split('').sort().join('').toLowerCase()
	) {
		return false;
	}
	//accept anything else (even if it might be unsolvable)
	return true;
};

Editor.prototype.bind = function () {
	this.widthInput.addEventListener('change', this.boundOnSizeChange);
	this.heightInput.addEventListener('change', this.boundOnSizeChange);
	this.mapTable.addEventListener('click', this.boundOnMapClick);
	this.playButton.addEventListener('click', this.boundOnPlayClick);
};

Editor.prototype.unbind = function () {
	this.widthInput.removeEventListener('change', this.boundOnSizeChange);
	this.heightInput.removeEventListener('change', this.boundOnSizeChange);
	this.mapTable.removeEventListener('click', this.boundOnMapClick);
	this.playButton.removeEventListener('click', this.boundOnPlayClick);
};

Editor.prototype.show = function (level) {
	this.level = level;
	this.bind();
	this.editorArea.hidden = false;
	this.runArea.hidden = true;
	this.update();
};

Editor.prototype.hide = function () {
	this.unbind();
	this.editorArea.hidden = true;
	this.runArea.hidden = false;
};

Editor.prototype.getStr = function () {
	return this.grid.map(function (row) {
		return row.join('');
	}).join('-');
};

Editor.prototype.update = function () {
	var map = this.getStr();
	display.map(map);
	this.playButton.disabled = !Editor.isValid(map);
};

Editor.prototype.changeSize = function (w, h) {
	var i;
	if (this.grid.length < h) {
		for (i = this.grid.length; i < h; i++) {
			this.grid[i] = Array(Number(w) + 1).join('_').split('');
		}
	} else {
		this.grid.length = h;
	}
	this.grid.forEach(function (row) {
		if (row.length < w) {
			for (i = row.length; i < w; i++) {
				row[i] = '_';
			}
		} else {
			row.length = w;
		}
	});
	this.update();
};

Editor.prototype.changeMap = function (x, y, c) {
	this.grid[y][x] = c;
	this.update();
};

Editor.prototype.onSizeChange = function () {
	var w = this.widthInput.value, h = this.heightInput.value;
	if (w >= 1 && h >= 1 && w <= 10 && h <= 10) {
		this.changeSize(w, h);
	}
};

Editor.prototype.onMapClick = function (e)  {
	var target = e.target, c;
	while (target && target.nodeName !== 'TD' && target.nodeName !== 'TABLE') {
		target = target.parentNode;
	}
	if (!target || target.nodeName !== 'TD') {
		return;
	}
	for (c = 0; c < this.radioInput.length; c++) {
		if (this.radioInput[c].checked) {
			c = this.radioInput[c].value;
			break;
		}
	}
	this.changeMap(target.cellIndex, target.parentNode.rowIndex, c);
};

Editor.prototype.onPlayClick = function () {
	this.level.end(this.getStr());
};/*global CodeInput, Editor, LevelCollection, sound, storage*/
var codeInput, editor, soundCheckbox, levels, bonus;

codeInput = new CodeInput();

soundCheckbox = document.getElementById('sound-checkbox');

function onMuteUnmute () {
	var checked = soundCheckbox.checked;
	sound.setMuted(!checked);
	storage.set('sound', checked);
}

soundCheckbox.checked = storage.get('sound', true);
soundCheckbox.addEventListener('change', onMuteUnmute);
onMuteUnmute();

levels = [
	{title: 'Tutorial', info: 0, levels: [
		{title: 'Tutorial 1', map: 'Aa3', top: 3, info: 1},
		{title: 'Tutorial 2', map: 'A______1a', top: 7, req: 1, info: 2},
		{title: 'Tutorial 3', map: 'FFFFbF-b___1B-A____a-FFFFBF', top: 18, req: 2, info: 3}
	]},
	{title: 'Let’s Start!', req: 3, levels: [
		{title: 'Welcome!', map: 'A___a-_____-__0__', top: 10},
		{title: 'One', map: '__A-_F2-a__', top: 10, req: 4},
		{title: 'Two', map: 'a_A-_1_-A_a', top: 10, req: 5},
		{title: 'Three', map: 'B__b-C__c-A_1a', top: 16, req: 6},
		{title: 'Four', map: 'B__C-_bc_-1ad_-A__D', top: 12, req: 7},
		{title: 'Five', map: 'ABCDE-abcde-1____', top: 11, req: 8}
	]},
	{title: 'Circling the Square', req: 4, levels: [
		{title: 'Easy Square', map: 'FFFAFFF-F__2__F-F__a__F-D_dFb_B-F__c__F-F_____F-FFFCFFF', top: 12},
		{title: 'Still Easy', map: 'FFFAFFF-F__2__F-F__b__F-D_aFc_B-F__d__F-F_____F-FFFCFFF', top: 13, req: 5},
		{title: 'Full Square', map: '_FAFBF_-F1acb_F-DdFCFdD-FbBFAaF-CcFDFcC-F_adb_F-_FAFBF_', top: 19, req: 7},
		{title: 'Easy again', map: 'b___d-_FDF_-1BFC_-_FAF_-a___c', top: 16, req: 9},
		{title: 'Not So Easy', map: 'a___b-_FDF_-1BFC_-_FAF_-c___d', top: 43, req: 10}
	]},
	{title: 'JS13K', req: 5, levels: [
		{title: 'J', map: 'A____-___F_-___F_-_FaF_-__F1_-_____', top: 17},
		{title: 'S', map: '______-__FFF_-_Fa___-__FF__-__3AF_-_FFF__-______', top: 34, req: 6},
		{title: '1', map: 'B____-__FF_-_F2F_-___F_-___F_-___F_-C__bc', top: 27, req: 9},
		{title: '3', map: '____B-_FF__-__bF_-1FF__-__cF_-_FF__-____C', top: 36, req: 10},
		{title: 'K', map: 'A_____-_F__F_-_FaF__-_FFe_E-_FcF__-_F__F_-_F__F_-C___3_', top: 50, req: 13}
	]},
	{title: 'Even More Levels', req: 7, levels: [
		{title: 'Stairs', map: '__FF_A-_FF__F-FF__FF-F__FF_-1aFF__', top: 8},
		{title: 'Upside down', map: 'A_e-B_d-C3c-D_b-E_a', top: 43, req: 11},
		{title: 'Clock', map: '__FFAFFF__-_FF_a_FFF_-FFDd_bBCFF-FFC____c_F-F_c_0___dD-Bb_____a_F-F_a____AFF-FFADd_bBFF-_FFF_c_FF_-__FFFCFF__', top: 18, req: 15},
		{title: 'Race Course', map: '______A-aBFFFFF-_______-FFFFFCb-_______-cDFFFFF-_____1d', top: 43, req: 19},
		{title: 'Crazy', map: '____E_____-D_B_dAcB_C-_1__e_____-E_A__a_D_a-__db_dC_Ab-_B_C__eb__-a__ac__C_c-__e_bA___D-E_D___d_B_-__e__E___c', req: 23} //I'm crazy enough to create this level, but not crazy enough to solve it, so no top score here
	]},
	{title: 'Editor', req: 5, editor: true, info: 4, levels: [
		{title: 'Start editor', info: 5}
	]}
];

if (location.hash) {
	bonus = location.hash.slice(1);
	if (!Editor.isValid(bonus)) {
		bonus = false;
	}
}

if (bonus) {
	levels.splice(-1, 0, {
		title: 'Bonus', levels: [
			{title: 'Bonus', map: bonus}
		]
	});
}
editor = new Editor(bonus || '_');
levels = new LevelCollection(levels);

levels.init();})();
