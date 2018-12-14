const db = require('../utils/db');

module.exports = db.defineModel('blog_users', {
    user_login : db.STRING,
    user_pass : db.STRING,
});