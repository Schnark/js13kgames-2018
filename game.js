var codeInput, soundCheckbox, levels;

codeInput = new CodeInput();

soundCheckbox = document.getElementById('sound-checkbox');

function onMuteUnmute () {
	var checked = soundCheckbox.checked;
	sound.setMuted(!checked);
	storage.set('sound', checked);
}

soundCheckbox.checked = storage.get('sound', true);
soundCheckbox.addEventListener('change', onMuteUnmute);
onMuteUnmute();

levels = new LevelCollection([
	{title: 'Tutorial', info: 0, levels: [
		{title: 'Tutorial 1', map: 'Aa<', top: 3, info: 1},
		{title: 'Tutorial 2', map: 'A      >a', top: 7, req: 1, info: 2}, //TODO top: 6 falls ) nicht zählt
		{title: 'Tutorial 3', map: 'A<a\nB b', req: 2}
	]},
	{title: 'Foo', req: 3, levels: [
		{title: 'Foo', map: 'A<a\nB b\nC c'}
	]}
]);

levels.init();

document.getElementById('reset-scores').addEventListener('click', levels.clearScores.bind(levels));
document.getElementById('reset-info').addEventListener('click', function () {
	storage.remove('info');
});