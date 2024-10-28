<template>
  <div class="box">
    <div class="background">
      <div class="top">資產管理</div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import FooterBar from './../components/FooterBar.vue'

</script>

<style scoped lang="scss">
.box {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  font-weight: 300;
  font-size: 15px;

  .background {
    width: 500px;
    background-color: rgb(255, 244, 230);
    display: flex;
    flex-direction: column;

    .top {
      height: 100px;
      width: 500px;
      background-color: rgb(255, 103, 103);
      font-size: 40px;
      letter-spacing: 5px;
      color: white;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
