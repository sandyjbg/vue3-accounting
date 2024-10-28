<template>
  <div class="box">
    <div class="background">
      <div class="topic">
        <div class="nameWithLogo">
          <div class="space">
            <div><n-icon :component="DensityMediumTwotone" /></div>
          </div>
          <img src="../assets/building.png" />
          <div class="name">沙雕記賬</div>
        </div>
        <div class="monthTotalwithArrow">
          <div><n-icon :component="ArrowLeftRound" /></div>
          <div class="monthTotal">
            <n-date-picker v-model:value="timestamp" type="month" clearable />
            <div class="input">
              <p>收入</p>
              <p>{{ monthlyTotalInput }}</p>
            </div>
            <div class="output">
              <p>支出</p>
              <p>{{ monthlyTotalOutput }}</p>
            </div>
          </div>
          <div><n-icon :component="ArrowRightRound" /></div>
        </div>
      </div>
      <div class="content">
        <div class="dayDetail" v-for="(items, date) in sortListbyTime" :key="date">
          <div class="dayTotal">
            <div class="date">
              <p>{{ formatDate(date) }}</p>
              <p>{{ getDayOfWeek(date) }}</p>
            </div>
            <div class="smallTotal">
              <div class="smallDailyTotal">
                <p>日增減</p>
                <p>{{ dailyTotalAmount(items.income, items.expense) }} 元</p>
              </div>
              <div class="smallInput">
                <p>收入</p>
                <p>{{ dailyTotalInput(items.income) }} 元</p>
              </div>
              <div class="smallOutput">
                <p>支出</p>
                <p>{{ dailyTotalOutput(items.expense) }} 元</p>
              </div>
            </div>
          </div>
          <div class="dayList">
            <div class="eachList" v-for="list in [...items.income, ...items.expense]"
              :class="list.type === '收入' ? 'input' : 'output'">
              <div class="project">
                <n-icon :component="list.icon" :style="{ backgroundColor: list.color }" />
                <p>{{ list.category }}</p>
                <p v-if="list.description">-- {{ list.description }}</p>
              </div>
              <div class="number">
                <div class="payment"><p v-for="pay in list.payment">{{ pay }}</p></div>
                <p class="num">{{ list.type === '收入' ? '+' : '-' }}{{ Number(list.amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { DensityMediumTwotone, PlusOutlined, ArrowLeftRound, ArrowRightRound } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'
import FooterBar from './../components/FooterBar.vue'

const accountingStore = useAccountingStore()
const timestamp = ref(Date.now())
const lists: any = ref([])
const monthlyTotalInput = ref(0)
const monthlyTotalOutput = ref(0)

// 日期格式
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}月${day}日`;
}

// 獲得星期
const getDayOfWeek = (dateString: string) => {
  const daysOfWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = new Date(dateString)
  return daysOfWeek[date.getDay()]
}

const sortListbyTime = computed(() => {
  // const lists = ref<any[]>([])

  if (!Array.isArray(lists.value) || lists.value.length === 0) {
    return {}; // 返回空对象，避免reduce报错
  }

  const sortedLists = lists.value.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return sortedLists.reduce((timeList: any, list: any) => {
    const processingDate = new Date(list.date)
    const month = String(processingDate.getMonth() + 1).padStart(2, '0')
    const day = String(processingDate.getDate()).padStart(2, '0')
    const formattedDate = `2024-${month}-${day}`

    if (!timeList[formattedDate]) {
      timeList[formattedDate] = { income: [], expense: [] }
    }
    if (list.type === '收入') {
      timeList[formattedDate].income.push(list)
    } else if (list.type === '支出') {
      timeList[formattedDate].expense.push(list)
    }

    return timeList
  }, {})
})

// 計算日支出 / 收入 / 日增減
function dailyTotalInput(timeprocessinglist: any) {
  return timeprocessinglist.filter((item: any) => item.type = '收入').reduce((total: number, item: any) => total + Number(item.amount), 0)
}
function dailyTotalOutput(timeprocessinglist: any) {
  return timeprocessinglist.filter((item: any) => item.type = '支出').reduce((total: number, item: any) => total + Number(item.amount), 0)
}
function dailyTotalAmount(a: any, b: any) {
  const income = a.filter((item: any) => item.type = '收入').reduce((total: number, item: any) => total + Number(item.amount), 0)
  const expense = b.filter((item: any) => item.type = '支出').reduce((total: number, item: any) => total + Number(item.amount), 0)
  return income - expense
}

// 計算月支出 / 收入
function calculateMonthlyAmount() {
  monthlyTotalInput.value = lists.value.filter((item: any) => item.type === '收入').reduce((total: number, item: any) => total + Number(item.amount), 0)
  monthlyTotalOutput.value = lists.value.filter((item: any) => item.type === '支出').reduce((total: number, item: any) => total + Number(item.amount), 0)
}

watch(lists, (newValue) => {
  calculateMonthlyAmount()
}, { deep: true })


onMounted(() => {
  lists.value = accountingStore.accountingData || []
  calculateMonthlyAmount()
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

    .topic {
      display: flex;
      flex-direction: column;

      .nameWithLogo {
        background-color: rgb(255, 103, 103);
        color: rgb(255, 255, 255);
        height: 100px;
        width: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 5px;
        font-size: 40px;
        font-weight: bolder;

        .space {
          background-color: transparent;
          position: absolute;
          width: 500px;
          height: 100px;
          padding-right: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;

          .n-icon {
            font-size: 30px;
          }
        }

        img {
          width: 70px;
          padding: 0 20px 5px 0;
        }

        .name {}
      }

      .monthTotalwithArrow {
        display: flex;
        flex-direction: row;
        background-color: rgb(255, 103, 103);
        padding: 0 20px 10px 20px;
        justify-content: space-between;
        align-items: center;

        .n-icon {
          font-size: 60px;
          color: rgb(255, 255, 255);
        }

        .monthTotal {
          display: flex;
          flex-direction: row;
          gap: 30px;
          align-items: center;
          justify-content: center;

          :deep(.n-date-picker) {

            .n-input,
            .n-input--resizable,
            .n-input--stateful {
              --n-color: transparent !important;
              --n-color-focus: transparent !important;
              --n-font-size: 16px !important;
              --n-height: 30px !important;
              --n-text-color: rgb(255, 255, 255) !important;
              --n-border: 1px solid white !important;
              --n-border-hover: 1px solid white !important;
              --n-border-focus: 1px solid white !important;
              --n-box-shadow-focus: transparent !important;
              --n-icon-color: transparent !important;
              --n-border-radius: 20px !important;
              width: 120px;
            }
          }

          .input,
          .output {
            display: flex;
            flex-direction: row;
            gap: 10px;

            >p {
              display: flex;
              align-items: flex-end;
              color: white;

              &:nth-child(2) {
                font-size: 18px;
                font-weight: bolder;
                color: yellow;
              }
            }
          }
        }
      }
    }

    .content {
      .dayDetail {
        display: flex;
        flex-direction: column;
        padding: 30px 30px 0 30px;
        gap: 10px;

        .dayTotal {
          display: flex;
          flex-direction: row;
          padding-bottom: 5px;
          color: gray;
          border-bottom: 1px gray solid;
          justify-content: space-between;

          .date {
            display: flex;
            flex-direction: row;
            gap: 5px;
            font-weight: bolder;
          }

          .smallTotal {
            display: flex;
            flex-direction: row;
            gap: 10px;

            .smallDailyTotal,
            .smallInput,
            .smallOutput {
              display: flex;
              flex-direction: row;
              gap: 5px;
            }

            .smallDailyTotal {
              color: red;
              font-weight: bolder;
              margin-right: 5px;
            }
          }
        }

        .dayList {
          display: flex;
          flex-direction: column;

          .eachList {
            padding: 8px 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            &.input {
              background-color: rgba(255, 255, 0, 0.205);
              border-radius: 5px;
              margin: 2px 0;
            }

            &.output {
              background-color: rgba(255, 103, 103, 0.226);
              border-radius: 5px;
              margin: 2px 0;
            }

            .project {
              display: flex;
              flex-direction: row;
              gap: 8px;
              align-items: center;

              .n-icon {
                width: 24px;
                height: 24px;
                background-color: coral;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }

            .number {
              font-size: 16px;
              display: flex;
              flex-direction: row;
              gap: 10px;

              .payment {
                width: 80%;
              }

              .num {
                width: 20%;
              }
            }
          }
        }
      }
    }
  }

  // .plusBtn {
  //   position: absolute;
  //   font-size: 50px;
  //   background-color: rgb(255, 103, 103);
  //   color: white;
  //   height: 80px;
  //   width: 80px;
  //   border-radius: 50%;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   top: 80%;
  //   right: 48%;
  //   cursor: pointer;
  //   z-index: 999;
  // }
}
</style>