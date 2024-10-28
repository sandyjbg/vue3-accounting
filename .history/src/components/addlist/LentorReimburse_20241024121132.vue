<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <p class="selected">報銷</p>
        <p>借用</p>
      </div>
      <div class="reimburseDetail">
        <div class="status">
          <n-space>
            狀態：<n-switch v-model:value="checkStrategyIsChild" />已報銷
          </n-space>
        </div>
        <div class="info">
          <div class="inputWrap">
            <p>報銷用戶</p>
            <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const checkStrategyIsChild = ref('')
</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.336);
  top: 100px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;
  font-weight: bolder;

  .background {
    position: absolute;
    background-color: white;
    height: 500px;
    width: 400px;
    border-radius: 3px;
    top: 130px;
    right: 45px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .whichOne {
      display: flex;
      flex-direction: row;
      font-size: 16px;
      gap: 15px;

      >p {
        cursor: pointer;

        &.selected {
          color: rgb(255, 103, 103);
          border-bottom: 2px solid rgb(255, 103, 103);
        }
      }
    }

    .reimburseDetail {
      display:flex;
      flex-direction:column;
      gap:15px;

      .status {
        background-color: rgb(255, 242, 199);
        padding: 5px 10px;
        border-radius: 3px;

        .n-switch {
          --n-box-shadow-focus: transparent !important;
        }
      }

      .info {
        display: flex;
        flex-direction: column;

        .inputWrap {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
}
</style>