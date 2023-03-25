<template>
    <div class="announcementBox"
        style="cursor:pointer"
        @click="clickShowModel">
        <div class="title ellipsis">{{title}}</div>
        <div class="publisher_time">{{publisher_time.substring(0,10)+" "+publisher_time.substring(11,19)}}</div>
        <div class="content ellipsis">{{content}}</div>
    </div>

    <el-dialog
        class="announcementModelBox"
        close-on-press-escape 
        v-model="showModel"
        :show-close="false"
        :append-to-body="true"
        width="80%"
        top="58px">
        <!-- 模态框内容 -->
        <div class="announcementBox">
            <div class="title">
                <span>{{title}}</span>
                <img @click="clickHideModel" class="close" src="/icons/close.svg">
            </div>
            <div class="publisher_time">{{publisher_time.substring(0,10)+" "+publisher_time.substring(11,19)}}</div>
            <div class="content">{{content}}</div>
        </div>
    </el-dialog>
</template>

<script setup>
    import { ref, defineProps } from "vue"
    const props = defineProps({title:String, publisher_time:String,content:String});

    const showModel = ref(false);
    function clickShowModel(){
        showModel.value = true;
    }
    function clickHideModel(){
        showModel.value = false;
    }
</script>

<style lang="scss" scoped>
    .announcementBox{
        background-color: white;
        width: 100%;
        border-radius: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        padding: 15px;
        margin-bottom: 10px;
        .title{
            min-height: 33px;
            text-align: center;
            font-weight: bold;
            font-size: 22px;
            display: block;
            color: black;
            margin-bottom: 10px;
            &.ellipsis{
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
        .publisher_time{
            text-align: center;
            margin-bottom: 10px;
            color:gray
        }
        .content{
            text-indent: 2em;
            display: -webkit-box;
            height: 100%;
            &.ellipsis{
                overflow: hidden;
                -webkit-box-orient: vertical;
                line-clamp: 5;
                -webkit-line-clamp: 5;
            }
        }
    }

    .announcementModelBox{
        display: flex;
        flex-direction: column;
        .announcementBox{
            padding: 0px;
            margin: 0px;
            display: flex;
            flex-direction: column;
            width: 100%;
            flex-grow: 1;
            .title{
                .close{
                    width: 20px;
                    height: 20px;
                    float: right;
                    cursor: pointer;
                }
            }
            .content{
                // flex-grow: 1;
                height: 100%;
                overflow-y: scroll;
                &::-webkit-scrollbar {
                    width: 4px;
                    border-radius: 10px;
                    background: -webkit-linear-gradient(top,  #716ff3 0%,rgb(240, 210, 103) 100%);
                }

                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background: -webkit-linear-gradient(top,  #6f6df1 0%,rgba(83, 237, 142, 0) 100%);
                }
            }
        }
    }
</style>
<style lang="scss">//调节element-plus属性
    .announcementModelBox{
        &.el-dialog{
            height: 90vh;
            padding: 15px;
            box-sizing: border-box;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            .el-dialog__header{
                display: none;
            }
            .el-dialog__body{
                width: 100%;
                height: 100%;
                padding: 0px;
                display: flex;
            }
        }
    }
</style>