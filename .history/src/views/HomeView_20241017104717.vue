<template>
  <draggable v-model="b" class="dragArea" @end="onEnd">
    <div class="happy" v-for="a in b" :key="a.name">
      <div class='border'>{{ a.name }}-{{ a.gas }}</div>
    </div>
  </draggable>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { Search32Filled } from '@vicons/fluent'
import * as echarts from 'echarts'
import draggable from 'vuedraggable'

const b = [{ name: 'aaa', gas: 'aaafart' }, { name: 'bbb', gas: 'bbbfart' }]

const onEnd = (event: any) => {
  console.log('拖曳结束后的数据:', b)
}

onMounted(() => {
})
</script>

<style scoped lang="scss">
.border {
  border: black 1px solid;
}
</style>
