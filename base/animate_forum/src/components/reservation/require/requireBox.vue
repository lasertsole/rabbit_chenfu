<template>
    <div class="require-box">
        <div class="require-box-abstract">
            <div class="leftBox">
                <div class="title">{{title}}</div>
                <div class="describe">{{describe_require}}</div>
            </div>
            <div class="rightBox">
                <!-- 头像可以为空 -->
                <img v-if="describe_image!=global.ServerPath" :src="describe_image">
            </div>
        </div>
        <div class="require-box-figure">
            <span class="moneny"><img src="/src/assets/icons/money.svg"/>{{money}}</span>
            <span class="tag"><img src="/src/assets/icons/tag.svg"/>{{tag}}</span>
            <span class="calendar"><img src="/src/assets/icons/calendar.svg"/>{{calendar}}</span>
        </div>
    </div>
</template>

<script setup>
    import {defineProps} from "vue";
    import useGlobal from "/src/global";
    const global = useGlobal();//获取全局变量

    const props = defineProps({title:String, describe_require:String, describe_image:String, money:String, tag:String, calendar:String});//从父组件传值到本组件
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
                img{
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