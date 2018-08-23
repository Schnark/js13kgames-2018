var overlay = document.getElementById('overlay'), infoCallback, codeMap = {
	'<': 'code-left',
	'>': 'code-right',
	'_': 'code-go',
	',': 'code-up',
	'.': 'code-down',
	')': 'code-repeat'
};

function htmlEscape (str) {
	return str.replace(/</g, '&lt;');
}

document.getElementById('info-close').addEventListener('click', function () {
	overlay.className = '';
	if (infoCallback) {
		infoCallback();
	}
});

function displayTitle (title) {
	document.getElementById('title').textContent = title;
}

function displayInfo (info, callback) {
	document.getElementById('info-box').innerHTML = info;
	overlay.className = 'visible';
	infoCallback = callback;
}

function displayError (error) {
	document.getElementById('error').textContent = error;
}

function displayMap (map) {
	document.getElementById('map').innerHTML = '<table><tr>' + map.split('').map(function (c) {
		if (c === '\n') {
			return '</tr><tr>';
		}
		return '<td>' + htmlEscape(c) + '</td>';
	}).join('') + '</tr></table>';
}

function displayCode (code, highlight) {
	document.getElementById('code').innerHTML = code.split('').map(function (c, i) {
		if (c === ' ') {
			return '<svg class="highlight"></svg>';
		}
		return displaySymbol(codeMap[c] || 'code-' + c, (i === highlight) && 'highlight');
	}).join('');
}

function displaySymbol (id, cls) {
	return '<svg class="' + (cls ? cls + ' ' : '') + id + '"><use xlink:href="#' + id + '"/></svg>';
}

var display = {
	title: displayTitle,
	info: displayInfo,
	error: displayError,
	map: displayMap,
	code: displayCode,
	symbol: displaySymbol
};