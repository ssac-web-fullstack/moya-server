const express = require('express');
const mysql = require('mysql2');
let router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Chat';
  db.query(sql, (err, result) => {
    if (err) console.error(err);
    res.send(result);
  });
});
router.post('/', (req, res) => {
  const { title } = req.body;
  const sql = 'insert into Chat(title) values(?)';
  db.query(sql, title, (err, result) => {
    if (err) console.error(err);
    console.log(result);
    res.send('good');
  });
});
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Chat WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) console.error(err);
    console.log(result);
    res.send('good');
  });
});
module.exports = router;
