// 自动本目录下所有 model，排除 index.js

const fs = require('fs');
const db = require('../utils/db');

const files = fs.readdirSync(__dirname).filter(file => {
    return file !== 'index.js' && file.endsWith('.js');
});

exports.sync = () => {
    db.sync();
};

for (let file of files) {
    let name = file.substring(0, file.length - 3);
    exports[name] = require(`${__dirname}/${file}`);
}
