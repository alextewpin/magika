const utils = require('./prepare-utils.js');

function propsToArray (props) {
  return utils.objectToArray(props).map(prop => {
    const _prop = Object.assign({}, prop);
    _prop.text = utils.objectToArray(prop.text);
    return prop;
  });
}

function statFull (stat) {
  const statBonus = Math.floor((stat - 10) / 2);
  let statSymbol = '';
  if (statBonus >= 0) { statSymbol = '+'; }
  return `${stat} (${statSymbol}${statBonus})`;
}

function groupMontersByCR (source) {
  const output = [...Array(34)].map(() => []);
  source.forEach(monster => {
    if (output[monster.crNum].indexOf(monster.url) === -1) {
      output[monster.crNum].push(monster.url);
    }
  });
  return output;
}

function makeMonsterTypeFilterLists (monsters) {
  const allCrArray = [...Array(34)].map(() => []);
  const monsterLists = {
    All: allCrArray
  };
  monsters.forEach(monster => {
    if (monsterLists.All[monster.crNum].indexOf(monster.url) === -1) {
      monsterLists.All[monster.crNum].push(monster.url);
    }
    if (monsterLists[monster.typeShort] === undefined) {
      const typeCrArray = [...Array(34)].map(() => []);
      monsterLists[monster.typeShort] = typeCrArray;
    }
    if (monsterLists[monster.typeShort][monster.crNum].indexOf(monster.url) === -1) {
      monsterLists[monster.typeShort][monster.crNum].push(monster.url);
    }
  });
  return monsterLists;
}

function makeMonsterTypeFilters (monsterLists) {
  const monsterTypeList = Object.keys(monsterLists)
    .sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });
  const allIndex = monsterTypeList.indexOf('All');
  return ['All', ...monsterTypeList.slice(0, allIndex), ...monsterTypeList.slice(allIndex + 1)];
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
    default:
      console.warn(`Unexpected size: ${size}`);
      return '';
  }
}

function getTypeShort (type) {
  const typeShort = type.replace('swarm of Tiny beasts', 'beast')
    .replace(', monster manual', '')
    .replace(', lost mine of phandelver', '')
    .replace(', tyranny of dragons', '')
    .replace(', elemental evil', '')
    .replace(', out of the abyss', '')
    .replace(', curse of strahd', '')
    .replace(', storm kings thunder', '')
    .replace(', Volo\'s Guide, Volo\'s Guide', '')
    .replace(', Volo\'s Guide', '')
    .replace(' (human), elemental evil', '')
    .replace(' (elf), elemental evil', '')
    .replace(' (half-elf), elemental evil', '')
    .replace(' (halfling), elemental evil', '')
    .replace(' (shield drarf), elemental evil', '')
    .replace(' (half-dragon), elemental evil', '')
    .replace(' (water genasi), elemental evil', '')
    .replace(' (earth genasi), elemental evil', '')
    .replace(' (shield dwarf), storm kings thunder', '')
    .replace(' (Illuskan human), storm kings thunder', '')
    .replace(' (Illuskan humanoid), storm kings thunder', '')
    .replace(' (Turami human), storm kings thunder', '')
    .replace(' (shield dwarf), storm kings thunder', '')
    .replace(' (shield dwarf), storm kings thunder', '')
    .replace(/\s\(.*\)/, '');
  return `${typeShort.charAt(0).toUpperCase()}${typeShort.slice(1)}`;
}

function getStatsFull (monster) {
  return {
    str: statFull(monster.str),
    dex: statFull(monster.dex),
    con: statFull(monster.con),
    int: statFull(monster.int),
    wis: statFull(monster.wis),
    cha: statFull(monster.cha)
  };
}

function getTraits (traits) {
  return traits.map(trait => {
    return {
      title: trait.name,
      value: utils.stringToArray(trait.text)
    };
  });
}

function prepareMonsters (monsters) {
  return monsters.map(monster => {
    const _monster = Object.assign({}, monster);
    _monster.crNum = getCrNum(monster.cr);
    _monster.sizeFull = getSizeFull(monster.size);
    _monster.typeShort = getTypeShort(monster.type);
    _monster.stats = getStatsFull(monster);

    if (monster.languages === '') { _monster.languages = '—'; }
    if (monster.action) { _monster.action = getTraits(propsToArray(monster.action)); }
    if (monster.trait) { _monster.trait = getTraits(propsToArray(monster.trait)); }
    if (monster.reaction) { _monster.reaction = getTraits(propsToArray(monster.reaction)); }
    if (monster.legendary) { _monster.legendary = getTraits(propsToArray(monster.legendary)); }

    _monster.url = utils.nameToUrl(monster.name);

    delete _monster.str;
    delete _monster.dex;
    delete _monster.con;
    delete _monster.int;
    delete _monster.wis;
    delete _monster.cha;

    return _monster;
  });
}

module.exports.prepareMonsters = prepareMonsters;
module.exports.makeMonsterTypeFilterLists = makeMonsterTypeFilterLists;
module.exports.makeMonsterTypeFilters = makeMonsterTypeFilters;
module.exports.groupMontersByCR = groupMontersByCR;
