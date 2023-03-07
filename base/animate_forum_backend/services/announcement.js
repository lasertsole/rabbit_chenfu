const db = require('../db.js')
const {getAccountInfoByToken, getAccountInfoByID} = require("./account")

/***********************消息-公告***********************/
async function getAnnouncementBox(req, res) {//获取公告盒子方法
    let sql = 'select * from announcement order by publisher_time desc limit 50'//按创建时间排序
    result = await db.query(sql)
    if (result.error) {
        res.send({error: '无公告盒子'})
    } else {
        res.send(result)
    }
};

module.exports={
    //消息-公告
    getAnnouncementBox,
}