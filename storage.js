var prefix = 'schnark-js13k2018-', storage;

function get (key, defaultValue) {
	try {
		return JSON.parse(localStorage.getItem(prefix + key) || 'x');
	} catch (e) {
		return defaultValue;
	}
}

function set (key, value) {
	try {
		localStorage.setItem(prefix + key, JSON.stringify(value));
	} catch (e) {
	}
}

/*function remove (key) {
	try {
		localStorage.removeItem(prefix + key);
	} catch (e) {
	}
}*/

storage = {
	get: get,
	set: set
};