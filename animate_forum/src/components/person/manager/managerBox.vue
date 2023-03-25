<template>
    <div @click="exeReCall" class="classify_box">
        <img :src="icon">
        <span>{{title}}</span>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';
    import useGlobal from "/src/global";
    import { storeToRefs } from 'pinia'
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router'

    
    const props = defineProps({icon:String, title:String, link:String, modelIndex:Number});//从父组件传值到本组件
    const global = useGlobal();//引入全局变量
    const store = global.Pinia;//引入持久性存储
    const { token } = storeToRefs(store);//引入token
    const router = useRouter()//引入路由对象

    function exeReCall(){//点击事件
        if(!token.value){
            ElMessage("登录后才能使用该功能");
        }
        else{
            router.replace({ path: props.link, query: {showUploadIndex:props.modelIndex}});
        }
    }
</script>

<style lang="scss" scoped>
    .classify_box{
        cursor: pointer;
        max-width: 200px;
        min-width: 200px;
        max-height: 200px;
        min-height: 200px;
        color: #716ff3;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        border: 2px solid #716ff3;
        flex-direction: column;
        transition: all 0.3s linear;
        margin-bottom: 10px;
        img{
            width: 60px;
            height: 60px;
        }
        
        span{
            margin-top: 10px;
        }

        &:hover{
            background-color: rgb(255, 255, 255);
        }
    }
</style>