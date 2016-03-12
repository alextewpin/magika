const prepare = require('./prepare.js');
const fs = require('fs');

const srcDir = './data-source/';
const outDir = './src/data/';

if (!fs.existsSync(`${outDir}`)) {
  fs.mkdirSync(`${outDir}`);
}

fs.writeFileSync(`${outDir}/data-spellbook.json`, prepare(`${srcDir}Spells`));
fs.writeFileSync(`${outDir}/data-bestiary.json`, prepare(`${srcDir}Bestiary`));
fs.writeFileSync(`${outDir}/data-classes.json`, prepare(`${srcDir}Character Files`, 'classes'));
