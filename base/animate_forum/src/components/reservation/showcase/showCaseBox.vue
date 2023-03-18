<template>
    <div class="showcasebox" @click="clickShowModel">
        <div class="worksBox">
            <el-image class="LazyloadImg works"
                :src="works"
                :lazy="lazyLoad"
                scroll-container=".page-content"
            />
        </div>
        <div class="infoBox">
            <el-image class="author_profile LazyloadImg"
                :src="id==userinfo?.id?global.ServerPath+userinfo.profile:author_profile"
                :lazy="lazyLoad"
                scroll-container=".page-content"/>
            <p class="author_name">{{id==userinfo?.id?userinfo.username:author_name}}</p>
            <p class="author_comment">{{author_comment}}</p>
            <p class="transact_info">
                <span class="price">{{price}}</span>
                <span class="sold_num">已售{{sold_num}}</span>
            </p>
        </div>
    </div>
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { ref, defineProps, onMounted, onUnmounted } from 'vue';

    const props = defineProps({works:String, author_profile:String, author_name:String, author_comment:String, price:Number,
         sold_num:Number, id:String, search_id:String});//从父组件传值到本组件
    const global = useGlobal();
    const store = global.Pinia;
    const detailPage = global.detailPage;
    const { userinfo } = storeToRefs(store);

    /**控制模态框显现与否**/
    function clickShowModel(){
        detailPage.openModel("local","showcase",{ search_id: props.search_id, id:props.id, author_name:props.author_name,
             author_profile:props.author_profile, works:props.works, author_comment:props.author_comment, price:props.price, 
             sold_num:props.sold_num});
    }

    /**控制懒加载**/
    const lazyLoad=ref(false);

    /**挂载触发**/
    onMounted(()=>{
       lazyLoad.value=true;//启动懒加载
    })
    /**卸载载触发**/
    onUnmounted(()=>{
        lazyLoad.value=false;//重置懒加载
    })
    
</script>

<style lang="scss" scoped>
    .showcasebox{
        cursor: pointer;
        width: 200px;
        height: 250px;
        background-color: white;
        margin: 15px;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .worksBox{
            width: 100%;
            flex-basis: 65%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            .works{
                width: 100%;
                height: 100%;
            }
        }
        .infoBox{
            width: 100%;
            flex-basis: 35%;
            position: relative;
            .author_profile{
                width: 34px;
                height: 34px;
                border-radius: 50%;
                border: 2px solid white;
                position: absolute;
                transform: translate(25%,-50%);
                overflow: hidden;
            }
            .author_name{
                color: gray;
                font-size: 12px;
                margin-left: 55px;
            }
            .author_comment{
                font-weight: 500;
                display: block;
                text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
                white-space: nowrap; /* 段落中的文本不进行换行 */
                overflow: hidden; /* 溢出部分隐藏 */
                padding: 6px 10px;
                text-indent: 15px;
            }
            .transact_info{
                padding:0px 15px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-end;
                .price{
                    color: #ff5000;
                    font-size: 20px;
                    &:before{
                        content: "￥";
                        display: inline;
                    }
                }

                .sold_num{
                    color: rgb(146, 146, 146);
                    font-size: 12px;
                    margin-bottom: 3px;
                }
            }
        }
    }
</style>
<style lang="scss">//调节element-plus、vue3-lazyload属性
    .showcasebox{//调节vue3-lazyload
        .LazyloadImg{
            img{
                width: 100%;
                height: 100%;
            }
        }
        .works{
            img{
                object-fit: cover;
                object-position: top;
            }
        }
    }
</style>