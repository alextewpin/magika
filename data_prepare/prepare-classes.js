var utils = require('./prepare-utils.js');

var makeClassesList = function(source) {
	var output = [];
	output.push(source.map(function(charClass){
		return charClass.url;
	}))
	return output;
}

var prepareClasses = function(charClasses) {
	charClasses.forEach(function(charClass){
		if (charClass.autolevel) {
			charClass.url = utils.nameToUrl(charClass.name);
			charClass.hitDice = '1d' + charClass.hd + ' per ' + charClass.name.toLowerCase() + ' level'
			charClass.hpAtFirstLevel = charClass.hd + ' + your Constitution modifier'
			charClass.hpAtHigherLevels = '1d' + charClass.hd + ' (or ' + Math.ceil((parseInt(charClass.hd) + 1)/2) + ') +  your Constitution modifier per ' + charClass.name.toLowerCase() + ' level after 1st'

			charClass.features = {};
			charClass.slots = {};
			charClass.slotsOptional = false;

			charClass.autolevel.forEach(function(levelObject){
				var level = parseInt(levelObject.$.level)

				if (levelObject.feature) {
					var featuresArray = utils.objectToArray(levelObject.feature)
					featuresArray = featuresArray.map(function(feature){
						feature.optional = false;
						if (feature.$ && feature.$.optional == "YES") {
							feature.optional = true;
							delete feature.$;
						}

						feature.text = utils.stringToArray(feature.text);
						feature.text = feature.text.map(function(p){
							return p.trim();
						})
						feature.text = feature.text.filter(function(p){
							return p !== '';
						})

						delete feature.modifier;
						return feature;
					})
					charClass.features[level] = featuresArray
				}

				if (levelObject.slots) {
					if (levelObject.slots.$ && levelObject.slots.$.optional == "YES") {
						charClass.slotsOptional = true;
						charClass.slots[level] = levelObject.slots._.split(',');
					} else {
						charClass.slots[level] = levelObject.slots.split(',');
					}
				}
			})
			delete charClass.autolevel
		}
	});
	return charClasses;
}

module.exports.prepareClasses = prepareClasses;
module.exports.makeClassesList = makeClassesList;