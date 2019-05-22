
/*
* token 加密签名
* */

const TOKEN_SECRET = "this is my node app"

/*
* 当前域名地址
* */
const address = '192.168.1.74'

/*
* 开启的端口号
* */
const prot = 3000

/*
* mysql 配置
* */

const mysql = {
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Qq690902636',
  port: '3306',
  database: 'test',
  typeCast: true,
  useConnectionPooling: true
}

module.exports = {
  mysql,
  TOKEN_SECRET,
  address,
  prot
}
