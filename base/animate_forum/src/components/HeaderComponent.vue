<template>
    <div class="header">
        <!-- 左侧logo -->
        <router-link :to="'/index'" class="logo">
            <h2>沉浮兔</h2>
            <div></div>
        </router-link>
        <!-- 主菜单 -->
        <div class="header-menu" :class="{'header-menu-change-search':isChangeSearch}">
            <tabbar :linkArr="linkArr"></tabbar>
        </div>
        <!-- 搜索框 -->
        <searchBar :isChangeSearch="isChangeSearch" @changeStyle="changeStyle"></searchBar>
        <!-- 头像 -->
        <userMenu></userMenu>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import userMenu from "./frameComponents/userMenu.vue";
    import tabbar from './frameComponents/tabbar.vue';
    import searchBar from './frameComponents/searchBar.vue';

    /****************************tabbar配置****************************/
    const linkArr = ref([
        {name:"首页", linkTo:"/index",childLinkArr:[
            {name:'新作品', linkTo:'/index/newWork'},
            {name:'动态', linkTo:'/index/trends'}
        ]},
        {name:"约稿", linkTo:"/Reservation",childLinkArr:[
            {name:'橱窗', linkTo:'/Reservation/showcase'},
            {name:'需求贴', linkTo:'/Reservation/require'}
        ]},
        {name:"消息", linkTo:"/message",childLinkArr:[
            {name:'会话', linkTo:'/message/session'},
            {name:'公告', linkTo:'/message/announcement'}
        ]},
        {name:"我的", linkTo:"/Person",childLinkArr:[
            {name:'管理', linkTo:'/Person/manager'},
        ]},
    ]);

    /****************************点击搜索框展开功能****************************/
    const isChangeSearch= ref(false);
    function changeStyle(){
        isChangeSearch.value = !isChangeSearch.value;
    }
</script>

<style lang="scss" scoped>
    .header {
        position: relative;
        z-index: 1;
        background: #323233;
        display: flex;
        flex-direction: row;
	    align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        height: 58px;
        width: 100%;
        padding: 0 30px;
        white-space: nowrap;
        box-sizing: border-box;
        @media screen and (max-width: 480px) {
            padding: 0 16px;
        }
        
        .logo{
            display: flex;
            flex-direction: row;
            align-items: center;
            h2{
                color: white;
                margin-left: 80px;
                font-family: 仓耳舒圆体W03;
                font-weight: bolder;
                font-size: 30px;
            }

            div{
                $logoEdge: 48px;
                min-width: $logoEdge;
                max-width: $logoEdge;
                min-height: $logoEdge;
                max-height: $logoEdge;
                margin: 0px 20px 0px 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                background-image: url("/icons/logo.png");
                background-position: center 104px;
                $backgroundEdge: $logoEdge*3.0;
                background-size: $backgroundEdge $backgroundEdge;
                overflow: hidden;
            }

            @media screen and (max-width: 945px) {
                display: none;
            }
        }

        /* .head-menu */
        &-menu{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            margin-left: 5px;
        }

        /*输入框聚焦后，样式改变 */
        &-menu-change-search{
            display: none;
        }
    }
</style>