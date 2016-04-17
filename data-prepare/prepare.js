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
            spellsMerged = spellsMerged.concat(prepareSpells.prepareSpells(result.compendium.spell));
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
    output.CLASSES = {
      dictionary: utils.convertToObjects(data.charClasses),
      list: utils.makeList(utils.convertToObjects(data.charClasses))
    };
  }
  if (data.spellsMerged.length > 0) {
    data.spellsMerged = utils.sortByName(data.spellsMerged);
    output.SPELLBOOK = {
      dictionary: utils.convertToObjects(data.spellsMerged),
      list: utils.makeList(utils.convertToObjects(data.spellsMerged)),
      byClass: {
        groupedLists: prepareSpells.makeSpellsCharFilterLists(data.spellsMerged),
        options: prepareSpells.makeSpellsCharFilters(prepareSpells.makeSpellsCharFilterLists(data.spellsMerged))
      }
    };
  }
  if (data.monstersMerged.length > 0) {
    data.monstersMerged = utils.sortByName(data.monstersMerged);
    output.BESTIARY = {
      dictionary: utils.convertToObjects(data.monstersMerged),
      list: utils.makeList(utils.convertToObjects(data.monstersMerged)),
      byType: {
        groupedLists: prepareMonsters.makeMonsterTypeFilterLists(data.monstersMerged),
        options: prepareMonsters.makeMonsterTypeFilters(
          prepareMonsters.makeMonsterTypeFilterLists(data.monstersMerged))
      }
    };
  }
  return JSON.stringify(output, null, '\t');
}

module.exports = main;
