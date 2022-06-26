//数据库模块
const mysql =require("mysql");  //加载mysql模块
const config =require("../util/config");//加载配置文件

function conn(){
  let connction=  mysql.createConnection({
    host:config.database.ip,
    user:config.database.username,
    password:config.database.password,
    database:config.database.dbname
  });
  connction.connect();
  return  connction;
}
 
//查询--并列精确查找
 function getAll(table,{where=0,order="",limit=0}={}){
    let sql ="select * from `"+table+"`";
    if(where){  //where条件
      sql += " where";
      for(let k in where){
          sql += " `"+k+"`='"+where[k]+"' and";
      }
      sql=sql.slice(0,sql.length-3);//去掉最后的"and"
    }
    if(order){
      sql += " order by ";
      for(let k in order){
        sql += "`"+k+"` "+order[k]+",";
      }
      sql = sql.slice(0,sql.length-1);//去掉最后的","
    }
    if(limit){
      sql +=" limit ";
      sql += limit.start ? limit.start+"," : "";
      sql += limit.len ? limit.len : 1;
    }
    return  new Promise(resolve=>{
    // console.log(sql);
    conn().query(sql,(err,results,fileds)=>{
        resolve(results);
    })
   });
  }

module.exports ={getAll}