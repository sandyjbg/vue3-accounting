<template>
  <div>
    <input type="file" @change="onFileChange" />
    <div v-if="fileData">
      <p>檔案名稱: {{ fileData.name }}</p>
      <p>檔案大小: {{ fileData.size }} bytes</p>
      <p>檔案類型: {{ fileData.type }}</p>
    </div>
    <img v-if="imageUrl" :src="imageUrl" alt="Image Preview" style="max-width: 300px;" />
  </div>
</template>

<script lang="ts" setup>
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
</script>