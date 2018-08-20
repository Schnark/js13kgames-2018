function generateHash (str) {
	//copied from QUnit
	var hash = 0, i, hex;
	for (i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	hex = (0x100000000 + hash).toString(16);
	if (hex.length < 8) {
		hex = '0000000' + hex;
	}
	return hex.slice(-8);
}

function LevelCollection (levelGroups) {
	var i, j;
	this.levelGroups = levelGroups;
	for (i = 0; i < this.levelGroups.length; i++) {
		for (j = 0; j < this.levelGroups[i].levels.length; j++) {
			this.levelGroups[i].levels[j].hash = generateHash(this.levelGroups[i].levels[j].map);
		}
	}
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

LevelCollection.prototype.getScore = function (hash) {
	return this.scores[hash] || -1;
};

LevelCollection.prototype.setScore = function (hash, score) {
	this.scores[hash] = score;
	storage.set('scores', this.scores);
};

LevelCollection.prototype.clearScores = function () {
	this.scores = {};
	storage.remove('scores');
	this.buildMenu();
};

LevelCollection.prototype.buildMenu = function () {
	var solved = 0;
	this.menuArea.innerHTML = this.levelGroups.map(function (group, i) {
		if (solved < group.req || 0) {
			return '<h2 class="locked">' + group.title + '</h2>';
		}
		if ('info' in group) {
			this.infoEntry = group.info;
		}
		return '<h2>' + group.title + '</h2>' + group.levels.map(function (level, j) {
			var best, status;
			if (solved < level.req || 0) {
				status = 'locked';
			} else {
				best = this.getScore(level.hash);
				if (best === -1) {
					status = '';
				} else if (best < level.top || 0) {
					status = 'solved-2';
				} else if (best === level.top) {
					status = 'solved-1';
				} else {
					status = 'solved';
				}
			}
			if (status !== '' && status !== 'locked') {
				solved++;
			}
			return '<button ' + (status === 'locked' ? 'disabled' : 'data-id="' + i + '|' + j + '"') + ' class="' + status + '">' + level.title + '</button>';
		}.bind(this)).join('');
	}.bind(this)).join('');
};

LevelCollection.prototype.onclick = function (e) {
	var id = e.target.dataset.id;
	if (!id) {
		return;
	}
	this.initSound();
	id = id.split('|');
	this.startLevel(id[0], id[1]);
};

LevelCollection.prototype.show = function () {
	display.title('Levels');
	this.menuArea.hidden = false;
	if (this.infoEntry > -1) {
		info.show(this.infoEntry);
	}
};

LevelCollection.prototype.startLevel = function (i, j) {
	var levelData = this.levelGroups[i].levels[j], level;
	level = new Level(levelData.title, levelData.map, function (result) {
		this.endLevel(i, j, result);
	}.bind(this));
	this.menuArea.hidden = true;
	level.show();
	if ('info' in levelData) {
		info.show(levelData.info);
	}
};

LevelCollection.prototype.endLevel = function (i, j, result) {
	var hash, oldResult, top, str, update = false;
	if (result > -1) {
		hash = this.levelGroups[i].levels[j].hash;
		oldResult = this.getScore(hash);
		top = this.levelGroups[i].levels[j].top || Infinity;
		if (oldResult === -1) {
			str = 'Level solved!';
			if (result > top) {
				str += ' But there is a shorter solution, try to find it!';
			}
			update = true;
		} else {
			str = 'Level solved again!';
			if (result < oldResult) {
				str = 'Level solved again with a shorter solution than before!';
				update = true;
			}
			if (result > top) {
				str += ' But there is a shorter solution, try to find it!';
			}
		}
		display.info(str, this.show.bind(this));
		if (update) {
			this.setScore(hash, result);
			this.buildMenu();
		}
	} else {
		this.show();
	}
};