const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();
const SALTROUNDS = 10;

const insertUserInfo = async (name, nickname, loginId, password, email) => {
  const sqlInsert =
    'INSERT INTO User(name, nickname, loginid, passwd, email) VALUES (?, ?, ?, ?, ?)';

  await db.query(
    sqlInsert,
    [name, nickname, loginId, password, email],
    (err, row) => {
      if (err) console.error(err);
      console.log('insertId:', row.insertId);
    }
  );
};

// TODO: catch 부분 error handling 더 세련된 방법 적용
router.post('/', async (req, res) => {
  console.log(req.body);
  let { name, nickname, loginId, password, email } = req.body;

  await bcrypt.hash(password, SALTROUNDS, (err, hash) => {
    if (err) {
      return res.status(500).send('암호화 및 회원 가입 실패');
    }

    insertUserInfo(name, nickname, loginId, hash, email);
    return res.status(200).json('회원가입 성공');
  });
});

module.exports = router;
