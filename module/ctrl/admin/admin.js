const path=require("path");//加载路径模块
const crypto=require("crypto");//加载加密模块
const show1=require("../../view/show1")//响应模块
const db = require("../../db/db.fun");
const config =require("../../util/config");//配置文件
//管理员模块
function login(res,data){  //登录
    //判断data是否为空
    if(data.has("uname")){ //通过点击登录按钮访问的登陆页
      if(data.get("uanme")==""||data.get("pwd")==""){//用户没有填写用户名或密码
        show1.loadPage(res,"用户名或密码不能为空~",`${config.baseurl}:${config.port}/admin`);
      }else{
        //登录验证
        db.getAll("admin",{
          where:{
            uname:data.get("uname"),
            //使用md5加密后的密码
            pwd:crypto.createHash("md5").update(data.get("pwd")).digest('hex')
          },
          // order:{
          //   uid:"DESC"
          // },
          // limit:{
          //   star:1,
          //   len:3
          // }
        }).then(data=>{
          //验证用户
          console.log(data);
          if(data.length>0){
            //登录成功,跳转到后台首页
            show1.loadPage(res,"登录成功~",`${config.baseurl}:${config.port}/admin/chart`);
          }else{
            show1.loadPage(res,"登录失败~",`${config.baseurl}:${config.port}/admin`)
          }
        });
      }
    }else{ //通过url访问的登陆页
    //加载的模板路径
    let filePath = path.join(__dirname,"../../../","tpl/admin/admin/login.art");
    //加载模块
    show1.retrunTemplate(res,filePath,{baseurl:`${config.baseurl}:${config.port}/`})
  }
}
function logout(){  //退出

}
//加载网站图标的方法
function favicon(res){
  show1.returnFile(res,path.join(__dirname,"../../../","favicon.ico"));
}
//导出

//ajax无刷新登录{errCode,errMsg:"",data:[]}
function ajaxLogin(res,data){
  if(data.get("uanme")==""||data.get("pwd")==""){//用户没有填写用户名或密码
    console.log("用户没有填写用户名或密码");
    show1.returnJson(res,{
      errCode:101,
      errMsg:"用户名或密码为空",
      data:[]
    });//返回一个json格式的数据
  }else{
    //登录验证
    db.getAll("admin",{
      where:{
        uname:data.get("uname"),
        pwd:crypto.createHash("md5").update(data.get("pwd")).digest('hex')
      },
    }).then(data=>{
      if(data.length>0){
        show1.loadPage(res,"登录成功~",`${config.baseurl}:${config.port}/admin/chart`);
      }else{
        show1.loadPage(res,"登录失败~",`${config.baseurl}:${config.port}/admin`)
      }
    })
}
}
module.exports ={login,logout,favicon,ajaxLogin}