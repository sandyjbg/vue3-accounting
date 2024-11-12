<template>
  <div class="mask">
    <div class="background">
      <div class="top">
        <p>檔案上傳</p>
        <p>(我很小氣，只給你上傳一個)</p>
        <n-icon :component="CloseFilled" @click="closeAttachmentModel()" />
      </div>
      <input type="file" @change="onFileChange" />
      <div class="fileData" v-if="fileData">
        <p>檔案名稱: {{ fileData.name }}</p>
        <p>檔案大小: {{ fileData.size }} bytes</p>
        <p>檔案類型: {{ fileData.type }}</p>
      </div>
      <div class="img">
        <img v-if="imageUrl" :src="imageUrl" alt="Image Preview" style="max-width: 300px;" />
      </div>
      <p class="upLoad" @click="uploadFile">上傳</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseFilled } from '@vicons/material'
import { useMessage } from 'naive-ui'
import { useAccountingStore } from '@/stores/accountingStore';

const accountingStore = useAccountingStore();
const message = useMessage()
const fileData = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

const props = defineProps({
  closeAttachmentModel: {
    type: Function,
    required: true
  },
  recordId: {
    type: Number,
    required: true
  }
})

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;

  if (file) {
    fileData.value = file;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        imageUrl.value = reader.result as string;
      };
    }
  }
};

const emits = defineEmits(['fileSelected'])

const uploadFile = () => {
  if (fileData.value) {
    emits('fileSelected', { file: fileData.value, imageUrl: imageUrl.value })
    console.log(fileData.value)
    props.closeAttachmentModel()
  } else {
    message.warning('請選擇一個文件')
  }
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
    top: 130px;
    right: 45px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      >p {
        &:nth-child(1) {
          color: rgb(255, 103, 103);
          border-bottom: 2px solid rgb(255, 103, 103);
          font-size: 16px;
        }

        &:nth-child(2) {
          font-size: 14px;
          padding-right: 80px;
        }
      }

      .n-icon {
        font-size: 20px;
        cursor: pointer;
      }
    }

    .fileData {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .img {
      display: flex;
      justify-content: center;
    }

    .upLoad {
      display: flex;
      justify-content: center;
      padding: 2px 8px;
      background-color: rgb(255, 103, 103);
      border-radius: 3px;
      font-size: 15px;
      cursor: pointer;
    }
  }
}
</style>