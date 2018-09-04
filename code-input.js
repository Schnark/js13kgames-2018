/*global display*/
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
};