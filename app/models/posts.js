const moment = require('moment');
const { createTimeFormat } = require('../constants');
const db = require('../utils/db');

module.exports = db.defineModel('posts', {
    title: db.STRING,
    keywords: db.STRING,
    description: db.STRING,
    content: db.STRING,
    tag_ids: db.STRING,
    category_id: db.INTEGER,
    view_count: {
        type: db.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            isInt: true,
        }
    },
    comment_count: {
        type: db.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    publish_time: {
        type: db.STRING,
        allowNull: false,
        defaultValue: moment().format(createTimeFormat),
    },
    publish_status: {
        type: db.ENUM,
        values: ['publish', 'trash', 'draft'],
    }
});