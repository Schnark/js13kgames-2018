function Editor (mapStr) {
	this.grid = mapStr.split('\n').map(function (line) {
		return line.split('');
	});

	document.getElementById('radio-input').innerHTML = ' #aAbBcCdDeE^>v<'
		.split('')
		.map(function (c) {
			return '<label>' +
				'<input type="radio" name="radios" value="' + c + '"' + (c === ' ' ? ' checked' : '') + '>' +
				display.mapSymbol(c) +
				'</label>';
		}).join('');

	this.radioInput = document.getElementById('radio-input').getElementsByTagName('input');
	this.editorArea = document.getElementById('editor-area');
	this.runArea = document.getElementById('run-area');
	this.mapTable = document.getElementById('map');
	this.doneButton = document.getElementById('done-button');
	this.widthInput = document.getElementById('width-input');
	this.heightInput = document.getElementById('height-input');

	this.widthInput.value = this.grid[0].length;
	this.heightInput.value = this.grid.length;

	this.boundOnSizeChange = this.onSizeChange.bind(this);
	this.boundOnMapClick = this.onMapClick.bind(this);
	this.boundOnDoneClick = this.onDoneClick.bind(this);
}

Editor.isValid = function (map) {
	map = map.split('\n');
	if (map.length > 10) {
		return false;
	}
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
	if (/[^a-eA-Ev<>^# ]/.test(map)) {
		return false;
	}
	if (map.replace(/[^v<>^]/g, '').length !== 1) {
		return false;
	}
	//TODO
	return true;
};

Editor.prototype.bind = function () {
	this.widthInput.addEventListener('change', this.boundOnSizeChange);
	this.heightInput.addEventListener('change', this.boundOnSizeChange);
	this.mapTable.addEventListener('click', this.boundOnMapClick);
	this.doneButton.addEventListener('click', this.boundOnDoneClick);
};

Editor.prototype.unbind = function () {
	this.widthInput.removeEventListener('change', this.boundOnSizeChange);
	this.heightInput.removeEventListener('change', this.boundOnSizeChange);
	this.mapTable.removeEventListener('click', this.boundOnMapClick);
	this.doneButton.removeEventListener('click', this.boundOnDoneClick);
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
	this.runArea.hidden = true;
};

Editor.prototype.getStr = function () {
	return this.grid.map(function (row) {
		return row.join('');
	}).join('\n');
};

Editor.prototype.update = function () {
	var map = this.getStr();
	display.map(map);
	this.doneButton.disabled = !Editor.isValid(map);
};

Editor.prototype.changeSize = function (w, h) {
	var i;
	if (this.grid.length < h) {
		for (i = this.grid.length; i < h; i++) {
			this.grid[i] = Array(Number(w) + 1).join(' ').split('');
		}
	} else {
		this.grid.length = h;
	}
	this.grid.forEach(function (row) {
		if (row.length < w) {
			for (i = row.length; i < w; i++) {
				row[i] = ' ';
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
	while (target.nodeName !== 'TD' && target.nodeName !== 'TABLE') {
		target = target.parentNode;
	}
	if (target.nodeName !== 'TD') {
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

Editor.prototype.onDoneClick = function () {
	this.level.end(this.getStr());
};