<template>
    
    <div class="showcasebox">
        <div class="worksBox">
            <img :src="props.works">
        </div>
        <div class="infoBox">
            <img class="author_profile" :src="props.author_profile">
            <p class="author_name">{{props.author_name}}</p>
            <p class="author_comment">{{props.author_comment}}</p>
            <p class="transact_info">
                <span class="price">￥{{props.price}}</span>
                <span class="sold_num">已售{{props.sold_num}}</span>
            </p>
        </div>
    </div>

</template>

<script setup>
    import {defineProps} from "vue";

    const props = defineProps({works:String, author_profile:String, author_name:String, author_comment:String, price:Number, sold_num:Number});//从父组件传值到本组件

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
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: top;
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