const { aesEncode } = require('../utils/password');
const { createToken } = require('../utils/token');
const model = require('../models/');

module.exports = [
    {
        method: 'GET',
        path: '/sign',
        handler: async (ctx) => {
            await ctx.render('sign');
        }
    },
    {
        method: 'POST',
        path: '/sign',
        handler: async (ctx) => {
            const { body } = ctx.request;
            const { username, password } = body;
            const data = await model.users.findAll({ 
                where: {'user_login': username, 'user_pass': aesEncode(password)} 
            });
            if (data.length) {
                const user = data[0];
                const token = createToken(user.id);
                ctx.cookies.set('token', token, {
                   path: '/',
                   maxAge: 1000 * 60 * 60 * 2,
                });
                
                console.log('aaaa');
                await ctx.redirect('/user');
            } else {
                await ctx.render('sign', {
                    loginErrorMsg: '用户名密码错误'
                });
            }
        }
    }
];