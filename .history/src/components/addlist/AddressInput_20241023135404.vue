<template>
  <div class="mask">
    <div class="background">
      <div class="top">
        <div class="inputWrap">
          <n-icon :component="LocationOnRound" />
          <input class="input" type="text" v-model="address" placeholder="請输入地址或地點名稱" @keydown.enter="locatePlace" />
        </div>
        <n-icon :component="CloseFilled" @click="closeAddressInput()"/>
      </div>
      <GMapMap :center="center" :zoom="zoom" style="width: 100%; height: 200px; padding:20px;">
        <GMapMarker :position="center" />
      </GMapMap>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LocationOnRound, CloseFilled } from '@vicons/material'

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

const props = defineProps({
  closeAddressInput:{
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

    .top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 15px;

      .inputWrap {
        display: flex;
        gap: 10px;
        align-items: center;

        .n-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          color: rgb(255, 103, 103);
          font-size: 25px;
        }

        .input {
          width: 200px;
          height: 30px;
          border-radius: 3px;
          border: 1px black solid;
        }

        .input::placeholder {

        }

        .input:focus{
          padding-left: 10px;
        }
      }

      .n-icon {
        font-size: 20px;
        cursor:pointer;
      }
    }
  }
}
</style>