<template>
    <div class="announcement">
        <announcementBox
            v-for="(item, index) in announcemnentArr"
            :title="item.title"
            :publisher_time="item.publisher_time"
            :content="item.content"
        ></announcementBox>
    </div>
</template>

<script setup>
    import { onMounted,ref } from "vue";
    import axios from "axios";
    import {ElMessage} from "element-plus"
    import announcementBox from "/src/components/message/announcement/announcementBox.vue"
    import useGlobal from "/src/global";
    import {storeToRefs} from "pinia"

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
    
    /****************************挂载触发****************************/
    onMounted(()=>{
        sentRequire();
    });
</script>

<style lang="scss" scoped>
    .announcement{
        display: flex;
        flex-direction: column;
        padding: 20px 20px;
        width: 100%;
        max-width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow-y: scroll;
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