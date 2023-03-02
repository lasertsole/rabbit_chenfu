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
        :on-success="handleImageSuccess">
        <el-icon class="el-icon--upload"></el-icon>
        <div class="el-upload__text">
            拖拽图片到这，<em>也可以点击打开文件夹</em>
        </div>
    </el-upload>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'
    import { genFileId, ElMessage} from 'element-plus'
    import { ref, defineEmits,defineExpose } from 'vue'
    import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
    
    const props = defineProps({action:String});
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

    const submitUpload = () => {//提交方法
        upload.value!.submit();
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
        console.log(response);
        emits("submitImageSuccess", response);
    }

    defineExpose({//暴露子组件方法和属性给ref
        submitUpload,//暴露提交方法
        isHadFile//暴露判断是否有图片的变量
    })
</script>