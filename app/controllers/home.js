const model = require('../models/');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: async(ctx) => {
        const data = await model.posts.findAll({
            where: {post_status: 'publish'},
            limit: 10,
            order: [['post_date', 'DESC']]
        });
        await ctx.render('home', {
            data
        });
    }
}];