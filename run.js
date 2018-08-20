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
			sound.play('win');
		} else {
			this.showError('Not all done!');
		}
	}
	this.map.draw(this.robot);
	this.showCode();
	if (!this.running) {
		this.onend(this.done);
	} else {
		this.timeoutId = setTimeout(this.step.bind(this), this.pause);
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
	this.showCode();
	this.step();
};