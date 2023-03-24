const db = require('../db.js');
const multiparty = require('multiparty');
const { fileUpload } = require('./manner.js');

/***********************约稿-需求帖***********************/
async function getRequireBox(req, res) {//获取需求盒子方法
    let sql = `select title,describe_require,describe_image,money,tag,calendar,requireBox.id,
    profile,username,search_id from requireBox left join user_login on requireBox.id=user_login.id
     order by requireBox.created_time desc limit 50`
    let result = await db.query(sql)
    if (result.error) {
        res.send({error: '获取需求盒子失败'})
    } else {
        res.send(result)
    }
};

async function submitRequireBox(req, res) {//用户上传需求盒子的图片
    let form = new multiparty.Form();

    let title = undefined;
    let describe = undefined;
    let describe_image = undefined;
    let money = undefined;
    let tag = undefined;
    let calendar= undefined;
    let id = undefined;
    await form.parse(req, function(err, fields, files) {
        title = fields.title[0];
        describe = fields.describe[0];
        money = fields.money[0];
        tag = fields.tag[0];
        calendar= fields.calendar[0];
        id = fields.id[0];
        console.log(fields);
	});

    let result = await fileUpload(req);
    if(!result.error){
        describe_image=result;
        describe_image = "/files/" + describe_image;
    }
    else{res.send({error:"作品上传失败"});}

    console.log(title);
    let sql = 'insert into requirebox (title, describe_require, describe_image, money, tag, calendar, id) values (?, ?, ?, ?, ?, ?, ?)'
    result = await db.query(sql, [title, describe, describe_image, money, tag, calendar, id]);
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

async function searchRequireBoxBySearchID(req, res){//根据searchID查找需求盒子信息
    let data=req.query;
    let search_id=data.search_id;

    let sql = `select title,describe_require,describe_image,money,tag,calendar,requireBox.id,profile,
    username from requireBox left join user_login on requireBox.id=user_login.id where search_id=?`;

    let result = await db.query(sql, [search_id]);
    
    if(!result.error){res.send(result[0]);}else{res.send({error:"查找发送错误"});};
}

module.exports={
    //约稿-需求帖
    getRequireBox,
    submitRequireBox,
    searchRequireBox,
    searchRequireBoxBySearchID,
}