<template>
    <div class="announcement" v-if="announcemnentArr.length>0">
        <announcementBox
            v-for="(item, index) in announcemnentArr"
            :title="item.title"
            :publisher_time="item.publisher_time"
            :content="item.content"
        ></announcementBox>
    </div>
    <div class="mock" v-else v-if="showHadNotResult">
        <p>无公告信息</p>
    </div>
</template>

<script setup>
    import axios from "axios";
    import useGlobal from "/src/global";
    import { storeToRefs } from "pinia";
    import { ElMessage } from "element-plus"
    import { useRoute, useRouter } from "vue-router";
    import { onMounted, onUnmounted, ref, watch } from "vue";
    import announcementBox from "/src/components/message/announcement/announcementBox.vue"

    const global = useGlobal();//引入全局变量
    const store = global.Pinia;//引入持久性存储
    const bus = global.Bus;//引入事假总线
    const { token } = storeToRefs(store);//引入token

    const announcemnentArr = ref([]);

    async function sentRequire(){

        let result = await axios.get(global.ServerPath+'/getAnnouncementBox');
        if(result.data.error){
            ElMessage.error("获取公告盒子失败");
        }
        else{
            announcemnentArr.value = result.data;
        }
    }
    /****************************watch监听控制显示无结果提示****************************/
    const showHadNotResult = ref(false);//显示无结果提示
    watch(announcemnentArr,()=>{showHadNotResult.value=!(announcemnentArr.value.length>0)})
    
    /****************************Bus监听函数****************************/
    //用户下线
    const router = useRouter();
    function announcementLogout(data){
        router.replace({ name: 'index'});//强制跳转到其他页面
    }
    
    /****************************挂载触发****************************/
    onMounted(()=>{
        sentRequire();
        global.Bus.on("logout",announcementLogout);//用户下线触发
    });

    /****************************卸载解绑****************************/
    onUnmounted(()=>{
        global.Bus.off("logout",announcementLogout);
    })
</script>

<style lang="scss" scoped>
    .announcement{
        display: flex;
        flex-direction: column;
        padding: 20px 40px;
        width: 100%;
        max-width: 100%;
        height: 100%;
        box-sizing: border-box;
        max-width: 1280px;
        flex-basis: 1280px;
    }
    .mock{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 30px;
    }

    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #716ff3 0%,rgb(240, 210, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #6f6df1 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>