<template>
    <div @click="clickShowModel" class="require-box">
        <div class="require-box-abstract">
            <div class="leftBox">
                <div class="title">{{title}}</div>
                <div class="describe">{{describe_require}}</div>
            </div>
            <div class="rightBox" v-if="describe_image!=undefined">
                <!-- 可以为空 -->
                <el-image class="LazyloadImg"
                    v-if="describe_image!=undefined"
                    :src="describe_image"
                    :lazy="lazyLoad"
                    scroll-container=".page-content"
                />
            </div>
        </div>
        <div class="require-box-figure">
            <span class="money"><img src="/icons/money.svg"/>{{money}}</span>
            <span class="tag"><img src="/icons/tag.svg"/>{{tag}}</span>
            <span class="calendar"><img src="/icons/calendar.svg"/>{{calendar}}</span>
        </div>
    </div>
</template>

<script setup>
    import useGlobal from "/src/global";
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';

    const props = defineProps({title:String, describe_require:String, describe_image:String, money:String,
         tag:String, calendar:String, profile:String, username:String, id:String, search_id:String});//从父组件传值到本组件
    const global = useGlobal();//获取全局变量
    const detailPage = global.detailPage;//获得模态框页面对象

    /**控制模态框显现与否**/
    function clickShowModel(){
        detailPage.openModel("local","require",{ search_id: props.search_id, id:props.id, username:props.username,
             profile:props.profile, title:props.title, describe_require:props.describe_require, describe_image:props.describe_image, 
             money:props.money, tag:props.tag, calendar:props.calendar});
    }

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**挂载触发**/
    onMounted(()=>{
        lazyLoad.value=true;//启动懒加载
    })

    /**卸载载触发**/
    onUnmounted(()=>{
        lazyLoad.value=false;//重置懒加载
    })
</script>

<style lang="scss" scoped>
    .require-box{
        cursor: pointer;
        background-color: white;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        height: 200px;
        overflow: hidden;
        padding: 10px 12px 0px 12px;
        margin-bottom: 10px;
        &-abstract{
            flex-basis: 80%;
            display: flex;
            flex-direction: row;
            .leftBox{
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                flex-grow: 1;
                .title{
                    font-size: 20px;
                    color: rgb(39, 39, 39);
                    font-weight: 500;
                    padding: 10px 0px;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    white-space: nowrap; /* 段落中的文本不进行换行 */
                    overflow: hidden; /* 溢出部分隐藏 */
                }

                .describe{
                    font-size: 14px;
                    color: rgb(54, 54, 54);
                    padding: 10px 0px;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    overflow: hidden; /* 溢出部分隐藏 */
                }
            }

            .rightBox{
                flex-basis: 150px;
                min-width: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                overflow: hidden;
                border-radius: 8px;
                .LazyloadImg{
                    width: 150px;
                    height: 150px;
                }
            }
        }

        &-figure{
            flex-basis: 20%;
            color: #b8b8b8;
            font-size: 13px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #b8b8b8;
            padding: 0px 15px;
            span{
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            img{
                width: 13px;
                height: 13px;
                margin-right: 5px;
            }
        }
    }
</style>
<style lang="scss">//调节element-plus、vue3-lazyload属性
    .require-box{//调节vue3-lazyload
        .LazyloadImg{
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: 50% 50%;
            }
        }
    }
</style>