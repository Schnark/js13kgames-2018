/*global display, storage*/
var info, infoCount = storage.get('info', -1), data = [
	'<p>Welcome! Your task is to program a robot to run <b>offline</b>. You enter the code, and once you start the robot, you can no longer change it. So you have to plan ahead how your robot should run. The tutorial levels will teach you how to do so.</p>',
	'<p>Use the virtual keyboard to enter the code for the robot. You have to <kbd>' + display.symbol('code-up') + '</kbd> take the <kbd>' + display.symbol('map-item-a') + '</kbd> item, <kbd>' + display.symbol('code-go') + '</kbd> advance one step, and <kbd>' + display.symbol('code-down') + '</kbd> drop it on the <kbd>' + display.symbol('map-tile-a') + '</kbd> target.</p><p>Then <kbd>' + display.symbol('go') + '</kbd> run the code. If the robot crashes, you have to <kbd>' + display.symbol('reset') + '</kbd> reset it. Use the slider to regulate its speed.</p><p>If you prefer your real keyboard, then type cursor down, underscore, cursor up, enter instead.</p>',
	'<p>You can also turn the robot and repeat parts of the code. For example <kbd>' + display.symbol('code-4') + display.symbol('code-right') + display.symbol('code-repeat') + '</kbd> will turn the robot four times clockwise, after which everything will be the same. To enter this code, use the <kbd>' + display.symbol('code-repeat') + '</kbd> key, increment using the <kbd>' + display.symbol('plus') + '</kbd> key, and insert the code to repeat in the middle (use <kbd>' + display.symbol('left') + '</kbd><kbd>' +  display.symbol('right') + '</kbd> to move the cursor).</p><p>Or again, if you prefer your real keyboard, type 4&gt; for the above code.</p>',
	'This time, you have three items and three targets. You must take the red item to the red target, and the blue items to the blue targets, but it doesn’t matter which blue item you take to which blue target, as long as you take one to each of them.</p><p>Note that the robot can only carry one item at a time, but that you can also drop an item on an empty place and pick it up again later.</p>',
	'<p>Congratulations! You just unlocked the editor. Now you can create your own levels, play them, and share them (just share the URL once you tested your level).</p>',
	'<p>First, decide on the size of the map, and then fill it by selecting the tile and clicking on the map to place it there. Note that you need exactly one starting position, at least one target, and the items and targets must match.</p>'
];

info = {
	show: function (i) {
		if (infoCount < i) {
			display.info(data[i], function () {
				infoCount = i;
				storage.set('info', i);
			});
		}
	}
};