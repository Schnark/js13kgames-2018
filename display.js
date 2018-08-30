var overlay = document.getElementById('overlay'),
	closeButton = document.getElementById('info-close'),
	infoCallback,
	codeMap = {
		'<': 'code-left',
		'>': 'code-right',
		'_': 'code-go',
		',': 'code-up',
		'.': 'code-down',
		')': 'code-repeat'
	}, display;

//Firefox can persist disabled state and can get confused by the level buttons that sometimes exist and sometimes don't
closeButton.disabled = false;

closeButton.addEventListener('click', function () {
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
	closeButton.focus();
}

function displayError (error) {
	document.getElementById('error').textContent = error;
}

function displaySymbol (id, cls) {
	return '<svg class="' + (cls ? cls + ' ' : '') + id + '"><use xlink:href="#' + id + '"/></svg>';
}

function displayCode (code, highlight) {
	document.getElementById('code').innerHTML = code.split('').map(function (c, i) {
		if (c === ' ') {
			return '<svg class="highlight"></svg>';
		}
		return displaySymbol(codeMap[c] || 'code-' + c, (i === highlight) && 'highlight');
	}).join('');
}

function displayMapSymbol (c) {
	if (c === '_') {
		return '';
	}
	if (/[0-3]/.test(c)) {
		return displaySymbol('map-r' + c);
	}
	if (/[a-e]/.test(c)) {
		return displaySymbol('map-item-' + c);
	}
	return displaySymbol('map-tile-' + c.toLowerCase());
}

function displayMap (map) {
	document.getElementById('map').innerHTML = '<table><tr>' + map.split('').map(function (c) {
		if (c === '-') {
			return '</tr><tr>';
		}
		return '<td>' + displayMapSymbol(c) + '</td>';
	}).join('') + '</tr></table>';
}

display = {
	title: displayTitle,
	info: displayInfo,
	error: displayError,
	symbol: displaySymbol,
	code: displayCode,
	mapSymbol: displayMapSymbol,
	map: displayMap
};