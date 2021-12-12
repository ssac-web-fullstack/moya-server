const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('../utils/jwt-utils');
const { redis, redisClient } = require('../utils/redis-utils');
const router = express.Router();

const checkAuth = async (inputId, inputPassword) => {
  try {
    const userInfo = await db.query(
      `SELECT name, nickname, loginid, passwd, email FROM User WHERE loginid = "${inputId}"`
    );
    let user = userInfo[0][0];
    console.log(user);
    const idMatch = inputId === user?.loginid;
    const passwordMatch = await bcrypt.compare(inputPassword, user?.passwd);

    return [idMatch && passwordMatch, user];
  } catch (err) {
    return console.error(err);
  }
};

router.post('/', async (req, res) => {
  try {
    const { inputId, inputPassword } = await req.body;
    const [loginSuccess, user] = await checkAuth(inputId, inputPassword);

    if (loginSuccess) {
      const accessToken = jwt.signAccessToken(user.loginid);
      const refreshToken = jwt.signRefreshToken();

      await redisClient.set(user.loginid, refreshToken, redis.print);
      await redisClient.get(user.loginid, (err, res) => console.log(res[0]));

      res.cookie('access', accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      return res.status(200).send({
        auth: true,
        message: 'Login Success',
      });
    } else {
      return res.status(401).send({
        auth: false,
        message: 'Unauthorized',
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
