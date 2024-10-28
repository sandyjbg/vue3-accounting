<template>
  <div class="happy" v-for="a in b">
    <div class='border'>{{ a.name }}-{{ a.gas }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { Search32Filled } from '@vicons/fluent'
import * as echarts from 'echarts'

const b = [{ name: 'aaa', gas: 'aaafart' }, { name: 'bbb', gas: 'bbbfart' }]
onMounted(() => {
})
</script>

<style scoped lang="scss">
.border{
  border: black 1px solid;
}
</style>
