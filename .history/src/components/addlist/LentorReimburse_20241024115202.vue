<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <p class="selected">報銷</p>
        <p>借用</p>
      </div>
      <div class="reimburseDetail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.336);
  top: 130px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;

  .background {
    position: absolute;
    background-color: white;
    height: 500px;
    width: 400px;
    border-radius: 3px;
    top: 190px;
    right: 45px;
    padding: 20px;

    .whichOne {
      display: flex;
      flex-direction: row;
      font-size: 16px;
      gap: 10px;

      >p {
        &.selected {
          color: rgb(255, 103, 103);
          border-bottom: 2px solid rgb(255, 103, 103);
        }
      }


    }
  }
}
</style>