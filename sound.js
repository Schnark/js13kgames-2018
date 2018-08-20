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
		//TODO
		console.log(sound);
	}
};