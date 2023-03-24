<template>
    <div class="require" v-if="showRequireBoxes.length>0">
        <requireBox
            v-for="(item, index) in showRequireBoxes"
            :title="item.title"
            :describe_require="item.describe_require"
            :describe_image="item.describe_image?global.ServerPath+item.describe_image:undefined"
            :money="item.money"
            :tag="item.tag"
            :calendar="item.calendar.substring(0, 10)"
            :profile="global.ServerPath+item.profile"
            :username="item.username"
            :search_id="item.search_id"
            :id="item.id">
        </requireBox>
    </div>
    <div class="mock" v-else v-if="showHadNotResult">
        <p><img src="/icons/hadNotResult.svg"></p>
        <p>未能找到结果</p>
    </div>

    <el-dialog class="uploadBox"
        style="width: 800px; padding: 30px 56px; border-radius: 10px; box-shadow: 5px 5px 30px 1px #00AEEC;"
        v-model="showUploadModel"
        :show-close="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                需求帖
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="content">
            <uploadRequireBox
                ref="upload"
                @submitImageSuccess="submitImageSuccess"
                :action="global.ServerPath+'/submitRequireBox'"
                :title="uploadTitle"
                :describe="uploadComment"
                :money="uploadPrice"
                :tag="uploadclassify"
                :calendar="uploadDeadline">
            </uploadRequireBox>
            <input v-model="uploadTitle" placeholder="写下你要定的标题"/>
            <input v-model="uploadPrice" placeholder="写下你要定的价格"/>
            <el-select
                style="width: 100%; border: 2px solid #00AEEC; border-radius: 8px; overflow: hidden; margin: 20px 0px 15px;"
                v-model="uploadclassify"
                placeholder="写下你的分类"
                size="large">
                <el-option
                    v-for="item in selectOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
            </el-select>
            <input v-model="uploadComment" placeholder="写下你的留言"/>
            <el-date-picker
                style="width: 100%; border: 2px solid #00AEEC; border-radius: 8px; overflow: hidden; margin-top: 20px;"
                size="large"
                v-model="uploadDeadline"
                type="datetime"
                :editable="false"
                placeholder="选择你的截止日期"
                format="YYYY/MM/DD"/>
            <button @click="clickUpload">提交</button>
        </div>
        
    </el-dialog>

</template>

<script setup>
    import axios from "axios";
    import useGlobal from "/src/global";
    import { useRoute } from 'vue-router';
    import { ElMessage } from "element-plus";
    import { onMounted, onUnmounted, ref, watch } from "vue";
    import requireBox from "/src/components/reservation/require/requireBox.vue"
    import uploadRequireBox from "/src/components/reservation/require/uploadRequireBox.vue"

    const global = useGlobal();//获取全局变量

    const showRequireBoxes = ref([]);//用于改变UI的变量
    async function sentRequire(){//请求橱窗盒子
        let resuit = await axios.get(global.ServerPath+'/getRequireBox');
        showRequireBoxes.value = resuit.data;
    }
    
    const selectOption=[//下拉选项
        {
            value: 'CG动画',
            label: 'CG动画',
        },
        {
            value: '原画',
            label: '原画',
        },
        {
            value: '插画',
            label: '插画',
        },
        {
            value: '厚涂',
            label: '厚涂',
        },
        {
            value: '半厚涂',
            label: '半厚涂',
        },
    ]

    const upload = ref();//获取upload节点
    const uploadTitle = ref("");//请求贴标题
    const uploadPrice = ref("");//能接受的价格
    const uploadclassify =ref("");//能接受的分类
    const uploadComment = ref("");//要提交的留言
    const uploadDeadline = ref(undefined);//等接受的截止日期
    async function clickUpload(){//提交推荐盒子
        if(uploadTitle.value==""){
            ElMessage.error("请输入请求贴标题");
        }
        else if(uploadPrice.value==""){
            ElMessage.error("请输入你要定的价格");
        }
        else if(uploadclassify.value==""){
            ElMessage.error("请输入你需求的类型");
        }
        else if(uploadComment.value==""){
            ElMessage.error("请输入要提交的留言");
        }
        else if(uploadDeadline.value==""){
            ElMessage.error("请输入你的截止日期");
        }
        else{
            upload.value.submitUpload();
        }
    }

    async function submitImageSuccess(){//提交图片成功触发事件
        showUploadModel.value=false;
        uploadTitle.value="";
        uploadPrice.value="";
        uploadclassify.value="";
        uploadComment.value="";
        uploadDeadline.value=undefined;
        sentRequire();
    }
    
    /****************************watch监听控制显示无结果提示****************************/
    const showHadNotResult = ref(false);//显示无结果提示
    watch(showRequireBoxes,()=>{showHadNotResult.value=!(showRequireBoxes.value.length>0)})

    /****************************Bus监听函数****************************/
    const Bus = global.Bus;//从全局属性里获取事件总线
    async function searchEvent(searchContent){
        let result = await axios.get(global.ServerPath+"/searchRequireBox",{params:{searchContent}});
        if(!result.data.error){showRequireBoxes.value=result.data;}
        else{ElMessage.error(result.data.error);}
    }
    
    /****************************路由传参****************************/
    const route = useRoute()
    const showUploadModel = ref(false);
    function uploadInformation(){
        if(route.query.showUploadIndex==3){//弹出上传页
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
    .require{
        padding: 20px 40px;
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
            input{
                margin-top: 20px;
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 2px solid #00AEEC;
                resize: none;
                outline: none;
                margin-bottom: 15px;
                box-sizing: border-box;
            }

            button{
                margin-top: 40px;
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