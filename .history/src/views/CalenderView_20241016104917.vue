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
          <div class="dailyDetail">
            <div class="eachType">
              <div class="typeTitle">
                <n-icon :component="FreeBreakfastRound" />
                <p class="type">飲料</p>
              </div>
              <p class="totalAmount">290元</p>
              <div class="repeatTypeContent">
                <div class="detailContent">
                  <div class="detailContentTopic">
                    <p>2024年10月9日</p>
                    <p>早安美之城</p>
                  </div>
                  <p>130元</p>
                </div>
                <div class="detailContent">
                  <div class="detailContentTopic">
                    <p>2024年10月9日</p>
                    <p>星巴克</p>
                  </div>
                  <p>160元</p>
                </div>
              </div>
            </div>
            <div class="eachType">
              <div class="typeTitle">
                <n-icon :component="FreeBreakfastRound" style="background: red;" />
                <p class="type">交通</p>
              </div>
              <p class="totalAmount">120元</p>
              <div class="repeatTypeContent">
                <div class="detailContent">
                  <div class="detailContentTopic">
                    <p>2024年10月9日</p>
                    <p></p>
                  </div>
                  <p>120元</p>
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
import { ref, onMounted, watch , computed} from 'vue'
import { addDays } from 'date-fns'
import { zhCN } from 'naive-ui'
import { useAccountingStore } from '@/stores/accountingStore'
import { FreeBreakfastRound } from '@vicons/material'
import FooterBar from './../components/FooterBar.vue'

const locale = ref(zhCN)
const accountingStore = useAccountingStore()
const lists: any = ref([])
const value = ref(addDays(Date.now(), 1).valueOf())

function pressed() {
  const date = new Date (value.value)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const valueDate = `${year}年${month}月${day}日`

}

const sortDatebyList = computed(() => {
  return lists.value.reduce((sortList: any, list: any) => {
    if (!sortList[list.date]) {
      sortList[list.date] = []
    }
    sortList[list.date].push(list)
    return sortList
  }, {})
})

console.log(sortDatebyList)

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
      height: calc(100% - 100px);

      .calendar {
        height: 50%;

        :deep(.n-calendar) {
          padding: 20px;
          --n-border-color: transparent !important;
          --n-text-color: black !important;
          --n-title-font-weight: 800 !important;
          --n-date-color-current: rgb(255, 103, 103) !important;
          --n-bar-color: transparent !important;
          --n-cell-color: #42b883 !important;
          --n-font-size: 13px !important;

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

      .dailyDetail {
        height: 50%;
        padding: 0 25px;

        .eachType {
          display: flex;
          flex-direction: row;


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
            color: red;
            padding-left: 10px;
            font-weight: bolder;
          }

          .repeatTypeContent {
            display: flex;
            flex-direction: column;
            width: calc(100% - 134px);

            .detailContent {
              display: flex;
              flex-direction: row;
              justify-content: space-between;

              .detailContentTopic {
                display: flex;
                flex-direction: row;
                padding-left: 20px;
                gap: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
