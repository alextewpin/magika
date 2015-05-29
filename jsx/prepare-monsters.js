var utils = require('./prepare-utils.js');

var prepareMonsters = function(monsters) {
	monsters = utils.sortByName(monsters);
	monsters.forEach(function(monster) {
		switch (monster.cr) {
			case '0':
				monster.crNum = 0;
				break;
			case '1/8':
				monster.crNum = 1;
				break;
			case '1/4':
				monster.crNum = 2;
				break;
			case '1/2':
				monster.crNum = 3;
				break;
			default:
				monster.crNum = parseInt(monster.cr) + 3;
		}

		//spell.text = utils.stringToArray(spell.text);
		monster.url = utils.nameToUrl(monster.name);
	});

	return monsters;
}

module.exports = prepareMonsters;