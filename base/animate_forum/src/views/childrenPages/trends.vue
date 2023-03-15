<template>
    <div class="following" v-if="showFollowingBoxes.length>0">
        <trendsBox
            v-for="(item, index) in showFollowingBoxes"
            :user_profile="global.ServerPath+item.user_profile"
            :user_name="item.username"
            :submited_time="item.submited_time.substring(0,10)+' '+item.submited_time.substring(11,16)"
            :user_recommend="item.user_recommend"
            :author_id="item.id"
            :imageArr="item.user_photos">
        </trendsBox>
    </div>
    <div class="mock" v-else v-if="showHadNotResult">
        <p><img src="/icons/hadNotResult.svg"></p>
        <p>未能找到结果</p>
    </div>

    <el-dialog class="uploadBox" style="width: 800px; padding: 30px 56px; border-radius: 10px; box-shadow: 5px 5px 30px 1px #00AEEC;" v-model="showUploadModel" :show-close="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                发表动态
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="content">
            <textarea v-model="uploadComment" placeholder="写下你的留言吧" rows="10"></textarea>
            <trendsUploadBox @submitImageSuccess="submitImageSuccess" :action="global.ServerPath+'/submitTrendsBoxImage'" ref="upload"></trendsUploadBox>
            <button @click="clickUpload">提交</button>
        </div>
        
    </el-dialog>
    
</template>

<script setup>
    import axios from 'axios'
    import { storeToRefs } from "pinia"
    import useGlobal from "/src/global"
    import { useRoute } from 'vue-router'
    import { ElMessage } from "element-plus";
    import {ref, onMounted, onUnmounted, watch} from 'vue'
    import trendsBox from "/src/components/index/trends/trendsBox.vue"
    import trendsUploadBox from "/src/components/index/trends/trendsUploadBox.vue"

    const global = useGlobal()
    const tempStore = global.TempPinia;
    const { userinfo } = storeToRefs(tempStore);

    /****************************更改关注盒子状态****************************/
    const showFollowingBoxes = ref([]);
    async function sentRequire(){//请求关注盒子
        let result = await axios.get(global.ServerPath+'/getTrendsBox');
        showFollowingBoxes.value=result.data;
    }

    async function clickUpload(){//提交推荐盒子
        if(uploadComment.value!=""){
            upload.value.submitUpload();
        }
        else{
            ElMessage.error("请输入你的留言");
        }
    }
    
    const upload = ref();//获取upload节点
    const uploadComment = ref("");//要提交的留言
    const tempimgArr = ref([]);//临时数组
    async function submitImageSuccess(imgPath, length){//发布动态盒子
        tempimgArr.value.push(imgPath);
        if(tempimgArr.value.length>=length){
            let result = await axios.post(global.ServerPath+'/submitTrendsBox', { id:userinfo.value.id, user_recommend:uploadComment.value, user_photos:tempimgArr.value.join(";")});
            if(result.data.error){
                ElMessage.error("提交失败");
            }
            else{
                showUploadModel.value=false;
                tempimgArr.value.length=0;//清空临时数组
                uploadComment.value="";
                ElMessage.success("上传成功");
                sentRequire();
            }
        }
    }

    /****************************watch监听控制显示无结果提示****************************/
    const showHadNotResult = ref(false);//显示无结果提示
    watch(showFollowingBoxes,()=>{showHadNotResult.value=!(showFollowingBoxes.value.length>0)})
    
    /****************************Bus监听函数****************************/
    const Bus = global.Bus;//从全局属性里获取事件总线
    async function searchEvent(searchContent){
        let result = await axios.get(global.ServerPath+"/searchTrendsBox",{params:{searchContent}});
        if(!result.data.error){showFollowingBoxes.value=result.data;}
        else{ElMessage.error(result.data.error);}
    }

    /****************************路由传参****************************/
    const route = useRoute()

    const showUploadModel = ref(false);
    function uploadInformation(){
        if(route.query.showUploadIndex==1){//弹出上传页
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
    .following{
        padding: 20px 40px;
        box-sizing: border-box;
        max-width: 1280px;
        flex-basis: 1280px;

        img{
            display: none;
            width: 100%;
            margin-bottom: 10px;
            object-fit: cover;
        }
    }
    .mock{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 20px;
        img{
            $imgEdge:150px;
            width: $imgEdge;
            height: $imgEdge;
        }
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
            textarea{
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 2px solid #00AEEC;
                resize: none;
                outline: none;
                margin-bottom: 15px;
            }

            button{
                margin-top: 30px;
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
<style lang="scss">
    .following{
        .trendsingBox{
            .user_photos{
                .LazyloadImg{
                    pointer-events:none;//trendsingBox内的图片设置不可点击
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>