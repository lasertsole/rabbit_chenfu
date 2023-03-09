<template>
    <!-- 头像 -->
    <div class="header-profile">
        <el-popover :visible="visible" placement="bottom" :width="160">
            <ul v-if="userinfo!=undefined" style="text-align: center; margin: 0">
                <li style="text-align: right;">
                    <img @click="visible = false" style="width:17px; height:17px; cursor: pointer;" src="/src/assets/icons/close.svg">
                </li>
                <li style="padding: 5px; color: gray; cursor: pointer;" @click="reset">个人设置</li>
                <li style="padding: 5px; color: gray; cursor: pointer;" @click="logout">退出登录</li>
            </ul>
            <ul v-else  style="text-align: center; margin: 0">
                <li style="padding: 5px; color: gray; cursor: pointer;" @click="modelShow=true;visible = false">登录</li>
            </ul>
            <template #reference>
                <img class="profile-img" @click="visible=true" :src="userinfo?global.ServerPath+userinfo.profile:'/src/assets/icons/anonymous.svg'"/>
            </template>
        </el-popover>
    </div>

    <!-- 登录模态框 -->
    <el-dialog
        style="width: 400px;padding: 30px 56px" v-model="modelShow"
        :show-close="true"
        :append-to-body="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h4 :id="titleId" :class="titleClass">
                    <h1 style="">沉浮兔</h1>
                </h4>
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="login" v-show="modernChange">
            <el-input style="margin-top: 20px;" v-model="inputPhone" placeholder="请输入11位手机号" clearable />
            <el-input style="margin-top: 20px;" type="password" v-model="inputPassword" placeholder="请输入大于6位小于等于15位密码" clearable />
            <el-button style="margin-top: 40px;margin-bottom: 10px; width: 100%;" type="primary" @click="Submit('login')">登录</el-button>
            <a @click.prevent="modernChangeHanppen" href="#">没有账号？注册一个！</a>
        </div>
        <div class="register" v-show="!modernChange">
            <el-input style="margin-top: 20px;" v-model="inputPhone" placeholder="请输入11位手机号" clearable />
            <el-input style="margin-top: 20px;" type="password" v-model="inputPassword" placeholder="请输入大于6位小于等于15位密码" clearable />
            <el-button style="margin-top: 40px;margin-bottom: 10px; width: 100%;" type="primary" @click="Submit('register')">注册</el-button>
            <a @click.prevent="modernChangeHanppen" href="#">已有账号？马上登录！</a>
        </div>
    </el-dialog>

    <!-- 设置模态框 -->
    <el-dialog
        style="width: 400px; padding: 30px 56px; border-radius: 10px;"
        v-model="resetShow"
        :show-close="true"
        :append-to-body="true">
        <!-- 模态框头部 -->
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <div class="user_profile">
                    <uploadProfile
                        :profile="userinfo?global.ServerPath+userinfo.profile:global.ServerPath+'/files/anonymous.svg'"
                        :action="global.ServerPath+'/submitUserProfile'"
                        @changeProfile="changeProfile"
                    ></uploadProfile>
                </div>
            </div>
        </template>
        <!-- 模态框内容 -->
        <div class="reset">
            <input type="text" placeholder="请输入新名字,回车确定" v-model="tempNewName" @keyup.enter="submitName" maxlength="32"/>
        </div>
    </el-dialog>

</template>

