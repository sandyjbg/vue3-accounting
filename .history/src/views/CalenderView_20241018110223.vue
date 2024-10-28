<template>
  <n-config-provider :locale="locale">
    <div class="box">
      <div class="background">
        <div class="top">日曆管理</div>
        <div class="content">
          <div class=calendar>
            <n-calendar #default="{ year, month, date }" v-model:value="value" @update:value="pressed">
              <p>{{ calculateInput(year, month, date) }}</p>
              <p class="output">{{ calculateOutput(year, month, date) }}</p>
            </n-calendar>
          </div>
          <div class="detailTopic">
            <p>每日明細</p>
            <div>
              <p @click="status = '支出'" :class="status === '支出' ? 'active' : ''">支出</p>
              <p @click="status = '收入'" :class="status === '收入' ? 'active' : ''">收入</p>
            </div>
          </div>
          <img v-if="hasData" src="./../assets/empty.png">
          <div class="dailyDetail" v-if="status === '支出'">
            <div class="eachType" v-for="(items, category) in categorizedList['支出']" :key="category"
              :style="{ color: items && items.length > 0 ? items[0].color : 'red' }">
              <div class="typeTitle" :style="{ backgroundColor: items && items.length > 0 ? items[0].color : 'red' }">
                <n-icon :component="items && items.length > 0 ? items[0].icon : FreeBreakfastRound" />
                <p class="type">{{ category }}</p>
              </div>
              <p class="totalAmount">總計{{
                calculateTotal(items) }} 元</p>
              <div class="repeatTypeContent">
                <div class="detailContent" v-for="(item, index) in items" :key="index">
                  <div class="detailContentTopic">
                    <p>{{ item.time }}</p>
                    <p>{{ item.description }}</p>
                  </div>
                  <p>{{ item.amount }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="dailyDetail" v-if="status === '收入'">
            <div class="eachType" v-for="(items, category) in categorizedList['收入']" :key="category"
              :style="{ color: items && items.length > 0 ? items[0].color : 'red' }">
              <div class="typeTitle" :style="{ backgroundColor: items && items.length > 0 ? items[0].color : 'red' }">
                <n-icon :component="items && items.length > 0 ? items[0].icon : FreeBreakfastRound" />
                <p class="type">{{ category }}</p>
              </div>
              <p class="totalAmount">總計{{
                calculateTotal(items) }} 元</p>
              <div class="repeatTypeContent">
                <div class="detailContent" v-for="(item, index) in items" :key="index">
                  <div class="detailContentTopic">
                    <p>{{ item.time }}</p>
                    <p>{{ item.description }}</p>
                  </div>
                  <p>{{ item.amount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { addDays } from 'date-fns'
import { zhCN } from 'naive-ui'
import { useAccountingStore } from '@/stores/accountingStore'
import { FreeBreakfastRound } from '@vicons/material'
import FooterBar from './../components/FooterBar.vue'

const locale = ref(zhCN)
const accountingStore = useAccountingStore()
const lists: any = ref([])
const value = ref(addDays(Date.now(), 1).valueOf())
const hasData = ref(true)
const status = ref<string>('支出')
const categorizedList = ref({ '支出': {}, '收入': {} })

// 按照日期歸類出同一天的項目
const sortDatebyList = computed(() => {
  return lists.value.reduce((sortList: any, list: any) => {
    if (!sortList[list.date]) {
      sortList[list.date] = {
        '支出': {},
        '收入': {}
      }
    }

    if (!sortList[list.date][list.type][list.category]) {
      sortList[list.date][list.type][list.category] = []
    }

    sortList[list.date][list.type][list.category].push(list)
    return sortList
  }, {})
})

function pressed() {
  const date = new Date(value.value)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const valueDate = `${year}年${month}月${day}日`

  if (sortDatebyList.value[valueDate]) {
    categorizedList.value['支出'] = sortDatebyList.value[valueDate]['支出'] || {}
    categorizedList.value['收入'] = sortDatebyList.value[valueDate]['收入'] || {}
    hasData.value = false
  } else {
    categorizedList.value['支出'] = {}
    categorizedList.value['收入'] = {}
    hasData.value = true
  }
}


console.log(sortDatebyList)

function calculateTotal(items: any[] = []) {
  return items.reduce((total, item) => total + Number(item.amount), 0)
}

const calculateInput = (year: number, month: number, date: number) => {
  const equalDate = `${year}年${month < 10 ? '0' + month : month}月${date < 10 ? '0' + date : date}日`
  const calculate = lists.value.filter((item: any) => item.date == equalDate)
  const calculateThing = calculate.filter((item: any) => item.type === '收入')
  if (calculateThing.length === 0) {
    return ''
  }
  const lastInputNumber = calculateThing.reduce((sum: number, current: any) => sum + Number(current.amount), 0)
  return `+${lastInputNumber}`
}

const calculateOutput = (year: number, month: number, date: number) => {
  const equalDate = `${year}年${month < 10 ? '0' + month : month}月${date < 10 ? '0' + date : date}日`
  const calculate = lists.value.filter((item: any) => item.date == equalDate)
  const calculateThing = calculate.filter((item: any) => item.type === '支出')
  if (calculateThing.length === 0) {
    return ''
  }
  const lastInputNumber = calculateThing.reduce((sum: number, current: any) => sum + Number(current.amount), 0)
  return `-${lastInputNumber}`
}

onMounted(() => {
  lists.value = accountingStore.accountingData || []

  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const todayDate = `${year}年${month}月${day}日`

  // 檢查當前日期是否有明細
  if (sortDatebyList.value[todayDate]) {
    categorizedList.value = sortDatebyList.value[todayDate]
    hasData.value = false
  } else {
    categorizedList.value = {}
    hasData.value = true
  }
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
  font-weight: bolder;

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
      height: calc(100% - 100px);

      .calendar {


        :deep(.n-calendar) {
          padding: 20px 20px 12px 20px;
          --n-border-color: transparent !important;
          --n-text-color: black !important;
          --n-title-font-weight: 800 !important;
          --n-date-color-current: rgb(255, 103, 103) !important;
          --n-bar-color: orange !important;
          --n-cell-color: #42b883 !important;
          --n-font-size: 13px !important;
          height: 100%;

          .n-calendar-header {

            .n-calendar-header__title {
              color: rgb(255, 103, 103);
            }

            .n-calendar-header__extra {


              .n-button {
                --n-color: rgb(255, 103, 103) !important;
                --n-color-hover: rgb(255, 103, 103) !important;
                --n-color-pressed: rgb(255, 103, 103) !important;
                --n-color-focus: rgb(255, 103, 103) !important;
                --n-border: 1px solid white !important;
                --n-border-hover: 1px solid white !important;
                --n-border-pressed: 1px solid white !important;
                --n-border-focues: 1px solid white !important;
                --n-text-color: white !important;
                --n-text-color-hover: white !important;
                --n-text-color-pressed: white !important;
                --n-text-color-focus: white !important;
                --n-ripple-color: transparent !important;
              }
            }

          }

          .n-calendar-dates {
            flex: none;
            line-height: 15px;

            .n-calendar-cell {
              height: 60px !important;
              background: rgb(255, 219, 185);
              border-radius: 5px;
              border: 2px solid #fff4e6;

              .n-calendar-date__date {
                width: 20px;
                height: 20px;
                font-weight: bolder;
              }

              .n-calendar-date__day {
                color: black;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                margin-left: 3px;
              }

              >p {
                font-size: 12px;
                text-align: right;
                color: green;

                &.output {
                  color: red;
                }
              }
            }
          }
        }
      }

      .detailTopic {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 25px;

        >p {

          font-size: 25px;
          font-weight: bolder;
          color: rgb(255, 103, 103);
          margin-bottom: 10px;
        }

        >div {
          display: flex;
          flex-direction: row;
          gap: 10px;
          color:orange;

          >p {
            &.active {
              border-bottom: 1.5px black solid;
            }
          }
        }
      }


      img {
        height: 150px;
        position: absolute;
        top: 64%;
        left: 46%;
      }

      .dailyDetail {
        padding: 0 25px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        overflow: auto;

        /* 滚轮宽度 */
        &::-webkit-scrollbar {
          width: 5px;
        }

        /* 滑块 */
        &::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 4px;
        }

        .eachType {
          display: flex;
          flex-direction: row;
          font-weight: bolder;
          border-bottom: black dotted 2px;
          padding-bottom: 5px;
          justify-content: space-between;

          &:nth-last-child(1) {
            border-bottom: none;
          }

          .typeTitle {
            display: flex;
            flex-direction: row;
            gap: 5px;
            background-color: red;
            height: 25px;
            border-radius: 12.5px;
            padding: 0 8px 0 5px;
            color: white;

            .n-icon {
              width: 25px;
              height: 25px;
              border-radius: 50%;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .totalAmount {
            padding-left: 10px;
            font-weight: bolder;
          }

          .repeatTypeContent {
            display: flex;
            flex-direction: column;
            width: calc(100% - 160px);

            .detailContent {
              display: flex;
              flex-direction: row;
              justify-content: space-between;

              .detailContentTopic {
                display: flex;
                flex-direction: row;
                padding-left: 20px;
                gap: 5px;

                >p {

                  &:nth-child(2) {
                    padding-left: 10px;
                  }
                }
              }

              >p {
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
}
</style>
