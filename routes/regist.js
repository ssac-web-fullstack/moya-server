const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();
const SALTROUNDS = 10;

const insertUserInfo = async (name, nickname, loginId, password, email) => {
  try {
    const sql =
      'INSERT INTO User(name, nickname, loginid, passwd, email) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [name, nickname, loginId, password, email]);
  } catch (err) {
    return console.error(err);
  }
};

router.post('/', async (req, res) => {
  const { name, nickname, loginId, password, email } = req.body;

  await bcrypt.hash(password, SALTROUNDS, (err, hash) => {
    if (err) {
      return res.status(500).json('암호화 및 회원 가입 실패');
    }

    insertUserInfo(name, nickname, loginId, hash, email);
    return res.status(200).json('회원가입 성공');
  });
});

module.exports = router;
