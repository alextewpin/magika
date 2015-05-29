var prepareSpellLists = function(spells) {
	var spellLists = {
		'All': [[], [], [], [], [], [], [], [], [], []]
	};
	spells.forEach(function(spell){
		spellLists['All'][spell.level].push(spell.url);
		spell.classesArray.forEach(function(className) {
			if (spellLists[className])
				spellLists[className][spell.level].push(spell.url);
			else {
				spellLists[className] = [[], [], [], [], [], [], [], [], [], []];
				spellLists[className][spell.level].push(spell.url);
			}
		});
	});
	return spellLists;
}

module.exports = prepareSpellLists;