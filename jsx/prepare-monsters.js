var utils = require('./prepare-utils.js');

var propsToArray = function(props) {
	props = utils.objectToArray(props);
	props.map(function(prop){
		prop.text = utils.objectToArray(prop.text);
		return prop;
	})
	return props;
}

var statFull = function(stat) {
	var statBonus = Math.floor((stat-10)/2);
	var statSymbol = '';
	if (statBonus >= 0)
		statSymbol = '+'
	return stat + ' (' + statSymbol + statBonus + ')';
}

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

		switch (monster.size) {
			case 'T':
				monster.sizeFull = 'Tiny';
				break;
			case 'S':
				monster.sizeFull = 'Small';
				break;
			case 'M':
				monster.sizeFull = 'Medium';
				break;
			case 'L':
				monster.sizeFull = 'Large';
				break;
			case 'H':
				monster.sizeFull = 'Huge';
				break;
			case 'G':
				monster.sizeFull = 'Gargantuan';
				break;
			default:
				console.warn(monster.size);
		}

		monster.strFull = statFull(monster.str);
		monster.dexFull = statFull(monster.dex);
		monster.conFull = statFull(monster.con);
		monster.intFull = statFull(monster.int);
		monster.wisFull = statFull(monster.wis);
		monster.chaFull = statFull(monster.cha);

		monster.typeShort = monster.type.replace('swarm of Tiny beasts', 'beast').replace(', monster manual', '').replace(/\s\(.*\)/, '')
		monster.typeShort = monster.typeShort.charAt(0).toUpperCase() + monster.typeShort.slice(1);

		if (monster.languages === '')
			monster.languages = '—'

		if (monster.action)
			monster.action = propsToArray(monster.action);

		if (monster.trait)
			monster.trait = propsToArray(monster.trait);

		if (monster.reaction)
			monster.reaction = propsToArray(monster.reaction);

		if (monster.legendary)
			monster.legendary = propsToArray(monster.legendary);

		monster.url = utils.nameToUrl(monster.name);
	});

	return monsters;
}

module.exports = prepareMonsters;