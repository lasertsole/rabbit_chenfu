const db = require('../db.js')
const { fileUpload } = require('./manner.js')

/***********************约稿-橱窗***********************/
async function getShowCaseBox(req, res) {//获取橱窗盒子方法
    let sql = 'select * from showcase order by id limit 50'
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

    let sql = 'insert into showcase (works, author_profile, author_comment, sold_num, author_name, price, id) values (?, ?, ?, 0, ?, ?, ?)'
    let result = await db.query(sql, [works, author_profile, author_comment, author_name, price, id]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

/***********************约稿-需求帖***********************/
async function getRequireBox(req, res) {//获取需求盒子方法
    let sql = 'select * from requireBox order by id limit 50'
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

    let sql = 'insert into requirebox (title, describe_require, describe_image, money, tag, calendar, id, username) values (?, ?, ?, ?, ?, ?, ?, ?)'
    let result = await db.query(sql, [title, describe, describe_image, money, tag, calendar, id, username]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
};

module.exports={
    //约稿-橱窗
    getShowCaseBox,
    submitShowCaseBoxImage,
    submitShowCaseBox,

    //约稿-需求帖
    getRequireBox,
    submitRequireBoxImage,
    submitRequireBox,
}