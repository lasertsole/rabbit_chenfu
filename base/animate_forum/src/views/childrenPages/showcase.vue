<template>
    
    <div class="showcase">
        <showCaseBox v-for="(item,index) in showCaseBoxes"
            :works="global.ServerPath+item.works"
            :author_profile="global.ServerPath+item.author_profile"
            :author_name="item.author_name"
            :author_comment="item.author_comment"
            :price="item.price"
            :sold_num="item.sold_num"
            :id="item.id">
        </showCaseBox>
    </div>

    <el-dialog class="uploadBox" style="width: 800px; padding: 30px 56px; border-radius: 10px;" v-model="showUploadModel" :show-close="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                橱窗
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="content">
            <showcaseUploadBox @submitImageSuccess="submitImageSuccess" ref="upload" :action="global.ServerPath+'/submitShowCaseBoxImage'"></showcaseUploadBox>
            <input v-model="uploadPrice" placeholder="写下你要定的价格"/>
            <input v-model="uploadComment" placeholder="写下你的介绍吧"/>
            <button @click="clickUpload">提交</button>
        </div>
        
    </el-dialog>
    
</template>

<script setup>
    import axios from "axios";
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global"
    import { useRoute } from 'vue-router'
    import { ElMessage } from "element-plus";
    import { onMounted, onUnmounted, ref } from "vue";
    import showCaseBox from "/src/components/reservation/showcase/showCaseBox.vue"
    import showcaseUploadBox from "/src/components/reservation/showcase/showcaseUploadBox.vue"

    const global = useGlobal();
    const tempStore = global.TempPinia;
    const { userinfo } = storeToRefs(tempStore);

    const showCaseBoxes = ref();
    async function sentRequire(){//请求橱窗盒子
        let resuit = await axios.get(global.ServerPath+'/getShowCaseBox');
        showCaseBoxes.value = resuit.data;
    }

    const upload = ref();//获取upload节点
    const uploadPrice = ref("");//要提交的价格
    const uploadComment = ref("");//要提交的留言
    async function clickUpload(){//提交推荐盒子
        if(!upload.value.isHadFile){
            ElMessage.error("请添加你的图片");
        }
        else if(uploadPrice.value==""){
            ElMessage.error("请先添加价格");
        }
        else if(uploadComment.value==""){
            ElMessage.error("请先添加介绍");
        }
        else{
            upload.value.submitUpload();
        }
    }

    async function submitImageSuccess(imgPath){//提交图片成功触发事件
        let obj = { works:imgPath, author_comment:uploadComment.value, price:uploadPrice.value, id:userinfo.value.id}
        let result = await axios.post(global.ServerPath+'/submitShowCaseBox', obj);
        if(result.data.error){
            ElMessage.error("提交失败,存在重复展示作品");
        }
        else{
            ElMessage.success("提交成功");
            showUploadModel.value=false;
            uploadPrice.value="";
            uploadComment.value="";
            sentRequire();
        }
    }

    /****************************Bus监听函数****************************/
    const Bus = global.Bus;//从全局属性里获取事件总线
    async function searchEvent(searchContent){
        let result = await axios.get(global.ServerPath+"/searchShowCaseBox",{params:{searchContent}});
        if(!result.data.error){
            showCaseBoxes.value=result.data;
        }
        else{
            ElMessage.error(result.data.error);
        }
    }

    /****************************路由传参****************************/
    const route = useRoute()

    const showUploadModel = ref(false);
    function uploadInformation(){
        if(route.query.showUploadIndex==2){//弹出上传页
            showUploadModel.value=!showUploadModel.value;
        }
    }

    /****************************挂载触发****************************/
    onMounted(()=>{
        sentRequire();
        uploadInformation();
        Bus.on("searchEvent", searchEvent);
    });

    /****************************卸载解绑****************************/
    onUnmounted(()=>{
        Bus.off("searchEvent", searchEvent);
    })
    
</script>

<style lang="scss" scoped>
    .showcase{
        min-height: 100%;
        padding: 20px 40px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
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
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 2px solid #00AEEC;
                resize: none;
                outline: none;
                margin-bottom: 15px;
            }

            button{
                margin-top: 50px;
                width: 100%;
                background-color: #00AEEC;
                color: white;
                outline: none;
                border-radius: 8px;
                border: none;
                transition: 0.3s linear;
                &:hover{
                    background-color: #78dbff;
                }
            }
        }
    }
</style>