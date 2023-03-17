import axios from"axios"
import { defineStore } from "pinia";

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

export const useDetailPageStore = defineStore({//临时存储detail页信息
    id: 'detailPage', 
    state: () => ({
        showModel:false,

        serverPath:undefined,//记录服务器地址
        dataMode:undefined,//控制是从数据是来自服务器还是本地
        search_id:undefined,//指明当数据是来自服务器时的search_id
        table:undefined,//指明当数据是来自服务器时，该到哪个表查询

        author_id:undefined,//作者id
        author_name:undefined,//作者姓名
        author_profile:undefined,//作者头像
        recomment:undefined,//留言
        imgArr:undefined,//大图组
        title:undefined,//盒子标题1
        price:undefined,//作品价格
        sold_num:undefined,//作品已售数量
        requireTail:undefined,//请求盒子尾部信息
    }),
    getters: {
    },
    actions:{
        initServerPath:function(serverPath){//初始化服务器地址
            this.serverPath=serverPath;
        },
        openModel:async function(dataMode,param1,param2){//当为server模式时，第二个参数为要查找的table，第三为search_id
            this.showModel=true;
            let result=undefined;
            let data=undefined;
            
            switch(dataMode){
                case "local":
                    this.table=param1;
                break;
                case "server":
                    this.table=param1;
                    this.search_id=param2;
                    switch(this.table){
                        case "showcase":
                            result = await axios.get(this.serverPath+"/searchShowCaseBoxBySearchID",{params:{search_id:this.search_id}});
                            data = result.data;
                            this.author_id = data.id;
                            this.author_name = data.author_name;
                            this.author_profile = data.author_profile;
                            this.imgArr = data.works;
                            this.recomment = data.author_comment;
                            this.price = data.price;
                            this.sold_num = data.sold_num;
                        break;
                        case "require":
                            result = await axios.get(this.serverPath+"/searchRequireBoxBySearchID",{params:{search_id:this.search_id}});
                            console.log(result.data);
                            data = result.data;
                            this.author_id = data.id;
                            this.author_name = data.username;
                            this.author_profile = data.profile;
                            this.title = result.data.title;
                            this.recomment = data.describe_require;
                            this.imgArr = data.describe_image;
                            this.requireTail = [data.money, data.tag, data.calendar] 
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