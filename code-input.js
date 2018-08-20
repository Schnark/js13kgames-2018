function CodeInput () {
	document.getElementById('code-input').innerHTML = '<input id="input">';
}

CodeInput.prototype.get = function () {
	return document.getElementById('input').value;
};

CodeInput.prototype.clear = function () {
	document.getElementById('input').value = '';
};
