const checkLogin = require('../middleware/checkLogin');

module.exports = [{
    method: 'GET',
    path: '/user',
    use: [
        checkLogin
    ],
    fn: async(ctx, next) => {
        ctx.body = 'user';
    }
}]