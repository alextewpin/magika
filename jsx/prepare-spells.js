var utils = require('./prepare-utils.js');

var prepareSpells = function(spells) {
	spells = utils.sortByName(spells);
	spells.forEach(function(spell) {
		spell.level = parseInt(spell.level);

		switch (spell.school) {
			case 'A': 
				spell.school = 'abjuration'
				break;
			case 'C': 
				spell.school = 'conjuration'
				break;
			case 'D': 
				spell.school = 'divination'
				break;
			case 'EN': 
				spell.school = 'enchantment'
				break;
			case 'EV': 
				spell.school = 'evocation'
				break;
			case 'I': 
				spell.school = 'illusion'
				break;
			case 'N': 
				spell.school = 'necromancy'
				break;
			case 'T':
				spell.school = 'transmutation'
				break;
			default:
				spell.school = ''
		}

		var schoolAndLevel = '';
		switch (spell.level) {
			case '0':
				schoolAndLevel = spell.school.charAt(0).toUpperCase() + spell.school.substring(1) + ' cantrip';
				break;
			case '1':
				schoolAndLevel = '1st level ' + spell.school;
				break;
			case '2':
				schoolAndLevel = '2nd level ' + spell.school;
				break;
			case '3':
				schoolAndLevel = '3rd level ' + spell.school;
				break;
			default:
				schoolAndLevel = spell.level + 'th level ' + spell.school;
		}
		if (spell.ritual === 'YES')
			schoolAndLevel = schoolAndLevel + ' (ritual)';
		spell.schoolAndLevel = schoolAndLevel;

		var timeShort = ''
		if (spell.time.indexOf('bonus') != -1)
			timeShort = 'Bonus'
		if (spell.time.indexOf('reaction') != -1)
			timeShort = 'Reaction'
		spell.timeShort = timeShort;

		var rangeShort = ''
		if (spell.range.indexOf('(') != -1) {
			rangeShort = spell.range.substring(spell.range.indexOf('(') + 1, spell.range.length - 1)
			rangeShort = rangeShort.replace('foot', 'f.');
			rangeShort = rangeShort.replace('mile', 'm.');
			rangeShort = rangeShort.replace('-radius', ' radius');
			rangeShort = rangeShort.replace(' hemisphere', '');
			rangeShort = rangeShort.replace(' sphere', '');
		}

		if (spell.range.indexOf('feet') != -1) {
			rangeShort = spell.range;
			//spell.rangeShort = spell.range.replace('feet', 'f.');
		}
		spell.rangeShort = rangeShort;

		var durationShort = '';
		if (spell.duration != 'Instantaneous' && spell.duration != 'Until dispelled' && spell.duration != 'Until dispelled or triggered' && spell.duration != 'Special') {
			durationShort = spell.duration;
			durationShort = durationShort.replace('1min', '1 minute');
			durationShort = durationShort.replace('rounds', 'r.');
			durationShort = durationShort.replace('round', 'r.');
			durationShort = durationShort.replace('minutes', 'm.');
			durationShort = durationShort.replace('minute', 'm.');
			durationShort = durationShort.replace('hours', 'h.');
			durationShort = durationShort.replace('hour', 'h.');
			durationShort = durationShort.replace('days', 'd.');
			durationShort = durationShort.replace('day', 'd.');
			durationShort = durationShort.replace('Concentration, up to ', '');
			durationShort = durationShort.replace('Up to ', '');
		}
		spell.durationShort = durationShort;

		spell.concentration = false;
		if (spell.duration.indexOf('Concentration') != -1)
			spell.concentration = true;

		spell.text = utils.stringToArray(spell.text);
		spell.url = utils.nameToUrl(spell.name);

		var classesArray = spell.classes.split(',');
		classesArray = classesArray.map(function(className) {
			return className.trim();
		});
		spell.classesArray = classesArray;

	});
	return spells;
}

module.exports = prepareSpells;