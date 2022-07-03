const http = require("http"); //加载http模块
const url=require("url");//加载url模块
const router=require("./router")//加载自定义的路由模块
const config =require("../util/config");//加载项目的配置文件


function createServer(){
    return http.createServer((req,res)=>{
    //req:用户请求  res:服务器应答
    // let reqUrl=url.parse(req.url);//旧版URL
    let reqUrl=new URL(req.url,config.baseurl);//新版URL
    //  console.log(reqUrl);
    router.show(reqUrl.pathname,res);
    // res.writeHead(200,{"Content-type":"text/html;charset='UTF-8'"});
    // res.write("<h1>hello</h1>"); //应答的主体内容
    // res.end();//应答结束
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