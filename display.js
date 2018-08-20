function htmlEscape (str) {
	return str.replace(/</g, '&lt;');
}

function displayTitle (title) {
	document.getElementById('title').textContent = title;
}

function displayInfo (info, callback) {
	alert(info);
	if (callback) {
		callback();
	}
}

function displayError (error) {
	document.getElementById('error').textContent = error;
}

function displayMap (map) {
	document.getElementById('map').textContent = map;
}

function displayCode (code, highlight) {
	if (highlight === undefined) {
		highlight = code.length;
	}
	document.getElementById('code').innerHTML = htmlEscape(code.slice(0, highlight)) + '<b>' + htmlEscape(code.charAt(highlight)) + '</b>' + htmlEscape(code.slice(highlight + 1));
}

var display = {
	title: displayTitle,
	info: displayInfo,
	error: displayError,
	map: displayMap,
	code: displayCode
};