<template>
  <n-message-provider>
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
          <div class="dayDetail" v-for="date in Object.keys(doneSortingLists)" :key="date">
            <div class="dayTotal">
              <div class="date">
                <p>{{ date }}</p>
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
              <div class="biggerEachList" v-for="(list, index) in [...items.income, ...items.expense]">
                <div
                  :class="['eachList', { more: !moreFunction, input: list.type === '收入', output: list.type !== '收入' }]">
                  <div class="project">
                    <n-checkbox v-if="list.merging" :value="index" />
                    <n-icon :component="list.icon"
                      :style="{ backgroundColor: list.color, marginLeft: (list.merging === false && mergeStart === true) ? '23px' : '' }" />
                    <p>{{ list.category }}</p>
                    <p v-if="list.description">-- {{ list.description }}</p>
                  </div>
                  <div class="number" v-if="list.moreFunction">
                    <div class="payment">
                      <p v-for="pay in list.payment">{{ pay }}</p>
                    </div>
                    <p class="num">{{ list.type === '收入' ? '+' : '-' }}{{ Number(list.amount) }}</p>
                  </div>
                </div>
                <div @click="toggleMoreFunction(index)" v-if="list.moreFunction" class="moreBtn"></div>
                <div v-else class="list">
                  <n-icon class="back" :component="ArrowForwardIosFilled" @click="closeAllFunction(index)" />
                  <n-icon class="function" :component="EditFilled" />
                  <n-icon class="function" :component="MergeFilled" @click="listsMerge(index)" />
                  <n-icon class="function" :component="ContentCopyFilled" @click="listsCopy(index)" />
                  <n-icon class="function" :component="DeleteFilled" @click="listsDelete(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FooterBar />
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { DensityMediumTwotone, ArrowLeftRound, ArrowRightRound, ArrowForwardIosFilled, ContentCopyFilled, DeleteFilled, EditFilled, MergeFilled } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'
import FooterBar from './../components/FooterBar.vue'
import { useMessage } from 'naive-ui';

const message = useMessage()
const accountingStore = useAccountingStore()
const timestamp = ref(Date.now())
const lists: any = ref([])
const monthlyTotalInput = ref(0)
const monthlyTotalOutput = ref(0)
const moreFunction = ref(true)
const merging = ref(false)
const mergeStart = ref(false)


// 獲得星期
const getDayOfWeek = (dateString: string) => {
  const daysOfWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const formattedDate = dateString.replace(/年|月/g, '-').replace('日', '')
  const date = new Date(formattedDate)
  return daysOfWeek[date.getDay()]
}

// 按照時間排列
const sortListbyTime = computed(() => {
  if (!Array.isArray(lists.value) || lists.value.length === 0) {
    return {}; // 返回空对象，避免reduce报错
  }
  const sortedLists = lists.value.sort((a: any, b: any) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())
  return sortedLists.reduce((timeList: any, list: any) => {
    if (!timeList[list.date]) {
      timeList[list.date] = []
    }
    timeList[list.date].push(list)
    return timeList
  }, {})
})

const doneSortingLists = computed(() => {
  const sortedTimeList = { ...sortListbyTime.value }
  for (const date in sortedTimeList) {
    if (Array.isArray(sortedTimeList[date])) {
      sortedTimeList[date].sort((a: any, b: any) => {
        if (a.type === '收入' && b.type === '支出') {
          return -1
        } else if (a.type === '支出' && b.type === '收入') {
          return 1
        }
        return 0
      })
    }
  }
  return sortedTimeList
})

console.log(doneSortingLists)

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

//----------更多功能------------//
// 删除該列
function listsDelete(index: number) {
  lists.value.splice(index, 1)
  calculateMonthlyAmount()
}

// 複製該列
function listsCopy(index: number) {
  const originItem = lists.value[index]
  const newList = {
    ...JSON.parse(JSON.stringify(originItem)),
    icon: originItem.icon,
    id: lists.value.length + 1
  }
  lists.value.push(newList);
  lists.value.forEach((item: any) => {
    item.moreFunction = true
  })
}

// 組合功能
function listsMerge(selectedIndex: number) {
  mergeStart.value = true
  lists.value.forEach((list: any, index: number) => {
    if (index !== selectedIndex) {
      list.merging = true
    }
  })
  message.warning('請選擇要組合的對象')
}

// 收回功能表
function closeAllFunction(index: number) {
  lists.value[index].moreFunction = true
  lists.value.forEach((item: any) => item.merging = false)
}

// 打開功能表
function toggleMoreFunction(selectedIndex: number) {
  lists.value.forEach((list: any, index: number) => {
    if (index !== selectedIndex) {
      list.moreFunction = true
    }
  })

  lists.value[selectedIndex].moreFunction = !lists.value[selectedIndex].moreFunction
}

watch(lists, (newValue) => {
  calculateMonthlyAmount()
}, { deep: true })

onMounted(() => {
  lists.value = accountingStore.accountingData || []
  console.log(lists.value)

  lists.value.forEach((list: any) => {
    list.moreFunction = true
    list.merging = false
  })

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

          .biggerEachList {
            display: flex;
            flex-direction: row;
            width: 100%;

            .eachList {
              padding: 8px 10px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              width: calc(100% - 10px);

              &.more {
                width: calc(100% - 300px);
              }

              &.input {
                background-color: rgba(255, 255, 0, 0.205);
                border-radius: 5px 0 0 5px;
                margin: 2px 0;
              }

              &.output {
                background-color: rgba(255, 103, 103, 0.226);
                border-radius: 5px 0 0 5px;
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
                  display: flex;
                  flex-direction: row;
                  gap: 10px;
                  justify-content: flex-end;

                  >p {
                    padding: 1px 5px;
                    border-radius: 3px;
                    background-color: rgb(255, 203, 154);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                }

                .num {
                  text-align: right;
                  width: 50px;
                }
              }
            }

            .moreBtn {
              width: 10px;
              height: 43.6px;
              background-color: rgb(255, 103, 103);
              margin: 2px 0;
              border-radius: 0 5px 5px 0;
              cursor: pointer;
            }

            .list {
              width: 300px;
              height: 43.6px;
              background-color: rgb(255, 103, 103);
              margin: 2px 0;
              border-radius: 0 5px 5px 0;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-evenly;

              .function {
                font-size: 18px;
                width: 28px;
                height: 28px;
                background-color: white;
                color: rgb(255, 103, 103);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                &:hover {
                  background-color: rgb(255, 247, 178);
                }
              }

              .back {
                font-size: 20px;
                color: white;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>