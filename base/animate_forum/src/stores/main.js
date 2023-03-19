import axios from"axios"
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

export const useMainStore = defineStore({//持久化存储用户信息
    id: 'mainInfo', 
    state: () => ({
        token:undefined,
        userinfo: undefined,
    }),
    //持久化选项
    persist:{ 
        storage: window.localStorage,
        //自定义持久化方式
        // beforeRestore: context => {
        //     console.log('Before', context)
        // },
        // afterRestore: context => {
        //     console.log('After', context)
        // }
    },
    getters: {
    },
    actions:{
        removeAccount:function(){//移除账号信息
            this.token=undefined;
            this.userinfo=undefined;
        },
        setAccount:function(token,userinfo){//设置账号信息
            this.token=token;
            this.userinfo=userinfo;
        },
    }
})

export const useTabBarStore = defineStore({//持久化存储用户信息
    id: 'tabBar', 
    state: () => ({
        tabBarIndex:1
    }),
    actions:{
        setTabBarIndex:function(tabBarIndex){this.tabBarIndex=tabBarIndex}
    }
})

export const useDetailPageStore = defineStore({//临时存储detail页信息
    id: 'detailPage', 
    state: () => ({
        showModel:false,

        serverPath:undefined,//记录服务器地址
        dataMode:undefined,//控制是从数据是来自服务器还是本地
        search_id:undefined,//指明当数据是来自服务器时的search_id
        table:undefined,//指明当数据是来自服务器时，该到哪个表查询

        author_id:undefined,//用户id
        author_name:undefined,//用户姓名
        author_profile:undefined,//用户头像
        recomment:undefined,//留言
        imgArr:undefined,//大图组
        title:undefined,//盒子标题
        price:undefined,//作品价格
        sold_num:undefined,//作品已售数量
        submited_time:undefined,//盒子提交时间
        requireTail:undefined,//请求盒子尾部信息
        work_id:undefined,//作品唯一id
        likeStatusArr:undefined,//点赞列表的ref
        appointNum:undefined,//总点赞数
        newWorkBoxPointer:-1,//指向newWorkBox的指针，用于判断指向那个盒子
    }),
    getters: {
    },
    actions:{
        setLikeStatusArr:function(likeStatusArr){//设置点赞列表
            this.likeStatusArr=likeStatusArr;
        },
        initServerPath:function(serverPath){//初始化服务器地址
            this.serverPath=serverPath;
        },
        openModel:async function(dataMode,param1,param2){//当为server模式时，第二个参数为要查找的table，第三为search_id
            this.showModel=true;
            this.dataMode=dataMode;
            this.table=param1;
            let result=undefined;
            let data=undefined;
            
            switch(this.dataMode){
                case "local":
                    switch(this.table){
                        case "newWork":
                            this.author_id = param2.author_id;
                            this.author_name = param2.user_name;
                            this.author_profile = param2.user_profile;
                            this.recomment = param2.works_describe;
                            this.imgArr = param2.url;
                            this.work_id = param2.work_id;
                            this.appointNum = param2.appointNum;
                            this.newWorkBoxPointer = param2.newWorkBoxPointer;
                        break;
                        case "trends":
                            this.author_name = param2.user_name;
                            this.author_profile = param2.user_profile;
                            this.submited_time = param2.submited_time;
                            this.recomment = param2.user_recommend;
                            this.author_id = param2.author_id;
                            this.imgArr = param2.imageArr;
                        break;
                        case "showcase":
                            this.search_id = param2.search_id;
                            this.author_id = param2.id;
                            this.author_name = param2.author_name;
                            this.author_profile = param2.author_profile;
                            this.imgArr = param2.works;
                            this.recomment = param2.author_comment;
                            this.price = param2.price;
                            this.sold_num = param2.sold_num;
                        break;
                        case "require":
                            this.search_id = param2.search_id;
                            this.author_id = param2.id;
                            this.author_name = param2.username;
                            this.author_profile = param2.profile;
                            this.title = param2.title;
                            this.recomment = param2.describe_require;
                            this.imgArr = param2.describe_image;
                            this.requireTail = [param2.money, param2.tag, param2.calendar];
                        break;
                    }
                break;
                case "server":
                    this.search_id=param2;
                    switch(this.table){
                        case "showcase":
                            result = await axios.get(this.serverPath+"/searchShowCaseBoxBySearchID",{params:{search_id:this.search_id}});
                            if(!result.data.error){
                                data = result.data;
                                this.author_id = data.id;
                                this.author_name = data.author_name;
                                this.author_profile = this.serverPath+data.author_profile;
                                this.imgArr = this.serverPath+data.works;
                                this.recomment = data.author_comment;
                                this.price = data.price;
                                this.sold_num = data.sold_num;
                            }else{ElMessage.error("页面加载发生错误")}
                        break;
                        case "require":
                            result = await axios.get(this.serverPath+"/searchRequireBoxBySearchID",{params:{search_id:this.search_id}});
                            if(!result.data.error){
                                data = result.data;
                                this.author_id = data.id;
                                this.author_name = data.username;
                                this.author_profile = this.serverPath+data.profile;
                                this.title = data.title;
                                this.recomment = data.describe_require;
                                this.imgArr = this.serverPath+data.describe_image;
                                this.requireTail = [data.money, data.tag, data.calendar] 
                            }else{ElMessage.error("页面加载发生错误")}
                        break;
                    }
                break;
            }
        },
        closeModel:function(){
            this.showModel=false;
        },
    }
})