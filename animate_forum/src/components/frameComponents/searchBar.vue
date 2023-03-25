<template>
    <div class="search-bar" :class="{'search-bar-change-search': isChangeSearch, 'hide': searchBarHide}">
        <input type="text" placeholder="请输入关键字"
            v-model="searchContent"
            @keyup.enter="triggerSearch"
            @focusin="changeStyle"
            @focusout="changeStyle"
        >
    </div>
</template>

<script setup>
    import useGlobal from '/src/global';
    import { useRouter } from "vue-router"
    import { ref, defineProps, defineEmits } from 'vue';
    
    const props = defineProps({isChangeSearch:Boolean});
    const emits = defineEmits(["changeStyle"]);
    const global = useGlobal();

    /**********点击时改变header的样式**********/
    function changeStyle(){
        emits("changeStyle");
    }

    /**********控制显示searchBar**********/
    const router = useRouter();
    const hidePageArr=["newWork","trends","showcase","require"]//要显示searchBar的页面名字
    const searchBarHide=ref(false);//控制searchBar的hide样式
    router.afterEach((to,from)=>{//后置路由守卫
        if(hidePageArr.indexOf(to.name)>=0){searchBarHide.value=false;}
        else{searchBarHide.value=true;}
    })

    /**********搜索功能**********/
    const searchContent = ref("");//搜索框内的内容
    const Bus = global.Bus;//从全局属性里获取事件总线
    function triggerSearch(){//发出搜索全局事件
        Bus.emit("searchEvent", searchContent.value);
    }

</script>

<style lang="scss" scoped>
    .search-bar{
        height: 40px;
        display: flex;
        width: 100%;
        max-width: 400px;
        padding-left: 16px;
        border-radius: 4px;
        border: none;
        transition: opacity .2s ease-out;
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
            background-image: url("/icons/search.svg");
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

        &.hide{
            opacity: 0;
            pointer-events: none;
        }
    }

    .search-bar-change-search{
        max-width: 100%;
        transition: 0.4s;
        box-shadow: 0 0 0 1px rgba(113 119 144 / 25%);
        padding-left: 0;
    }
</style>