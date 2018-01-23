const fs = require('fs');
const amConfig = require('./config.json');

fs.readFile("./dist/main.js", 'utf8', (err, data) => {
    if (err) {
        return console.log(err);
    }

    let result = data;
    amConfig.forEach((config) => {
        const regExp = new RegExp(`aa_config_${config.configId}`, 'g');
        result = result.replace(regExp, config.value);
    });

    fs.writeFile("./dist/main.js", result, 'utf8', (err) => {
        if (err) return console.log(err);
    });
});