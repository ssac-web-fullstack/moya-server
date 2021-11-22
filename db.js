const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: process.env.DB_TIMEZONE,
  connectionLimit: process.env.DB_CONNECTIONLIMIT,
});

module.exports = db;
// module.export = {
//   getConnection: (callback) => {
//     return pool.createPool.getConnection(callback);
//   },
// };
