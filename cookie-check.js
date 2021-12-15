const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { redisClient } = require('../utils/redis-utils');
const {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('./utils/redis-utils');

dotenv.config();

const {
  signAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../util/jwt-util');

const authChecker = async (req, res) => {
  try {
    const accessCookie = await req.cookies;

    if (!accessCookie) {
      return res.status(401).json({
        auth: false,
        message: 'unauthorized',
      });
    }

    const accessTokenCheck = verifyAccessToken(accessCookie.accessToken);
    if (!accessTokenCheck.auth) {
      const refreshToken = await redisClient.get(accessCookie.loginId);
      const refreshTokenCheck = verifyRefreshToken(
        refreshToken,
        accessCookie.loginId
      );

      if (refreshTokenCheck) {
        return;
      }
    } else {
      return res.status(200).json({
        auth: true,
        message: 'Access Token has been confirmed.',
      });
    }
  } catch (err) {
    return res.status(500).json({
      auth: false,
      message: err.message,
    });
  }

  //////////////////////////////////////////////////////////////////////////////

  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh;
    const authResult = verifyAccessToken(authToken);
    const decoded = jwt.decode(authToken);

    if (!decoded) {
      res.status(401).json('No authorized!');
    }

    const refreshResult = verifyRefreshToken(refreshToken, decoded.loginId);

    // access token 만료 확인
    if (authResult.ok === false && authResult.message === 'jwt expired') {
      // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인
      if (refreshResult.ok === false) {
        res.status(401).send({
          ok: false,
          message: 'No authorized!',
        });
      } else {
        // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
        const newAccessToken = signAccessToken(user);

        res.status(200).send({
          // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환
          ok: true,
          data: {
            accessToken: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      // 3. access token이 만료되지 않은경우 => refresh 안함
      res.status(400).send({
        ok: false,
        message: 'Acess token is not expired!',
      });
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(400).send({
      ok: false,
      message: 'Access token and refresh token are need for refresh!',
    });
  }
};

module.exports = authChecker;
