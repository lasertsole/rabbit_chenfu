<template>
    <el-dialog class="newWorkModelBox"
        close-on-press-escape 
        v-model="showModel"
        :show-close="false"
        :modal="false"
        :fullscreen="true"
        :destroy-on-close="true"
        :append-to-body="true">
        <!-- 模态框内容 -->
        <div class="modelContent">
            <img class="close" src="icons/pureClose.svg"  @click="hideModel">

            <leftBox/>

            <rightBox/>
        </div>
    </el-dialog>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import leftBox from "/src/components/detaillPageComponents/leftBox.vue"
    import rightBox from "/src/components/detaillPageComponents/rightBox.vue"

    const global = useGlobal();
    const detailPage = global.detailPage;
    const { showModel} = storeToRefs(detailPage);


    function hideModel(){//关闭模态框
        showModel.value=false;
    }

</script>

<style lang="scss" scoped>
    .newWorkModelBox{
        display: flex;
        flex-direction: row;
        justify-content: center;
        overflow-y: scroll;
        box-sizing: border-box;
        .modelContent{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: 54px;
            .close{
                $closeEdge:25px;
                width: $closeEdge;
                height: $closeEdge;
                position: fixed;
                top: 16px;
                right: 37px;
                cursor: pointer;
            }
            
            @media screen and (max-width: 1100px){
                padding: 19px;
                flex-direction: column-reverse;
                align-items: center;
            }
        }
    }
</style>
<style lang="scss">
    .newWorkModelBox{
        &.el-dialog{
            background-color: rgba($color: #ffffff, $alpha: 0.7);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .el-dialog__header{
                display: none;
            }

            .el-dialog__body{
                width: 100%;
                padding: 0px;
                display: flex;
                position: relative;
            }
        }
    }
</style>