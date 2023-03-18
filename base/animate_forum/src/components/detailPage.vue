<template>
    <el-dialog class="newWorkModelBox"
        close-on-press-escape 
        v-model="showModel"
        :show-close="false"
        :modal="false"
        :fullscreen="true"
        :destroy-on-close="true"
        :append-to-body="true">
        <!-- 模态框内容 -->
        <div class="modelContent">
            <div class="close" @click="hideModel"></div>
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

            <div class="right">
                <img :src="author_id==userinfo?.id?ServerPath+userinfo.profile:author_profile"/>
                <p class="author_name">{{author_id==userinfo?.id?userinfo.username:author_name}}</p>
                <button v-if="dataMode=='local'&&table=='showcase'" @click="clickDm_showcase" class="dm_Button" style="max-width:85px">
                    <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"></path><path fill="currentColor" d="M352 576h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm32-192h256q32 0 32 32t-32 32H384q-32 0-32-32t32-32z"></path></svg>
                    立刻约稿
                </button>
                <button v-else-if="dataMode=='local'&&table=='require'" @click="clickDm_require" class="dm_Button" style="max-width:85px">
                    <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"></path><path fill="currentColor" d="M352 576h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm32-192h256q32 0 32 32t-32 32H384q-32 0-32-32t32-32z"></path></svg>
                    立刻接稿
                </button>
                <button v-else @click="clickDm_other" class="dm_Button">
                    <svg viewBox="0 0 1024 1024"><path fill="currentColor" d="m174.72 855.68 135.296-45.12 23.68 11.84C388.096 849.536 448.576 864 512 864c211.84 0 384-166.784 384-352S723.84 160 512 160 128 326.784 128 512c0 69.12 24.96 139.264 70.848 199.232l22.08 28.8-46.272 115.584zm-45.248 82.56A32 32 0 0 1 89.6 896l58.368-145.92C94.72 680.32 64 596.864 64 512 64 299.904 256 96 512 96s448 203.904 448 416-192 416-448 416a461.056 461.056 0 0 1-206.912-48.384l-175.616 58.56z"></path><path fill="currentColor" d="M352 576h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm32-192h256q32 0 32 32t-32 32H384q-32 0-32-32t32-32z"></path></svg>
                    私信
                </button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
    import axios from "axios";
    import { onMounted } from "vue";
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRouter } from "vue-router";
    import { ElMessage } from "element-plus";

    const router = useRouter();
    const global = useGlobal();
    const store = global.Pinia;
    const detailPage = global.detailPage;
    const ServerPath = global.ServerPath;
    const { userinfo } = storeToRefs(store);
    const { showModel, dataMode, table, search_id, author_id, author_name, author_profile, recomment, imgArr,
         title, price, sold_num, requireTail, work_id, likeStatusArr, appointNum} = storeToRefs(detailPage);//控制模态框开关


    function hideModel(){//关闭模态框
        showModel.value=false;
    }

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

    /******************************showcase的私聊******************************/
    function clickDm_showcase(){//私聊功能
        router.replace({ name: "session", query: {target_id:author_id.value, search_id:search_id.value, works:imgArr.value, recomment:recomment.value, price:price.value, sold_num:sold_num.value, type:"showCaseBox"}});
        detailPage.closeModel();
    }

    /******************************require的私聊******************************/
    function clickDm_require(){//私聊功能
        router.replace({ name: "session", query: {target_id:author_id.value, search_id:search_id.value, title:title.value,
             describe_require:recomment.value, describe_image:imgArr.value, money:requireTail.value[0], 
             calendar:requireTail.value[1], tag:requireTail.value[2], type:"requireBox"}});
        detailPage.closeModel();
    }
    /******************************其他页面的私聊******************************/
    function clickDm_other(){//私聊功能
        router.replace({ name: "session", query: {target_id:author_id.value}});
        detailPage.closeModel();
    }

    /******************************挂载触发******************************/
    onMounted(()=>{
    })

</script>

<style lang="scss" scoped>
    .newWorkModelBox{
        display: flex;
        flex-direction: row;
        justify-content: center;
        overflow-y: scroll;
        box-sizing: border-box;
        .modelContent{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: 54px;
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

            .right{
                border-radius: 8px;
                padding: 19px;
                box-sizing: border-box;
                background-color: white;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                img{
                    $profileEdge: 88px;
                    min-width: $profileEdge;
                    min-height: $profileEdge;
                    max-width: $profileEdge;
                    max-height: $profileEdge;
                    border-radius: 50%;
                    overflow: hidden;
                }
                .author_name{
                    height: 38px;
                    width: 100%;
                    margin-top: 10px;
                    color: #1a1a1a;
                    font-size: 16px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 200px;
                    height: 38px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                .dm_Button{
                    $buttonWidth:70px;
                    padding: 0px 5px;
                    max-width: $buttonWidth;
                    min-width: $buttonWidth;
                    height: 38px;
                    box-sizing: border-box;
                    background-color: #00AEEC;
                    color: white;
                    margin-top: 20px;
                    outline: none;
                    border: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    svg{
                        width: 16px;
                        height: 16px;
                        margin-right: 3px;
                    }
                    &:hover{
                        background-color: #69bad8;
                    }
                }
            }
            
            @media screen and (min-width: 1100px) {
                .left{
                    $leftWidth: 680px;
                    max-width: $leftWidth;
                    min-width: $leftWidth;
                }

                .right{
                    $rightWidth:300px;
                    max-width: $rightWidth;
                    min-width: $rightWidth;
                    height: 220px;
                }
            }
            @media screen and (max-width: 1100px){
                flex-direction: column-reverse;
                align-items: center;
                .left{
                    margin-top: 20px;
                }
                .right{
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: flex-start;
                    position: relative;
                    .author_name{
                        flex-grow: 1;
                        margin: 10px  20px;
                        justify-content: flex-start;
                    }
                    .dm_Button{
                        float: right;
                        margin-top: 0px;
                        align-self: center;
                    }
                }
            }
            @media screen and (max-width: 1100px) and (min-width: 700px){
                .left{
                    margin-right: 0px;
                    max-width: 680px;
                    min-width: 680px;
                }
                .right{
                    max-width: 680px;
                    min-width: 680px;
                    max-height: 150px;
                    min-height: 150px;
                }
            }

            @media screen and (max-width: 700px) {
                
                .left{
                    margin-top: 20px;
                    margin-right: 0px;
                    width: 100%;
                }
                .right{
                    width: 100%;
                    max-height: 150px;
                    min-height: 150px;
                    flex-direction: row;
                }
            }
        }
    }
</style>
<style lang="scss">
    .newWorkModelBox{
        &.el-dialog{
            background-color: rgba($color: #ffffff, $alpha: 0.7);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .el-dialog__header{
                display: none;
            }
            .close{
                $closeEdge:25px;
                width: $closeEdge;
                height: $closeEdge;
                position: absolute;
                background-image: url(icons/pureClose.svg);
                background-size: 100%;
                top: 0px;
                right: 0px;
                cursor: pointer;
            }

            .el-dialog__body{
                width: 100%;
                padding: 0px;
                display: flex;
                position: relative;
            }
        }
    }
</style>