<template>
  <div class="background">
    <div class="eachPayment" v-for="(option, index) in props.mergePayment" :key="index">
      <p>{{ option }}</p>
      <n-input v-model:value="inputValues[index]" type="text" :placeholder="`${option}支出金額`" />
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
  width: 400px;
  background-color: white;
  top: 14%;
  right: 42%;
  display: flex;
  flex-direction: column;
  gap:10px;

  .eachPayment {
    display: flex;
    flex-direction: row;

    >p{
      width:15%;
    }

    :deep(.n-input) {
      --n-height: 20px !important;
      width:80%;
    }
  }
}
</style>