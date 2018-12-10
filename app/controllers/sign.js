const { aesEncode, aesDecode } = require('../utils/password');
const { Sequelize, sequelize } = require('../utils/connect');
const { createToken } = require('../utils/token');

const Users = sequelize.define('blog_users', {
    user_login :Sequelize.STRING,
    user_pass :Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = [
    {
        method: 'GET',
        path: '/sign',
        fn: async (ctx, next) => {
            await ctx.render('sign');
        }
    },
    {
        method: 'POST',
        path: '/sign',
        fn: async (ctx, next) => {
            const { body } = ctx.request;
            const { username, password } = body;
            const data = await Users.findAll({ 
                where: {'user_login': username, 'user_pass': aesEncode(password)} 
            });
            if (data.length) {
                const user = data[0];
                const token = createToken(user.id);
                ctx.cookies.set('token',token);
                await ctx.redirect('/user');
            } else {
                await ctx.render('sign', {
                    loginErrorMsg: '用户名密码错误'
                });
            }
        }
    }
]