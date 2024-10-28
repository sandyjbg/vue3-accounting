<template>
  <div class="background">
    <div @click="router.push('/')">
      <n-icon :class="isActive('/') ? 'active' : ''" :component="ListAltFilled" />
    </div>
    <div @click="router.push('/CalenderView')">
      <n-icon :class="isActive('/CalenderView') ? 'active' : ''" :component="CalendarMonthRound" />
    </div>
    <div @click="router.push('/Addlist')">
      <n-icon class="plusBtn" :component="PlusOutlined" />
    </div>
    <div @click="router.push('/ChartsView')">
      <n-icon :class="isActive('/ChartsView') ? 'active' : ''" :component="PieChartSharp" />
    </div>
    <div @click="router.push('/CardManagement')">
      <n-icon :class="isActive('/CardManagement') ? 'active' : ''" :component="CreditCardRound" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListAltFilled, PlusOutlined, CalendarMonthRound, PieChartSharp, CreditCardRound } from '@vicons/material'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isActive = (path: String) => route.path === path
</script>

<style scoped lang="scss">
.background {
  position: absolute;
  width: 500px;
  height: 100px;
  background-color: rgb(255, 103, 103);
  top: 728px;
  right: 624px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  .n-icon {
    font-size: 26px;
    color: rgb(255, 103, 103);
    width: 45px;
    height: 45px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;

    &.plusBtn {
      width: 60px;
      height: 60px;
      font-size: 45px;
      color: white;
      background-color: #ffa743;
    }

    &.active {
      background-color: rgb(255, 60, 60);
      color: white;
    }
  }
}
</style>
