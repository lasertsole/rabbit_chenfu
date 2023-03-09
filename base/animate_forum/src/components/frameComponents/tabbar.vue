<template>
    <el-popover popper-class="tabbarBox"
        v-for="(item, index) in linkArr"
        placement="bottom"
        :width="100"
        trigger="hover"
        :show-after="0"
        :hide-after="0"
    >
        <ul>
            <li v-for="(childItem, childIndex) in item.childLinkArr">
                <router-link class="tabbarChildItem" active-class="active" :to="childItem.linkTo">{{childItem.name}}</router-link>
            </li>
        </ul>
        <template #reference>
            <router-link class="tabbarItem" active-class="active" :to="item.linkTo">{{item.name}}</router-link>
        </template>
  </el-popover>
</template>

<script setup>
    import { ref, defineProps, defineEmits } from 'vue';
    const props = defineProps({linkArr:Object});
</script>

<style lang="scss" scoped>
    .tabbarItem{
        padding: 20px 30px;
        text-decoration: none;
        color: #96A4A9;
        border-bottom: 2px solid transparent;
        transition: 0.3s;
        @media screen and (max-width: 610px) {
            display: none;
        }

        &.active{
            color: #ffffff;
            border-bottom: 2px solid #ffffff;
        }
    }

    .tabbarChildItem{
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #333333;
        border-radius: 6px;
        @media screen and (max-width: 610px) {
            display: none;
        }

        &.active{
            color: #00e3fc;
        }

        &:hover{
            transition: all .6s ease-out;
            background-color: rgba($color: #000000, $alpha: .05);
        }
    }
</style>