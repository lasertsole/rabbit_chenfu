<template>
    <div class="session">

        <div class="communicate_information">
            <div ref="communicate_log" class="communicate_log">
                <template v-for="item in AllChatLog">
                    <sessionBox  v-if="item.id==uniqueContactsArr[indexContacts]" :isMe="item.isMe" :content="item.content" :profile="item.isMe?global.ServerPath+userinfo.profile:global.ServerPath+personList[indexContacts].profile"></sessionBox>
                </template>
            </div>
            <textarea v-model="unSubmit_content" class="unSubmit_content" @keyup.enter="SubmitChat"></textarea>
            <el-button class="submitButton" type="primary" round @click="SubmitChat">发送</el-button>
        </div>

        <div class="contacts">
            <el-scrollbar>
                <p v-for="(item, index) in personList" :key="item" class="scrollbar-demo-item" @click="indexContacts=index">
                    <div class="profile_box">
                        <img class="profile" :src="global.ServerPath+item.profile"/>
                    </div>
                    <div class="info">
                        <div class="user_name">{{item.username}}</div>
                        <div class="last_community_content">{{item.content}}</div>
                    </div>
                </p>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { storeToRefs } from 'pinia';
    import useGlobal from "/src/global";
    import { useRoute, useRouter } from "vue-router";
    import { ElMessage } from 'element-plus';
    import { onMounted, onUnmounted, ref, nextTick  } from "vue";
    import sessionBox from "/src/components/message/session/sessionBox.vue";
    
    const global = useGlobal();//引入全局变量
    const store = global.Pinia;//引入持久性存储
    const tempStore = global.TempPinia;//引入临时性存储
    const { token }=storeToRefs(store);//token用于判断是否在线
    const { userinfo }=storeToRefs(tempStore);//临时存储的用户信息

    const lazyLoad = ref(false);//设置懒加载

    const chatResult = ref([]);//聊天盒子容器
    const personList = ref([]);//右侧联系人列表

    const indexContacts=ref(0)//聊天记录对于右侧列表的联系人（默认打开第一个）
    const uniqueContactsArr = ref([]);//去重联系人列表(只包含id)
    const AllChatLog=ref([]);//所有聊天记录(包含指向)

    let setIntervalContain;//轮询函数容器
    async function sentRequire(){//获取聊天盒子
        /******获取聊天盒子******/
        let result = await axios.get(global.ServerPath+'/getSessionBox');
        if(result.error=="用户未登录"){
            ElMessage.error('请先登录');
        }else if(result.error=="token错误"){
            ElMessage.error('token错误');
        }
        else if(result.error=="无消息盒子"){
            ElMessage('无消息盒子')
        }
        else{
            userinfo.value={id:result.data.id, username:result.data.username, profile:result.data.profile};//暂存本用户的id，名字和头像
            chatResult.value=result.data.result;//返回聊天盒子列表
        /******右侧联系人列表******/
            let tempArr=[];
            let tempDetailArr=[];
            chatResult.value.forEach((item)=>{//联系人去重1 根据source_id和target_id选出联系人的id(不包括自己)
                if(item.source_id!=userinfo.value.id){
                    tempArr.push(item.source_id);

                    tempDetailArr.push({id:item.source_id, created_time:item.created_time, content:item.content, isMe: false});
                }
                if(item.target_id!=userinfo.value.id){
                    tempArr.push(item.target_id);

                    tempDetailArr.push({id:item.target_id, created_time:item.created_time, content:item.content, isMe: true});
                }
            })
            tempArr = Array.from(new Set(tempArr))//联系人去重2 使用set函数去重

            result = await axios.post(global.ServerPath+'/getPersonList',{personList:tempArr});//请求回每个联系人的头像、名字和id信息

            result.data=result.data.map((item)=>{
                let temp=0;
                for(let i=0;i<tempDetailArr.length;i++){
                    if(item.id==tempDetailArr[i].id){
                        temp=i;
                    }
                }
                return {content:tempDetailArr[temp].content, username:item.username, profile:item.profile}
            })

            personList.value=result.data;//得到右侧联系人列表的请求结果
        /******左侧聊天具体内容******/
            uniqueContactsArr.value=tempArr;//获取去重联系人列表
            AllChatLog.value=tempDetailArr;//获取所有聊天记录(包含指向)
        
        /******判断聊天内容是否更新，更新时划到底部******/
            if(AllChatLogLength.value!=AllChatLog.value.length){
                AllChatLogLength.value=AllChatLog.value.length;
                nextTick(()=>{scrollToBottom()});//nextTick确保scrollToBottom()在聊天框总长度更新完之后才执行
            }
        }
    }
    
    const unSubmit_content = ref("");//输入框内容
    async function SubmitChat(){//提交聊天内容
        unSubmit_content.value=unSubmit_content.value.replace(/\n$/,"");//去掉回车发送时字符串后面的回车符
        if(unSubmit_content.value!=""){
            let result = await axios.post(global.ServerPath+'/SubmitChat', { source_id:userinfo.value.id, target_id:uniqueContactsArr.value[indexContacts.value], content:unSubmit_content.value });
            if(result.data.error){ElMessage.error("发送失败");}
            else{unSubmit_content.value="";sentRequire();}
        }
        else{ElMessage('请先输入内容');}
    }

    const communicate_log = ref();//获取聊天框原生元素
    const AllChatLogLength = ref(AllChatLog.value.length);//用AllChatLog的长度判断聊天内容是否更新
    function scrollToBottom(){//聊天框滑动到底部
        communicate_log.value.scrollTop=communicate_log.value.scrollHeight;
    }
    
    /****************************路由传参****************************/
    const route = useRoute();
    async function receiveDm(){
        if(token.value&&route.query.target_id){//登录状态并且有其他页面传值时才能触发
            if(route.query.target_id==userinfo.value.id){
                ElMessage.error("你不能给自己私信");
            }
            else if(uniqueContactsArr.value.indexOf(route.query.target_id)<0){//私信的人不在列表中
                let result = await axios.post(global.ServerPath+'/SubmitChat', { source_id:route.query.target_id, target_id:userinfo.value.id, content:"现在开始私聊吧~" });
                if(result.data.error){ElMessage.error("发送失败");}
                else{sentRequire();}
            }
            else{
                indexContacts.value=uniqueContactsArr.value.indexOf(route.query.target_id);
            }
        }
    }

    /****************************Bus监听函数****************************/
    //用户上线
    function sessionLogin(data){
        sentRequire();
        clearInterval(setIntervalContain);
        setIntervalContain = setInterval(sentRequire,5000);//轮询刷新聊天记录
    }

    //用户下线
    const router = useRouter();
    function sessionLogout(data){
        //清空所有聊天信息
        clearInterval(setIntervalContain);
        chatResult.value=[];
        personList.value=[];
        indexContacts.value=0;
        uniqueContactsArr.value=[];
        AllChatLog.value=[];
        //强制跳转到其他页面
        router.replace({ name: 'index'});
    }
    
    /****************************挂载触发****************************/
    onMounted(()=>{
        if(token.value!=undefined){//判断是否为登录状态，若是则调用
            sentRequire().then(()=>{receiveDm()},//确保路由传参在初始化请求完成后执行
            ()=>{ElMessage.error("初始化错误")});
            setIntervalContain = setInterval(sentRequire,5000);//轮询刷新聊天记录
        }
        global.Bus.on("login",sessionLogin);//用户上线触发
        global.Bus.on("logout",sessionLogout);//用户下线触发
        lazyLoad.value=true;//开启懒加载
    });

    /****************************卸载解绑****************************/
    onUnmounted(()=>{
        clearInterval(setIntervalContain);
        global.Bus.off("login",sessionLogin);
        global.Bus.off("logout",sessionLogout);
    })

