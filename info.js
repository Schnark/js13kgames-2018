var info, data = [
	'<p>Welcome! Your task is to programm a robot to run <b>offline</b>. You enter the code, and once you start the bot, you can no longer change it. You have to collect some items and drop them in special places.</p>',
	'<p>Use the virtual keyboard to enter the code for the bot. You have to <kbd>' + display.symbol('code-up') + '</kbd> take the item, <kbd>' + display.symbol('code-go') + '</kbd> advance one step, and <kbd>' + display.symbol('code-down') + '</kbd> drop it.</p><p>Then <kbd>' + display.symbol('go') + '</kbd> run the code. If the bot crashes, you have to <kbd>' + display.symbol('reset') + '</kbd> reset it. Use the slider to regulate its speed.</p>',
	'<p>You can also turn the bot and repeat parts of the code. For example <kbd>' + display.symbol('code-4') + display.symbol('code-right') + display.symbol('code-repeat') + '</kbd> will turn the bot four times clockwise, after which everything will be the same. To enter this code, use the <kbd>' + display.symbol('code-repeat') + '</kbd> key, increment using the <kbd>' + display.symbol('plus') + '</kbd> key, and insert the code to repeat in the middle (use <kbd>' + display.symbol('left') + display.symbol('right') + '</kbd> to move the cursor).</p>',
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