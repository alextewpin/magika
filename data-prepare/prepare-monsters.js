const utils = require('./prepare-utils.js');

function propsToArray (props) {
  let _props = utils.objectToArray(props);
  _props = _props.map(prop => {
    prop.text = utils.objectToArray(prop.text);
    return prop;
  });
  return _props;
}

function statFull (stat) {
  const statBonus = Math.floor((stat - 10) / 2);
  let statSymbol = '';
  if (statBonus >= 0) { statSymbol = '+'; }
  return `${stat} ('${statSymbol}${statBonus})`;
}

function groupMontersByCR (source) {
  const output = [];
  for (let i = 1; i <= 34; i++) {
    output.push([]);
  }
  source.forEach(monster => {
    if (output[monster.crNum].indexOf(monster.url) === -1) {
      output[monster.crNum].push(monster.url);
    }
  });
  return output;
}

function makeMosterTypeFilterLists (monsters) {
  const allCrArray = [];
  for (let i = 1; i <= 34; i++) {
    allCrArray.push([]);
  }
  const monsterLists = {
    'All': allCrArray
  };
  monsters.forEach(monster => {
    monsterLists.All[monster.crNum].push(monster.url);
    if (monsterLists[monster.typeShort] === undefined) {
      const typeCrArray = [];
      for (let i = 1; i <= 34; i++) {
        typeCrArray.push([]);
      }
      monsterLists[monster.typeShort] = typeCrArray;
    }
    if (monsterLists[monster.typeShort][monster.crNum].indexOf(monster.url) === -1) {
      monsterLists[monster.typeShort][monster.crNum].push(monster.url);
    }
  });
  return monsterLists;
}

function makeMosterTypeFilters (monsterLists) {
  const monsterTypeList = [];
  for (let monsterType in monsterLists) { // eslint-disable-line prefer-const
    if ({}.hasOwnProperty.call(monsterLists, monsterType)) {
      monsterTypeList.push(monsterType);
    }
  }
  monsterTypeList.sort((a, b) => {
    if (a < b) { return -1; }
    if (a > b) { return 1; }
    return 0;
  });
  monsterTypeList.splice(monsterTypeList.indexOf('All'), 1);
  monsterTypeList.unshift('All');
  return monsterTypeList;
}

function getCrNum (cr) {
  switch (cr) {
    case '0': return 0;
    case '1/8': return 1;
    case '1/4': return 2;
    case '1/2': return 3;
    default: return parseInt(cr, 10) + 3;
  }
}

function getSizeFull (size) {
  switch (size) {
    case 'T': return 'Tiny';
    case 'S': return 'Small';
    case 'M': return 'Medium';
    case 'L': return 'Large';
    case 'H': return 'Huge';
    case 'G': return 'Gargantuan';
    default: console.warn(`Unexpected size: ${size}`);
  }
}

function getTypeShort (type) {
  let typeShort = type.replace('swarm of Tiny beasts', 'beast')
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
    .replace(/\s\(.*\)/, '');
  typeShort = `${typeShort.charAt(0).toUpperCase()}${typeShort.slice(1)}`;
}

function getStatsFull (monster) {
  return {
    strFull: statFull(monster.str),
    dexFull: statFull(monster.dex),
    conFull: statFull(monster.con),
    intFull: statFull(monster['int']),
    wisFull: statFull(monster.wis),
    chaFull: statFull(monster.cha)
  };
}

function prepareMonsters (monsters) {
  monsters.forEach(monster => {
    monster.crNum = getCrNum(monster.cr);
    monster.sizeFull = getSizeFull(monster.size);
    monster.typeShort = getTypeShort(monster.type);

    Object.assign(monster, getStatsFull(monster));

    if (monster.languages === '') { monster.languages = '—'; }
    if (monster.action) { monster.action = propsToArray(monster.action); }
    if (monster.trait) { monster.trait = propsToArray(monster.trait); }
    if (monster.reaction) { monster.reaction = propsToArray(monster.reaction); }
    if (monster.legendary) { monster.legendary = propsToArray(monster.legendary); }

    monster.url = utils.nameToUrl(monster.name);
  });
  return monsters;
}

module.exports.prepareMonsters = prepareMonsters;
module.exports.makeMosterTypeFilterLists = makeMosterTypeFilterLists;
module.exports.makeMosterTypeFilters = makeMosterTypeFilters;
module.exports.groupMontersByCR = groupMontersByCR;
