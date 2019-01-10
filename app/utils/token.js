const jwt = require('jsonwebtoken');
const KEY = 'yuuk';

exports.createToken = (userId) => {
  const token = jwt.sign({ userId }, KEY, {expiresIn: '7d'});
  return token;
};

//检查token是否过期
exports.checkToken = (token) => {
  return jwt.verify(token, KEY);
};