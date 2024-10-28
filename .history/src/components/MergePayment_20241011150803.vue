<template>
  <div class="background">
    <p>混合支付金額設定</p>
    <div class="eachPayment" v-for="(option, index) in props.mergePayment" :key="index">
      <p>{{ option + '：' }}</p>
      <n-input v-model:value="inputValues[index]" type="text" :placeholder="`${option}支出金額`" />
    </div>
    <div class="result">
      <div class="confirm">確定</div>
      <div class="cancel">取消</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  mergePayment: {
    type: Array,
    required: true
  }
})
const inputValues = ref(Array(props.mergePayment.length).fill(''))

</script>

<style scoped lang="scss">
.background {
  position: absolute;
  width: 300px;
  background-color: white;
  top: 14%;
  right: 42%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px 25px;
  border-radius: 5px;
  // background-color: rgb(255, 244, 230);
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.356);

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

      &.cancel{
        background-color: gray;
      }
    }
  }
}
</style>