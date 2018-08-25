var codeInput, editor, soundCheckbox, levels, bonus;

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

levels = [
	{title: 'Tutorial', info: 0, levels: [
		{title: 'Tutorial 1', map: 'Aa<', top: 3, info: 1},
		{title: 'Tutorial 2', map: 'A      >a', top: 7, req: 1, info: 2},
		{title: 'Tutorial 3', map: 'A<a\nB b', req: 2, info: 3}
	]},
	{title: 'Foo', req: 3, levels: [
		{title: 'Foo', map: 'A<a\nB b\nC c'}
	]},
	{title: 'Editor', req: 3, editor: true, levels: [
		{title: 'Start editor'}
	]}
];


if (location.hash) {
	bonus = decodeURIComponent(location.hash.slice(1));
	if (!Editor.isValid(bonus)) {
		bonus = false;
	}
}

if (bonus) {
	levels.splice(-1, 0, {
		title: 'Bonus', levels: [
			{title: 'Bonus', map: bonus}
		]
	});
}
editor = new Editor(bonus || ' ');
levels = new LevelCollection(levels);

levels.init();

document.getElementById('reset-scores').addEventListener('click', levels.clearScores.bind(levels));
document.getElementById('reset-info').addEventListener('click', function () {
	storage.remove('info');
});