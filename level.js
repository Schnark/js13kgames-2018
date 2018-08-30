/*global Run, codeInput, display, editor*/
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
	display.title(this.title);
	this.onReset();
	this.bind();
	this.wrapper.hidden = false;
	this.abortButton.hidden = false;
	codeInput.clear();
};

Level.prototype.showEditor = function () {
	display.title('Editor');
	this.bind();
	this.wrapper.hidden = false;
	this.abortButton.hidden = false;
	editor.show(this);
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
};