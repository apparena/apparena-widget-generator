const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const replaceValues = function (result, type) {
  const srcPath = path.resolve(__dirname, `./config/${type}.json`);
  if (fs.existsSync(srcPath)) {
    console.log(`Start Replacing ${type} Values`);
    const obj = require(srcPath);

    obj.forEach((config) => {
      const regExp = new RegExp(`aa_${type}_${config[`${type}Id`]}`, 'g');
      result = result.replace(regExp, config.value);
    });
    console.log(`Finish Replacing ${type} Values`);

    return result;
  }
};

if (fs.existsSync("./dist/main.min.js")) {
  fs.readFile("./dist/main.min.js", 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }

    data = replaceValues(data, 'config');
    data = replaceValues(data, 'info');

    fs.writeFile(`./dist/main.${crypto.randomBytes(3).toString('hex')}.js`, data, 'utf8', (err) => {
      if (err) return console.log(err);
    });
  });
} else {
  console.log('Please run `yarn run build` before calling this script');
}
