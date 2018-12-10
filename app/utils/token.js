const jwt = require('jsonwebtoken');
const KEY = 'yuuk';

exports.createToken = (userId) => {
  const token = jwt.sign({user_id: userId}, KEY, {expiresIn: '60s'});
  return token;
};

//检查token是否过期
exports.checkToken = async(ctx, next) => {
    //拿到token
    const authorization = ctx.get('Authorization');
    if (authorization === '') {
      ctx.throw(401, 'no token detected in http headerAuthorization');
    }
    const token = authorization.split(' ')[1];
    let tokenContent;
    try {
      tokenContent = await jwt.verify(token, KEY);//如果token过期或验证失败，将抛出错误
    } catch (err) {
      ctx.throw(401, 'invalid token');
    }
    await next();
};