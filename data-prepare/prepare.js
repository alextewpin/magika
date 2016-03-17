const fs = require('fs');
const xml2js = require('xml2js');

const prepareClasses = require('./prepare-classes.js');
const prepareSpells = require('./prepare-spells.js');
const prepareMonsters = require('./prepare-monsters.js');
const utils = require('./prepare-utils.js');

const parser = new xml2js.Parser({ explicitArray: false });
const parseXml = parser.parseString;

function readXml (dir, file) {
  const folderContent = fs.readdirSync(dir);
  let charClasses = [];
  let charSpells = [];
  let spellsMerged = [];
  let monstersMerged = [];
  if (dir.indexOf('Character Files') !== -1) {
    folderContent.forEach(xmlFileName => {
      const xmlFileNameLc = xmlFileName.toLowerCase();
      if (xmlFileNameLc.indexOf('.xml') !== -1 && xmlFileNameLc.indexOf(file) !== -1) {
        const xmlFile = fs.readFileSync(`${dir}/${xmlFileNameLc}`, { encoding: 'utf-8' });
        parseXml(xmlFile, (err, result) => {
          switch (file) {
            case 'classes':
              charClasses = prepareClasses
                .prepareClasses(result.compendium.class);
              charSpells = prepareClasses
                .prepareClasses(result.compendium.spell);
              break;
            default:
              console.log('No char files here');
          }
        });
      }
    });
  } else {
    folderContent.forEach(xmlFileNameLc => {
      if (xmlFileNameLc.indexOf('.xml') !== -1) {
        const xmlFile = fs.readFileSync(`${dir}/${xmlFileNameLc}`, { encoding: 'utf-8' });
        parseXml(xmlFile, (err, result) => {
          if (dir.indexOf('Spells') !== -1) {
            spellsMerged = spellsMerged.concat(prepareSpells.prepareSpells(result.spells.spell));
          }
          if (dir.indexOf('Bestiary') !== -1) {
            if (result.bestiary) {
              monstersMerged = monstersMerged.concat(prepareMonsters.prepareMonsters(result.bestiary.monster));
            } else {
              monstersMerged = monstersMerged.concat(prepareMonsters.prepareMonsters(result.compendium.monster));
            }
          }
        });
      }
    });
  }
  return {
    charClasses,
    charSpells,
    spellsMerged,
    monstersMerged
  };
}

function main (dir, file) {
  const output = {};
  const data = readXml(dir, file);
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
