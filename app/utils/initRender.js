const path = require('path');
const render = require('koa-art-template');
const { dateFormat } = require('./index');

module.exports = function(app) {
    return render(app, {
        root: path.join(__dirname, '../views'),
        extname: '.art',
        escape: true,
        debug: process.env.NODE_ENV !== 'production',
        imports: {
            dateFormat
        }
    });
}
