<template>
    <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :action="action"
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :on-change="hadFile"
        :before-upload="beforeImageUpload"
        :http-request="request">
        <el-icon class="el-icon--upload"></el-icon>
        <div class="el-upload__text">
            拖拽图片到这，<em>也可以点击打开文件夹</em>
        </div>
    </el-upload>
</template>

<script setup lang="ts">
    import axios from 'axios'
    import { storeToRefs } from "pinia";
    import useGlobal from '/src/global';
    import { ElMessage, genFileId} from 'element-plus'
    import { ref, defineProps, defineEmits, defineExpose } from 'vue'
    import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

    const global = useGlobal();//获取全局变量
    const tempStore = global.TempPinia;
    const { userinfo } = storeToRefs(tempStore);

    const props = defineProps({action:String, title:String, describe:String, money:String, tag:String, calendar:Date});
    const emits = defineEmits(["submitImageSuccess"]);

    const upload = ref<UploadInstance>()

    const handleExceed: UploadProps['onExceed'] = (files) => {
        upload.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        upload.value!.handleStart(file)
    }

    const isHadFile = ref(false);//判断是否有图片的变量
    const hadFile = () =>{
        isHadFile.value=true;
    }

    const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {//检查上传的文件是否为图片
        let typeArr=['image/jpeg', 'image/webp', 'image/png', 'svg+xml'];//能接收的图片文件类型
        if (typeArr.indexOf(rawFile.type)<0) {
        ElMessage.error('请输入图片类型文件')
        return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB')
        return false
        }
        return true
    }

    async function submitUpload(){//提交方法
        if(isHadFile.value){
            upload.value!.submit();
        }
        else{
            let obj = {title:props.title, describe:props.describe, describe_image:undefined, money:props.money, tag:props.tag, calendar:props.calendar, id:userinfo.value.id, username:userinfo.value.username};
            let result = await axios.post(global.ServerPath+"/submitRequireBox", obj);//第二次请求
            if(!result.data.error){
                emits("submitImageSuccess");
                ElMessage.success("上传成功");
            }
            else{
                ElMessage.error("上传失败");
            }
        }
    }

    async function request(params){//替换掉原本的xhr请求
        const formData = new FormData();//第一次请求
        formData.append("file", params.file);
        let result = await axios({
            method: 'post',
            url: params.action,
            headers: {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryVCFSAonTuDbVCoAN",
            },
            data: formData,
        });
        let imgPath = result.data;
        
        let nowDate=props.calendar?.toLocaleString('zh', { hour12: false }).split('/').join("-");//将时间格式化(?有可能为underfine)        
        let obj = {title:props.title, describe:props.describe, describe_image:imgPath, money:props.money, tag:props.tag, calendar:nowDate, id:userinfo.value.id, username:userinfo.value.username};
        result = await axios.post(global.ServerPath+"/submitRequireBox", obj);//第二次请求
        if(!result.data.error){
            emits("submitImageSuccess");
            ElMessage.success("上传成功");
        }
        else{
            ElMessage.error("上传失败");
        }
    }

    defineExpose({//暴露子组件方法和属性给ref
        submitUpload,//暴露提交方法
        isHadFile//暴露判断是否有图片的变量
    })
</script>