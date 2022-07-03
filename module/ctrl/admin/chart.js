const path = require("path");
const show = require("../../view/show");
const config = require("../../util/config");

//报表模块
function showChart(res){
  //加载模板页
  show.returnTemplate(res,path.join(__dirname,"../../../","tpl/admin/chart/index.art"),
  {
    baseurl:`${config.baseurl}:${config.port}/`
  })
}

module.exports = {showChart}