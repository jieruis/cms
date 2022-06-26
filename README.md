# cms

#### 介绍
node.js

#### 用户模块

##### 密码加密
对数据库密码进行加密
sql： update admin set pwd=md5("111") where uid =2;

![sql](https://cdn.jsdelivr.net/gh/jieruis/cdn/imgtu/md5.png)

#### crypto
1.作用：提供了加密功能，其中包括了用于OpenSSL散列、HAMC、加密、解密、签名、以及验证的函数的一整套封装

2.crypto.createHash("md5").update(data).digest('hex')