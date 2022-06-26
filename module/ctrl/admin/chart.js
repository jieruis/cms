const path =require("path");
const show1 = require("../../view/show1");
const config=require("../../util/config");

//报表模块
function showChart(res){
    // show.returnFile(res,path.join(__dirname,"../../../","tpl/admin/chart/index.html"),"text/html")
   //加载模板页
    show1.retrunTemplate(res,path.join(__dirname,"../../../","tpl/admin/chart/index.art"),
   {
    baseurl:`${config.baseurl}:${config.port}/`
   })
}

module.exports={showChart}