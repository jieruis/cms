//路由模块--根据用户请求的path对应到不同的页面
const paths = require("path");  //路径模块
const admin = require("../ctrl/admin/admin");  //用户模块控制器
const index = require("../ctrl/index");  //前台首页模块控制器
const chart = require("../ctrl/admin/chart");  //报表模块
const show = require("../view/show");  //响应模块
const {checkLogin} = require("../util/common.fun");  //导入通用函数模块的checkLogin方法 
const {add:cate_add,manager:cate_manager,update:cate_update,del:cate_del,ajaxCategory:getCate} = require("../ctrl/admin/category");  //分类模块
async function route(path,res,data,cookies={}){
  //静态资源文件
  if(path.startsWith("/public")){
    let suffix = path.slice(path.lastIndexOf(".")+1);  //获取静态资源文件后缀
    //文件类型和MIME Type对应关系
    let mimeType = new Map([
      ["jpg","image/jpeg"],
      ["jpeg","image/jpeg"],
      ["png","image/png"],
      ["gif","image/gif"],
      ["css","text/css"],
      ["js","text/javascript"],
      // ["ttf",],
      ["mp3","audio/x-mpeg"],
      ["mp4","video/mp4"],
    ]);    
    let filePath = paths.join(__dirname,"../../",path);
    //根据后缀找到对应的文件类型,然后加载文件
    show.returnFile(res,filePath,mimeType.get(suffix));
  }else{
    path = path.endsWith("/") ? path.slice(0,path.length-1) : path;
    /*let pathMap = new Map([
      ["/admin","chart.showChart(res)"], //后台首页-报表页
      ["/admin/login","admin.login(res,data)"],  //登录页
      ["/admin/ajaxLogin","admin.ajaxLogin(res,data)"], //ajax登录接口
      ["/admin/chart","chart.showChart(res)"], //报表页
      ["/","index.index(res)"],  //前台首页
      ["/favicon.ico","admin.favicon(res)"]  //网站图标
    ]);*/  //路径和控制器的对应关系
    let pathMap = [
      //后台首页(报表页)
      {
        path:"/admin",  //路由
        ctrl:"chart.showChart(res)",  //路由对应的控制器
        checkLogin:true  //是否验证用户登录
      },  //一个对象就是一个路由对应关系
      //后台登录页
      {
        path:"/admin/login",
        ctrl:"admin.login(res,data)",
        checkLogin:false
      },
      //ajax登录接口
      {
        path:"/admin/ajaxLogin",
        ctrl:"admin.ajaxLogin(res,data)",
        checkLogin:false
      },
      //报表页
      {
        path:"/admin/chart",
        ctrl:"chart.showChart(res)",
        checkLogin:true
      },
      //分类新增
      {
        path:"/admin/category/add",
        ctrl:"cate_add(res,data)",
        checkLogin:true
      },
      //分类管理
      {
        path:"/admin/category",
        ctrl:"cate_manager(res)",
        checkLogin:true
      },
      //分类更新
      {
        path:"/admin/category/update",
        ctrl:"cate_update(res,data)",
        checkLogin:true
      },
      //分类删除
      {
        path:"/admin/category/del",
        ctrl:"cate_del(res,data)",
        checkLogin:true
      },
      //获取下级分类接口
      {
        path:"/admin/category/getCate",
        ctrl:"getCate(res,data)",
        checkLogin:true
      },
      //前台首页
      {
        path:"",
        ctrl:"index.index(res)",
        checkLogin:false
      },
      //退出
      {
        path:"/admin/logout",
        ctrl:"admin.logout(res)",
        checkLogin:false
      },
      //网站图标
      {
        path:"/favicon.ico",
        ctrl:"admin.favicon(res)",
        checkLogin:false
      }
    ];
    let r = {}; //匹配的路由
    if(r = pathMap.find(v=>{
      return v.path == path;
    })){  //查看路径是否错误
      //根据路由判断是否验证用户登录
      if(r.checkLogin){
        if(cookies.uid){
          //执行路径对应的方法
          eval(r.ctrl);
        }else{
          show.loadPage(res,"请先登录！~","http://localhost/admin/login");
        }
      }else{
        //执行路径对应的方法
        eval(r.ctrl);
      }
    }else{
      //404
      show.returnFile(res,paths.join(__dirname,"../../","tpl/404.html"),"text/html");
    }
  }
}

//导出show方法
module.exports = {route}