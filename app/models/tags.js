const moment = require('moment');
const { createTimeFormat } = require('../constants');
const db = require('../utils/db');

module.exports = db.defineModel('tags', {
    title: {
        type: db.STRING,
        allowNull: false,
        unique: true,
    },
    alias: db.STRING,
    create_time: {
        type: db.STRING,
        allowNull: false,
        defaultValue: moment().format(createTimeFormat),
    }
});