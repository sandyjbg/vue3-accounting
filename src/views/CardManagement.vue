<template>
  <div class="box">
    <div class="background">
      <div class="top">資產管理</div>
      <div class="content">
        <div class="wholeLess">
          <div class="chartTopic">總支出剩餘水平圖</div>
          <div class="switchChart">
            <div class="waterBallChart" id="wholeLessChart"></div>
            <div class="switchButton">
              <p>● 現存金額</p>
              <p>● 實際金額</p>
            </div>
          </div>
        </div>
        <div class="assetManagement">
          <div class="topic">賬戶列表</div>
          <div class="cash" v-for="(payment, index) in largePayment" :key="index">
            <div class="left">
              <div class="picture">
                <img :src="payment.picture" style="height:140px">
              </div>
              <div class="button">
                <div class="buttonTop">
                  <div @click="moneyTransfering(payment.paymentName)">
                    <n-icon :component="CurrencyExchangeRound" />
                    <p>資金移轉</p>
                  </div>
                </div>
                <div class="buttonBottom">
                  <div @click="openPaymentList(payment.paymentName)" class="c">
                    <n-icon :component="ListFilled" />
                    <p>賬目</p>
                  </div>
                  <div class="c">
                    <n-icon :component="SettingsRound" />
                    <p>設定</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="list">
              <div class="smallname">
                <div class="smallleft">
                  <p class="smallt">名稱：</p>
                  <p class="smallcontent">{{ payment.paymentName }}{{ payment.cardBank }}{{ payment.cardLastCode ? '-' :
                    '' }}{{ payment.cardLastCode }}</p>
                </div>
                <n-space>
                  <n-icon class="deleted" :component="CloseFilled" @click="handleConfirm(index)" />
                </n-space>
              </div>
              <div class="smallname">
                <div class="smallleft">
                  <p class="smallt">種類：</p>
                  <p class="smallcontent">{{ payment.paymentType }}</p>
                </div>
                <p v-if="payment.default">預設</p>
              </div>
              <div class="name">
                <p class="t">支付：</p>
                <p class="smallcontent">{{ payment.paymentTime }}</p>
              </div>
              <div class="name">
                <p class="t">描述：</p>
                <p class="smallcontent">{{ payment.paymentDescription ? payment.paymentDescription : '----' }}</p>
              </div>
              <div class="name" v-if="payment.creditCardTopAmount">
                <p class="t">預支額度：</p>
                <p class="smallcontent"><span>{{ payment.creditCardTopAmount }}</span>元</p>
              </div>
              <div class="name">
                <p class="t">現存金額：</p>
                <p class="smallcontent"><span>{{ payment.paymentNowAccount }}</span>元</p>
              </div>
              <div class="name">
                <p class="t">實際金額：</p>
                <p class="smallcontent"><span>12000</span>元</p>
              </div>
              <div class="name">
                <p class="t">總消費：</p>
                <p class="smallcontent"><span>{{ payment.paymentExpense }}</span>元</p>
              </div>
            </div>
          </div>
        </div>
        <div class="addAsset" @click="showAddAsset = true">
          <p>點選這裡新增資產</p>
          <n-icon :component="PlusRound" />
        </div>
      </div>
    </div>
  </div>
  <FooterBar />
  <AddAsset v-if="showAddAsset" :closeAddAsset="closeAddAsset" />
  <CashFlow v-if="showCashFlow" :closeCashFlow="closeCashFlow" :selectedAsset="selectedAsset" />
  <listIncludePayment v-if="showPaymentList" :closePaymentList="closePaymentList" :selectedAsset="selectedAsset" />
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import FooterBar from '../components/FooterBar.vue'
import AddAsset from '../components/AddAsset.vue'
import listIncludePayment from '../components/listIncludePayment.vue'
import CashFlow from '../components/CashFlow.vue'
import { CurrencyExchangeRound, PlusRound, SettingsRound, ListFilled, CloseFilled } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'
import { useDialog } from 'naive-ui'

const dialog = useDialog()
const accountingStore = useAccountingStore()
const showAddAsset = ref(false)
const showPaymentList = ref(false)
const showCashFlow = ref(false)
const selectedAsset = ref('')
const largePayment = ref<any[]>([])
const filterPayment = ref<any[]>([])
const lists = ref<any[]>([])

function closeAddAsset() {
  showAddAsset.value = false
}
function closePaymentList() {
  showPaymentList.value = false
}
function closeCashFlow() {
  showCashFlow.value = false
}

// 資金移轉功能
function moneyTransfering(payment: string) {
  selectedAsset.value = payment
  showCashFlow.value = true
}

// 查看賬目功能
function openPaymentList(payment: string) {
  selectedAsset.value = payment
  showPaymentList.value = true
}

// 刪除功能
function handleConfirm(index: number) {
  dialog.warning({
    title: '確認', content: '你確定要刪除該支付方式嗎？', positiveText: '確定', negativeText: '取消',
    onPositiveClick: () => {
      deletePayment(index)
    }
  })
}
function deletePayment(index: number) {
  largePayment.value.splice(index, 1)
  // 刪除項目，更新pinia
  accountingStore.paymentData = largePayment.value
  localStorage.setItem('paymentDataList', JSON.stringify(accountingStore.paymentData))
}

