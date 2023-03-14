const db =require('../db.js')
const md5 = require('md5')
const { fileUpload } = require('./manner.js')

/***********************用户登录***********************/
async function login(req, res) {//普通登录方法
    let data = req.body
    let phone = data.phone
    let password = data.password

    let sql = 'select password, salt, token, username, profile, id from user_login where phone = ?'
    let result = await db.query(sql, [phone])
    if (result.error) {
        res.send({error: '发生错误'})
    }else if(result.length==0){
        res.send({error: '手机号未被注册'})
    }
    else{
        let username = result[0].username
        let profile =result[0].profile
        let salt = result[0].salt
        let id = result[0].id
        password = md5(password+ salt)
        let token = md5(phone + password + salt)
        
        if (password==result[0].password) {
            res.send({username, profile, id, token})
        } else {
            res.send({error: '密码错误'})
        }
    }
};
async function fasterLogin(req, res) {//token登录方法
    let token = req.headers.token
    let sql = 'select username, profile, token, id from user_login where token = ?'
    let result = await db.query(sql, [token])
    if(result.length!=0){
        let data=result[0];
        res.send({username:data.username, profile:data.profile, token:data.token, id:data.id});
    } else {
        res.send({error: '未登录，请登录后再操作'})
    }
};
async function register(req, res) {//用户注册
    let data = req.body
    let phone = data.phone
    let password = data.password

    let salt = md5(new Date().getTime())
    let profile = "/files/anonymous.svg"
    password = md5(password+ salt)
    let token = md5(phone + password + salt)
    let username = md5(Math.random())

    let sql = 'insert into user_login (phone, profile, password, salt, token, username) values (?, ?, ?, ?, ?, ?)'
    let result = await db.query(sql, [phone, profile, password, salt, token, username])
    if (result.error) {
        res.send({error: '手机号已被使用'})
    } else {
        login(req, res)
    }
};

/***********************账户信息搜索***********************/
async function getAccountInfoByToken(token) {//根据token获得账户基本信息(username,profile,id)
    let sql = 'select username, profile, id from user_login where token = ?'
    let result = await db.query(sql, [token])
    if (result.error) {
        return {error: '发生错误'}
    }else if(result.length==0){
        return {error: '找不到匹配token的信息'}
    }
    else{
        return {username:result[0].username, profile:result[0].profile, id:result[0].id};
    }
};

async function getAccountInfoByID(id) {//根据id获得账户基本信息(username,profile)
    let sql = 'select username, profile from user_login where id = ?'
    let result = await db.query(sql, [id])

    if (result.error) {
        return {error: '发生错误'}
    }else if(result.length==0){
        return {error: '找不到匹配id的信息'}
    }
    else{
        return {username:result[0].username, profile:result[0].profile, id}
    }
};

/***********************用户头像上传***********************/
async function submitUserProfile(req, res) {//用户上传头像
    let result = await fileUpload(req);
    if(!result.error){
        res.send(result);
    }else{
        res.send({error:"头像上传失败"});
    }
};
async function changeUserProfile(req, res){//上传头像后更改profile
    let data = req.body;
    let imgPath = "/files/"+data.imgPath;
    let token = data.token;

    let sql = 'update user_login set profile=? where token = ?'
    let result = await db.query(sql, [imgPath, token])
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({profile:imgPath});
    }
}

/***********************用户名字上传***********************/
async function submitNewName(req, res){
    let data = req.body;
    let username = data.username;
    let token = data.token;

    let sql = 'update user_login set username=? where token = ?'
    let result = await db.query(sql, [username, token])
    if(result.error||result.length==0){
        res.send({error:"数据库插入失败"});
    }else{
        res.send({success:"数据库插入成功"});
    }
}

module.exports={
    /*请求函数*/
    login,
    fasterLogin,
    register,
    submitUserProfile,
    changeUserProfile,
    submitNewName,

    /*工具函数*/
    getAccountInfoByToken,
    getAccountInfoByID,
}