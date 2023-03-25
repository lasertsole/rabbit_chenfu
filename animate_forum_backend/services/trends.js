const db = require('../db.js')
const { fileUpload } = require('./manner.js')

/***********************主页-动态***********************/
async function getTrendsBox(req, res) {//获取动态盒子方法
    let sql = `select user_login.id,trends.submited_time,username,profile as 
    user_profile,user_recommend,user_photos from trends left join user_login 
    on trends.id=user_login.id order by trends.submited_time desc limit 50`
    let result = await db.query(sql)
    if (result.error) {
        res.send({error: '获取关注盒子失败'})
    } else {
        res.send(result)
    }
};

async function submitTrendsBoxImage(req, res) {//用户上传动态盒子的图片
    let result = await fileUpload(req);
    if(!result.error){
        res.send(result);
    }else{
        res.send({error:"图片上传失败"});
    }
};

async function submitTrendsBox(req, res){//用户上传动态盒子
    let data = req.body;
    let id = data.id;
    let user_recommend = data.user_recommend;
    let user_photos = data.user_photos;
    if(user_photos[0]!=undefined){
        user_photos = user_photos.split(";");
        user_photos = user_photos.map((item)=>{return "/files/" + item;});
        user_photos = user_photos.join(";");
    }
    else{
        user_photos = undefined;
    }

    let sql = 'insert into trends (id, user_recommend, user_photos) values (?, ?, ?)'
    let result = await db.query(sql, [id, user_recommend, user_photos]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

async function searchTrendsBox(req, res){//搜索动态盒子
    let data=req.query;
    let searchContent = data.searchContent;

    searchContent = "%"+searchContent+"%";
    let sql = `select user_login.id,trends.submited_time,username,profile as user_profile,user_recommend,
    user_photos from trends left join user_login on trends.id=user_login.id where username like ? or 
    user_recommend like ? order by trends.submited_time desc limit 50`
    let result = await db.query(sql, [searchContent, searchContent]);
    
    if(!result.error){res.send(result);}else{res.send({error:"查找发送错误"});};
}

module.exports={
    //主页-关注
    getTrendsBox,
    submitTrendsBoxImage,
    submitTrendsBox,
    searchTrendsBox,
}