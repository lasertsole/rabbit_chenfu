const db = require('../db.js')
const { fileUpload } = require('./manner.js')

/***********************主页-新作品***********************/
async function getnewWorkBox(req, res) {//获取新作品盒子方法
    let sql = `select works,works_describe,profile as author_profile,username as author_name,appoint,author_id,work_id from
     newWork left join user_login on newWork.author_id=user_login.id order by newWork.created_time desc limit 50`
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
    let works = "/files/"+data.works;
    let works_describe = data.works_describe;
    let author_id = data.author_id;

    let sql = 'insert into newWork (works, works_describe, appoint, author_id) values (?, ?, 0, ?)'
    let result = await db.query(sql, [works, works_describe, author_id]);
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

async function getLikeStatusArr(req, res){//获取点赞列表
    let token = req.headers.token
    if(token){
        let sql = 'select id from user_login where token = ?'
        let result = await db.query(sql, [token])
        let user_id = result[0].id;
    
        sql = 'select work_id from newwork_like where user_id=? order by created_time'
        result = await db.query(sql, [user_id]);
        result = result.map((item)=>{return item.work_id});
    
        if(!result.error){res.send(result);}
        else{res.send({error:"获取点赞列表发生错误"});}
    }
    else{
        res.send([]);
    }
}
async function changeLike(req, res){//改变点赞状态
    let token = req.headers.token;
    let data = req.body;
    let sql = 'select id from user_login where token = ?'
    let result = await db.query(sql, [token])
    let user_id = result[0].id;
    let work_id = data.work_id;

    sql = 'select * from newWork_like where user_id=? and work_id=?'
    result = await db.query(sql, [user_id, work_id]);
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

async function searchNewWorkBox(req, res){//搜索新作品盒子
    let data=req.query;
    let searchContent = data.searchContent;

    searchContent = "%"+searchContent+"%";
    let sql = `select works,works_describe,profile as author_profile,username as author_name,appoint,author_id,work_id 
    from newWork left join user_login on newWork.author_id=user_login.id where works_describe like ? or username like ?
     order by newWork.created_time desc limit 50`;
    let result = await db.query(sql, [searchContent, searchContent]);
    
    if(!result.error){res.send(result);}else{res.send({error:"查找发送错误"});};
}

module.exports={
    //主页-新作品
    getnewWorkBox,
    submitnewWorkBoxImage,
    submitnewWorkBox,
    getLikeStatusArr,
    changeLike,
    searchNewWorkBox,
}