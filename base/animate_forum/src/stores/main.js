import { defineStore } from "pinia";

export const useMainStore = defineStore({//持久化存储
    id: 'main', 
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