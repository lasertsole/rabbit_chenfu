const db = require('../db.js')
const { fileUpload } = require('./manner.js')

/***********************约稿-需求帖***********************/
async function getRequireBox(req, res) {//获取需求盒子方法
    let sql = `select title,describe_require,describe_image,money,tag,calendar,requireBox.id,
    profile,username from requireBox left join user_login on requireBox.id=user_login.id order 
    by requireBox.created_time desc limit 50`
    let result = await db.query(sql)
    if (result.error) {
        res.send({error: '获取需求盒子失败'})
    } else {
        res.send(result)
    }
};

async function submitRequireBoxImage(req, res) {//用户上传需求盒子
    let result = await fileUpload(req);
    if(!result.error){
        res.send(result);
    }else{
        res.send({error:"作品上传失败"});
    }
    console.log(result);
};

async function submitRequireBox(req, res) {//用户上传需求盒子
    let data = req.body;

    let title = data.title;
    let describe = data.describe;
    let describe_image = data.describe_image;
    if(describe_image==undefined){
        describe_image="";
    }
    else{
        describe_image = "/files/" + describe_image;
    }
    let money = data.money;
    let tag = data.tag;
    let calendar= data.calendar;
    let id = data.id;
    let username = data.username;

    let sql = 'insert into requirebox (title, describe_require, describe_image, money, tag, calendar, id) values (?, ?, ?, ?, ?, ?, ?)'
    let result = await db.query(sql, [title, describe, describe_image, money, tag, calendar, id]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
};

async function searchRequireBox(req, res){//搜索需求盒子
    let data=req.query;
    let searchContent = data.searchContent;

    searchContent = "%"+searchContent+"%";
    let sql = `select title,describe_require,describe_image,money,tag,calendar,requireBox.id,profile,
    username from requireBox left join user_login on requireBox.id=user_login.id where title like ? or
     username like ? or describe_require like ? order by requireBox.created_time desc limit 50`;
    let result = await db.query(sql, [searchContent, searchContent, searchContent]);
    
    if(!result.error){res.send(result);}else{res.send({error:"查找发送错误"});};
}

module.exports={
    //约稿-需求帖
    getRequireBox,
    submitRequireBoxImage,
    submitRequireBox,
    searchRequireBox,
}