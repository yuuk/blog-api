const db = require('../utils/db');

module.exports = db.defineModel('blog_posts', {
    post_title: db.STRING,
    post_date: db.DATE,
});