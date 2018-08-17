function htmlEscape (str) {
	return str.replace(/</g, '&lt;');
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
	error: displayError,
	map: displayMap,
	code: displayCode
};