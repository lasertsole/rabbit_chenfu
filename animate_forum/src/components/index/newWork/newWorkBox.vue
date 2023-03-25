<template>
    <div class="newWorkBox"
        @click="clickShowModel">
        <LazyImg :url="url"/>
        <p class="works_describe">{{item.works_describe}}</p>
        <p class="anthor_info">
            <span class="left">
                <el-image :src="item.author_id==userinfo?.id?global.ServerPath+userinfo.profile:item.author_profile" 
                    scroll-container=".page-content"
                    class="author_profile"
                    :lazy="lazyLoad"
                    :key="index"/>
                <span class="author_name">{{item.author_id==userinfo?.id?userinfo.username:item.author_name}}</span>
            </span>
            <span class="right">
                <el-image class="heart"
                    scroll-container=".page-content"
                    :src="userinfo&&likeStatusArr&&likeStatusArr.indexOf(props.item.work_id)>=0?'/icons/fulledHeart.svg':'/icons/followHeart.svg'"
                    :key="index"/>
                <span class="appoint">{{newWorkBoxPointer==index?appoint=appointNum:appoint}}</span>
            </span>
        </p>
    </div>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { LazyImg } from 'vue-waterfall-plugin-next';
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';
    
    const props = defineProps({item:Object, url:String, index:Number});
    const global = useGlobal();
    const store = global.Pinia;
    const { userinfo } = storeToRefs(store);
    const detailPage = global.detailPage;//获得模态框页面对象
    const { newWorkBoxPointer, appointNum, likeStatusArr } = storeToRefs(detailPage);

    const appoint = ref(props.item.appoint);

    /**控制模态框显现与否**/
    function clickShowModel(){
        detailPage.openModel("local","newWork",{ newWorkBoxPointer:props.index, author_id:props.item.author_id, user_profile:props.item.author_profile, user_name:props.item.author_name, 
            works_describe:props.item.works_describe, url:props.url, work_id:props.item.work_id, 
            appointNum:appoint.value });
    }

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**挂载触发**/
    onMounted(()=>{
        lazyLoad.value=true;//启动懒加载
    })
    /**卸载触发**/
    onUnmounted(()=>{
        lazyLoad.value=false;//重置懒加载
    })
</script>

<style lang="scss" scoped>
    .newWorkBox{
        background-color: white;
        border-radius: 10px;
        padding: 0;
        overflow: hidden;
        cursor: pointer;
        .works_describe{
            margin: 7px 7px;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            white-space: nowrap; /* 段落中的文本不进行换行 */
            overflow: hidden; /* 溢出部分隐藏 */
        }

        .anthor_info{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .left{
                display: flex;
                flex-direction: row;
                align-items: center;
                .author_profile{
                    $profileEdge: 33px;
                    margin: 7px 7px;
                    width: $profileEdge;
                    height: $profileEdge;
                    border-radius: 50%;
                }

                .author_name{
                    margin-left: 3px;
                }
            }

            .right{
                display: flex;
                flex-direction: row;
                align-items: center;
                .heart{
                    $heartEdge: 20px;
                    width: $heartEdge;
                    height: $heartEdge;
                    margin-right: 5px;
                }
                .appoint{
                    margin-right: 14px;
                    color: #b8b8b8;
                }
            }
        }
    }
</style>