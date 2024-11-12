<template>
  <div class="box">
    <div class="background">
      <div class="top">統計圖表</div>
      <div class="content">
        <div class="categoryChart">
          <div class="choosing">
            <p>分類佔比</p>
            <div>
              <div>日</div>
              <div class="active">月</div>
              <div>年</div>
            </div>
          </div>
          <div class="initPieChart" id="category"></div>
          <div class="detailBtn">
            <p @click="router.push('/ChartsDetail')">明 細</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import * as echarts from 'echarts'
import FooterBar from './../components/FooterBar.vue'
import { useAccountingStore } from '@/stores/accountingStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const accountingStore = useAccountingStore()
const lists: any = ref([])

const initPieChart = async (id: string) => {
  await nextTick();
  const chartDom = document.getElementById(id)!;
  if (!chartDom) return;

  const result = lists.value.reduce((array: any, item: any) => {
    if (array[item.category]) {
      array[item.category].amount += Number(item.amount)
    } else {
      array[item.category] = { category: item.category, amount: Number(item.amount), color: item.color }
    }
    return array
  }, {})

  const data = Object.values(result).map((item: any) => ({
    name: item.category,
    value: Number(item.amount)
  }))

  const color = Object.values(result).map((item: any) => (item.color))

  let option = {
    tooltip: {
      trigger: 'item'
    },
    color: color,
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  if (typeof echarts.getInstanceByDom(chartDom) === 'undefined') {
    echarts.dispose(chartDom);
    let myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
    window.addEventListener('resize', function () {
      setTimeout(() => {
        myChart.resize();
      }, 300);
    });
  } else {
    // @ts-ignore
    echarts.dispose(chartDom);
    echarts.init(chartDom);
    if (!chartDom) return;
    option && echarts.getInstanceByDom(chartDom)?.setOption(option);
  }
};

onMounted(() => {
  initPieChart('category')
  const savedData = localStorage.getItem('accountingDataList');
  if (savedData) {
    accountingStore.accountingData = JSON.parse(savedData);
  }
  lists.value = accountingStore.accountingData || []
})
</script>

<style scoped lang="scss">
.box {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  font-weight: 300;
  font-size: 15px;

  .background {
    width: 500px;
    background-color: rgb(255, 244, 230);
    display: flex;
    flex-direction: column;

    .top {
      height: 100px;
      width: 500px;
      background-color: rgb(255, 103, 103);
      font-size: 40px;
      letter-spacing: 5px;
      color: white;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .content {
      padding: 20px 45px;
      display: flex;
      flex-direction: column;

      .choosing {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        >p {
          font-size: 16px;
          font-weight: bolder;
          color: gray;
        }

        >div {
          display: flex;
          flex-direction: row;

          >div {
            width: 50px;
            display: flex;
            justify-content: center;
            color: rgb(255, 103, 103);
            font-weight: bolder;

            &:nth-child(1),
            &:nth-child(3) {
              border: 2px rgb(255, 103, 103) solid;

              &.active {
                background-color: rgb(255, 103, 103);
                color: white;
              }
            }

            &:nth-child(2) {
              border-top: 2px rgb(255, 103, 103) solid;
              border-bottom: 2px rgb(255, 103, 103) solid;

              &.active {
                background-color: rgb(255, 103, 103);
                color: white;
              }
            }
          }
        }
      }

      .initPieChart {
        width: 410px;
        height: 200px;
        display: flex;
        padding: 0 50px;
      }

      .detailBtn {
        display: flex;
        justify-content: flex-end;

        >p {
          background-color: #ffa743;
          border-radius: 5px;
          padding: 5px 20px;
          font-weight: bolder;
          cursor: pointer;
          color: white;
        }

      }
    }
  }
}
</style>
