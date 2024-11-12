<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <div class="left">
          <p>自定義詳情</p>
        </div>
        <n-icon @click="closeCustomizeModal()" :component="CloseFilled" />
      </div>
      <div class="content">
        <div class="eachDetail" v-for="(value, index) in number" :key="index">
          <n-input v-model:value="topicValue[index]" class="inputTopic" type="text" placeholder="標題" />
          <p>：</p>
          <n-input v-model:value="contentValue[index]" class="inputContent" type="text" placeholder="內容" />
          <n-icon @click="addDetail" :component="AddCircleOutlined" />
          <n-icon @click="removeDetail(index)" :component="RemoveCircleFilled" />
        </div>
        <div class="textarea">
          <n-input v-model:value="value" type="textarea" placeholder="其他" />
        </div>
      </div>
      <div class="confirm">
        <p @click="confirmMoreDetail">確定</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { CloseFilled, AddCircleOutlined, RemoveCircleFilled } from '@vicons/material'

const props = defineProps({
  closeCustomizeModal: {
    type: Function,
    required: true
  }
})

const topicValue = ref<string[]>([])
const contentValue = ref<string[]>([])
const value = ref('')
const number = ref(1)

for (let i = 1; i <= number.value; i++) {
  topicValue.value[i] = ''
  contentValue.value[i] = ''
}

function addDetail() {
  number.value += 1;
  topicValue.value.push(''); 
  contentValue.value.push(''); 
}

function removeDetail(index: number) {
  number.value -= 1
  topicValue.value.splice(index, 1)
  contentValue.value.splice(index, 1)
}

const result = computed(() => {
  return topicValue.value.map((topic, index) => {
    return topic && contentValue.value[index] ? { [topic]: contentValue.value[index] } : null;
  }).filter(item => item !== null); // 過濾空鍵值的對象
});

const emit = defineEmits(['commitMoreDetail'])

function confirmMoreDetail() {
  emit('commitMoreDetail', [result.value, value.value])
}

</script>

<style scoped lang="scss">
.mask {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.336);
  top: 100px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;

  .background {
    position: absolute;
    background-color: white;
    height: auto;
    width: 400px;
    border-radius: 3px;
    top: 190px;
    right: 45px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .whichOne {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        gap: 15px;

        >p {
          color: rgb(255, 103, 103);
          border-bottom: 2px solid rgb(255, 103, 103);
        }
      }

      .n-icon {
        font-size: 25px;
        cursor: pointer;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .eachDetail {
        display: flex;
        flex-direction: row;
        align-items: center;

        .n-input {
          --n-caret-color: black !important;
          --n-border-hover: 1px solid rgb(224, 224, 230) !important;
          --n-border-focus: 1px solid rgb(224, 224, 230) !important;
          --n-box-shadow-focus: transparent !important;

          &.inputTopic {
            width: 30%;
          }
        }

        .n-icon {
          font-size: 25px;
          margin-left: 8px;
          color: rgb(255, 103, 103);
          cursor: pointer;
        }
      }

      .textarea {
        .n-input {
          --n-caret-color: black !important;
          --n-border-hover: 1px solid rgb(224, 224, 230) !important;
          --n-border-focus: 1px solid rgb(224, 224, 230) !important;
          --n-box-shadow-focus: transparent !important;
        }
      }
    }

    .confirm {
      display: flex;
      justify-content: center;

      >p {
        background-color: rgb(255, 103, 103);
        padding: 5px 8px;
        border-radius: 3px;
        width: 45px;
        color: white;
      }
    }
  }
}
</style>