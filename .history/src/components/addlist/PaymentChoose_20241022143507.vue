<template>
  <div class="mask">
    <div class="paymentList">
      <n-checkbox-group v-model:value="cities">
        <p>最多只能選擇兩種支付方式</p>
        <n-checkbox v-for="payment in props.paymentList" :value="payment.key" :label="payment.label" />
      </n-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref , onMounted} from 'vue'
const cities = ref([])
const props = defineProps({
  paymentList: {
    type:Array,
    required:true
  }
})

console.log(cities.value)
</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(255, 255, 255);
  top: 486px;
  right: 945px;
  height: 179px;
  width: 196px;
  border-radius: 3px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05);

  .paymentList {
    width: 100%;
    height: 100%;
    padding: 0 12px;

    .n-checkbox-group {
      width: 100%;
      height: 100%;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-evenly !important;

      >p {
        color: white;
        background-color: rgb(255, 103, 103);
        padding-left:1px;
      }

      .n-checkbox {
        --n-border-checked: 1px solid rgb(255, 103, 103) !important;
        --n-border-focus: 1px solid rgb(255, 103, 103) !important;
        --n-box-shadow-focus: 0 0 0 2px transparent !important;
        --n-color-checked: rgb(255, 103, 103) !important;
      }
    }
  }
}
</style>