const { checkToken } = require('../utils/token');


module.exports = async(ctx, next) => {
    const token = ctx.cookies.get('token');
    if (!token) {
      ctx.apiError(401, {
        code: '1000',
        msg: 'Token is not found'
      });
      // ctx.throw(401, 'Token is not found');
    }
    try {
      await checkToken(token);
    } catch (err) {
      ctx.throw(401, '登录信息有误!');
    }
    await next();
};