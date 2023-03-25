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
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';

    const props = defineProps({user_profile:String, submited_time:String, user_name:String, user_recommend:String, author_id:String, imageArr:String});//从父组件传值到本组件
    const global = useGlobal();
    const store = global.Pinia;
    const { userinfo } = storeToRefs(store);
    const detailPage = global.detailPage;//获得模态框页面对象

    /**控制模态框显现与否**/
    function clickShowModel(){
        detailPage.openModel("local","trends",{user_profile:props.user_profile, user_name:props.user_name, submited_time:props.submited_time, user_recommend:props.user_recommend, author_id:props.author_id, imageArr:props.imageArr});
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
            $userInfoEdge: 60px;
            flex-basis: $userInfoEdge;
            min-height: $userInfoEdge;
            max-height: $userInfoEdge;
            justify-content: space-between;
            align-items: center;
            .user_header{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                .user_profile{
                    $profileEdge: 50px;
                    border-radius: 50%;
                    width: $profileEdge;
                    height: $profileEdge;
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
</style>