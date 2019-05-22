/* 数据库连接配置 */
const mysql = require('mysql');
const myConfig = require('../config/key')

// 初始化数据库配置,建立连接池 mysql端口号默认为3306
const pool = mysql.createPool(myConfig.mysql);

const query = function (query, params) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        reject(err, 'pool');
      }
      connection.query(query, params, function (err, res) {
        connection.release();
        if (err) {
          reject(err, 'query');
        } else {
          resolve(res);
        }
      });
    });
  });
}


module.exports = query
