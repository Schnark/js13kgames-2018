/*global CodeInput, Editor, LevelCollection, sound, storage*/
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
		{title: 'Tutorial 1', map: 'Aa3', top: 3, info: 1},
		{title: 'Tutorial 2', map: 'A______1a', top: 7, req: 1, info: 2},
		{title: 'Tutorial 3', map: 'FFFFbF-b___1B-A____a-FFFFBF', top: 18, req: 2, info: 3}
	]},
	{title: 'Foo', req: 3, levels: [
		{title: 'Simple start 1', map: '__A-_F2-a__', top: 10},
		{title: 'Simple start 2', map: 'a_A-_1_-A_a', top: 10, req: 4},
		{title: 'Simple start 3', map: 'B__b-C__c-A_1a', req: 5},
		{title: 'Simple start 4', map: 'B__C-_bc_-1ad_-A__D', req: 6},
		{title: 'Bar', map: 'FFFAFFF-F__2__F-F__a__F-D_dFb_B-F__c__F-F_____F-FFFCFFF', req: 6},
		{title: 'Baz', map: 'FFFAFFF-F__2__F-F__b__F-D_aFc_B-F__d__F-F_____F-FFFCFFF', req: 7},
		{title: 'Go round', map: 'b___d-_FDF_-1BFC_-_FAF_-a___c', req: 7},
		{title: 'Go round again', map: 'a___b-_FDF_-_BFC_-_FAF_-c_0_d', req: 8}
	]},
	{title: 'JS13K', req: 4, levels: [
		{title: 'J', map: 'A____-___F_-___F_-_FaF_-__F1_-_____'},
		{title: 'S', map: '______-__FFF_-_Fa___-__FF__-__3AF_-_FFF__-______'},
		{title: '1', map: 'B____-__FF_-_F2F_-___F_-___F_-___F_-C__bc', req: 5},
		{title: '3', map: '____B-_FF__-__bF_-1FF__-__cF_-_FF__-____C', req: 5},
		{title: 'K', map: 'A_____-_F__F_-_FaF__-_FFe_E-_FcF__-_F__F_-_F__F_-C___3_', req: 7}
	]},
	{title: 'Editor', req: 4, editor: true, info: 4, levels: [
		{title: 'Start editor', info: 5}
	]}
];

if (location.hash) {
	bonus = location.hash.slice(1);
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
editor = new Editor(bonus || '_');
levels = new LevelCollection(levels);

levels.init();