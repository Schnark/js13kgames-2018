/*global Level, display, sound, info, storage*/
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
};