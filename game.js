var mapStr = 'A      >a', runButton, resetButton;

function init () {
	runButton = document.getElementById('run-button');
	resetButton = document.getElementById('reset-button')
	runButton.addEventListener('click', start);
	resetButton.addEventListener('click', reset);
	reset();
}

function start () {
	var run = new Run(mapStr, document.getElementById('code-input').value, function (done) {
		alert(done);
		resetButton.disabled = false;
	});
	run.run(1000);
	runButton.disabled = true;
}

function reset () {
	display.map(mapStr);
	display.error('');
	display.code('');
	runButton.disabled = false;
	resetButton.disabled = true;
}

init();