var utils = {};

utils.stringToArray = function(text){
	if (typeof text == 'string' || text instanceof String) {
		textArray = [];
		textArray.push(text);
		return textArray;
	} else {
		return text;
	}
}

utils.nameToUrl = function(name) {
	var url = name.replace(/\s/g, '_');
	url = url.replace(/\//g, '_');
	return url;
}

utils.sortByName = function(list) {
	return list.sort(function(a, b){
		var itemA = a.name.toLowerCase();
		var itemB = b.name.toLowerCase();
		if (itemA < itemB)
			return -1 
		if (itemA > itemB)
			return 1
		return 0
	});
}

module.exports = utils;