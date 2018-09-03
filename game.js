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
	{title: 'Let’s Start!', req: 3, levels: [
		{title: 'Welcome!', map: 'A___a-_____-__0__', top: 10},
		{title: 'One', map: '__A-_F2-a__', top: 10, req: 4},
		{title: 'Two', map: 'a_A-_1_-A_a', top: 10, req: 5},
		{title: 'Three', map: 'B__b-C__c-A_1a', top: 16, req: 6},
		{title: 'Four', map: 'B__C-_bc_-1ad_-A__D', top: 12, req: 7},
		{title: 'Five', map: 'ABCDE-abcde-1____', top: 11, req: 8}
	]},
	{title: 'Circling the Square', req: 4, levels: [
		{title: 'Easy Square', map: 'FFFAFFF-F__2__F-F__a__F-D_dFb_B-F__c__F-F_____F-FFFCFFF', top: 12},
		{title: 'Still Easy', map: 'FFFAFFF-F__2__F-F__b__F-D_aFc_B-F__d__F-F_____F-FFFCFFF', top: 13, req: 5},
		{title: 'Full Square', map: '_FAFBF_-F1acb_F-DdFCFdD-FbBFAaF-CcFDFcC-F_adb_F-_FAFBF_', top: 19, req: 7},
		{title: 'Easy again', map: 'b___d-_FDF_-1BFC_-_FAF_-a___c', top: 16, req: 9},
		{title: 'Not So Easy', map: 'a___b-_FDF_-1BFC_-_FAF_-c___d', top: 43, req: 10}
	]},
	{title: 'JS13K', req: 5, levels: [
		{title: 'J', map: 'A____-___F_-___F_-_FaF_-__F1_-_____', top: 17},
		{title: 'S', map: '______-__FFF_-_Fa___-__FF__-__3AF_-_FFF__-______', top: 34, req: 6},
		{title: '1', map: 'B____-__FF_-_F2F_-___F_-___F_-___F_-C__bc', top: 27, req: 9},
		{title: '3', map: '____B-_FF__-__bF_-1FF__-__cF_-_FF__-____C', top: 36, req: 10},
		{title: 'K', map: 'A_____-_F__F_-_FaF__-_FFe_E-_FcF__-_F__F_-_F__F_-C___3_', top: 50, req: 13}
	]},
	{title: 'Even More Levels', req: 7, levels: [
		{title: 'Stairs', map: '__FF_A-_FF__F-FF__FF-F__FF_-1aFF__', top: 8},
		{title: 'Upside down', map: 'A_e-B_d-C3c-D_b-E_a', top: 43, req: 11},
		{title: 'Clock', map: '__FFAFFF__-_FF_a_FFF_-FFDd_bBCFF-FFC____c_F-F_c_0___dD-Bb_____a_F-F_a____AFF-FFADd_bBFF-_FFF_c_FF_-__FFFCFF__', top: 18, req: 15},
		{title: 'Race Course', map: '______A-aBFFFFF-_______-FFFFFCb-_______-cDFFFFF-_____1d', top: 43, req: 19},
		{title: 'Crazy', map: '____E_____-D_B_dAcB_C-_1__e_____-E_A__a_D_a-__db_dC_Ab-_B_C__eb__-a__ac__C_c-__e_bA___D-E_D___d_B_-__e__E___c', req: 23} //I'm crazy enough to create this level, but not crazy enough to solve it, so no top score here
	]},
	{title: 'Editor', req: 5, editor: true, info: 4, levels: [
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