</script>

<style lang="scss" scoped>
    .session{
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        max-width:100%;
        box-sizing: border-box;
        overflow: hidden;
        padding: 10px 40px;
        max-width: 1280px;
        flex-basis: 1280px;
        @media screen and (max-width: 610px) {
            padding: 10px 0px;
        }

        .communicate_information{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-right: 12px;
            position: relative;
            .communicate_log{
                padding: 10px;
                box-sizing: border-box;
                border-radius: 8px;
                flex-basis: 79%;
                border: 1px solid white;
                box-shadow: inset 2px 2px 2px 2px rgb(255 255 255 / 50%), 7px 7px 20px 0px rgb(0 0 0 / 10%), 4px 4px 5px 0px rgb(0 0 0 / 10%);
                color: white;
                overflow-y: auto;
            }

            .unSubmit_content{
                padding: 10px;
                box-sizing: border-box;
                border-radius: 8px;
                flex-basis: 19%;
                background-color: transparent;
                border: 1px solid white;
                resize:none;
                outline: none;
                box-shadow: inset 2px 2px 2px 2px rgb(255 255 255 / 50%), 7px 7px 20px 0px rgb(0 0 0 / 10%), 4px 4px 5px 0px rgb(0 0 0 / 10%);
                color: white;
            }

            .submitButton{
                position:absolute;
                bottom:10px;
                right:25px;
                @media screen and (max-height: 325px) {
                    display: none;
                }
            }
        }
        .contacts{
            height: 100%;
            width: 250px;
            box-sizing: border-box;
            box-sizing: border-box;
            @media screen and (max-width: 945px) {
                width: 200px;
            }

            @media screen and (max-width: 610px) {
                width: 150px;
            }
            
            .scrollbar-demo-item {
                display: flex;
                flex-direction: row;
                padding: 10px;
                align-items: center;
                cursor: pointer;
                margin: 3px;
                text-align: center;
                border-radius: 4px;
                transition: all 0.3s ease;
                box-shadow: inset 2px 2px 2px 0px rgb(255 255 255 / 50%), 7px 7px 20px 0px rgb(0 0 0 / 10%), 4px 4px 5px 0px rgb(0 0 0 / 10%);
                
                .profile_box{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .profile{
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                }

                .info{
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    align-items: flex-start;
                    padding-left: 10px;
                    .user_name{
                        color: white;
                        display: block;
                        text-align: left;
                        max-width: 163px;
                        text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                        white-space: nowrap; /* 段落中的文本不进行换行 */
                        overflow: hidden; /* 溢出部分隐藏 */
                        @media screen and (max-width: 945px) {
                            max-width: 113px;
                        }

                        @media screen and (max-width: 610px) {
                            max-width: 70px;
                        }
                    }

                    .last_community_content{
                        color: rgb(137, 137, 137);
                        display: block;
                        text-align: left;
                        max-width: 163px;
                        text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                        white-space: nowrap; /* 段落中的文本不进行换行 */
                        overflow: hidden; /* 溢出部分隐藏 */
                        @media screen and (max-width: 945px) {
                            max-width: 113px;
                        }

                        @media screen and (max-width: 610px) {
                            max-width: 70px;
                        }
                    }
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #3f6cff 0%,rgb(240, 240, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #4952ff 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>