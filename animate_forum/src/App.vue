<template>
  <div class="main">
    <HeaderComponent></HeaderComponent>
    <div class="wrapper">
      <KeepAlive>
        <router-view></router-view>
      </KeepAlive>
    </div>
    <BottomComponent></BottomComponent>
  </div>
  <detailPage></detailPage>
</template>

<script setup>
  import HeaderComponent from "/src/components/HeaderComponent.vue"
  import BottomComponent from "/src/components/BottomComponent.vue"
  import detailPage from "/src/views/detailPage.vue"
</script>

<style lang="scss" scoped>
  .main{
    overflow: hidden;
    position: relative;
    z-index: 1;
    background-color: #17181A;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .wrapper{
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      overflow: hidden;
    }
  }
</style>
