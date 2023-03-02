<template>
    <div class="header">
        <!-- 左侧logo -->
        <div class="logo">
            <h2>沉浮兔</h2>
        </div>
        <!-- 主菜单 -->
        <div class="header-menu" :class="{'header-menu-change-search':isChangeSearch}">
            <router-link  active-class="active" to="/index">首页</router-link>
            <router-link  active-class="active" to="/Reservation">约稿</router-link>
            <router-link  active-class="active" to="/message">消息</router-link>
            <router-link  active-class="active" to="/Person">我的</router-link>
        </div>
        <!-- 搜索框 -->
        <div class="search-bar" :class="{'search-bar-change-search': isChangeSearch}">
			<input @focusin="changeStyle" @focusout="changeStyle" type="text" placeholder="请输入关键字">
		</div>
        <!-- 头像 -->
        <div class="header-profile">
            <el-popover :visible="visible" placement="bottom" :width="160">
                <ul v-if="userinfo!=undefined" style="text-align: center; margin: 0">
                    <li style="text-align: right;">
                        <img @click="visible = false" style="width:17px; height:17px; cursor: pointer;" src="../assets/icons/close.svg">
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
    </div>

    <!-- 登录模态框 -->
    <el-dialog style="width: 400px;padding: 30px 56px" v-model="modelShow" :show-close="true">
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
    <el-dialog style="width: 400px; padding: 30px 56px; border-radius: 10px;" v-model="resetShow" :show-close="true">
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
    import {ref,onMounted} from 'vue'
    import useGlobal from "../global"
    import axios from "axios"
    import { storeToRefs } from 'pinia'
    import { ElMessage } from 'element-plus'
    import uploadProfile from './uploadProfile.vue'

    /****************************点击搜索框展开功能****************************/
    const isChangeSearch= ref(false);
    function changeStyle(){
        isChangeSearch.value = !isChangeSearch.value;
    }


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
    .header {
        position: relative;
        z-index: 1;
        background: #323233;
        display: flex;
        flex-direction: row;
	    align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        height: 58px;
        width: 100%;
        padding: 0 30px;
        white-space: nowrap;
        box-sizing: border-box;
        @media screen and (max-width: 480px) {
            padding: 0 16px;
        }
        
        .logo{
            width: 96px;
            height: 30px;
            margin-right: 110px;
            display: flex;
            flex-direction: row;
            align-items: center;

            @media screen and (max-width: 945px) {
                display: none;
            }

            h2{
                background-image: linear-gradient(#7a42ff, #42c7fb);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
            }
        }

        /* .head-menu */
        &-menu{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            margin-left: 5px;
            a{
                padding: 20px 30px;
                text-decoration: none;
                color: #96A4A9;
                border-bottom: 2px solid transparent;
                transition: 0.3s;
                @media screen and (max-width: 610px) {
                    display: none;
                }

                &.active{
                    color: #ffffff;
                    border-bottom: 2px solid #ffffff;
                }
            }
        }

        .search-bar{
            height: 40px;
            display: flex;
            width: 100%;
            max-width: 400px;
            padding-left: 16px;
            border-radius: 4px;
            border: none;
            input{
                color: white;
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                background-color: #3C3C3D;
                border-radius: 4px;
                font-family: "Poppins", sans-serif;
                font-size: 15px;
                font-weight: 500;
                padding: 0 20px 0 40px;
                background-image: url("../assets/icons/search.svg");
                background-size: 14px;
                background-repeat: no-repeat;
                background-position: 16px 48%;
                border: 2px solid rgb(0,0,0,0);
                &::placeholder {
                    font-family: "Poppins", sans-serif;
                    color: rgb(87, 87, 160);
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            input:focus{
                border-color: rgb(139, 134, 192);
            }
        }

        &-profile{
            display: flex;
            flex-direction: row;
            margin-left: 40px;
            width: 32px;
            height: 32px;
            cursor: pointer;
            img{
                border: 2px solid #f9fafb;
                box-sizing: border-box;
                width: 32px;
                height: 32px;
                object-fit: fill;
                border-radius: 50%;
            }
        }

        /*输入框聚焦后，样式改变 */
        &-menu-change-search{
            display: none;
        }

        .search-bar-change-search{
            max-width: 100%;
            transition: 0.4s;
            box-shadow: 0 0 0 1px rgba(113 119 144 / 25%);
            padding-left: 0;
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
                    width: 178px;
                    height: 178px;
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