const http = require("http");  //加载http模块
// const url = require("url");  //加载url模块
const cookie = require("cookie");  //加载第三方cookie模块
const router = require("./router");  //加载自定义的路由模块
const config = require("../util/config"); //加载项目配置文件
// const queryString = require("querystring");  //查询字符串处理模块

function createServer(){
  return http.createServer(async (req,res)=>{
    //req:用户请求  res:服务器应答
    // let reqUrl = url.parse(req.url);  //旧版URL API
    let reqUrl = new URL(req.url,config.baseurl);  //新版URL API
    //以下为get传参获取方式
    //旧版解析查询字符串
    // console.log(queryString.parse(reqUrl.search.slice(1))); //返回一个键值对集合
    // console.log("用户名："+reqUrl.searchParams.get("uname"));  //参数的键值对集合
    // let data = new URLSearchParams(reqUrl.search); //将查询字符串转换为键值对集合
    // console.log(data);
    //reqUrl.searchParams：get传递的参数
    // console.log(reqUrl.searchParams);
    //以下post传参获取方式
    let data = "";  //post传递的参数
    req.on("data",(chunk)=>{  //监听data事件，获取传递的数据
      data += chunk;
      // console.log(chunk);  //buffer
    })
    data = await new Promise(resolve=>{
      //请求体传递结束，获取完整的请求数据:x=1&y=2
      req.on("end",()=>{
        resolve(data);
      })
    })
    data = new URLSearchParams(data);
    for(let [k,v] of reqUrl.searchParams){
      // data.append(k,v);  //追加键值对，同名的保留
      data.set(k,v);  //设置键为某个值，同名的覆盖
    }
    //使用cookie模块将cookie字符串转换为键值对对象
    let cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    // console.log(cookies);
    router.route(reqUrl.pathname,res,data,cookies);
  });  //创建一个web服务器
}

function start(){
  // port = (port > 0 && Number.isInteger(port)) ? port : 80;  //端口号
  createServer().listen(config.port,()=>{  //监听一个端口号
    console.log("服务器开启成功~");
  })
}

//导出方法
module.exports = {start}