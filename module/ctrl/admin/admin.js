const path = require("path"); //加载路径模块
const crypto = require("crypto");  //加载加密模块
const cookie = require("cookie"); //加载第三方的cookie模块
const show = require("../../view/show");  //响应模块
const db = require("../../db/db.fun");  //数据库模块
const config = require("../../util/config");  //配置文件
const common = require("../../util/common.fun.js")
//管理员模块
function login(res,data){  //登录
  //判断data是否为空
  if(data.has("uname")){ //通过点击登录按钮访问的登录页
    if(data.get("uname") == "" || data.get("pwd") == ""){ //用户没有填写用户名或密码
      show.loadPage(res,"用户名或密码不能为空~",`${config.baseurl}:${config.port}/admin`);
    }else{
      //查询数据库
      db.getAll("admin",{
        where:{
          uname:data.get("uname"),
          //使用md5加密后的密码
          pwd:crypto.createHash("md5").update(data.get("pwd")).digest("hex")
        },
        // order:{
        //   uid:"DESC"
        // },
        // limit:{
        //   start:1,
        //   len:3
        // }
      }).then(result=>{
        //验证用户
        if(result.length > 0){
          //记录用户的登录信息
          // res.setHeader("Set-Cookie",[`uid=${result[0].uid};path=/;httpOnly`,`uname=${result[0].uname};`]);  //原生写法
          let option ={
            path:"/",  //cookie作用的文件夹，/表示根目录
            httpOnly:false,  //是否只能在服务端使用,false表示既可在服务端使用也可以在客户端使用
          };
          //记住我
          if(data.get("remember"))
            option.maxAge = 60*60*24*7;
          let setCookie = cookie.serialize("uid",result[0].uid,option);
          let setCookie2 = cookie.serialize("uname",result[0].uname,option);
          res.setHeader("Set-Cookie",[setCookie,setCookie2]);  //设置cookie
          //登录成功,跳转到后台首页
          show.loadPage(res,"登录成功~",`${config.baseurl}:${config.port}/admin/chart`);
        }else{
          show.loadPage(res,"登录失败~",`${config.baseurl}:${config.port}/admin/login`);
        }
      })
    }
  }else{ //通过url访问的登录页
    //加载的模板路径
    let filePath = path.join(__dirname,"../../../","tpl/admin/admin/login.art");
    //加载模板
    // show.returnFile(res,filePath,"text/html");
    show.returnTemplate(res,filePath,{baseurl:`${config.baseurl}:${config.port}/`})
  }
}
function logout(res){  //退出
    let option={
      path:"/",
      httpOnly:false,
      maxAge:-1,
    }
    let setCookie =cookie.serialize("uid","",option);
    let setCookie2 =cookie.serialize("uname","",option);
    res.setHeader("Set-Cookie",[setCookie,setCookie2]);
    show.loadPage(res,"退出成功~",`${config.baseurl}:${config.port}/admin/login`)
}
//加载网站图标的方法
function favicon(res){
  show.returnFile(res,path.join(__dirname,"../../../","favicon.ico"));
}

//ajax无刷新登录:{errCode:1,errMsg:"",data:[]}
function ajaxLogin(res,data){
  if(data.get("uname") == "" || data.get("pwd") == ""){ //用户没有填写用户名或密码
    console.log("用户没有填写用户名或密码");
    show.returnJSON(res,
    {
      errCode:101,
      errMsg:"用户名或密码为空",
      data:[]
    }); //返回一个json格式的数据
  }else{
    db.getAll("admin",{
      where:{
        uname:data.get("uname"),
        pwd:crypto.createHash("md5").update(data.get("pwd")).digest("hex")
      },
    }).then((result)=>{
      if(result.length > 0){
        common.checkLogin(res,result);
        show.returnJSON(res,
          {
            errCode:1,
            errMsg:"登录成功",
            data:[result]
          }); //返回一个json格式的数据
      }else{
        show.returnJSON(res,
          {
            errCode:2,
            errMsg:"账号或密码错误",
            data:[]
          }); //返回一个json格式的数据
      }
    })
  }
}
//导出
module.exports = {login,logout,favicon,ajaxLogin}