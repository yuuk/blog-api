const { aesEncode } = require('../utils/password');
const { createToken } = require('../utils/token');
const model = require('../models/');
const APIError = require('../utils/apiError');

module.exports = [
    {
        method: 'POST',
        path: '/api/login',
        handler: async (ctx) => {
            const { body } = ctx.request;
            const { username, password } = body;
            const data = await model.users.findAll({ 
                where: {'username': username, 'password': aesEncode(password)} 
            });
            if (data.length) {
                const user = data[0];
                const token = createToken(user.id);
                await ctx.rest({
                    token,
                });
            } else {
                throw new APIError('login:login_failed', '账号或密码错误！');
            }
        }
    }
];