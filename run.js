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
	if (!this.running) {
		if (this.end === 1) {
			sound.play('win');
		} else if (this.end === 2) {
			this.showError('Not all done!');
		}
		this.onend(this.done);
		return;
	}
	if (this.stepTypeShow) {
		this.showCode();
	} else {
		try {
			this.pos = this.robot.step();
		} catch (e) {
			this.showError(e);
			this.running = false;
		}
		if (this.pos >= this.codeStr.length) {
			this.running = false;
			if (this.map.allDone()) {
				this.done = true;
				this.end = 1;
			} else {
				this.end = 2;
			}
		}
		this.map.draw(this.robot);
	}
	this.stepTypeShow = !this.stepTypeShow;
	this.timeoutId = setTimeout(this.step.bind(this), this.pause / 2);
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
	this.end = 0;
	this.map.draw(this.robot);
	this.stepTypeShow = true;
	this.step();
};