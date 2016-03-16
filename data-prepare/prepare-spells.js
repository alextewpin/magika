const utils = require('./prepare-utils.js');

function groupSpellsByLevel (source) {
  const output = [[], [], [], [], [], [], [], [], [], []];
  source.forEach(spell => {
    if (output[spell.level].indexOf(spell.url) === -1) {
      output[spell.level].push(spell.url);
    }
  });
  return output;
}

function makeSpellsCharFilterLists (spells) {
  const spellLists = {
    All: [[], [], [], [], [], [], [], [], [], []]
  };
  spells.forEach(spell => {
    spellLists.All[spell.level].push(spell.url);
    spell.classesArray.forEach(className => {
      if (spellLists[className]) {
        spellLists[className][spell.level].push(spell.url);
      } else {
        spellLists[className] = [[], [], [], [], [], [], [], [], [], []];
        spellLists[className][spell.level].push(spell.url);
      }
    });
  });
  return spellLists;
}

function makeSpellsCharFilters (spellLists) {
  const charClassesList = Object.keys(spellLists)
    .sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });
  return charClassesList.splice(charClassesList.indexOf('All'), 1).splice(0, 0, 'All');
}

function getSpellSchool (school) {
  switch (school) {
    case 'A': return 'abjuration';
    case 'C': return 'conjuration';
    case 'D': return 'divination';
    case 'EN': return 'enchantment';
    case 'EV': return 'evocation';
    case 'I': return 'illusion';
    case 'N': return 'necromancy';
    case 'T': return 'transmutation';
    default: return '';
  }
}

function getSchoolAndLevelRaw (school, level) {
  switch (level) {
    case 0: return `${school.charAt(0).toUpperCase()}${school.substring(1)} cantrip`;
    case 1: return `1st level ${school}`;
    case 2: return `2nd level ${school}`;
    case 3: return `3rd level ${school}`;
    default: return `${level}th level ${school}`;
  }
}

function getSchoolAndLevel (school, level, ritual) {
  let schoolAndLevel = getSchoolAndLevelRaw(school, level);
  if (ritual === 'YES') {
    schoolAndLevel = `${schoolAndLevel} (ritual)`;
  }
  return schoolAndLevel;
}

function getTimeShort (time) {
  let timeShort = '';
  if (time.indexOf('bonus') !== -1) { timeShort = 'Bonus'; }
  if (time.indexOf('reaction') !== -1) { timeShort = 'Reaction'; }
  return timeShort;
}

function getRangeShort (range) {
  let rangeShort = '';
  if (range.indexOf('(') !== -1) {
    rangeShort = range.substring(range.indexOf('(') + 1, range.length - 1);
    rangeShort = rangeShort.replace('foot', 'f.');
    rangeShort = rangeShort.replace('mile', 'm.');
    rangeShort = rangeShort.replace('-radius', ' radius');
    rangeShort = rangeShort.replace(' hemisphere', '');
    rangeShort = rangeShort.replace(' sphere', '');
  }
  if (range.indexOf('feet') !== -1) {
    rangeShort = range;
  }
  return rangeShort;
}

function getDurationShort (duration) {
  let durationShort = '';
  if (duration !== 'Instantaneous' &&
      duration !== 'Until dispelled' &&
      duration !== 'Until dispelled or triggered' &&
      duration !== 'Special') {
    durationShort = duration;
    durationShort = durationShort.replace('1min', '1 minute');
    durationShort = durationShort.replace('rounds', 'r.');
    durationShort = durationShort.replace('round', 'r.');
    durationShort = durationShort.replace('minutes', 'm.');
    durationShort = durationShort.replace('minute', 'm.');
    durationShort = durationShort.replace('hours', 'h.');
    durationShort = durationShort.replace('hour', 'h.');
    durationShort = durationShort.replace('days', 'd.');
    durationShort = durationShort.replace('day', 'd.');
    durationShort = durationShort.replace('Concentration, up to ', '');
    durationShort = durationShort.replace('Up to ', '');
  }
  return durationShort;
}

function getClassesArray (classes) {
  let classesArray = classes.split(',');
  classesArray = classesArray.map(className => {
    return className.trim();
  });
  return classesArray;
}

function prepareSpells (spells) {
  return spells.map(spell => {
    const _spell = Object.assign({}, spell);
    _spell.level = parseInt(spell.level, 10);
    _spell.school = getSpellSchool(spell.school);
    _spell.schoolAndLevel = getSchoolAndLevel(spell.school, spell.level, spell.ritual);
    _spell.timeShort = getTimeShort(spell.time);
    _spell.rangeShort = getRangeShort(spell.range);
    _spell.durationShort = getDurationShort(spell.duration);
    _spell.classesArray = getClassesArray(spell.classes);
    _spell.concentration = spell.duration.indexOf('Concentration') !== -1;

    _spell.url = utils.nameToUrl(spell.name);

    _spell.hiLevelIndex = -1;
    _spell.text = utils.stringToArray(spell.text)
      .filter(p => {
        return p !== '';
      })
      .map((p, i) => {
        if (p.substr(0, 16) === 'At Higher Levels') {
          _spell.hiLevelIndex = i;
          return p.replace('At Higher Levels: ', '');
        } else {
          return p;
        }
      });
    return _spell;
  });
}

function prepareSpellsShort (spells) {
  return spells.map(spell => {
    return {
      name: spell.name,
      url: spell.url,
      level: spell.level,
      concentration: spell.concentration,
      ritual: spell.ritual,
      school: spell.school
    };
  });
}

module.exports.prepareSpells = prepareSpells;
module.exports.prepareSpellsShort = prepareSpellsShort;
module.exports.makeSpellsCharFilters = makeSpellsCharFilters;
module.exports.makeSpellsCharFilterLists = makeSpellsCharFilterLists;
module.exports.groupSpellsByLevel = groupSpellsByLevel;
