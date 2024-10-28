<template>
  <div class="mask">
    <div class="background">
      <p>混合支付金額設定</p>
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

    >p {
      text-align: center;
      font-size: 25px;
      background-color: rgb(255, 243, 204);
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
        width: 75%;
      }
    }

    .result {
      display: flex;
      flex-direction: row;
      gap: 10px;
      justify-content: flex-end;
      padding-top: 2px;

      >div {
        border: 1px solid black;
        height: 30px;
        width: 50px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(255, 243, 204);
        cursor: pointer;

        &.cancel {
          background-color: white;
        }
      }
    }
  }
}
</style>