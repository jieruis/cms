const http = require("http"); //加载http模块
// const url=require("url");//加载url模块
const router=require("./router")//加载自定义的路由模块
const config =require("../util/config");//加载项目的配置文件
// const queryString =require("querystring");//查询字符串处理模块

 function createServer(){
    return http.createServer(async (req,res)=>{
    //req:用户请求  res:服务器应答
    // let reqUrl=url.parse(req.url);//旧版URL
    let reqUrl=new URL(req.url,config.baseurl);//新版URL
    //以下
    //旧版解析查询字符串
    // console.log("用户名："+reqUrl.searchParams.get("uname"));//参数的键值对集合
    // let data=new URLSearchParams(reqUrl.search);//将查询字符串转为键值对集合
    // console.log(data);
    //reqUrl.searchParams:get传递的参数s
    // console.log(reqUrl.pathname,res);
    console.log(reqUrl.searchParams);
    // console.log(queryString,parse(reqUrl.search.slice(1)));//返回一个键值对集合
    let data="";
    req.on("data",(chunk)=>{ //监听data事件，获取传递的数据
        data +=chunk;
        // console.log(chunk);  //buffer
    });
     data = await new Promise(resolve=>{
        req.on("end",()=>{//请求体结束，获取完整的请求数据
           resolve(data);//x=1&&y=2
        })
    })
    data = new URLSearchParams(data);
    for(let [k,v] of reqUrl.searchParams){
        // data.append(k,v); //追加键值对，同名的保留
        data.set(k,v);//设置键为某个值，同名的覆盖
    }

    router.show(reqUrl.pathname,res,data);
});  //创建一个web服务器
}

function start(){
    // port = (port>0 && Number.isInteger(port))?port:80;
    createServer().listen(config.port,()=>{  //监听一个服务器
        console.log("服务器开启成功！");
    })
}

//
module.exports={start};