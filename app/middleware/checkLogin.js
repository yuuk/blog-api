const { checkToken } = require('../utils/token');
const APIError = require('../utils/apiError');


module.exports = async(ctx, next) => {
    const token = ctx.headers['token'];
    if (!token) {
      ctx.status = 401;
      ctx.body = new APIError('token:illegal_token', '登录信息不存在');
      return;
    }
    try {
      await checkToken(token);
    } catch (err) {
      ctx.status = 401;
      ctx.body = new APIError('token:illegal_token', '登录信息失效');
      return;
    }
    await next();
};