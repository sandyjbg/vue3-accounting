<template>
  <div class="mask">
    <div class="paymentList">
      <n-checkbox-group v-model:value="cities">
        <p>最多只能選擇兩種支付方式</p>
        <n-checkbox value="Beijing" label="現金" />
        <n-checkbox value="Shanghai" label="信用卡" />
        <n-checkbox value="Guangzhou" label="金融卡" />
        <n-checkbox value="Shenzen" label="悠遊卡" />
      </n-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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

  .n-checkbox-group {
    display: flex !important;
    flex-direction: column !important;
  }
}
</style>