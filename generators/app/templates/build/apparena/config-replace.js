const fs = require('fs');
const path = require('path');

const replaceValues = function (type) {
  const srcPath = path.resolve(__dirname, `../../src/config/aa_${type}.json`);
  if (fs.existsSync(srcPath)) {
    console.log(`Start Replacing ${type} Values`);
    const obj = require(srcPath);

    let result = {};
    Object.keys(obj).forEach((id) => {
      result[id] = `aa_${type}_${id}`;
    });

    fs.writeFile(`./src/config/aa_${type}_replaced.json`, JSON.stringify(result), 'utf8', (err) => {
      if (err) return console.log(err);
    });

    console.log(`Finish Replacing ${type} Values`);
  }
};

replaceValues('config');
replaceValues('info');

