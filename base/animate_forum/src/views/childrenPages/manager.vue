<template>
    <div class="manager">
        <header class="user_info">
            <div class="user_profile">
                <el-image class="lazyLoading"
                    :preview-src-list="userinfo?[global.ServerPath+userinfo.profile]:undefined"
                    :src="userinfo?global.ServerPath+userinfo.profile:global.ServerPath+'/files/anonymous.svg'"
                />
            </div>

            <div class="user-name">
                {{userinfo?userinfo.username:'未登录'}}
            </div>
        </header>

        <section class="classify_serve">
            <managerBox
                v-for="(item, index) in managerBoxArr"
                :icon="item.icon"
                :title="item.title"
                :link="item.link"
                :modelIndex="index">
            </managerBox>
        </section>
    </div>
</template>

<script setup>
    import { onMounted,ref } from "vue";
    import useGlobal from "/src/global";
    import { storeToRefs } from 'pinia'
    import managerBox from "/src/components/person/manager/managerBox.vue";

    /****************************显示四个功能按键****************************/
    const managerBoxArr = ref([
        {icon:'/icons/myWorks.svg', title:"发表作品", link:"/index/newWork"},
        {icon:'/icons/trend.svg', title:"发表动态", link:"/index/trends"},
        {icon:'/icons/showCase.svg', title:"橱窗展出", link:"/Reservation/showcase"},
        {icon:'/icons/require.svg', title:"发需求帖", link:"/Reservation/require"},
    ]);

    /****************************显示用户信息功能****************************/
    const global = useGlobal();//引入全局变量
    const store=global.Pinia;//引入持久化存储
    const tempStore=global.TempPinia;//引入临时性存储

    const { userinfo }=storeToRefs(tempStore);//用户登录后获得的用户信息
    const { token }=storeToRefs(store);//用户登录后获得的令牌
    
    /****************************挂载触发****************************/
    onMounted(()=>{
    });

</script>

<style lang="scss" scoped>
    .manager{
        display: flex;
        flex-direction: column;
        padding: 10px;
        height: 100%;
        width: 100%;
        max-width: 1280px;
        padding: 0px 40px;
        box-sizing: border-box;
        overflow: hidden;
        .user_info{ 
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 20px;
            border-bottom: 2px solid #00e7fc;
            .user_profile{
                width: 70px;
                min-width: 70px;
                height: 70px;
                min-height: 70px;
                border-radius: 50%;
                overflow: hidden;

                .lazyLoading{
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                }
            }

            .user-name{
                margin-left: 20px;
                color: white;
                font-size: 25px;
            }
        }

        .classify_serve{
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px;
            overflow-y: auto;
        }
    }
    ::-webkit-scrollbar {
        width: 4px;
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #716ff3 0%,rgb(240, 210, 103) 100%);
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: -webkit-linear-gradient(top,  #6f6df1 0%,rgba(83, 237, 142, 0) 100%);
    }
</style>