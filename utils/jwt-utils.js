const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const redisClient = require('./redis-utils');
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

module.exports = {
  signAccessToken: (user) => {
    const payload = {
      name: user.name,
      nickname: user.nickname,
      loginId: user.loginid,
      email: user.email,
    };

    return jwt.sign(payload, accessSecret, {
      algorithm: 'HS256',
      expiresIn: '1h',
    });
  },

  verifyAccessToken: (token) => {
    let decodedData;
    try {
      decodedData = jwt.verify(token, accessSecret);
      return {
        auth: true,
        name: decodedData.name,
        nickname: decodedData.nickname,
        loginId: decodedData.loginId,
        email: decodedData.email,
      };
    } catch (err) {
      return {
        auth: false,
        message: err.message,
      };
    }
  },

  signRefreshToken: () => {
    return jwt.sign({}, refreshSecret, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  },

  verifyRefreshToken: async (token, loginId) => {
    const redisAsync = promisify(redisClient.get).bind(redisClient);
    try {
      const redisToken = await redisAsync(loginId);
      if (redisToken === token) {
        try {
          jwt.verify(token, refreshSecret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
