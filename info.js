var info, data = [
	'<p>Welcome! Your task is to programm a robot to run offline. You enter the code, and once you start the bot, you can no longer change it. You have to collect some items and drop them in special places.</p>',
	'<p>Use the virtual keyboard to enter the code for the bot. You have to ' + display.symbol('code-up') + ' take the item, ' + display.symbol('code-go') + ' advance one step, and ' + display.symbol('code-down') + ' drop it.</p><p>Then ' + display.symbol('go') + ' run the code. If the bot crashes, you have to ' + display.symbol('reset') + ' reset it. Use the slider to regulate its speed.</p>',
	'<p>You can also turn the bot and repeat parts of the code. For example ' + display.symbol('code-4') + display.symbol('code-right') + display.symbol('code-repeat') + ' will turn the bot four times clockwise, after which everything will be the same. To enter this code, use the ' + display.symbol('code-repeat') + ' key, increment using the + key, and insert the code to repeat in the middle.</p>',
	'This time, you have two items and two targets. Note that the bot can only carry one item at a time.</p>'
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