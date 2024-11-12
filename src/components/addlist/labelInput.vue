<template>
  <div class="mask" @click="handleClickOutside">
    <div class="background" @click.stop>
      <div class="information">
        <p>空白區 (不含本彈窗) 點擊即存新標籤</p>
        <n-icon class="topic" :component="CloseFilled" @click="close()" />
      </div>
      <div class="wholeTag">
        <div v-for="(info, index) in tags" :key="index"
          :class="['eachTag', selectedTags.includes(info) ? 'selected' : '']" @click="choose(index)">
          <p>{{ info }}</p>
          <n-icon class="delete" :component="CloseFilled" @click="deletethings(index)" />
        </div>
        <div v-if="showInput" class="eachTag">
          <input type="text" v-model="newInput" ref="input" />
          <n-icon class="delete" :component="CloseFilled" @click="showInput = false" />
        </div>
        <n-icon :component="PlusTwotone" @click="showInput = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue';
import { CloseFilled, PlusTwotone } from '@vicons/material'

const props = defineProps({
  closeLabelInput: {
    type: Function,
    required: true
  },
  initialData: {
    type: Array,
    required: false
  }
})

const showInput = ref(false)
const newInput = ref('')
const input = ref<HTMLElement | null>(null)
const tags = ref(['好好吃'])
const selectedTags = ref(props.initialData || [])

function deletethings(index: number) {
  tags.value.splice(index, 1)
}

function choose(index: number) {
  const selectedTag = tags.value[index]
  const tagIndex = selectedTags.value.indexOf(selectedTag)

  if (tagIndex === -1) {
    selectedTags.value.push(selectedTag)
  } else {
    selectedTags.value.splice(tagIndex, 1)
  }
}

function handleClickOutside(event: MouseEvent) {
  if (input.value && !input.value.contains(event.target as Node)) {
    input.value.blur()
    if (newInput.value) {
      tags.value.push(newInput.value)
      newInput.value = ''
      showInput.value = false
    } else {
      showInput.value = false
    }
  }
}

const emit = defineEmits(['commitLabels'])

function close() {
  props.closeLabelInput()
  commitLabel()
}

function commitLabel() {
  emit('commitLabels', selectedTags.value)
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
input {
  background-color: transparent;
  border: transparent;
  font-size: 14px;
  width: 30px;

  &:focus {
    outline: none;
    border: transparent;
  }
}

.mask {
  position: absolute;
  top: 100px;
  right: 710px;
  height: calc(100% - 100px);
  width: 500px;
  color: rgb(71, 71, 71);

  .background {
    position: absolute;
    background-color: white;
    height: auto;
    width: 280px;
    border-radius: 3px;
    top: 384px;
    right: 41px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 2px 2px 10px 2px rgba(90, 90, 90, 0.5);

    .information {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      >p {
        padding: 0 5px;
        background-color: rgb(255, 103, 103);
        color: white;
      }

      .topic {
        background-color: transparent;
        color: black;
        font-size: 15px;
        cursor: pointer;
      }
    }

    .wholeTag {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .eachTag {
        background-color: rgb(211, 211, 211);
        height: 27px;
        padding: 2px 5px;
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: rgb(172, 172, 172);
        }

        &.selected {
          background-color: rgb(172, 172, 172);
        }

        .delete {
          width: 15px;
          height: 15px;
          font-size: 15px;
          color: black;
          margin-top: 0;

          &:hover {

            border-radius: 50%;
            background-color: rgb(68, 68, 68);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
        }
      }

      .n-icon {
        font-size: 20px;
        width: 25px;
        height: 25px;
        margin-top: 3px;
        background-color: rgb(211, 211, 211);
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>