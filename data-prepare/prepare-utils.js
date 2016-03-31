const utils = {};

utils.convertToObjects = source => {
  const output = {};
  source.forEach(item => {
    output[item.url] = item;
  });
  return output;
};

utils.stringToArray = str => {
  if (typeof str === 'string' || str instanceof String) {
    const srtArray = [];
    srtArray.push(str);
    return srtArray;
  } else {
    return str;
  }
};

utils.objectToArray = obj => {
  if (obj.constructor === Array) {
    return obj;
  } else {
    const objArray = [];
    objArray.push(obj);
    return objArray;
  }
};

utils.nameToUrl = name => {
  return name.toLowerCase().replace(/\s/g, '_').replace(/\//g, '_');
};

utils.sortByName = list => {
  return list.sort((a, b) => {
    const itemA = a.name.toLowerCase();
    const itemB = b.name.toLowerCase();
    if (itemA < itemB) { return -1; }
    if (itemA > itemB) { return 1; }
    return 0;
  });
};

utils.makeList = source => {
  return Object.keys(source)
    .sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });
};

module.exports = utils;
