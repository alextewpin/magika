const utils = require('./prepare-utils.js');

function getFeaturesForLevel (levelObject) {
  let featuresArray = utils.objectToArray(levelObject.feature);
  featuresArray = featuresArray.map(feature => {
    const _feature = Object.assign({}, feature);
    _feature.optional = false;
    if (feature.$ && feature.$.optional === 'YES') {
      _feature.optional = true;
      delete _feature.$;
    }

    _feature.text = utils.stringToArray(feature.text)
      .map(p => p.trim())
      .filter(p => (p !== ''));

    delete _feature.modifier;
    return _feature;
  });
  return featuresArray;
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

      _charClass.features = {};
      _charClass.slots = {};
      _charClass.slotsOptional = false;

      charClass.autolevel.forEach(levelObject => {
        const level = parseInt(levelObject.$.level, 10);

        if (levelObject.feature) {
          _charClass.features[level] = getFeaturesForLevel(levelObject);
        }

        if (levelObject.slots) {
          if (levelObject.slots.$ && levelObject.slots.$.optional === 'YES') {
            _charClass.slotsOptional = true;
            _charClass.slots[level] = levelObject.slots._.split(',');
          } else {
            _charClass.slots[level] = levelObject.slots.split(',');
          }
        }
      });
      _charClass.url = utils.nameToUrl(charClass.name);
      delete _charClass.autolevel;
      return _charClass;
    } else {
      return 'prepare-classes.js 65';
    }
  });
}

module.exports.prepareClasses = prepareClasses;
