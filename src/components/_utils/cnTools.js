function camelToSnake (str) {
  return str.replace(/([A-Z])/g, $1 => `-${$1.toLowerCase()}`);
}

function getMods (mods) {
  return Object.keys(mods).map(mod => `${camelToSnake(mod)}_${mods[mod]}`);
}

export default function cnFactory (styles) {
  function hasClassName (className) {
    if (!styles[className]) {
      console.warn(`No style for ${className}`);
      return false;
    }
    return true;
  }
  return (element, mods) => {
    if (mods) {
      return getMods(mods).reduce((sum, mod) => {
        const className = `${element}_${mod}`;
        hasClassName(className);
        return `${sum} ${styles[className]}`;
      }, '');
    }
    hasClassName(element);
    return styles[element];
  };
}
