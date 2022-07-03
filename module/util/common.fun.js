//通用函数模块
const cookie = require("cookie"); //加载第三方的cookie模块

//验证用户是否登录
function checkLogin(res,result){
  let option = {
    path:"/",  //cookie作用的文件夹，/表示根目录
    httpOnly:false,  //是否只能在服务端使用,false表示既可在服务端使用也可以在客户端使用
  };
  //记住我
  // if(data.get("remember")){
  //   option.maxAge = 60*60*24*7;
  // }  
  let setCookie = cookie.serialize("uid",result[0].uid,option);
  let setCookie2 = cookie.serialize("uname",result[0].uname,option);
  res.setHeader("Set-Cookie",[setCookie,setCookie2]);  //设置cookie
};

module.exports = {checkLogin};