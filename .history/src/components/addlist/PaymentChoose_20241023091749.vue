<template>
  <div class="mask">
    <div class="paymentList">
      <n-checkbox-group v-model:value="payment">
        <div class="top">
          <p>最多只能選擇兩種支付方式</p>
          <n-checkbox v-for="payment in paymentEndLists" :value="payment.key" :label="payment.label"
            :disabled="payment.disabled" />
        </div>
        <div class="bottom">
          <p @click="confirm()">確定</p>
          <p @click="paymentClose()">取消</p>
        </div>
      </n-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const payment = ref<String[]>([])

const props = defineProps({
  paymentList: {
    type: Array,
    required: true
  },
  paymentClose: {
    type: Function,
    required: true
  },
  paymentConfirm:{
    type:Function,
    required: true
  }
})

const paymentLists = props.paymentList.slice(0, -1)
const paymentEndLists = ref(paymentLists.map((item: any) => ({
  ...item,
  disabled: false
})))

watch(payment, (newValue) => {
  if (newValue.length >= 2) {
    paymentEndLists.value = paymentEndLists.value.map((item: any) => ({
      ...item,
      disabled: !newValue.includes(item.key)
    }))
  } else {
    paymentEndLists.value = paymentEndLists.value.map((item: any) => ({
      ...item,
      disabled: false
    }))
  }
})

const emit = defineEmits(['commitMergePayment'])

function confirm(){
 emit('commitMergePayment', payment.value)
}
</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(255, 255, 255);
  top: 486px;
  right: 945px;
  height: 190px;
  width: 196px;
  border-radius: 3px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05);

  .paymentList {
    width: 100%;
    height: 100%;
    padding: 10px 12px;

    .n-checkbox-group {
      width: 100%;
      height: 100%;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;

      .top {
        height: calc(100% - 22.39px);
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;

        >p {
          color: white;
          background-color: rgb(255, 103, 103);
          padding-left: 1px;
        }

        .n-checkbox {
          --n-border-checked: 1px solid rgb(255, 103, 103) !important;
          --n-border-focus: 1px solid rgb(255, 103, 103) !important;
          --n-box-shadow-focus: 0 0 0 2px transparent !important;
          --n-color-checked: rgb(255, 103, 103) !important;
        }
      }

      .bottom {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 10px;

        >p {
          border: 1px solid rgb(188, 188, 194);
          padding: 0 5px;
          border-radius: 3px;
          cursor: pointer;
        }

      }
    }
  }
}
</style>