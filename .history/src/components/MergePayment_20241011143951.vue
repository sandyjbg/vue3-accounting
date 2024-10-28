<template>
  <div class="background">
    <div class="eachPayment" v-for="(option, index) in props.mergePayment" :key="index">
      <p>{{ option }}</p>
      <n-input v-model:value="inputValues[index]" type="text" placeholder="基本的 Input" />
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

  .eachPayment {
    display: flex;
    flex-direction: row;

    .n-input{
      --n-height: 20px !important;
    }
  }
}
</style>