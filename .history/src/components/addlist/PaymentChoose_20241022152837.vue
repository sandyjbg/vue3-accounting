<template>
  <div class="mask">
    <div class="paymentList">
      <n-checkbox-group v-model:value="cities">
        <div class="top">
          <p>最多只能選擇兩種支付方式</p>
          <n-checkbox v-for="payment in paymentEndLists" :value="payment.key" :label="payment.label"
            :disabled="payment.disabled" />
        </div>
        <div class="bottom">
          <p>確定</p>
          <p>取消</p>
        </div>
      </n-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const cities = ref<String[]>([])
const props = defineProps({
  paymentList: {
    type: Array,
    required: true
  }
})

const paymentLists = props.paymentList.slice(0, -1)
const paymentEndLists = ref(paymentLists.map((item: any) => ({
  ...item,
  disabled: false
})))

watch(cities, (newValue) => {
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
    padding: 0 12px;

    .n-checkbox-group {
      width: 100%;
      height: calc(100% - 22.39px);
      display: flex !important;
      flex-direction: column !important;

      .top {
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-evenly !important;

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

        >p {}

      }
    }
  }
}
</style>