<template>
  <div class="box">
    <div class="background">
      <div class="top">日曆管理</div>
      <div class="content">
        <div class=calendar>
          <n-calendar #="{ year, month, date }" v-model:value="value">
            {{ calculateInput(year, month, date) }}
          </n-calendar>
        </div>
        <div class="dailyDetail"></div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { addDays } from 'date-fns'
import { useAccountingStore } from '@/stores/accountingStore'
import FooterBar from './../components/FooterBar.vue'

const accountingStore = useAccountingStore()
const lists: any = ref([])
const value = ref(addDays(Date.now(), 1).valueOf())

const calculateInput = (year: number, month: number, date: number) => {
  console.log(123)
  if (!year || !month || !month || lists.value.length === 0) {
    return '數據加載中'
  }
  const equalDate = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`
  const calculate = lists.value.filter((item: any) => (item.date).split('T')[0] == equalDate)
  if (calculate.length === 0) {
    return '無數據'
  }
  console.log('列表：',calculate)

  const calculateThing = calculate.filter((item: any) =>  item.type === '支出' )

  console.log('篩選支出',calculateThing)
  return calculateThing.reduce((sum: any, current: any) => sum + current.amount, 0)

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

          .n-calendar-dates {
            flex: none;

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
            }
          }


        }
      }

      .dailyDetail {
        height: 50%;
      }
    }
  }
}
</style>
