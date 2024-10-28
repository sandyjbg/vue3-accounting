<template>
  <div class="mask">
    <div class="background">
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.336);
  top: 100px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;

  .background{
    position: absolute;
    background-color:white;
    height:200px;
    width:400px;
  }
}
</style>