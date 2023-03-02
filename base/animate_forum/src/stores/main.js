import { defineStore } from "pinia";

export const useMainStore = defineStore({//持久化存储
    id: 'main', 
    state: () => ({
        token:undefined,
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
    }

})


export const useTempStore = defineStore({//临时性存储
    id: 'temp', 
    state: () => ({
        userinfo: undefined,
    }),
    getters: {
    },
    actions:{
    }

})