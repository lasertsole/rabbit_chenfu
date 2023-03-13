<template>
    <el-upload
      class="avatar-uploader"
      :action="action"
      :show-file-list="false"
      :before-upload="beforeImageUpload"
      :on-success="handleAvatarSuccess"
    >
      <img v-if="userinfo" :src="global.ServerPath+userinfo.profile" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import useGlobal from "/src/global/index.js"
  import { ElMessage } from 'element-plus'
  import { defineProps, defineEmits } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps } from 'element-plus'
  import { storeToRefs } from 'pinia'
  
  const global = useGlobal();
  const store=global.Pinia;//引入持久化存储
  const { userinfo } = storeToRefs(store);
  
  const props = defineProps({profile:String, action:String});
  const emits = defineEmits(["changeProfile"]);
  const imageUrl = ref(props.profile);
  
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
  ) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!);
    emits("changeProfile", response);
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
  </script>
  
  <style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
  
  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 50%;
    background-color: gray;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
  </style>