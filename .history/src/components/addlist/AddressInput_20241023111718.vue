<template>
  <div class="mask">
    <div class="background">
      <input type="text" v-model="address" placeholder="輸入地址" @keydown.enter="locatePlace" />
    <GMapMap
      :center="center"
      :zoom="zoom"
      style="width: 100%; height: 500px;"
    >
      <GMapMarker :position="center" />
    </GMapMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGeocoder } from '@fawmi/vue-google-maps';

// 定义响应式变量
const address = ref('');
const center = ref({ lat: 25.033964, lng: 121.564468 }); // 默认中心点 (台北101)
const zoom = ref(15);

// 使用地理编码器（Geocoder）
const { geocode } = useGeocoder();

// 定位方法：当用户按下回车键时调用此方法
const locatePlace = async () => {
  try {
    // 调用 geocode 函数，根据地址获取地理坐标
    const response = await geocode({ address: address.value });
    if (response.results.length > 0) {
      // 将地图中心设置为地址对应的经纬度
      center.value = response.results[0].geometry.location;
    } else {
      alert('未找到該地址');
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
  }
};

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
    height: 200px;
    width: 400px;
    border-radius: 3px;
    top:190px;
    right:45px;
  }
}
</style>