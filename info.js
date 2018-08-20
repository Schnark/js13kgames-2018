var info, data = [
	'Welcome! Your task is to programm a robot to run offline.',
	'The symbol for "grab" is ",", the symbol for move is "_", the symbol for drop is ".".',
	'Use "<" and ">" to turn and "n...)" to repeat something n times.'
];

info = {
	show: function (i) {
		if (storage.get('info', -1) < i) {
			display.info(data[i], function () {
				storage.set('info', i);
			});
		}
	}
};