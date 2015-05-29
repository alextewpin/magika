var makeCharClassesList = function(spellLists) {
	var charClassesList = [];
	for (className in spellLists)
		charClassesList.push(className)

	charClassesList.sort(function(a, b){
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	})

	return charClassesList;
}

module.exports = makeCharClassesList;