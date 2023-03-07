<template>
    <div class="header">
        <!-- 左侧logo -->
        <div class="logo">
            <h2>沉浮兔</h2>
        </div>
        <!-- 主菜单 -->
        <div class="header-menu" :class="{'header-menu-change-search':isChangeSearch}">
            <router-link  active-class="active" to="/index">首页</router-link>
            <router-link  active-class="active" to="/Reservation">约稿</router-link>
            <router-link  active-class="active" to="/message">消息</router-link>
            <router-link  active-class="active" to="/Person">我的</router-link>
        </div>
        <!-- 搜索框 -->
        <searchBar :isChangeSearch="isChangeSearch" @changeStyle="changeStyle"></searchBar>
        <!-- 头像 -->
        <userMenu></userMenu>
    </div>

</template>

<script setup>
    import { ref } from 'vue'
    import searchBar from './frameComponents/searchBar.vue'
    import userMenu from "./frameComponents/userMenu.vue"

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
            width: 96px;
            height: 30px;
            margin-right: 110px;
            display: flex;
            flex-direction: row;
            align-items: center;

            @media screen and (max-width: 945px) {
                display: none;
            }

            h2{
                background-image: linear-gradient(#7a42ff, #42c7fb);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
            }
        }

        /* .head-menu */
        &-menu{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            margin-left: 5px;
            a{
                padding: 20px 30px;
                text-decoration: none;
                color: #96A4A9;
                border-bottom: 2px solid transparent;
                transition: 0.3s;
                @media screen and (max-width: 610px) {
                    display: none;
                }

                &.active{
                    color: #ffffff;
                    border-bottom: 2px solid #ffffff;
                }
            }
        }

        /*输入框聚焦后，样式改变 */
        &-menu-change-search{
            display: none;
        }
    }
    
</style>