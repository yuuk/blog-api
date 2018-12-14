const checkLogin = require('../middleware/checkLogin');

module.exports = [{
    method: 'GET',
    path: '/user',
    use: [ checkLogin ],
    handler: async(ctx, next) => {
        ctx.body = 'user';
    }
}];