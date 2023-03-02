const db = require('../db.js')
const { fileUpload } = require('./manner.js')

/***********************主页-新作品***********************/
async function getnewWorkBox(req, res) {//获取新作品盒子方法
    let sql = 'select * from newWork order by author_profile limit 50'
    let result = await db.query(sql)
    if (result.error) {
        res.send({error: '获取推荐盒子失败'})
    } else {
        res.send(result)
    }
};

async function submitnewWorkBoxImage(req, res) {//用户上传新作品盒子的图片
    let result = await fileUpload(req);
    if(!result.error){
        res.send(result);
    }else{
        res.send({error:"作品上传失败"});
    }
};
async function submitnewWorkBox(req, res){//用户上传新作品盒子
    let data = req.body;
    console.log(data);
    let works = "/files/"+data.works;
    console.log(works);
    let works_describe = data.works_describe;
    let author_profile = data.author_profile;
    let author_name = data.author_name;
    let author_id = data.author_id;

    let sql = 'insert into newWork (works, works_describe, author_profile, author_name, appoint, author_id) values (?, ?, ?, ?, 0, ?)'
    let result = await db.query(sql, [works, works_describe, author_profile, author_name, author_id]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

async function getLikeStatus(req, res){//获取点赞状态
    let data = req.body;
    let user_id = data.user_id;
    let work_id = data.work_id;

    let sql = 'select * from newWork_like where user_id=? and work_id=?'
    let result = await db.query(sql, [user_id, work_id]);

    if(!result.error){
        if(result.length!=0){res.send(true);}
        else{res.send(false);}
    }
    else{res.send({error:"获取点赞状态发生错误"});}
}
async function changeLike(req, res){//改变点赞状态
    let data = req.body;
    let user_id = data.user_id;
    let work_id = data.work_id;

    let sql = 'select * from newWork_like where user_id=? and work_id=?'
    let result = await db.query(sql, [user_id, work_id]);
    if(result.error){res.send({error:"改变点赞状态发生错误"});}

    let LikeStatus = result.length!=0?true:false;
    let appointnum = undefined;

    if(LikeStatus){
        sql = 'delete from newWork_like where user_id=? and work_id=?'
        result = await db.query(sql, [user_id, work_id]);
        if(!result.error){
            sql = 'select appoint from newWork where work_id=?'
            result = await db.query(sql, [work_id]);
            appointnum = result[0].appoint-1;
            if(!result.error){
                sql = 'update newWork set appoint=? where work_id = ?'
                result = await db.query(sql, [appointnum, work_id]);
            }
        }
    }else{
        sql = 'insert into newWork_like (user_id, work_id) values (?, ?)'
        result = await db.query(sql, [user_id, work_id]);
        if(!result.error){
            sql = 'select appoint from newWork where work_id=?'
            result = await db.query(sql, [work_id]);
            appointnum = result[0].appoint+1;
            if(!result.error){
                sql = 'update newWork set appoint=? where work_id = ?'
                result = await db.query(sql, [appointnum, work_id]);
            }
        }
    }
    if(result.error){res.send({error:"改变点赞状态发生错误"});}
    res.send({LikeStatus:!LikeStatus,appointnum});
}

/***********************主页-动态***********************/
async function getTrendsBox(req, res) {//获取动态盒子方法
    let sql = 'select * from trends order by id limit 50'
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
    let username = data.username;
    let user_profile = data.user_profile;
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

    let sql = 'insert into trends (id, username, user_profile, user_recommend, user_photos) values (?, ?, ?, ?, ?)'
    let result = await db.query(sql, [id, username, user_profile, user_recommend, user_photos]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

module.exports={
    //主页-新作品
    getnewWorkBox,
    submitnewWorkBoxImage,
    submitnewWorkBox,
    getLikeStatus,
    changeLike,

    //主页-关注
    getTrendsBox,
    submitTrendsBoxImage,
    submitTrendsBox,
}