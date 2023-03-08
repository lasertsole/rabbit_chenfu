<template>
    <div @click="clickShowModel" class="trendsingBox">
        <div class="user_info">
            <div class="user_header">
                <el-image class="user_profile"
                    :src="author_id==userinfo?.id?global.ServerPath+userinfo.profile:user_profile"
                    :lazy="lazyLoad"
                    scroll-container=".page-content"/>
                <span class="user_name">{{author_id==userinfo?.id?userinfo.username:user_name}}</span>
            </div>
            <span class="submited_time">{{submited_time}}</span>
        </div>
        <div class="user_recommend">
            {{user_recommend}}
        </div>
        <div class="user_photos">
            <el-image class="LazyloadImg"
                scroll-container=".page-content"
                :lazy="lazyLoad"
                v-if="imageArr!=null"
                v-for="(subItem,subIndex) in imageArr.split(';')"
                :key="subIndex"
                :src="global.ServerPath+subItem"
            />
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
                <p class="author_recomment">{{user_recommend}}</p>
                <p>
                    <el-image class="LazyloadImg"
                        :preview-src-list="[...imageArr.split(';').map((item)=>{return global.ServerPath+item})]"
                        v-if="imageArr!=null"
                        v-for="(subItem,subIndex) in imageArr.split(';')"
                        :key="subIndex"
                        :src="global.ServerPath+subItem"
                    />
                </p>
            </div>
            <div class="right">
                <img :src="author_id==userinfo?.id?global.ServerPath+userinfo.profile:user_profile"/>
                <p class="author_name">{{author_id==userinfo?.id?userinfo.username:user_name}}</p>
                <button @click="clickDm_Button" class="dm_Button">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"></path><path fill="currentColor" d="M352 576h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm32-192h256q32 0 32 32t-32 32H384q-32 0-32-32t32-32z"></path></svg>
                    私信
                </button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRouter } from "vue-router";
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';

    const props = defineProps({user_profile:String, submited_time:String, user_name:String, user_recommend:String, author_id:String, imageArr:String});//从父组件传值到本组件
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

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**私聊功能**/
    const router = useRouter();
    function clickDm_Button(){
        router.replace({ name: "session", query: {target_id:props.author_id}});
    }

    /**挂载触发**/
    onMounted(()=>{
        lazyLoad.value=true;//启动懒加载
    })
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
                    margin: 10px 10px 10px;
                    font-size: 18px;
                    color: black;
                    flex-grow: 1;
                    text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                    white-space: nowrap; /* 段落中的文本不进行换行 */
                    overflow: hidden; /* 溢出部分隐藏 */
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

            @media screen and (max-width: 1100px) {
                flex-direction: column-reverse;
                align-items: center;
                .left{
                    margin-top: 20px;
                    margin-right: 0px;
                }
                .right{
                    max-width: 680px;
                    min-width: 680px;
                    max-height: 150px;
                    min-height: 150px;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                    position: relative;
                    .author_name{
                        flex-grow: 1;
                        margin: 10px  20px;
                        justify-content: flex-start;
                    }

                    .dm_Button{
                        float: right;
                        margin-top: 0px;
                        align-self: center;
                    }
                }
            }

            @media screen and (max-width: 700px) {
                
                .left{
                    margin-top: 20px;
                    margin-right: 0px;
                    max-width: 460px;
                    min-width: 460px;
                }
                .right{
                    max-width: 460px;
                    min-width: 460px;
                    max-height: 150px;
                    min-height: 150px;
                    flex-direction: row;
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