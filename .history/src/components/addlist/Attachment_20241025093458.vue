<template>
  <div class="mask">
    <div class="background">
      <input type="file" @change="onFileChange" />
    <div v-if="fileData">
      <p>檔案名稱: {{ fileData.name }}</p>
      <p>檔案大小: {{ fileData.size }} bytes</p>
      <p>檔案類型: {{ fileData.type }}</p>
    </div>
    <img v-if="imageUrl" :src="imageUrl" alt="Image Preview" style="max-width: 300px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fileData = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

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

const props = defineProps({
  closeAddressInput: {
    type: Function,
    required: true
  }
})

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
    height: 285px;
    width: 400px;
    border-radius: 3px;
    top: 190px;
    right: 45px;
    padding: 20px;
  }
}
</style>