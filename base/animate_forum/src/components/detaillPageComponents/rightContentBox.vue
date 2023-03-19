<template>
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
</template>

<script setup>
    import { storeToRefs } from "pinia";
    import useGlobal from "/src/global";
    import { useRouter } from "vue-router";

    const router = useRouter();
    const global = useGlobal();
    const store = global.Pinia;
    const detailPage = global.detailPage;
    const ServerPath = global.ServerPath;
    const { userinfo } = storeToRefs(store);
    const { dataMode, table, search_id, author_id, author_name, author_profile, recomment, imgArr, title, price, sold_num, requireTail } = storeToRefs(detailPage);

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
</script>

<style lang="scss" scoped>
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
    
    @media screen and (min-width: 1100px) {
        img{margin-top: 16px;}
    }
    
    @media screen and (max-width: 1100px){
        .author_name{
            flex-grow: 1;
            margin: 10px  20px;
            justify-content: flex-start;
        }

        .dm_Button{
            margin-top: 0px;
        }
    }
</style>