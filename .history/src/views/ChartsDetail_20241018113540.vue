<template>
  <div class="box">
    <div class="background">
      <div class="top">
        <div><n-icon :component="ArrowBackIosRound" @click="router.push('/ChartsView')" /></div>
        <p>統計圖表</p>
        <div></div>
      </div>
      <div class="content">
        <div class="categoryChart">
          <p>分類佔比</p>
          <div class="initPieChart" id="category"></div>
          <div class="categoryList">
            <n-collapse v-for="list in categoryData">
              <n-collapse-item :title="list.category" name="1">
                <div class="smallList" v-for="(item, idx) in listFiltered(list.category)"
                  :style="{ borderBottom: idx === listFiltered(list.category).length - 1 ? 'none' : `${item.color} 1px dotted` }">
                  <div class="first">
                    <div class="categoryWithIcon" :style="{ backgroundColor: item.color }">
                      <n-icon :component="item.icon" />
                      <p>{{ item.category }}</p>
                    </div>
                    <div class="date">{{ item.date.replace('2024年','') }}</div>
                    <div class="word">{{ item.description }}</div>
                  </div>
                  <div class="amount">{{ item.amount }} 元</div>
                </div>
              </n-collapse-item>
            </n-collapse>
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
import { ArrowBackIosRound } from '@vicons/material'
import { useRouter } from 'vue-router'

const router = useRouter()
const accountingStore = useAccountingStore()
const lists: any = ref([])
const categoryData = ref<any>([])

const listFiltered = (category: string) => {
  return lists.value.filter((item: any) => item.category === category)
}

const initPieChart = async (id: string) => {
  await nextTick();
  const chartDom = document.getElementById(id)!;
  if (!chartDom) return;

  let color = categoryData.value.map((item: any) => item.color)
  const data = categoryData.value.map((item: any) => ({
    name: item.category,
    value: item.amount
  }))

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

  lists.value = accountingStore.accountingData || []

  // 如果有相同的類別，合併該類別
  const result = lists.value.reduce((array: any, item: any) => {
    if (array[item.category]) {
      array[item.category].amount += item.amount
    } else {
      array[item.category] = { category: item.category, amount: item.amount, color: item.color }
    }
    return array
  }, {})
  categoryData.value = Object.values(result)
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
      justify-content: space-between;
      padding: 0 30px;

      .n-icon {
        font-size: 30px;
        cursor: pointer;
        text-align: left;
      }

      >p {
        padding-right: 30px;
      }
    }

    .content {
      padding: 20px 45px;
      display: flex;
      flex-direction: column;

      .categoryChart {
        display: flex;
        flex-direction: column;

        >p {
          font-size: 18px;
          font-weight: bolder;
          color: white;
          background-color: rgb(255, 103, 103);
          text-align: center;
          padding: 5px;
          border-radius: 5px;
          letter-spacing: 2px;
        }

        .initPieChart {
          width: 410px;
          height: 200px;
          display: flex;
          padding: 0 50px;
          background-color: white;
          margin-bottom: 10px;
        }

        .categoryList {
          .n-collapse {
            padding: 5px 20px;
            background-color: #ffcb90;
            border: white solid 1px;

            .smallList {
              display: flex;
              flex-direction: row;
              gap: 10px;
              font-weight: bolder;
              justify-content: space-between;
              align-items: center;
              padding: 5px 0px 5px 20px;

              &:last-child {
                border-bottom: none;
              }

              .first {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;

                .categoryWithIcon {
                  display: flex;
                  flex-direction: row;
                  gap: 5px;
                  padding: 2px 10px 2px 5px;
                  border-radius: 13px;
                  color: white;

                  .n-icon {
                    display: flex;
                    font-size: 12px;
                    width: 20px;
                    height: 20px;
                    align-items: center;
                    justify-content: center;
                  }
                }
              }

              .amount {
                color: red;
              }
            }
          }
        }
      }
    }
  }
}
</style>
