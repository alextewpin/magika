const utils = require('./prepare-utils.js');

function makeClassesList (source) {
  const output = [];
  output.push(source.map(charClass => {
    return charClass.url;
  }));
  return output;
}

function getFeaturesForLevel (levelObject) {
  let featuresArray = utils.objectToArray(levelObject.feature);
  featuresArray = featuresArray.map(feature => {
    feature.optional = false;
    if (feature.$ && feature.$.optional === 'YES') {
      feature.optional = true;
      delete feature.$;
    }

    feature.text = utils.stringToArray(feature.text);
    feature.text = feature.text.map(p => {
      return p.trim();
    });
    feature.text = feature.text.filter(p => {
      return p !== '';
    });

    delete feature.modifier;
    return feature;
  });
  return featuresArray;
}

function prepareClasses (charClasses) {
  charClasses.forEach(charClass => {
    if (charClass.autolevel) {
      charClass.url = utils.nameToUrl(charClass.name);

      const hd = charClass.hd;
      const cls = charClass.name.toLowerCase();
      const avgDice = Math.ceil((parseInt(hd, 10) + 1) / 2);
      charClass.hitDice = `1d${hd} per ${cls} level`;
      charClass.hpAtFirstLevel = `${hd} + your Constitution modifier'`;
      charClass.hpAtHigherLevels = `'1d${hd} (or ${avgDice}) + your Constitution modifier per ${cls} level after 1st`;

      charClass.features = {};
      charClass.slots = {};
      charClass.slotsOptional = false;

      charClass.autolevel.forEach(levelObject => {
        const level = parseInt(levelObject.$.level, 10);

        if (levelObject.feature) {
          charClass.features[level] = getFeaturesForLevel(levelObject);
        }

        if (levelObject.slots) {
          if (levelObject.slots.$ && levelObject.slots.$.optional === 'YES') {
            charClass.slotsOptional = true;
            charClass.slots[level] = levelObject.slots._.split(',');
          } else {
            charClass.slots[level] = levelObject.slots.split(',');
          }
        }
      });
      delete charClass.autolevel;
    }
  });
  return charClasses;
}

module.exports.prepareClasses = prepareClasses;
module.exports.makeClassesList = makeClassesList;
