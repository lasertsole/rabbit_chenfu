<template>
    <div class="contacts">
        <el-scrollbar>
            <p v-for="(item, index) in personList" :key="item" class="scrollbar-demo-item" @click="changeIndexContacts(index)">
                <div class="profile_box">
                    <img class="profile" :src="global.ServerPath+item.profile"/>
                </div>
                <div class="info">
                    <div class="user_name">{{item.username}}</div>
                    <div class="last_community_content">{{JSON.parse(item.content).data[0].content}}</div>
                </div>
            </p>
        </el-scrollbar>
    </div>
</template>

<script setup>
    import useGlobal from "/src/global";
    import { defineProps, defineEmits } from "vue";
    const props = defineProps({personList:Array});//从父组件传值到本组件
    const emits = defineEmits(["changeIndexContacts"]);//向父组件传递参数
    const global = useGlobal();//引入全局变量

    function changeIndexContacts(index){
        emits("changeIndexContacts",index);
    }
</script>

<style lang="scss" scoped>
    .contacts{
        height: 100%;
        min-width: 250px;
        box-sizing: border-box;
        @media screen and (max-width: 945px) {
            min-width: 200px;
        }

        @media screen and (max-width: 610px) {
            min-width: 150px;
        }

        @media screen and (max-width: 500px) {
            min-width: 75px;
        }
        
        .scrollbar-demo-item {
            display: flex;
            flex-direction: row;
            padding: 10px;
            align-items: center;
            cursor: pointer;
            margin: 3px;
            text-align: center;
            border-radius: 4px;
            transition: all 0.3s ease;
            box-shadow: inset 2px 2px 2px 0px rgb(255 255 255 / 50%), 7px 7px 20px 0px rgb(0 0 0 / 10%), 4px 4px 5px 0px rgb(0 0 0 / 10%);
            
            .profile_box{
                display: flex;
                justify-content: center;
                align-items: center;
                .profile{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }
            }

            .info{
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                align-items: flex-start;
                padding-left: 10px;
                .user_name{
                    color: white;
                    display: block;
                    text-align: left;
                    max-width: 163px;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    white-space: nowrap; /* 段落中的文本不进行换行 */
                    overflow: hidden; /* 溢出部分隐藏 */
                    @media screen and (max-width: 945px) {
                        max-width: 113px;
                    }

                    @media screen and (max-width: 610px) {
                        max-width: 70px;
                    }
                }

                .last_community_content{
                    color: rgb(137, 137, 137);
                    display: block;
                    text-align: left;
                    max-width: 163px;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    white-space: nowrap; /* 段落中的文本不进行换行 */
                    overflow: hidden; /* 溢出部分隐藏 */
                    @media screen and (max-width: 945px) {
                        max-width: 113px;
                    }

                    @media screen and (max-width: 610px) {
                        max-width: 70px;
                    }
                }

                @media screen and (max-width: 500px) {
                    display: none;
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #3f6cff 0%,rgb(240, 240, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #4952ff 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>