function calculateExpense(payment: string) {
  filterPayment.value = lists.value.filter((item: any) => item.payment.includes(payment))
  const expenseAmount = filterPayment.value.reduce((sum, list) => sum + Number(list.amount), 0)
  return expenseAmount
}

// 水球圖
const initLiquidFill = async (id: string) => {
  await nextTick();
  const chartDom = document.getElementById(id)!;
  if (!chartDom) return;

  let option = {
    series: [
      {
        type: 'liquidFill', // 種類：水球圖
        radius: '80%', // 大小
        data: [0.62, 0.62], // 波浪的數值
        backgroundStyle: { // 背景顏色
          color: '#fff',
        },
        label: { // 水球圖上顯示的文字
          formatter: function () {
            return 23000 + '元 / ' + 37000 + '元';
          },
          show: true,
          position: ['50%', '55%'],
          fontSize: 24,
          color: 'gray', // 波浪外字的顏色
          insideColor: 'gray', // 波浪內字的顏色
        },
        color: ['rgb(255, 103, 103)', 'rgb(255, 164, 164)'], // 波浪字的顏色
        outline: { // 外框顏色
          show: true,
          borderDistance: 3, // 外框和水球距離
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 5, // 外框寬度
          },
        },
      },
    ],
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

onMounted(async () => {


  const savedData = localStorage.getItem('paymentDataList');
  if (savedData) {
    accountingStore.paymentData = JSON.parse(savedData);
  }
  largePayment.value = accountingStore.paymentData || []

  setTimeout(() => {
    initLiquidFill('wholeLessChart');
  }, 100);

  const savedDataTwo = localStorage.getItem('accountingDataList');
  if (savedDataTwo) {
    accountingStore.accountingData = JSON.parse(savedDataTwo);
  }
  lists.value = accountingStore.accountingData || [];

  largePayment.value.forEach((payment: any) => {
    calculateExpense(payment.paymentName)
  })
  console.log(largePayment.value)

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
      height: calc(100% - 200px);
      width: 100%;
      padding: 20px;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d1d1;
        border-radius: 4px;
      }

      .wholeLess {
        display: flex;
        flex-direction: column;
        font-weight: bolder;
        align-items: center;

        .chartTopic {
          font-size: 24px;
          color: rgb(255, 103, 103);
          font-weight: bolder;
        }

        .switchChart {
          display: flex;
          flex-direction: row;

          .waterBallChart {
            height: 300px;
            width: 300px;
          }

          .switchButton {
            display: flex;
            flex-direction: column;
            color: rgb(255, 103, 103);
            justify-content: center;
            gap: 15px;
            cursor: pointer;
          }
        }
      }

      .assetManagement {
        font-weight: bolder;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .topic {
          background-color: rgb(255, 103, 103);
          width: 100%;
          height: 40px;
          border-radius: 5px;
          color: white;
          font-size: 20px;
          font-weight: bolder;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cash {
          width: 100%;
          background-color: #ffe3c3;
          border-radius: 5px;
          height: auto;
          padding: 10px;
          display: flex;
          flex-direction: row;
          gap: 20px;
          color: rgb(92, 92, 92);

          .left {
            width: 45%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-bottom: 10px;
            color: white;

            .button {
              display: flex;
              flex-direction: column;
              gap: 10px;

              .buttonTop {

                >div {
                  background-color: #ffa743;
                  padding: 2px 5px;
                  border-radius: 3px;
                  cursor: pointer;
                  display: flex;
                  flex-direction: row;
                  gap: 3px;
                  align-items: center;
                  justify-content: center;

                  .n-icon {
                    font-size: 20px;
                  }
                }
              }

              .buttonBottom {
                display: flex;
                flex-direction: row;
                gap: 10px;

                .c {
                  background-color: #ffa743;
                  padding: 2px 5px;
                  border-radius: 3px;
                  cursor: pointer;
                  display: flex;
                  flex-direction: row;
                  gap: 3px;
                  align-items: center;

                  .n-icon {
                    font-size: 20px;
                  }
                }
              }


            }
          }

          .list {
            width: 55%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            gap: 5px;

            .name {
              display: flex;
              flex-direction: row;

              .t {
                color: rgb(255, 103, 103);
                padding: 1px 8px;
                font-weight: bolder;
              }

              .smallcontent {

                >span {
                  color: red;
                }
              }
            }

            .smallname {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .smallleft {
                display: flex;
                flex-direction: row;

                .smallt {
                  color: rgb(255, 103, 103);
                  padding: 1px 8px;
                  font-weight: bolder;
                }
              }

              >p {
                background-color: rgb(141, 141, 141);
                padding: 0 5px;
                color: white;
                border-radius: 3px;

              }

              .deleted {
                background-color: rgb(189, 189, 189);
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
              }

              .default {
                .n-radio {}
              }
            }

            .c {}
          }
        }
      }

      .addAsset {
        border: 2px dotted #ffa743;
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        color: #ffa743;
        font-size: 16px;
        font-weight: bolder;
        cursor: pointer;
        flex-direction: row;
        gap: 5px;
        margin-top: 10px;

        .n-icon {
          color: #ffa743;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
