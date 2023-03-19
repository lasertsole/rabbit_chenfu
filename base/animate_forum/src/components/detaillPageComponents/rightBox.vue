<template>
    <el-affix ref="affix" class="right bigWindow" target=".modelContent" :offset="54" style="min-height: 220px;">
        <rightContentBox></rightContentBox>
    </el-affix>

    <div class="right smallWindow">
        <rightContentBox></rightContentBox>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import rightContentBox from "./rightContentBox.vue";
    const affix = ref();
</script>

<style lang="scss" scoped>
    .right{
        border-radius: 8px;
        box-sizing: border-box;
        background-color: white;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    @media screen and (min-width: 1100px) {
        .right{
            $rightWidth:300px;
            max-width: $rightWidth;
            min-width: $rightWidth;
            height: 220px;
            background-color: transparent;
            img{margin-top: 16px;}
            &.bigWindow{
                display: flex;
            }
            &.smallWindow{
                display: none;
            }
        }
    }

    @media screen and (max-width: 1100px) {
        .right{
            &.bigWindow{
                display: none;
            }
            &.smallWindow{
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 16px;
            }
        }
    }

    @media screen and (max-width: 1100px) and (min-width: 700px){
        .right{
            max-width: 680px;
            min-width: 680px;
            max-height: 150px;
            min-height: 150px;
        }
    }

    @media screen and (max-width: 700px) {
        .right{
            width: 100%;
            max-height: 150px;
            min-height: 150px;
            flex-direction: row;
        }
    }
</style>
<style lang="scss">
    .newWorkModelBox{
        &.el-dialog{
            .el-dialog__body{
                @media screen and (min-width: 1100px) {
                    .right{
                        >div{
                            border-radius: 8px;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            background-color: white;
                        }
                    }
                }
            }
        }
    }
</style>