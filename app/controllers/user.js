const checkLogin = require('../middleware/checkLogin');

module.exports = [{
    method: 'GET',
    path: '/user',
    use: [ checkLogin ],
    handler: async(ctx) => {
        ctx.body = 'user';
    }
}, {
    method: 'GET',
    path: '/api/user',
    use: [ checkLogin ],
    handler: async(ctx) => {
        ctx.rest({
            a: 1,
            b: 2
        });
    }
}];