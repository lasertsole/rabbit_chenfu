const db = require('../db.js')
const {getAccountInfoByToken, getAccountInfoByID} = require("./account")

/***********************消息-会话***********************/
async function getSessionBox(req, res) {//获取消息盒子方法
    let token = req.headers.token
    if(token==undefined){
        res.send({error: '用户未登录'})
    }
    else{
        let result = await getAccountInfoByToken(token);
        if(result.error){
            res.send({error: 'token错误'})
        }
        else{
            let id = result.id
            let username = result.username
            let profile = result.profile
            let sql = 'select * from session where source_id = ? or target_id = ? order by created_time'//按创建时间排序
            result = await db.query(sql,[id, id])
            if (result.error) {
                res.send({error: '无消息盒子'})
            } else {
                res.send({id, username, profile, result})
            }
        }
    }
};

async function getPersonList(req, res){//获取右侧联系人列表
    let data = req.body;
    let personList = data.personList;
    let tempArr = [];
    for(let i=0;i<personList.length;i++){
        tempArr.push(await getAccountInfoByID(personList[i]));
    }
    res.send(tempArr);
}

async function submitChat(req, res){//提交聊天内容
    let data = req.body;
    let source_id = data.source_id;
    let target_id = data.target_id;
    let content = data.content;
    let sql = 'insert into session (source_id, target_id, content) values (?, ?, ?)'//按创建时间排序
    result = await db.query(sql,[source_id, target_id, content])
    if (result.error) {
        res.send({error: '提交失败'})
    } else {
        res.send({success: '提交成功'})
    }
}

module.exports={
    //消息-会话
    getSessionBox,
    getPersonList,
    submitChat,
}