//路由模块--根据用户请求的path对应到不同的页面
const admin = require("../ctrl/admin/admin");//用户模块的控制器
const index = require("../ctrl/index")//前台首页模块控制器
const chart =require("../ctrl/admin/chart");//报表模块
const paths = require("path");
const show1=require("../view/show1")//响应模块
async function show(path,res,data){
  //静态资源文件
  if(path.startsWith("/public")){
    let suffix=path.slice(path.lastIndexOf(".")+1);//获取静态资源文件后缀
    //文件类型和MIME Type对应关系
    let mimeType = new Map([
      ["jpg","image/jpeg"],
      ["jpeg","image/jpeg"],
      ["png","image/png"],
      ["gif","image/gif"],
      ["css","text/css"],
      ["js","text/javascript"],
      // ["ttf",],
      ["mp3","audo/x-mpeg"],
      ["mp4","video/mp4"]
    ]);
    // res.writeHead(200,{"Content-type":`${mimeType.get(suffix)};charset=UTF-8`});
    let filePath = paths.join(__dirname,"../../",path);
    // let result = await new Promise((resolve,reject)=>{
    //     //读取模板内容(异步)
    //     fs.readFile(filePath,(err,data)=>{
    //         if(err)
    //         reject(err);  //读取失败返回错误
    //         else
    //         resolve(data);//读取成功发挥数据
    //     });
    // });
    // res.write(result);
    // res.end();
    show1.returnFile(res,filePath,mimeType.get(suffix));
  }else{
    path=path.endsWith("/")?path.slice(0,path.length-1):path;
  let pathMap =new Map([
    ["/admin","admin.login(res,data)"],  //登录页
    ["/admin/login","admin.login(res,data)"],//登陆页
    ["/admin/ajaxLogin","admin.ajaxLogin(res,data)"],//ajax登录
    ["/admin/chart","chart.showChart(res)"],
    ["/","index.index(res)"],
    ["/favicon.ico","admin.favicon(res)"]
  ]);//路径和控制器的对应关系
  if(pathMap.has(path)){//查看路径是否错误
    //执行路径对应的方法
    eval(pathMap.get(path));
  }else{
    //404
    // res.writeHead(404,{"Content-type":"text/html;charset=UTF-8"});
    // res.write("<h1>页面跑路了...</h1>");
    // res.end();
    show1.returnFile(res,paths.join(__dirname,"../../","tpl/404.html"),"text/html");
  }
}
}
//导出show方法
module.exports={show}