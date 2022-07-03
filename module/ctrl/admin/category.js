//分类模块
const path = require("path");
const show = require("../../view/show");
const config = require("../../util/config");
const db = require("../../db/db.fun");
//分类新增
async function add(res,data){
  //判断是否有提交数据
  if(data.get("cname") == null){
    let topCate = await getCategory();  //获取顶级分类
    //加载分类新增的模板页
    let filePath = path.join(__dirname,"../../../","tpl/admin/category/add.art");
    show.returnTemplate(res,filePath,{baseurl:`${config.baseurl}:${config.port}/`,topCate});
  }else{
    if(data.get("cname") == ""){
      show.loadPage(res,"分类名称必填~",`${config.baseurl}:${config.port}/admin/category/add`);
    }else{
      //新增
      db.insert("category",{
        cname:data.get("cname"),
        pid:data.get("pid"),
        uid:data.get("uid")
      }).then(result=>{
        if(result.affectedRows > 0){  //通过判断受影响的函数来确定是否新增成
          show.loadPage(res,"新增成功~",`${config.baseurl}:${config.port}/admin/category`);
        }
      });
    }
  }
}
//分类管理
async function manager(res){
  let cates = await db.getAll("category");  //获取所有的分类
  let filePath = path.join(__dirname,"../../../","tpl/admin/category/index.art");
  show.returnTemplate(res,filePath,{
    baseurl:`${config.baseurl}:${config.port}/`,
    cates
  });
}
//获取分类的所有父级分类(包含自身)
async function getParents(pid,allParents){
  //获取当前分类的同胞
  let bros = await db.getAll("category",{
    where:{pid}
  });
  allParents.unshift(bros);
  if(pid > 0){
    //获取当前分类的父id:cat.pid
    let parent = await db.getAll("category",{
      where:{cid:pid}
    });  //获取直接父级
    //父的父id:parent[0].pid
    await getParents(parent[0].pid,allParents);
  }
}
//分类更新
async function update(res,data){
  if(data.get("cid")){
    //获取已经填写的分类信息
    let cat = await db.getAll("category",{
      where:{cid:data.get("cid")}
    });
    let allParents = [];  //二维数组，存储所有的父级
    //获取所有的父级
    await getParents(cat[0].pid,allParents);
    let filePath = path.join(__dirname,"../../../","tpl/admin/category/update.art");
    show.returnTemplate(res,filePath,{
      baseurl:`${config.baseurl}:${config.port}/`,
      cat:cat[0],
      allParents
    });
  }else{
    show.loadPage(res,"请选择需要更新的分类~",`${config.baseurl}:${config.port}/admin/category`);
  }
}
//分类删除
function del(res,data){
  
}

/*
*description:通过pid获取下一级分类(pid实际是上一级的cid)
*params:number pid:上一级分类id,默认为0,表示获取一级分类
*/
function getCategory(pid=0){
  return db.getAll("category",
  {
    where:{pid}
  });
}

//客户端通过cid获取下级分类的接口
async function ajaxCategory(res,data){
  if(data.get("pid") != null && data.get("pid") != ""){
    let cates = await getCategory(data.get("pid"));
    show.returnJSON(res,{
      errCode:0,
      errMsg:"获取下级分类成",
      data:cates
    });
  }else{
    show.returnJSON(res,{
      errCode:1,
      errMsg:"无效的分类id",
      data:[]
    })
  }
}  

module.exports = {add,manager,update,del,ajaxCategory}