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

var groupMontersByCR = function(source) {
	var output = [];
	for (i = 1; i <= 34; i++) {
		output.push([])
	}
	source.forEach(function(monster){
		if (output[monster.crNum].indexOf(monster.url) === -1)
			output[monster.crNum].push(monster.url);

	})
	return output;
}

var makeMosterTypeFilterLists = function(monsters) {
	var allCrArray = [];
	for (i = 1; i <= 34; i++) {
		allCrArray.push([])
	}
	var monsterLists = {
		'All': allCrArray
	};
	monsters.forEach(function(monster){
		monsterLists['All'][monster.crNum].push(monster.url);
		if (monsterLists[monster.typeShort] === undefined) {
			var typeCrArray = [];
			for (i = 1; i <= 34; i++) {
				typeCrArray.push([])
			}
			monsterLists[monster.typeShort] = typeCrArray;
		}
		if (monsterLists[monster.typeShort][monster.crNum].indexOf(monster.url) === -1)
			monsterLists[monster.typeShort][monster.crNum].push(monster.url)
	});
	return monsterLists;
}

var makeMosterTypeFilters = function(monsterLists) {
	var monsterTypeList = [];
	for (monsterType in monsterLists)
		monsterTypeList.push(monsterType)

	monsterTypeList.sort(function(a, b){
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	})

	monsterTypeList.splice(monsterTypeList.indexOf('All'), 1);
	monsterTypeList.unshift('All');

	return monsterTypeList;
}

var prepareMonsters = function(monsters) {
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

		monster.typeShort = monster.type.replace('swarm of Tiny beasts', 'beast')
			.replace(', monster manual', '')
			.replace(', lost mine of phandelver', '')
			.replace(', tyranny of dragons', '')
			.replace(', elemental evil', '')
			.replace(', out of the abyss', '')
			.replace(' (human), elemental evil', '')
			.replace(' (elf), elemental evil', '')
			.replace(' (half-elf), elemental evil', '')
			.replace(' (halfling), elemental evil', '')
			.replace(' (shield drarf), elemental evil', '')
			.replace(' (half-dragon), elemental evil', '')
			.replace(' (water genasi), elemental evil', '')
			.replace(' (earth genasi), elemental evil', '')
			.replace(/\s\(.*\)/, '')
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

module.exports.prepareMonsters = prepareMonsters;
module.exports.makeMosterTypeFilterLists = makeMosterTypeFilterLists;
module.exports.makeMosterTypeFilters = makeMosterTypeFilters;
module.exports.groupMontersByCR = groupMontersByCR;