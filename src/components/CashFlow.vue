<template>
  <div class="mask">
    <div class="background">
      <div class="topic">
        <p>資金移轉</p>
        <n-icon :component="CloseFilled" @click="closeCashFlow()" />
      </div>
      <div class="content">
        <div class="transferingAccount">
          <p>轉出賬號</p>
          <div class="accountContent">
            <img :src="paymentInfo.picture" style="height:100px;">
            <div class="info">
              <p>{{ paymentInfo.paymentName }}</p>
              <p>現存金額：<span>{{ paymentInfo.paymentNowAccount }}</span>元</p>
            </div>
          </div>
        </div>
        <div class="receivingAccount" v-if="paymentLists2.length > 0">
          <p>轉入賬號</p>
          <div class="accountContent">
            <n-icon :component="ArrowLeftRound" @click="minus()" />
            <img :src="switchPicture" style="height:100px;">
            <div class="info">
              <p>{{ switchName }}</p>
              <p>現存金額：<span>{{ switchNowAccount }}</span>元</p>
            </div>
            <n-icon :component="ArrowRightRound" @click="plus()" />

          </div>
        </div>
        <div class="amountSection">
          <p>轉入金額</p>
          <n-input-number v-model:value="transferAmount" placeholder="請輸入移轉金額" clearable />
        </div>
        <div class="confirm">
          <p @click="transfer">確定</p>
          <p>重新輸入</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { CloseFilled, ArrowLeftRound, ArrowRightRound } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'
import { useMessage } from 'naive-ui'

const accountingStore = useAccountingStore()
const transferAmount = ref(0)
const paymentLists: any = ref([])
const paymentLists2: any = ref([])
const paymentInfo: any = ref([])
const iiindex = ref<number>(0)
const switchPicture = ref('')
const switchName = ref('')
const switchNowAccount = ref('')

const props = defineProps({
  closeCashFlow: {
    type: Function,
    required: true
  },
  selectedAsset: {
    type: String,
    required: true
  }
})

// 初始化被移轉賬戶
function updateSwitchData() {
  if (paymentLists2.value[iiindex.value]) {
    switchPicture.value = paymentLists2.value[iiindex.value].picture
    switchName.value = paymentLists2.value[iiindex.value].paymentName
    switchNowAccount.value = paymentLists2.value[iiindex.value].paymentNowAccount
  }
}

// 下一個
function plus() {
  if (iiindex.value !== paymentLists2.value.length - 1) {
    iiindex.value += 1
  } else {
    iiindex.value = 0
  }
  console.log(iiindex.value)

  updateSwitchData()
}

// 上一個
function minus() {
  if (iiindex.value === 0) {
    iiindex.value = paymentLists2.value.length - 1
  } else {
    iiindex.value -= 1
  }
  console.log(iiindex.value)

  updateSwitchData()
}

function transfer() {
  paymentInfo.value.paymentNowAccount -= transferAmount.value
  paymentLists2.value[iiindex.value].paymentNowAccount += transferAmount.value
  updateSwitchData()
}

onMounted(() => {
  const savedDataTwo = localStorage.getItem('paymentDataList');
  if (savedDataTwo) {
    accountingStore.paymentData = JSON.parse(savedDataTwo);
  }
  paymentLists.value = accountingStore.paymentData || [];

  const index = paymentLists.value.findIndex((item: any) => item.paymentName === props.selectedAsset)
  if (index !== -1) {
    paymentInfo.value = paymentLists.value[index]
  }

  paymentLists2.value = paymentLists.value.filter((item: any, idx: number) => idx !== index && item.type !== '信用卡')

  updateSwitchData()
  console.log(paymentLists2.value)
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
    height: 535px;
    width: 400px;
    border-radius: 3px;
    top: 75px;
    right: 45px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .topic {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: rgb(255, 103, 103);
      padding: 10px 20px;

      >p {
        font-size: 18px;
      }

      .n-icon {
        font-size: 24px;
        cursor: pointer;
      }
    }

    .content {
      height: calc(100% - 48.8px);
      padding: 15px 0 30px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;

      .transferingAccount,
      .receivingAccount {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;

        >p {
          font-size: 18px;
          font-weight: bolder;
          color: rgb(255, 103, 103);
          padding-left: 40px;
        }

        .accountContent {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background-color: #fff4e6;
          gap: 10px;

          .n-icon {
            font-size: 40px;
            color: gray;
            cursor: pointer;
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 10px;

            >p {

              &:nth-child(1) {
                background-color: #ffa743;
                color: white;
                text-align: center;
                font-size: 18px;
                border-radius: 3px;
                font-weight: bolder;
              }

              &:nth-child(2) {
                font-size: 16px;
              }

              >span {
                color: red;
              }
            }
          }
        }

      }

      .amountSection {
        width: 100%;
        font-size: 18px;
        font-weight: bolder;
        color: rgb(255, 103, 103);
        display: flex;
        flex-direction: row;
        padding: 10px 0 0 40px;
        gap: 10px;
        align-items: center;
      }

      .confirm {
        display: flex;
        flex-direction: row;
        margin-top: 5px;
        gap: 10px;

        >p {
          background-color: rgb(255, 103, 103);
          color: white;
          padding: 2px 10px;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>