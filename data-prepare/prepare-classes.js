const utils = require('./prepare-utils.js');

function getFeaturesForLevel (levelObject) {
  return utils.objectToArray(levelObject.feature).map(feature => {
    return {
      title: feature.name,
      isOptional: feature.$ && feature.$.optional === 'YES',
      value: utils.stringToArray(feature.text).map(p => p.trim()).filter(p => (p !== ''))
    };
  });
}

function prepareClasses (charClasses) {
  return charClasses.map(charClass => {
    if (charClass.autolevel) {
      const _charClass = Object.assign({}, charClass);
      const hd = charClass.hd;
      const cls = charClass.name.toLowerCase();
      const avgDice = Math.ceil((parseInt(hd, 10) + 1) / 2);
      _charClass.hitDice = `1d${hd} per ${cls} level`;
      _charClass.hpAtFirstLevel = `${hd} + your Constitution modifier`;
      _charClass.hpAtHigherLevels = `1d${hd} (or ${avgDice}) + your Constitution modifier per ${cls} level after 1st`;

      _charClass.features = [...Array(20)].map(() => []);
      _charClass.slots = [...Array(20)].map(() => []);
      _charClass.slotsOptional = false;

      charClass.autolevel.forEach(levelObject => {
        const levelIndex = Number(levelObject.$.level) - 1;

        if (levelObject.feature) {
          _charClass.features[levelIndex] = getFeaturesForLevel(levelObject);
        }

        if (levelObject.slots) {
          if (levelObject.slots.$ && levelObject.slots.$.optional === 'YES') {
            _charClass.slotsOptional = true;
            _charClass.slots[levelIndex] = levelObject.slots._.split(',');
          } else {
            _charClass.slots[levelIndex] = levelObject.slots.split(',');
          }
        }
      });

      if (_charClass.slots.reduce((sum, level) => { return sum + level.length; }, 0) === 0) {
        _charClass.slots = null;
      }

      _charClass.url = utils.nameToUrl(charClass.name);
      delete _charClass.autolevel;
      return _charClass;
    } else {
      return 'prepare-classes.js 65';
    }
  });
}

module.exports.prepareClasses = prepareClasses;
