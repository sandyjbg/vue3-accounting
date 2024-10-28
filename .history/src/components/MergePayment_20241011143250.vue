<template>
  <div class="background">
    <div v-for="option in props.mergePayment">
      <p>{{ option }}</p>
      <n-input v-model:value="value" type="text" placeholder="基本的 Input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
  mergePayment:{
    type: Array,
    required: true
  }
})
const value = ref(0)


</script>

<style scoped lang="scss">
.background {
  position: absolute;
  width: 300px;
  height: 100px;
  background-color: white;
  top: 14%;
  right: 42%;
}
</style>