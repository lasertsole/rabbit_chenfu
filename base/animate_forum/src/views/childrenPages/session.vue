<template>
    <div class="session" v-if="AllChatLog.length>0">
        <div class="communicate_information">
            <div ref="communicate_log" class="communicate_log">
                <template v-for="item in AllChatLog">
                    <sessionBox  v-show="item.id==uniqueContactsIdArr[indexContacts]" :isMe="item.isMe" :content="item.content" :profile="global.ServerPath+item.profile"></sessionBox>
                </template>
            </div>
            <textarea maxlength="100" v-model="unSubmit_content" class="unSubmit_content" @keyup.enter="SubmitChat"></textarea>
            <el-button class="submitButton" type="primary" round @click="SubmitChat">发送</el-button>
        </div>
        <contacts :personList="personList" @changeIndexContacts="changeIndexContacts"></contacts>
    </div>
    <div class="mock" v-else v-if="showHadNotResult">
        <p>无聊天记录</p>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { storeToRefs } from 'pinia';
    import useGlobal from "/src/global";
    import { ElMessage } from 'element-plus';
    import { useRoute, useRouter } from "vue-router";
    import { onMounted, onUnmounted, ref, nextTick, watch  } from "vue";
    import contacts from "/src/components/message/session/contacts.vue";
    import sessionBox from "/src/components/message/session/sessionBox.vue";
    
    const global = useGlobal();//引入全局变量
    const store = global.Pinia;//引入持久性存储
    const { token }=storeToRefs(store);//token用于判断是否在线
    const { userinfo }=storeToRefs(store);//临时存储的用户信息

    const lazyLoad = ref(false);//设置懒加载

    const chatResult = ref([]);//聊天盒子容器
    const personList = ref([]);//右侧联系人列表

    const indexContacts=ref(0)//聊天记录对于右侧列表的联系人（默认打开第一个）
    const uniqueContactsIdArr = ref([]);//去重联系人列表(只包含id)
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
                if(item.target_id==userinfo.value.id){
                    tempArr.push({id:item.source_id, username:item.source_username, profile:item.source_profile, content:item.content});
                    tempDetailArr.push({id:item.source_id, created_time:item.created_time, content:item.content, isMe: false, profile:item.source_profile});
                }
                if(item.source_id==userinfo.value.id){
                    tempArr.push({id:item.target_id, username:item.target_username, profile:item.target_profile, content:item.content});
                    tempDetailArr.push({id:item.target_id, created_time:item.created_time, content:item.content, isMe: true, profile:item.source_profile});
                }
            })

            let justify = {};//联系人去重2
            uniqueContactsIdArr.value=[];//联系人唯一id列表重置
            tempArr = tempArr.reverse().reduce(function(item, next) {//去重先翻转数组，保证最近聊天的在最顶部，并且指向最后的聊天记录
                justify[next.id] ? '' : justify[next.id] = true && item.push(next) && uniqueContactsIdArr.value.push(next.id);
                return item;
                }, []);
        /******左右侧聊天具体内容******/
            AllChatLog.value=tempDetailArr;//获取左侧所有聊天记录(包含指向)
            personList.value=tempArr;//得到右侧联系人列表的请求结果
        /******判断聊天内容是否更新，更新时划到底部******/
            if(AllChatLogLength.value!=AllChatLog.value.length){
                AllChatLogLength.value=AllChatLog.value.length;
                changeIndexContacts(0)//左边跳转到第一页
                nextTick(()=>{scrollToBottom()});//nextTick确保scrollToBottom()在聊天框总长度更新完之后才执行
            }
        }
    }
    
    const unSubmit_content = ref("");//输入框内容
    async function SubmitChat(){//提交聊天内容
        unSubmit_content.value=unSubmit_content.value.replace(/\n$/,"");//去掉回车发送时字符串后面的回车符
        if(unSubmit_content.value!=""){
            let contentObj={classify:"chat", data:[{type:"text",content:unSubmit_content.value}]};
            let obj = { source_id:userinfo.value.id, target_id:uniqueContactsIdArr.value[indexContacts.value], content:JSON.stringify(contentObj)}
            let result = await axios.post(global.ServerPath+'/SubmitChat', obj);
            if(result.data.error){ElMessage.error("发送失败");}
            else{unSubmit_content.value="";sentRequire()}
        }
        else{ElMessage('请先输入内容');}
    }

    function changeIndexContacts(index){//由右边联系人列表改变左边的聊天内容
        indexContacts.value=index;
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
            else{
                if(uniqueContactsIdArr.value.indexOf(route.query.target_id)<0){//私信的人不在列表中
                    let contentObj={classify:"chat", data:[{type:"text",content:"现在开始私聊吧~"}]};
                    let result = await axios.post(global.ServerPath+'/SubmitChat', { source_id:route.query.target_id,
                         target_id:userinfo.value.id, content:JSON.stringify(contentObj)});
                         
                    if(result.data.error){ElMessage.error("发送失败");}
                    else{sentRequire().then(()=>{indexContacts.value=uniqueContactsIdArr.value.indexOf(route.query.target_id)})}
                }
                else{
                    indexContacts.value=uniqueContactsIdArr.value.indexOf(route.query.target_id);
                }

                if(route.query.search_id&&route.query.type){//传交易信息到session
                    if(route.query.type=="showCaseBox"){//从showCase页面传来的约稿信息
                        let contentObj={classify:"reservation", kind:"showcase", search_id:route.query.search_id, data:[{type:"text",content:"大佬最近有档期吗？我想约这个"},{type:"pic",content:route.query.works},{type:"price",content:"￥"+route.query.sold_num}]};

                        let result = await axios.post(global.ServerPath+'/SubmitChat', {
                             source_id:userinfo.value.id, target_id:route.query.target_id, 
                             content:JSON.stringify(contentObj)});
                        if(result.data.error){ElMessage.error("发送失败");}
                        else{sentRequire().then(()=>{history.replaceState(history.state,"",'#'+router.currentRoute._rawValue.path)})}//还原URL，但不重载页面
                    }
                    else{//从require页面传来的约稿信息
                        let contentObj={classify:"reservation", kind:"require", search_id:route.query.search_id, data:[{type:"text",content:"老板单还在吗？我想接这个"},{type:"title",content:route.query.title}]};
                        if(route.query.describe_image){contentObj.data.push({type:"pic",content:route.query.describe_image});}
                        contentObj.data.push({type:"tail",content:[{type:"money", content:route.query.money}, {type:"tag", content:route.query.tag}, {type:"calendar", content:route.query.calendar}]});

                        let result = await axios.post(global.ServerPath+'/SubmitChat', {
                             source_id:userinfo.value.id, target_id:route.query.target_id, 
                             content:JSON.stringify(contentObj)});
                        if(result.data.error){ElMessage.error("发送失败");}
                        else{sentRequire().then(()=>{history.replaceState(history.state,"",'#'+router.currentRoute._rawValue.path)})}//还原URL，但不重载页面
                    }
                }
            }
        }
    }

    /****************************watch监听控制显示无结果提示****************************/
    const showHadNotResult = ref(false);//显示无结果提示
    watch(AllChatLog,()=>{showHadNotResult.value=!(AllChatLog.value.length>0)})
    
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
        uniqueContactsIdArr.value=[];
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
        max-width:100%;
        min-width:100%;
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
            flex-shrink: 1;
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
                display: flex;
                flex-direction: column;
            }

            .unSubmit_content{
                overflow-y: auto;
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
    }
    .mock{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 30px;
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