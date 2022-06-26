const fs =require("fs"); //加载文件模块
const template=require("art-template");//加载模板引擎
//response响应模块
async function returnFile(res,path,mimeType){
    //设置请求返回的状态码和文件类型
    res.writeHead(200,{"Content-type":`${mimeType};charset=UTF-8`});
    let result = await new Promise((resolve,reject)=>{
        //读取模板内容(异步)
        fs.readFile(path,(err,data)=>{
            if(err)
            reject(err);  //读取失败返回错误
            else
            resolve(data);//读取成功发挥数据
        });
    });
    res.write(result);
    //加载登录模板
    res.end();
}
/* 
descriotion:返回提示信息并跳转页面
params:Objext res:服务端响应
       string msg:提示信息
       string url:跳转页面地址
return:void
autor:jieruis
*/
function loadPage(res,msg="即将跳转页面~",url=""){
    res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
    res.write(`
      <script>
      alert("${msg}");
      window.location.href ="${url}";
      </script>
    `);
    res.end();
}

//加载一个模板页
function retrunTemplate(res,path,data={}){
    let html=template(path,{...data});  //加载模板，data就是传递的参数
    res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
    res.end(html);
}

//返回json数据
function returnJson(res,data){
    res.writeHead(200,{"Content-type":"application/json;charset=UTF-8"});
    res.end(JSON.stringify(data));
}
module.exports = {returnFile,loadPage,retrunTemplate,returnJson}