<template>
  <div class="mask">
    <div class="background">
      <div class="top">
      <p>混合支付金額設定</p>
      <n-icon :component="CloseFilled" @click="closeMergeAmountModel()" />
      </div>
      <div class="eachPayment" v-for="(option, index) in props.paymentList" :key="index">
        <p>{{ option + '：' }}</p>
        <n-input v-model:value="inputValues[index]" type="text" :placeholder="`${option}支出金額`" />
      </div>
      <div class="result">
        <div class="confirm">確定</div>
        <div class="cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseFilled } from '@vicons/material'

const inputValues = ref('')
const props = defineProps({
  paymentList:{
    type: Array,
    required: true
  },
  closeMergeAmountModel:{
    type: Function,
    required: true
  }
})
</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.336);
  top: 100px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;

  .background {
    position: absolute;
    background-color: white;
    height: 285px;
    width: 400px;
    border-radius: 3px;
    top: 190px;
    right: 45px;
    padding: 20px;
    display:flex;
    flex-direction: column;
    gap:15px;

    .top{
      display:flex;
      align-items: center;
      justify-content: space-between;

      >p {
        color: rgb(255, 103, 103);
        border-bottom: 2px solid rgb(255, 103, 103);
        font-size: 16px;
      }

      .n-icon{
        font-size:20px;
        cursor:pointer;
      }
    }

    .eachPayment {
      display: flex;
      flex-direction: row;
      gap: 5px;
      align-items: center;

      >p {
        width: 30%;
        font-size: 15px;
      }

      :deep(.n-input) {
        --n-height: 40px !important;
        --n-caret-color: black !important;
        --n-border-hover:1px solid rgb(224, 224, 230) !important;
        --n-border-focus:1px solid rgb(224, 224, 230) !important;
        width: 75%;
      }
    }

    .result {
      display: flex;
      flex-direction: row;
      gap: 10px;
      justify-content: center;
      padding-top: 2px;

      >div {
      color:white;
        height: 30px;
        width: 50px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(255, 103, 103);
        cursor: pointer;

        &.cancel {
          background-color: rgb(255, 103, 103);
        }
      }
    }
  }
}
</style>