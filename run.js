function htmlEscape (str) {
	return str.replace(/</g, '&lt;');
}

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
	document.getElementById('error').textContent = e;
};

Run.prototype.showCode = function () {
	document.getElementById('code').innerHTML = htmlEscape(this.codeStr.slice(0, this.pos)) + '<b>' + htmlEscape(this.codeStr.charAt(this.pos)) + '</b>' + htmlEscape(this.codeStr.slice(this.pos + 1));
};

Run.prototype.step = function () {
	try {
		this.pos = this.robot.step();
	} catch (e) {
		this.showError(e);
		this.running = false;
	}
	if (this.pos > this.codeStr.length) {
		this.running = false;
		if (this.map.allDone()) {
			this.done = true;
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