<script setup>
    import axios from "axios"
    import { ref,onMounted } from 'vue'
    import useGlobal from "/src/global"
    import { storeToRefs } from 'pinia'
    import { ElMessage } from 'element-plus'
    import uploadProfile from '/src/components/uploadProfile.vue'


    /****************************显示头像功能****************************/
    const global=useGlobal();//引入全局变量
    const store=global.Pinia;//引入持久化存储
    const tempStore=global.TempPinia;//引入临时性存储


    /****************************右上角用户界面关闭与否****************************/
    const visible=ref(false);
    

    /****************************用户登录注册模态框弹出与否****************************/
    const modelShow=ref(false);


    /****************************登录功能****************************/
    const {userinfo}=storeToRefs(tempStore);//用户登录后获得的用户信息
    const {token}=storeToRefs(store);//用户登录后获得的令牌
    const modernChange=ref(true);//更换登录或注册模式
    const inputPhone=ref("");//输入框手机号码
    const inputPassword=ref("");//输入框密码
    
    function modernChangeHanppen(){//切换登录注册页
        inputPhone.value="";
        inputPassword.value="";
        modernChange.value=!modernChange.value;
    }

    const isValidPhone=/^1[0-9]{10}$/;//用于判断输入手机号是否合法

    async function Submit(mode="register"){//普通登录、"register"注册、"login"登录
        if(inputPhone.value==""){
            ElMessage.error('手机号为空');
        }
        else if(!isValidPhone.test(inputPhone.value)){
            ElMessage.error('无效手机号');
        }
        else if(inputPassword.value==""){
            ElMessage.error('密码为空');
        }
        else if(inputPassword.value.length<6){
            ElMessage.error('密码过短');
        }
        else if(inputPassword.value.length>=15){
            ElMessage.error('密码过长');
        }
        else if(mode=="register"){
            let res = await axios.post(global.ServerPath+'/register',{phone:inputPhone.value,password:inputPassword.value});
        
            if(!res.data.error){
                ElMessage.success('注册成功');
                modelShow.value=!modelShow.value;
                token.value=res.data.token;
                userinfo.value={username:res.data.username, profile:res.data.profile, id:res.data.id};
            }
            else{
                ElMessage.error('手机号已被注册,注册失败');
            }
        }
        else if(mode=="login"){
            let res = await axios.post(global.ServerPath+'/login',{phone:inputPhone.value,password:inputPassword.value});
            
            if(!res.data.error){
                ElMessage.success('登录成功');
                modelShow.value=!modelShow.value;
                token.value=res.data.token;
                userinfo.value={username:res.data.username, profile:res.data.profile, id:res.data.id};

                global.Bus.emit("login","");//广播用户上线通知
            }
            else{
                ElMessage.error('登录失败，请检查手机号和密码');
            }
        }
        else{
            console.log("请输入提交类型");
        }
    }
    
    async function tokenSubmit(){//token登录
        let res = await axios.get(global.ServerPath+'/fasterLogin');
        if(!res.data.error){
            ElMessage.success('登录成功');
            token.value=res.data.token;
            userinfo.value={username:res.data.username, profile:res.data.profile, id:res.data.id};

            global.Bus.emit("login","");//广播用户上线通知
        }
        else if(token.value){
            ElMessage.error("token过期，请重新登录");
            token.value=undefined;
            userinfo.value=undefined;
        }
    }


    /****************************登出****************************/
    function logout(){//登出方法
        visible.value=false;
        userinfo.value=undefined;
        token.value=undefined;
        document.querySelector(".profile-img").src=global.ServerPath+"/files/anonymous.svg";

        global.Bus.emit("logout","");//广播用户下线通知
    }

    /****************************用户设置****************************/
    const resetShow = ref(false);//控制用户设置模态框弹出
    function reset(){//关掉有右上角菜单并打开用户设置页面
        visible.value=false;
        resetShow.value=!resetShow.value;
    }

    async function changeProfile(imgPath){//改变头像
        let result =  await axios.post(global.ServerPath+"/changeUserProfile", {token:token.value, imgPath});
        if(result.data.error){
            ElMessage.error("上传失败");
        }
        else{
            ElMessage.success("上传成功");
            userinfo.value.profile=result.data.profile;
        }
    }

    const tempNewName = ref("");//临时暂存新名字
    async function submitName(){//提交名字
        if(tempNewName.value==""){
            ElMessage.error("名字不能为空!");
        }
        else{
            let result = await axios.post(global.ServerPath+"/submitNewName", {token:token.value, username:tempNewName.value});
           
            if(result.data.error){
                ElMessage.error("上传失败");
            }
            else{
                ElMessage.success("上传成功");
                userinfo.value.username=tempNewName.value;
            }
        }
        tempNewName.value="";
    }
    /****************************挂载触发****************************/
    onMounted(async ()=>{
        tokenSubmit();
    });
</script>

<style lang="scss" scoped>
    /* .head-menu */
    .header-profile{
        display: flex;
        flex-direction: row;
        margin-left: 40px;
        $profileEdge: 32px;//头像长宽
        width: $profileEdge;
        height: $profileEdge;
        cursor: pointer;
        img{
            border: 2px solid #f9fafb;
            box-sizing: border-box;
            width: $profileEdge;
            height: $profileEdge;
            object-fit: fill;
            border-radius: 50%;
        }
    }

    .el-dialog{
        h1{
            margin-left: 16px;
            font-size: 30px;
            text-align: center;
            background-image: linear-gradient(#7a42ff, #42c7fb);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }

        .my-header{
            .user_profile{
                display: flex;
                justify-content: center;
                margin-left: 16px;
                img{
                    width: 100%;
                    height: 100%;
                    $profileEdge: 178px;//头像长宽
                    width: $profileEdge;
                    height: $profileEdge;
                    border-radius: 50%;
                }
            }
        }

        &__body{
            padding: 0;
            .reset{
                height: 30px;
                input{
                    height: 100%;
                    width: 100%;
                    outline: none;
                    text-indent: 10px;
                    border: 2px solid #00AEEC;
                    border-radius: 8px;
                    &::placeholder{
                        color: #00AEEC;
                    }
                }
            }
        }
    }
    
</style>
<style lang="scss">
</style>