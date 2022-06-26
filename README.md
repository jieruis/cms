[TOC]

# cms

#### 介绍
技术：node.js

#### http模块

方法：http.createServer()：创建一个Web服务器
http.createServer((request,response)=>{
//request:用户请求
//response:服务器应答
}).listen(端口号)
response:由http服务器内部创建，表示服务器对于request的应答
response.writeHead(状态码[,状态码描述][,头{key:val,key2:val2}])：响应的头
response.setHeadr(key,val):设置响应头
response.write(data):响应正文
response.end([data]):表示响应结束，每一次request都必须有一个end(),end()之后不能再次write()--只能有一次

```js
const http=require("http");//加载http模块

const server =http.createSever((req,res)=>{
    res.writeHead(200,{"Content-Type":"text/html;charset='UTF-8'"});//应答头信息
    res.write("<h1>hello</h1>");//应答主体内容
    res.end();应答结束
});//创建一个web服务器
server.listen(8888,()=>{ //监听一个端口号
    console.log("服务开启成功~");
})
```

#### url模块

1.作用：用于网站处理和解析
2.API：1.旧版：只能用于Node.js的特定版本
 const url=require("url");
 const reqStr=url.parse(urlString);
       2.新版:与浏览器相同的API
 const reqStr=new URL(request.url[,baseUrl]);

```js
const url=require("url");//加载url模块
 // let reqUrl=url.parse(req.url);//旧版URL

const BASURL ="http://localhost:8888";//自定义基本网址
let reqUrl=new URL(req.url,BASURL);//新版URL
```

#### path模块

#### 路由模块

根据用户请求的path对应到不同的页面
作用：根据URL和参数(get和post)来决定访问的页面和要执行的代码
路由规则
后端：/admin/模块/具体页面
     默认访问：后台首页--验证用户是否登录
     /admin/user/register:后台用户注册模块
前台:/模块/具体页面
     默认访问：前台首页 --http:localhost:8888或http://localhosr:8888/index

```js
function show(path,res){
	
}

//导出show方法
module.exports={show}
```

#### 用户模块

##### 密码加密
对数据库密码进行加密

```sql
sql： update admin set pwd=md5("111") where uid =2;
```

![sql](https://cdn.jsdelivr.net/gh/jieruis/cdn/imgtu/md5.png)

##### crypto

1.作用：提供了加密功能，其中包括了用于OpenSSL散列、HAMC、加密、解密、签名、以及验证的函数的一整套封装

2.crypto.createHash("md5").update(data).digest('hex')