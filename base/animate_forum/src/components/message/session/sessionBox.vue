<template>
    <div :class="{sessionBox:true,reverse:isMe}">
        <div class="profile">
            <el-image class="lazyloading"
                :src="profile"
                :lazy="false"
                scroll-container=".page-content"
            />
        </div>
        <div class="content" :class="{chat:isChat,reservation:isReservation}" @click="showDetailPage">
            <template v-for="(item,index) in contentObj.data">
                <span class="text" v-if="item.type=='text'">{{item.content}}</span>
                <p class="title" v-else-if="item.type=='title'">{{item.content}}</p>
                <p class="pic" v-else-if="item.type=='pic'"><img :src="item.content"></p>
                <p class="price" v-else-if="item.type=='price'">{{item.content}}</p>
                <p class="tail" v-else-if="item.type=='tail'">
                    <span v-for="(subItem, subIndex) in item.content" :className="subItem.type">{{subItem.content}}</span>
                </p>
            </template>
        </div>
    </div>
</template>

<script setup>
    import useGlobal from "/src/global";
    import { ref, defineProps, onMounted} from "vue";

    const props = defineProps({isMe:Boolean, content:String, profile:String});//从父组件传值到本组件
    const global = useGlobal();//引入全局变量

    const contentObj = ref(JSON.parse(props.content));

    /**对话框样式控制**/
    const isChat = ref(contentObj.value.classify=="chat");
    const isReservation = ref(contentObj.value.classify=="reservation");

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**控制模态框弹出**/
    const detailPage = global.detailPage;
    function showDetailPage(){
        switch(contentObj.value.classify){
            case 'reservation':
                detailPage.openModel("server", contentObj.value.kind, contentObj.value.search_id);
            break;
        }
    }

    /**挂载触发**/
    onMounted(()=>{
        lazyLoad.value=true;//启动懒加载
    })
</script>

<style lang="scss" scoped>
    .sessionBox{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        box-sizing: border-box;
        max-width: 100%;
        .profile{
            position: relative;
            .lazyloading{
                position: relative;
                z-index: 1;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            &:after{
                z-index: 0;
                content: "";
                display: block;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 12px solid white;
                position: absolute;
                top: 16px;
                right: -16px;
            }
            &:before{
                z-index: 0;
                content: "";
                display: none;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 12px solid cyan;
                position: absolute;
                top: 16px;
                left: -16px;
            }
        }

        .content{
            margin-left: 16px;
            border-radius: 8px;
            background-color: white;
            padding: 10px;
            color: black;
            $max-width: 100%;
            max-width: calc(100% - 133px);
            white-space: normal;
            word-break: break-all;

            @media screen and (max-width: 610px) {
                max-width: 99%;
            }
        }
    }
    .reverse{
        direction:rtl;
        .profile{
            &:after{
                display: none;
            }
            &:before{
                display: block;
            }
        }

        .content{
            margin-left: 0px;
            margin-right: 16px;
            background-color:cyan;
            direction:ltr;
        }
    }
</style>
<style lang="scss">
    .sessionBox{
        .content{
            &.chat{
                
            }

            &.reservation{
                max-width: calc(100% - 133px);
                cursor: pointer;

                @media screen and (max-width: 610px) {
                    max-width: 99%;
                }
            }

            >*{
                margin-top: 5px;
            }

            .text{

            }
            .title{
                color: blue;
            }
            .pic{
                img{
                    width: 100%;
                    height: 100%;
                    max-width: 350px;
                }
            }
            .price{
                color: #ff5000;
            }

            .tail{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 12px;
                color: #929292;
                >*{
                    padding: 0px 15px;
                    background-size: 13px;
                    background-repeat: no-repeat;
                    background-position: left center;
                }

                .money{background-image: url(/icons/money.svg);}
                .calendar{background-image: url(/icons/calendar.svg);}
                .tag{background-image: url(/icons/tag.svg);}
            }
        }
    }
</style>