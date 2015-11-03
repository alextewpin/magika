var fs = require('fs');
var xml2js = require('xml2js');

var prepareClasses = require('./prepare-classes.js');
var prepareSpells = require('./prepare-spells.js');
var prepareMonsters = require('./prepare-monsters.js');
var utils = require('./prepare-utils.js');

var parser = new xml2js.Parser({explicitArray: false});
var parseXml = parser.parseString;

var readXml = function(dir, file) {
	var folderContent = fs.readdirSync(dir);
	var charClasses = [];
	var charSpells = [];
	var spellsMerged = [];
	var monstersMerged = [];

	if (dir.indexOf('Character Files') !== -1) {
		folderContent.forEach(function(xmlFileName){
			xmlFileName = xmlFileName.toLowerCase();
			if (xmlFileName.indexOf('.xml') !== -1 && xmlFileName.indexOf(file) !== -1) {
				var xmlFile = fs.readFileSync(dir + '/' + xmlFileName, {encoding: 'utf-8'});
				parseXml(xmlFile, function(err, result){
					switch (file) {
						case 'classes':
							charClasses = prepareClasses.prepareClasses(result.compendium['class']);
							charSpells = prepareClasses.prepareClasses(result.compendium.spell);
							break;
						default:
							cosole.log('No char files here')
					}
				});
			}
		})
	} else {
		folderContent.forEach(function(xmlFileName){
			if (xmlFileName.indexOf('.xml') !== -1) {
				var xmlFile = fs.readFileSync(dir + '/' + xmlFileName, {encoding: 'utf-8'});
				parseXml(xmlFile, function(err, result){
					if (dir.indexOf('Spells') !== -1) {
						spellsMerged = spellsMerged.concat(prepareSpells.prepareSpells(result.spells.spell));
					}
					if (dir.indexOf('Bestiary') !== -1) {
						if (result.bestiary)
							monstersMerged = monstersMerged.concat(prepareMonsters.prepareMonsters(result.bestiary.monster));
						else
							monstersMerged = monstersMerged.concat(prepareMonsters.prepareMonsters(result.compendium.monster));
					}
				});
			}
		})
	}
	return {
		charClasses: charClasses,
		charSpells: charSpells,
		spellsMerged: spellsMerged,
		monstersMerged: monstersMerged
	}
}

var main = function (dir, file) {
	var output = {};
	var data = readXml(dir, file);
	if (data.charClasses.length > 0) {
		data.charClasses = utils.sortByName(data.charClasses);
		output.CLASSES = prepareClasses.makeClassesList(data.charClasses);
		output.CLASSES_BY_KEY = utils.convertToObjects(data.charClasses);
	}
	if (data.spellsMerged.length > 0) {
		data.spellsMerged = utils.sortByName(data.spellsMerged);
		output.SPELLS_BY_KEY = utils.convertToObjects(data.spellsMerged);
		output.SPELLS_GROUPED_BY_LEVEL = prepareSpells.groupSpellsByLevel(data.spellsMerged);
		output.SPELLS_CHAR_FILTER_LISTS = prepareSpells.makeSpellsCharFilterLists(data.spellsMerged);
		output.SPELLS_CHAR_FILTERS = prepareSpells.makeSpellsCharFilters(output.SPELLS_CHAR_FILTER_LISTS);
	}
	if (data.monstersMerged.length > 0) {
		data.monstersMerged = utils.sortByName(data.monstersMerged);
		output.MONSTERS_BY_KEY = utils.convertToObjects(data.monstersMerged);
		output.MONSTERS_GROUPED_BY_CR = prepareMonsters.groupMontersByCR(data.monstersMerged);
		output.MONSTER_TYPE_FILTER_LISTS = prepareMonsters.makeMosterTypeFilterLists(data.monstersMerged);
		output.MONSTER_TYPE_FILTERS = prepareMonsters.makeMosterTypeFilters(output.MONSTER_TYPE_FILTER_LISTS);
	}
	return JSON.stringify(output, null, '\t');
}

module.exports = main;