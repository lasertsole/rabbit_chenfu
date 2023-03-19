<template>
    <div class="left">
        <template v-if="table=='newWork'">
            <p class="author_recomment">{{recomment}}</p>
            <p><el-image class="LazyloadImg"
                    fit="fill"
                    :src="imgArr"
                    :preview-src-list="[imgArr]"
                />
            </p>
            <p class="follow">
                <img @click="changeLike" class="heart" :src="userinfo&&likeStatusArr.indexOf(work_id)>=0?'/icons/fulledHeart.svg':'/icons/followHeart.svg'"/>
                <span class="appoint">{{appointNum}}</span>
            </p>
        </template>

        <template v-if="table=='trends'">
            <p class="author_recomment">{{recomment}}</p>
            <p v-if="imgArr!=null">
                <el-image class="LazyloadImg"
                    v-for="(subItem,subIndex) in imgArr.split(';')"
                    :key="subIndex"
                    :src="ServerPath+subItem"
                    :preview-src-list="[...imgArr.split(';').map((item)=>{return global.ServerPath+item})]"
                />
            </p>
        </template>

        <template v-else-if="table=='showcase'">
            <p class="author_recomment">{{recomment}}</p>
            <p><el-image class="LazyloadImg" :preview-src-list="[imgArr]" :src="imgArr"/></p>
            <p class="transact_info">
                <span class="price">￥{{price}}</span>
                <span class="sold_num">已售{{sold_num}}</span>
            </p>
        </template>

        <template v-else-if="table=='require'">
            <div class="title">{{title}}</div>
            <div class="describe">{{recomment}}</div>
            <div><el-image :preview-src-list="[imgArr]" :src="imgArr" class="LazyloadImg" v-if="imgArr"/></div>
            <div class="tail">
                <span class="money"><img src="/icons/money.svg"/>{{requireTail?requireTail[0]:""}}</span>
                <span class="tag"><img src="/icons/tag.svg"/>{{requireTail?requireTail[1]:""}}</span>
                <span class="calendar"><img src="/icons/calendar.svg"/>{{requireTail?requireTail[2]:""}}</span>
            </div>
        </template>
    </div>
</template>

<script setup>
    import axios from "axios";
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRouter } from "vue-router";
    import { ElMessage } from "element-plus";

    const global = useGlobal();
    const store = global.Pinia;
    const detailPage = global.detailPage;
    const ServerPath = global.ServerPath;
    const { userinfo } = storeToRefs(store);
    const { table, recomment, imgArr,title, price, sold_num, requireTail, work_id, likeStatusArr, appointNum} = storeToRefs(detailPage);

    /******************************newWork******************************/
    async function changeLike(){//点击改变点赞状态
        let result = await axios.post(global.ServerPath+"/changeLike", {work_id:work_id.value});
        if(!result.data.error){
            if(appointNum.value<result.data.appointnum){
                likeStatusArr.value.push(work_id.value)
            }
            else{
                likeStatusArr.value.splice(likeStatusArr.value.indexOf(work_id.value),1)
            }
            appointNum.value=result.data.appointnum;
        }else{
            ElMessage.error("改变点赞状态失败");
        }
    }
</script>

<style lang="scss" scoped>
    .left{
        border-radius: 8px;
        box-sizing: border-box;
        background-color: white;
        margin-right: 20px;
        padding: 24px;
        //newWork的样式
        .follow{
            margin: 10px 10px 0px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .heart{
                width: 35px;
                height: 35px;
                cursor: pointer;
            }

            .appoint{
                margin-left: 10px;
                font-size: 18px;
                font-weight: bold;
                color: #b8b8b8;
            }
        }
        // showcaseBox的样式
        .LazyloadImg{
            margin-top: 10px;
        }
        .author_recomment{
            margin: 10px 10px 0px;
            font-size: 18px;
            color: black;
            flex-grow: 1;
        }
        .transact_info{
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            .price{
                color: #ff5000;
            }
            
            .sold_num{
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: rgb(146, 146, 146);
                font-size: 16px;
            }
        }
        // requireBox的样式
        .title{
            font-size: 20px;
            color: rgb(39, 39, 39);
            font-weight: 500;
            padding: 10px 0px;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            white-space: nowrap; /* 段落中的文本不进行换行 */
            overflow: hidden; /* 溢出部分隐藏 */
        }

        .describe{
            font-size: 14px;
            color: rgb(54, 54, 54);
            padding: 10px 0px;
            text-overflow: ellipsis; /* 文本溢出时显示省略号来代表被修剪的文本 */
            overflow: hidden; /* 溢出部分隐藏 */
        }
        .tail{
            $size: 18px;
            margin-top: 8px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            color: #929292;
            span{
                font-size: $size - 4px;
                line-height: $size;
                display: flex;
                flex-direction: row;
                align-items: center;
                img{
                width: $size;
                height: $size;
                margin-right: 5px;
                &.money{background-image: url(/icons/money.svg);}
                &.calendar{background-image: url(/icons/calendar.svg);}
                &.tag{background-image: url(/icons/tag.svg);}
            }
            }
        }
    }

    @media screen and (min-width: 1100px) {
        .left{
            $leftWidth: 680px;
            max-width: $leftWidth;
            min-width: $leftWidth;
        }
    }
    @media screen and (max-width: 1100px){
        .left{
            margin-top: 20px;
        }
    }
    @media screen and (max-width: 1100px) and (min-width: 700px){
        .left{
            margin-right: 0px;
            max-width: 680px;
            min-width: 680px;
        }
    }

    @media screen and (max-width: 700px) {
        .left{
            margin-top: 20px;
            margin-right: 0px;
            width: 100%;
        }
    }
</style>