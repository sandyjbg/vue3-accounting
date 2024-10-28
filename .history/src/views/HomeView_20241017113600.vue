<template>
  <draggable v-model="b">
    <template #item="{ element }">
      <div class="happy">
        <div class='border'>{{ element.name }} - {{ element.gas }}</div>
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import draggable from 'vuedraggable'

const b = [{ name: 'aaa', gas: 'aaafart' }, { name: 'bbb', gas: 'bbbfart' }]

onMounted(() => {
})
</script>

<style scoped lang="scss">
.border {
  border: black 1px solid;
  padding: 5px;
  margin-bottom: 5px;
}
</style>