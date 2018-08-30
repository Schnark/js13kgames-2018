//based on https://github.com/foumart/JS.13kGames/blob/master/lib/SoundFX.js
var sound, ac, muted = false;

function playSound (freq, incr, delay, times, vol, type) {
	var i = 0, osc, g, interval;

	function stop () {
		clearInterval(interval);
		osc.stop();
	}

	function internalPlay () {
		osc.frequency.value = freq + incr * i;
		g.gain.value = (1 - (i / times)) * vol;
		i++;
		if (i > times) {
			setTimeout(stop, delay);
		}
	}

	if (!ac) {
		return;
	}
	osc = ac.createOscillator();
	g = ac.createGain();
	osc.connect(g);
	g.connect(ac.destination);

	osc.frequency.value = freq;
	osc.type = ['square', 'sawtooth', 'triangle', 'sine'][type || 0];
	g.gain.value = 0;
	osc.start();
	interval = setInterval(internalPlay, delay);
}

sound = {
	init: function () {
		var AC = window.AudioContext;
		if (!AC) {
			return;
		}
		ac = new AC();
	},
	setMuted: function (onoff) {
		muted = onoff;
	},
	play: function (sound) {
		if (muted) {
			return;
		}
		switch (sound) {
		case 'move':
			playSound(100, -10, 15, 15, 1, 2);
			break;
		case 'turn':
			playSound(260, -60, 15, 15, 0.5, 2);
			break;
		case 'take':
			playSound(220, 15, 15, 15, 0.4, 2);
			break;
		case 'drop':
			playSound(440, -15, 15, 15, 0.4, 2);
			break;
		case 'drop-final':
			playSound(510, 0, 15, 20, 0.1);
			break;
		case 'error':
			playSound(440, -15, 15, 15, 0.5);
			setTimeout(function () {
				playSound(100, -10, 10, 25, 0.5);
			}, 300);
			break;
		case 'win':
			playSound(510, 0, 15, 20, 0.1);
			setTimeout(function () {
				playSound(2600, 1, 10, 50, 0.2);
			}, 80);
		}
	}
};