function Robot (map) {
	var start = map.getStart();
	this.x = start[0];
	this.y = start[1];
	this.dir = start[2];
	this.map = map;
}

Robot.prototype.getPos = function () {
	return [this.x, this.y, this.dir];
};

Robot.prototype.setCode = function (code) {
	this.code = code;
	this.codePos = 0;
	this.stack = [];
};

Robot.prototype.getNextPos = function () {
	switch (this.dir) {
	case 0: return [this.x, this.y - 1];
	case 1: return [this.x + 1, this.y];
	case 2: return [this.x, this.y + 1];
	case 3: return [this.x - 1, this.y];
	}
};

Robot.prototype.move = function () {
	var newPos = this.getNextPos(), type;
	type = this.map.getType(newPos[0], newPos[1]);
	if (type !== ' ') {
		throw new Error('Crashed into "' + type + '"!');
	}
	this.x = newPos[0];
	this.y = newPos[1];
	sound.play('move');
};

Robot.prototype.turn = function (dir) {
	this.dir = (this.dir + dir + 4) % 4;
	sound.play('turn');
};

Robot.prototype.take = function () {
	var pos, type;
	if (this.item) {
		throw new Error('Can\'t take two things!');
	}
	pos = this.getNextPos();
	type = this.map.getType(pos[0], pos[1]);
	if (['a', 'b', 'c', 'd', 'e'].indexOf(type) === -1) {
		throw new Error('Nothing to take!');
	}
	this.item = type;
	this.map.setType(pos[0], pos[1], ' ');
	sound.play('take');
};

Robot.prototype.drop = function () {
	var pos, type;
	if (!this.item) {
		throw new Error('Nothing to drop!');
	}
	pos = this.getNextPos();
	type = this.map.getType(pos[0], pos[1]);
	if (type !== ' ' && type !== this.item.toUpperCase()) {
		throw new Error('Can\'t drop it here!');
	}
	this.map.setType(pos[0], pos[1], type === ' ' ? this.item : '*');
	this.item = '';
	sound.play(type === ' ' ? 'drop' : 'drop-final');
};

Robot.prototype.step = function () {
	var token, oldPos;
	token = this.code[this.codePos];
	switch (token) {
	case '<': this.turn(-1); break;
	case '>': this.turn(1); break;
	case '_': this.move(); break;
	case ',': this.take(); break;
	case '.': this.drop(); break;
	case ')':
		oldPos = this.stack.pop();
		if (oldPos !== -1) {
			this.codePos = oldPos - 1; //codePos will be incremented below, so subtrcat 1
		}
		break;
	case '1': this.stack.push(-1); break;
	default:
		this.code = this.code.slice(0, this.codePos) + String(Number(token) - 1) + this.code.slice(this.codePos + 1);
		this.stack.push(this.codePos);
	}
	this.codePos++;
	return this.codePos;
};