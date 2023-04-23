const express = require("express")
const cors = require('cors')
const {fasterLogin, login, register, submitUserProfile, changeUserProfile, submitNewName } = require("./services/account.js")

const { getnewWorkBox, submitnewWorkBoxImage, submitnewWorkBox, getLikeStatusArr, changeLike, searchNewWorkBox } = require("./services/newWork.js")
const { getTrendsBox, submitTrendsBoxImage, submitTrendsBox, searchTrendsBox } = require("./services/trends.js")

const { getShowCaseBox, submitShowCaseBoxImage, submitShowCaseBox, searchShowCaseBox, searchShowCaseBoxBySearchID } = require("./services/showcase.js")
const { getRequireBox, submitRequireBoxImage, submitRequireBox, searchRequireBox, searchRequireBoxBySearchID } = require("./services/require.js")

const { getSessionBox, getPersonList, submitChat } = require("./services/session.js")
const { getAnnouncementBox } = require("./services/announcement.js")

const path = require('path')

const PORT = 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files',express.static(path.join(__dirname,"../../files")));

// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
// app.use(multipart({uploadDir:path.join(__dirname,"../../files")}));

// app.post('/upload',multipartMiddleware, function (req,res) {
// 	console.log(req.body,req.files);//分别返回body，文件属性，以及文件存放地址
// })

/*测试连接性*/
app.get('/',(req,res)=>{
	res.send("Helloworld");
})

/*注册*/
app.post('/register', register);

/*登录*/
app.post('/login', login)//普通登录
app.get('/fasterLogin', fasterLogin)//token登录

/*更改用户个人信息*/
app.post('/submitUserProfile', submitUserProfile);//上传头像
app.post('/changeUserProfile', changeUserProfile);//更改头像
app.post('/submitNewName', submitNewName);//更改用户名字

/*主页-新作品*/
app.get("/getnewWorkBox", getnewWorkBox)//获取新作品盒子方法
app.post("/submitnewWorkBoxImage", submitnewWorkBoxImage)//用户上传新作品盒子的图片
app.post("/submitnewWorkBox", submitnewWorkBox)//用户上传新作品盒子
app.get("/getLikeStatusArr", getLikeStatusArr)//改变点赞列表
app.post("/changeLike", changeLike)//改变点赞状态
app.get("/searchNewWorkBox", searchNewWorkBox)//搜索新作品盒子

/*主页-动态*/
app.get("/getTrendsBox", getTrendsBox)//获取关注盒子方法
app.post("/submitTrendsBoxImage", submitTrendsBoxImage)//用户上传关注盒子的图片
app.post("/submitTrendsBox", submitTrendsBox)//用户上传动态盒子
app.get("/searchTrendsBox", searchTrendsBox);//搜索动态盒子

/*约稿-橱窗*/
app.get("/getShowCaseBox", getShowCaseBox)//获取橱窗盒子方法
app.post("/submitShowCaseBoxImage", submitShowCaseBoxImage)//用户上传橱窗盒子的图片
app.post("/submitShowCaseBox", submitShowCaseBox)//用户上传推荐盒子
app.get("/searchShowCaseBox", searchShowCaseBox)//搜索橱窗盒子
app.get("/searchShowCaseBoxBySearchID", searchShowCaseBoxBySearchID)//根据searchID查找橱窗盒子信息

/*约稿-需求帖*/
app.get("/getRequireBox", getRequireBox)//获取需求盒子方法
app.post("/submitRequireBoxImage", submitRequireBoxImage)//用户上传需求盒子的图片
app.post("/submitRequireBox", submitRequireBox)//用户上传需求盒子
app.get("/searchRequireBox", searchRequireBox)//搜索需求盒子
app.get("/searchRequireBoxBySearchID", searchRequireBoxBySearchID)//根据searchID查找需求盒子信息

/*消息-会话*/
app.get("/getSessionBox", getSessionBox)//获取消息盒子方法
app.post("/getPersonList", getPersonList)//获取右侧联系人列表
app.post("/submitChat", submitChat)//提交聊天内容

/*消息-公告*/
app.get("/getAnnouncementBox", getAnnouncementBox)//获取公告盒子方法

/*启动后台，监听端口为PORT*/
app.listen(PORT,()=>{
	console.log(`HTTP服务在${PORT}端口启动...`);
});
