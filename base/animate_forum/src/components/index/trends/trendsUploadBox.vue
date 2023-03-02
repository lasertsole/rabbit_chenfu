<template>
  <el-upload
    ref="upload"
    v-model:file-list="fileList"
    :action="action"
    list-type="picture-card"
    :limit="3"
    :auto-upload="false"
    :on-exceed="handleExceed"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :before-upload="beforeImageUpload"
    :on-success="handleImageSuccess">
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
  
<script lang="ts" setup>
  import { ref, defineExpose, defineProps, defineEmits } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadInstance, UploadProps, UploadUserFile} from 'element-plus'

  const props = defineProps({action:String});
  const emits = defineEmits(["submitImageSuccess"]);
  
  const fileList = ref<UploadUserFile[]>([])//上传图片列表
  
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  
  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
  }

  function handleExceed(){
    ElMessage.error("上传图片总数不能超过3个");
  }
  
  const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }

  const upload = ref<UploadInstance>()//定义提交控制
  const submitUpload = () => {//提交方法
    if(fileList.value.length!=0){
      upload.value!.submit();
    }
    else{
      emits("submitImageSuccess", undefined, 0);
    }
  }

  const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {//检查提交的文件是否为图片
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

  const handleImageSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
      emits("submitImageSuccess", response, fileList.value.length);
  }

  defineExpose({//暴露方法或变量
      submitUpload
  })
</script>