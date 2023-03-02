<template>
    <div @click="clickShowModel" class="trendsingBox">
        <div class="user_info">
            <div class="user_header">
                <img class="user_profile" :src="user_profile"/>
                <span class="user_name">{{user_name}}</span>
            </div>
            <span class="submited_time">{{submited_time}}</span>
        </div>
        <div class="user_recommend">
            {{user_recommend}}
        </div>
        <div class="user_photos">
            <slot name="photos"></slot>
        </div>
    </div>

    <el-dialog class="trendsingModelBox"
        close-on-press-escape 
        v-model="showModel"
        :show-close="true"
        :modal="false"
        :fullscreen="true"
        :destroy-on-close="true"
        :append-to-body="true">
        <!-- 模态框内容 -->
        <div class="modelContent">
            <div class="left">
                <p><slot name="photos"></slot></p>
                <!-- <p class="author_recomment">{{item.works_describe}}</p>
                <p class="follow">
                    <img @click="changeLike" class="heart" :src="hadLike?'/src/assets/icons/fulledHeart.svg':'/src/assets/icons/followHeart.svg'"/>
                    <span class="appoint">喜欢{{likeCount}}</span>
                </p> -->
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRouter } from "vue-router";
    import { ElMessage } from "element-plus";
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';

    const props = defineProps({user_profile:String, submited_time:String, user_name:String, user_recommend:String});//从父组件传值到本组件
    const global = useGlobal();
    const tempStore = global.TempPinia;
    const store = global.Pinia;
    const { userinfo } = storeToRefs(tempStore);
    const { token } = storeToRefs(store);

    /**控制模态框显现与否**/
    const showModel = ref(false);
    function clickShowModel(){
        showModel.value = true;
    }
    
</script>

<style lang="scss" scoped>
    .trendsingBox{
        cursor: pointer;
        background-color: white;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 15px;
        margin-bottom: 10px;
        .user_info{
            display: flex;
            flex-basis: 60px;
            min-height: 60px;
            max-height: 60px;
            justify-content: space-between;
            align-items: center;
            .user_header{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                .user_profile{
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                }

                .user_name{
                    margin-left: 10px;
                    font-weight: bold;
                }
            }

            .submited_time{
                color: #878787;
                margin-right: 10px;
            }
        }

        .user_recommend{
            justify-content: flex-start;
            align-items: center;
            padding:15px 0px;
            font-size: 18px;
        }
        .user_photos{
            width: 100%;
            object-fit: cover;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
    .trendsingModelBox{
        .modelContent{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: 20px;
            .left{
                border-radius: 8px;
                max-width: 680px;
                min-width: 680px;
                box-sizing: border-box;
                background-color: white;
                margin-right: 20px;
                padding: 24px;
                .author_recomment{
                    margin: 10px 10px 0px;
                    font-size: 18px;
                    font-weight: bold;
                    color: black;
                    flex-grow: 1;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    white-space: nowrap; /* 段落中的文本不进行换行 */
                    overflow: hidden; /* 溢出部分隐藏 */
                }

                .follow{
                    margin: 10px 10px 0px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .heart{
                        width: 35px;
                        height: 35px;
                        cursor: pointer;
                    }

                    .appoint{
                        margin-left: 10px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #b8b8b8;
                    }
                }
            }

            .right{
                border-radius: 8px;
                padding: 19px;
                max-width: 300px;
                min-width: 300px;
                height: 220px;
                box-sizing: border-box;
                background-color: white;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                img{
                    min-width: 88px;
                    min-height: 88px;
                    max-width: 88px;
                    max-height: 88px;
                    border-radius: 50%;
                    overflow: hidden;
                }
                .author_name{
                    height: 38px;
                    width: 100%;
                    margin-top: 10px;
                    color: #1a1a1a;
                    font-size: 16px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 200px;
                    height: 38px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                .dm_Button{
                    padding: 0px;
                    width: 70px;
                    height: 38px;
                    box-sizing: border-box;
                    background-color: #00AEEC;
                    color: white;
                    margin-top: 20px;
                    outline: none;
                    border: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    svg{
                        width: 16px;
                        height: 16px;
                        margin-right: 3px;
                    }
                    &:hover{
                        background-color: #69bad8;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">//调节element-plus属性
    .trendsingModelBox{
        &.el-dialog{
            background-color: rgba($color: #ffffff, $alpha: 0.7);
            padding: 15px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .el-dialog__header{
                .el-icon{
                    font-size: 35px;
                }
            }

            .el-dialog__body{
                width: 100%;
                padding: 0px;
                display: flex;
            }
        }
    }
</style>