function Run (mapStr, codeStr, onend) {
	this.map = new Map(mapStr);
	this.robot = new Robot(this.map);
	this.robot.setCode(codeStr);
	this.codeStr = codeStr;
	this.pos = 0;
	this.onend = onend;
	this.running = true;
	this.done = false;
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
};

Run.prototype.run = function (pause) {
	this.showError('');
	this.map.draw(this.robot);
	this.showCode();
	var interval = setInterval(function () {
		this.step();
		if (!this.running) {
			clearInterval(interval);
			this.onend(this.done);
		}
	}.bind(this), pause);
};