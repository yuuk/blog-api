const {Sequelize, sequelize} = require('../utils/connect');

const Posts = sequelize.define('blog_posts', {
    post_title :Sequelize.STRING,
    post_date :Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = [{
    method: 'GET',
    path: '/',
    fn: async(ctx, next) => {
        const data = await Posts.findAll({ limit: 10 });
        await ctx.render('home', {
            data
        });
    }
}];