
/**
* token 加密签名
* */
const TOKEN_SECRET = "this is my node app"

/**
* 当前域名地址
* */
const address = '192.168.1.74'

/**
* 服务开启的端口号
* */
const prot = 3000

/**
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

/**
* redis 配置
* */
const redis = {
  host:'192.168.1.203',
  port:'6379'
}

module.exports = {
  mysql,
  TOKEN_SECRET,
  address,
  prot,
  redis
}
