var muted = false, sound = {
	init: function () {
		//TODO
	},
	setMuted: function (onoff) {
		muted = onoff;
	},
	play: function (sound) {
		if (muted) {
			return;
		}
		//move, turn, take, drop, drop-final, error, win
		//TODO
		console.log(sound);
	}
};