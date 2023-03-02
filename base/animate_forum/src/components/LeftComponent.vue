<template>
    <div class="left-side" v-show=" catalogue.length > 0">
        <div class="side-wrapper" v-for="pItem in catalogue" :key="pItem.pId">
            <div class="side-title">{{ pItem.pName }}</div>
            <div class="side-menu">
                <router-link v-for="item in pItem.name" :key="item.id" active-class="active" :to="item.to">
                <img :src="item.imageUrl">
                    {{item.name}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref} from "vue"

    const catalogue= ref([
        {
            pId: 1,
            pName: '首页',
            name:[
                {id:1,imageUrl:'',name:'新作品',to:'/index/newWork'},
                {id:2,imageUrl:'',name:'动态',to:'/index/trends'},
            ]
        },
        {
            pId: 2,
            pName: '约稿',
            name:[
                {id:1,imageUrl:'',name:'橱窗',to:'/Reservation/showcase'},
                {id:2,imageUrl:'',name:'需求贴',to:'/Reservation/require'},
            ]
        },
        {
            pId: 3,
            pName: '消息',
            name:[
                {id:1,imageUrl:'',name:'会话',to:'/message/session'},
                {id:1,imageUrl:'',name:'公告',to:'/message/announcement'},
            ]
        },
        {
            pId: 4,
            pName: '我的',
            name:[
                {id:1,imageUrl:'',name:'管理',to:'/Person/manager'},
            ]
        },
    ]);
</script>

<style lang="scss" scoped>
    .left-side {
        position: relative;
        z-index: 0;
        flex-basis: 160px;
        border-right: 1px solid rgba(113 119 144 / 25%);
        padding: 26px;
        overflow-y: scroll;
        flex-shrink: 0;
        background-color: #252526;
        @media screen and (max-width: 945px) {
            display: none;
        }

        .side-wrapper {
            margin-top: 20px;

            .side-title {
                color: #96A4A9;
                margin-bottom: 14px;
            }

            .side-menu {
                display: flex;
                flex-direction: column;
                white-space: nowrap;
                
                a {
                    text-decoration: none;
                    color: #7c888d;
                    display: flex;
                    align-items: center;
                    font-weight: 400;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 6px;
                    transition: 0.3s;
                    
                    &:hover {
                        background-color: rgba(12 15 25 / 30%);
                        color: white;
                    }
                    &.active {
                        color: #00e3fc;
                    }
                }
                
                img {
                    width: 16px;
                    margin-right: 8px;
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #db6ff3 0%,rgb(240, 240, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #f16de4 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>