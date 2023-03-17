const db = require('../db.js')
const { fileUpload } = require('./manner.js')

async function getShowCaseBox(req, res) {//获取橱窗盒子方法
    let sql = `select works,profile as author_profile,author_comment,price,sold_num,username as 
    author_name,showcase.id, search_id from showcase left join user_login on showcase.id=user_login.id 
    order by showcase.created_time desc limit 50`
    let result = await db.query(sql)
    if (result.error) {
        res.send({error: '获取橱窗盒子失败'})
    } else {
        res.send(result)
    }
};

async function submitShowCaseBoxImage(req, res) {//用户上传橱窗盒子的图片
    let result = await fileUpload(req);
    if(!result.error){
        res.send(result);
    }else{
        res.send({error:"作品上传失败"});
    }
};

async function submitShowCaseBox(req, res){//用户上传橱窗盒子
    let data = req.body;
    let works = "/files/"+data.works;
    let author_profile = data.author_profile;
    let author_comment = data.author_comment;
    let price = data.price;
    let author_name = data.author_name;
    let id = data.id;

    let sql = 'insert into showcase (works, author_comment, sold_num, price, id) values (?, ?, 0, ?, ?)'
    let result = await db.query(sql, [works, author_comment, price, id]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

async function searchShowCaseBox(req, res){//搜索橱窗盒子
    let data=req.query;
    let searchContent = data.searchContent;

    searchContent = "%"+searchContent+"%";
    let sql = `select works,profile as author_profile,author_comment,price,sold_num,username as
     author_name,showcase.id from showcase left join user_login on showcase.id=user_login.id where 
     username like ? or author_comment like ? order by showcase.created_time desc limit 50`
    let result = await db.query(sql, [searchContent, searchContent]);
    
    if(!result.error){res.send(result);}else{res.send({error:"查找发送错误"});};
}

async function searchShowCaseBoxBySearchID(req, res){//根据searchID查找橱窗盒子信息
    let data=req.query;
    let search_id=data.search_id;

    let sql = `select works,profile as author_profile,author_comment,price,sold_num,username as author_name,
    showcase.id from showcase left join user_login on showcase.id=user_login.id where search_id=?`

    let result = await db.query(sql, [search_id]);
    
    if(!result.error){res.send(result[0]);}else{res.send({error:"查找发送错误"});};
}

module.exports={
    //约稿-橱窗
    getShowCaseBox,
    submitShowCaseBoxImage,
    submitShowCaseBox,
    searchShowCaseBox,
    searchShowCaseBoxBySearchID,
}