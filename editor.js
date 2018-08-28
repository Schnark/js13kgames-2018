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
};