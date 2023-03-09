<template>
    <div class="page">
        <!-- 功能分页 屏幕宽度小于610px显示-->
        <div class="page-menu">
            <router-link  active-class="active" to="/index/newWork">新作品</router-link>
            <router-link  active-class="active" to="/index/trends">动态</router-link>
        </div>

        <!-- 显示内容 -->
        <div class="page-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>   
</script>

<style lang="scss" scoped>
    .page{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        &-menu{
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            height: 45px;
            @media screen and (min-width: 610px) {
                display: none;
            }

            a{
                flex-shrink: 0;
                line-height: 45px;
                padding: 0px 10px;
                margin: 0px 20px;
                text-decoration: none;
                color: #7c888d;
                border-bottom: 2px solid transparent;
                transition: 0.3s;

                &.active{
                    color: #00e3fc;
                    border-bottom: 2px solid #00e3fc;
                }
            }

            .fix{
                flex-grow: 1;
                background-color: #00e3fc;
            }
        }

        &-content{
            flex-grow: 1;
            overflow-y: scroll;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }

        &-bottom-menu{
            background: #323233;
            height: 58px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            a{
                display: block;
                flex-basis: 100%;
                flex-shrink: 1;
                text-align: center;
                line-height: 58px;
                color: #96A4A9;
                &.active{
                    color: #00e3fc;
                    border-top: 2px solid #00e3fc;
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #716ff3 0%,rgb(240, 210, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #6f6df1 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>