<template>
    <div class="recomment">
        <Waterfall animationEffect="fadeInUp" backgroundColor="#00000000" :list="imgsArr">
            <template #item="{ item, url, index }">
                <newWorkBox
                    :item="item"
                    :url="url"
                    :index="index">
                </newWorkBox>
            </template>
        </Waterfall>
    </div>

    <el-dialog class="uploadBox" style="width: 600px; padding: 30px 56px; border-radius: 10px;  box-shadow: 5px 5px 30px 1px #00AEEC;" v-model="showUploadModel" :show-close="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                发表作品
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="content">
            <newWorkUpload @submitImageSuccess="submitImageSuccess" ref="upload" :action="global.ServerPath+'/submitnewWorkBoxImage'"></newWorkUpload>
            <input placeholder="发表你的留言" type="text" maxlength="20" v-model="uploadComment">
            <button @click="clickUpload">点击上传</button>
        </div>
    </el-dialog>
    
</template>

<script setup>
    import axios from "axios";
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRoute } from 'vue-router';
    import { ElMessage } from "element-plus";
    import 'vue-waterfall-plugin-next/style.css';
    import { onMounted, onUnmounted, ref } from "vue";
    import { Waterfall } from 'vue-waterfall-plugin-next';
    import newWorkBox from "/src/components/index/newWork/newWorkBox.vue"
    import newWorkUpload from '/src/components/index/newWork/newWorkUploadBox.vue';

    const global = useGlobal();
    const tempStore = global.TempPinia;
    const { userinfo } = storeToRefs(tempStore);
    const imgsArr = ref([]);
    

    async function sentRequire(){//请求推荐盒子
        imgsArr.value=[];
        let resuit = await axios.get(global.ServerPath+'/getnewWorkBox');
        let tempArr=[];
        resuit.data.forEach((item)=>{
            tempArr.push({src:global.ServerPath+item.works, works_describe:item.works_describe, author_profile:global.ServerPath+item.author_profile, author_name:item.author_name, appoint:item.appoint, author_id:item.author_id, work_id:item.work_id});
        });
        imgsArr.value=tempArr;
    }

    const upload = ref();//获取upload节点
    const uploadComment = ref("");//要提交的留言
    async function clickUpload(){//提交推荐盒子
        if(upload.value.isHadFile&&uploadComment.value!=""){
            upload.value.submitUpload();
        }
        else if(!upload.value.isHadFile){
            ElMessage.error("请先添加图片");
        }
        else{
            ElMessage.error("请输入你的留言");
        }
    }

    async function submitImageSuccess(imgPath){//提交图片成功触发事件
        if(imgPath.error){
            ElMessage.error("文件上传错误");
            return;
        }
        let result = await axios.post(global.ServerPath+'/submitnewWorkBox', { works:imgPath, works_describe:uploadComment.value, author_id:userinfo.value.id });
        if(result.data.error){
            ElMessage.error("提交失败,存在重复作品");
        }
        else{
            ElMessage.success("提交成功");
            showUploadModel.value=false;
            sentRequire();
        }
    }
    
    /****************************Bus监听函数****************************/
    const Bus = global.Bus;//从全局属性里获取事件总线
    async function searchEvent(searchContent){
        let result = await axios.get(global.ServerPath+"/searchNewWorkBox",{params:{searchContent}});
        if(!result.data.error){
            imgsArr.value=[];
            setTimeout(function(){//Waterfall小bug，需要延迟才能正常刷新
                imgsArr.value=result.data.map((item)=>{
                    return {src:global.ServerPath+item.works, works_describe:item.works_describe, author_profile:global.ServerPath+item.author_profile, author_name:item.author_name, appoint:item.appoint, author_id:item.author_id, work_id:item.work_id};
                });
            },5);
        }
        else{
            ElMessage.error(result.data.error);
        }
    }

    /****************************路由传参****************************/
    const route = useRoute()

    const showUploadModel = ref(false);
    function uploadInformation(){
        if(route.query.showUploadIndex==0){//弹出上传页
            showUploadModel.value=!showUploadModel.value;
        }
    }


    /****************************挂载触发****************************/
    onMounted(()=>{
        sentRequire();
        Bus.on("searchEvent", searchEvent);
        uploadInformation();
    });

    /****************************卸载解绑****************************/
    onUnmounted(()=>{
        Bus.off("searchEvent", searchEvent);
    })

</script>

<style lang="scss" scoped>
    .recomment{
        width: 100%;
        min-height: 100%;
        padding: 20px 40px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        box-sizing: border-box;
        max-width: 1280px;
        flex-basis: 1280px;
    }

    .uploadBox{
        .my-header{
            text-align: center;
            font-size: 25px;
            font-weight: bold;
            margin-left: 16px;
        }

        .content{
            display: flex;
            flex-direction: column;
            align-items: center;

            input{
                margin-top: 30px;
                outline: none;
                width: 100%;
                height: 50px;
                border: 2px solid #00AEEC;
                border-radius: 8px;
                padding: 5px;
                &::placeholder{
                    color: #00AEEC;
                }
            }

            button{
                margin-top: 30px;
                outline: none;
            }
        }
    }
</style>