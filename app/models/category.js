const moment = require('moment');
const { createTimeFormat } = require('../constants');
const db = require('../utils/db');

module.exports = db.defineModel('category', {
    title: db.STRING,
    description: db.STRING,
    alias: db.STRING,
    parent_id: {
        type: db.STRING,
        allowNull: false,
        defaultValue: -1,
    },
    create_time: {
        type: db.STRING,
        allowNull: false,
        defaultValue: moment().format(createTimeFormat),
    }
});