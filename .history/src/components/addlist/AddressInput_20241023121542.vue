<template>
  <div class="mask">
    <div class="background">
      <input type="text" v-model="address" placeholder="输入地址" @keydown.enter="locatePlace" />
      <GMapMap :center="center" :zoom="zoom"
      style="width: 100%; height: 500px;">
      <GMapMarker :position="center" />
    </GMapMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义响应式变量
const address = ref('');
const center = ref({ lat: 25.033964, lng: 121.564468 }); // 默认中心点 (台北101)
const zoom = ref(15);

// 原生 Geocoder
const geocoder = new google.maps.Geocoder();

// 定位方法：当用户按下回车键时调用此方法
const locatePlace = () => {
  geocoder.geocode({ address: address.value }, (results, status) => {
    if (status === 'OK' && results.length > 0) {
      // 将地图中心设置为地址对应的经纬度
      center.value = results[0].geometry.location;
    } else {
      alert('未找到该地址');
    }
  });
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

    GMapMap{
      
    }
  }
}
</style>