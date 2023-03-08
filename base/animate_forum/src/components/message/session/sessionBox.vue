<template>
    
    <div :class="{sessionBox:true,reverse:isMe}">
        <div class="profile">
            <el-image class="lazyloading"
                :src="profile"
                :lazy="false"
                scroll-container=".page-content"
            />
        </div>
        <div class="content">{{content}}</div>
    </div>

</template>

<script setup>
    import { ref, defineProps, onMounted} from "vue";

    const props = defineProps({isMe:Boolean, content:String, profile:String});//从父组件传值到本组件

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**挂载触发**/
    onMounted(()=>{
        lazyLoad.value=true;//启动懒加载
    })
</script>

<style lang="scss" scoped>
    .sessionBox{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        .profile{
            position: relative;
            .lazyloading{
                position: relative;
                z-index: 1;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            &:after{
                z-index: 0;
                content: "";
                display: block;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 12px solid white;
                position: absolute;
                top: 16px;
                right: -16px;
            }
            &:before{
                z-index: 0;
                content: "";
                display: none;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 12px solid cyan;
                position: absolute;
                top: 16px;
                left: -16px;
            }
        }

        .content{
            margin-left: 16px;
            border-radius: 8px;
            background-color: white;
            padding: 10px;
            color: black;
            $max-width: 100%;
            max-width: calc(100% - 133px);
            white-space: normal;
            word-break: break-all;
        }
    }
    .reverse{
        direction:rtl;
        .profile{
            &:after{
                display: none;
            }
            &:before{
                display: block;
            }
        }

        .content{
            margin-left: 0px;
            margin-right: 16px;
            background-color:cyan;
            direction:ltr;
        }
    }
</style>