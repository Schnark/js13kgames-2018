function CodeInput () {
	document.getElementById('code-input').innerHTML = '<input id="input" placeholder="Type here and hope I code a better input soon!">';
}

CodeInput.prototype.get = function () {
	return document.getElementById('input').value;
};

CodeInput.prototype.clear = function () {
	document.getElementById('input').value = '';
};

CodeInput.prototype.enable = function () {
	document.getElementById('input').disabled = false;
};

CodeInput.prototype.disable = function () {
	document.getElementById('input').disabled = true;
};

