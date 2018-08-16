function Map (str) {
	this.grid = str.split('\n').map(function (line, y) {
		var match = /(.*)([v<>^])(.*)/.exec(line);
		if (match) {
			this.start = [match[1].length, y, '^>v<'.indexOf(match[2])];
			line = match[1] + ' ' + match[3];
		}
		return line.split('');
	}.bind(this));
}

Map.prototype.getStart = function () {
	return this.start;
};

Map.prototype.getType = function (x, y) {
	return (this.grid[y] || [])[x] || '';
};

Map.prototype.setType = function (x, y, type) {
	this.grid[y][x] = type;
};

Map.prototype.allDone = function () {
	return !/[A-Z]/.test(this.grid.map(function (line) {
		return line.join('');
	}).join(''));
};

Map.prototype.draw = function (robot) {
	var pos = robot.getPos();
	//TODO
	document.getElementById('map').textContent = this.grid.map(function (line, y) {
		var str = line.join('');
		if (y === pos[1]) {
			str = str.slice(0, pos[0]) + ['^', '>', 'v', '<'][pos[2]] + str.slice(pos[0] + 1);
		}
		return str;
	}).join('\n');
};