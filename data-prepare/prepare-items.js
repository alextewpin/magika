const R = require('ramda');
const utils = require('./prepare-utils.js');

function getType (type) {
  switch (type) {
    case '$': return `FILTER-${type}`;
    case 'G': return 'General';
    case 'P': return 'Potion';
    case 'SC': return 'Scroll';
    case 'A': return 'Arrow';
    case 'W': return 'Wondrous Item';
    case 'M': return 'Melee Weapon';
    case 'R': return 'Ranged Weapon';
    case 'ST': return 'Staff';
    case 'RD': return 'Rod';
    case 'WD': return 'Wand';
    case 'RG': return 'Ring';
    case 'LA': return 'Light Armor';
    case 'MA': return 'Medium Armor';
    case 'HA': return 'Heavy Armor';
    case 'S': return 'Shield';
    default: return `WAT-${type}`;
  }
}

function getTypeShort (type) {
  switch (type) {
    case 'W': return 'Wond. Item';
    case 'M': return 'Melee W.';
    case 'R': return 'Ranged W.';
    case 'LA': return 'Light A.';
    case 'MA': return 'Medium A.';
    case 'HA': return 'Heavy A.';
    default: return getType(type);
  }
}

function getTier (rarity) {
  switch (rarity) {
    case 'Common': return 0;
    case 'Uncommon': return 1;
    case 'Rare': return 2;
    case 'Very Rare': return 3;
    case 'Legendary': return 4;
    case 'Artifact': return 5;
    case 'Other': return 6;
    default: return `WAT-${rarity}`;
  }
}

function prepareItems (items) {
  return items
    .map(item => {
      const text = utils.stringToArray(item.text)
        .filter(str => str)
        .filter(str => !str.startsWith('Rarity: '))
        .map(str => str.replace('\t', ''));
      const requiresAttunement = text.some(str => str.startsWith('Requires Attunement'));
      const rarity = item.rarity || 'Other';
      const dmg2 = item.dmg2 ? `, ${item.dmg2}` : '';
      const dmgType = item.dmgType ? ` (${item.dmgType})` : '';
      return {
        url: utils.nameToUrl(item.name),
        name: item.name,
        type: getType(item.type),
        typeShort: getTypeShort(item.type),
        tier: getTier(rarity),
        rarity,
        requiresAttunement,
        text: text.filter(str => str !== 'Requires Attunement'),
        value: item.value,
        ac: item.ac,
        damage: item.dmg1 ? `${item.dmg1}${dmg2}${dmgType}` : null,
        range: item.range
      };
    })
    .filter(item => !item.type.startsWith('FILTER-'));
}

function getByTypeFilterOptions (dictionary, list) {
  const groupedLists = {
    All: Array(8).fill().map(() => [])
  };
  list.forEach(url => {
    const item = dictionary[url];
    if (!groupedLists[item.type]) {
      groupedLists[item.type] = Array(8).fill().map(() => []);
    }
    groupedLists[item.type][item.tier].push(item.url);
    groupedLists.All[item.tier].push(item.url);
  });
  const options = R.pipe(
    R.keys,
    R.filter(item => item !== 'All'),
    R.sort(R.ascend(R.toLower)),
    R.prepend('All')
  )(groupedLists);
  return {
    groupedLists,
    options
  };
}

module.exports = {
  prepareItems,
  getByTypeFilterOptions
};
