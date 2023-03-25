<template>
    <div class="bottom">
        <router-link  active-class="active" to="/index">首页</router-link>
        <router-link  active-class="active" to="/Reservation">约稿</router-link>
        <router-link  active-class="active" to="/message">消息</router-link>
        <router-link  active-class="active" to="/Person">我的</router-link>
    </div>
</template>

<script setup>
    
</script>

<style lang="scss" scoped>
    .bottom{
        position: relative;
        z-index: 0;
        height: 58px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        @media screen and (min-width: 610px) {
            display: none;
        }

        a{
            display: block;
            flex-basis: 25%;
            text-align: center;
            line-height: 58px;
            color: #96A4A9;
            &.active{
                color: #ffffff;
                border-top: 2px solid #ffffff;
            }
        }
    }
</style>