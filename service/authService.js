const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { redisClient } = require('../utils/redis-utils');
const {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('./utils/redis-utils');

dontenv.config();

module.exports = {
  checkCookie: (req, res, next) => {
    try {
      const cookie = req.cookies;

      if (!cookie) {
        res.status(401).json({
          auth: false,
          message: 'unauthorized',
        });
      } else {
        next();
      }
    } catch (err) {
      return {
        auth: false,
        message: err.message,
      };
    }
  },

  checkAccessToken: (req, res, next) => {
    try {
      const token = req.cookies.access;
      if (verifyAccessToken(token).auth) {
        next();
      } else {
        next(router);
      }
    } catch (err) {}
  },

  checkRefresh: async (loginId) => {
    const refreshToken = await redisClient.get(loginId);
    const tokenAuth = verifyRefreshToken(refreshToken, loginId);
    console.log('Is there refresh token?', tokenAuth);
    return tokenAuth;
  },
};
