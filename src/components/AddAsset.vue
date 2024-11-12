<template>
  <div class="mask">
    <div class="background">
      <div class="topic">
        <p>新增資產</p>
        <n-icon :component="CloseFilled" @click="closeAddAsset()" />
      </div>
      <div class="content">
        <div class="picture">
          <img v-if="showPicture === '現金'" src="@/assets/cash.png" style="height:200px">
          <img v-if="showPicture === '金融卡'" src="@/assets/debitCard.png" style="height:200px">
          <img v-if="showPicture === '信用卡'" src="@/assets/creditCard.png" style="width:200px">
          <img v-if="showPicture === '悠遊卡'" src="@/assets/easyCard.png" style="height:200px">
          <img v-if="showPicture === '禮券'" src="@/assets/coupon.png" style="height:200px">
          <img v-if="showPicture === '自定義種類'" src="@/assets/poop.png" style="height:200px">
        </div>
        <div class="list">
          <div class="eachone">
            <p>種類: </p>
            <n-dropdown v-if="!showInput" trigger="click" placement="bottom-start" :options="paymentTypeOption"
              @select="paymentHandleSelect">
              <n-button v-if="!paymentType">請選擇種類<n-icon :component="KeyboardArrowDownOutlined"
                  :style="{ paddingLeft: '10px' }" /></n-button>
              <n-button v-else>{{ paymentType }}<n-icon :component="KeyboardArrowDownOutlined"
                  :style="{ paddingLeft: '10px' }" /></n-button>
            </n-dropdown>
            <n-input v-if="showInput" v-model:value="typeValue" type="text" placeholder="請輸入種類"
              @keyup.enter="addPayment" />
          </div>
          <div class="eachone">
            <p>名稱: </p>
            <n-input v-model:value="nameValue" type="text" placeholder="請輸入名稱" />
          </div>
          <div class="eachone">
            <p>描述: </p>
            <n-input v-model:value="descriptionValue" type="text" placeholder="請輸入描述" />
          </div>
          <div class="eachone" v-if="showPicture === '信用卡' || showPicture === '金融卡'">
            <p>卡號: </p>
            <div class="account">xxxx - xxxx - xxxx - <n-input class="fourCode" v-model:value="cardLastFourCode"
                type="text" placeholder="後四碼" /></div>
          </div>
          <div class="eachone" v-if="showPicture === '信用卡' || showPicture === '金融卡'">
            <p>銀行: </p>
            <n-input v-model:value="bankValue" type="text" placeholder="請輸入銀行" />
          </div>
          <div class="eachone">
            <p>預支或現支: </p>
            <n-radio-group v-model:value="paytimeValue" name="radiogroup" disabled>
              <n-space>
                <n-radio v-for="song in payTiming" :key="song.value" :value="song.value">
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </div>
          <div v-if="showPicture === '信用卡'" class="eachone">
            <p>信用卡額度</p>
            <n-input-number v-model:value="topAmountValue" clearable />
          </div>
          <div class="eachone" v-if="showPicture !== '信用卡'">
            <p>設定初始金額: </p>
            <n-input-number v-model:value="amountValue" clearable />
          </div>
          <div class="eachone">
            <p>設為預設: </p>
            <n-switch v-model:value="defaultOrNot" />
          </div>
        </div>
        <div class="confirm">
          <p @click="commitPayment()">確定</p>
          <p @click="closeAddAsset()">取消</p>
          <p @click="reset()">重新輸入</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { CloseFilled, KeyboardArrowDownOutlined } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'
import { useMessage } from 'naive-ui'

const message = useMessage()
const accountingStore = useAccountingStore()
const typeValue = ref('')
const showInput = ref(false)
const nameValue = ref('')
const descriptionValue = ref('')
const cardLastFourCode = ref('')
const bankValue = ref('')
const paytimeValue = ref('')
const lists = ref<any[]>([])
const filterPayment = ref<any[]>([])
const topAmountValue = ref(0)
const amountValue = ref(0)
const showPicture = ref('現金')
const defaultOrNot = ref(false)
const paymentTypeOption = ref([
  { label: '現金', key: '現金' },
  { label: '金融卡', key: '金融卡' },
  { label: '信用卡', key: '信用卡' },
  { label: '悠遊卡', key: '悠遊卡' },
  { label: '禮券', key: '禮券' },
  { label: '自定義種類', key: '自定義種類' }])
const paymentType = ref('')
const payTiming = [{ label: '現付', value: '現付' }, { label: '預支', value: '預支' }]
const largePayment = ref<any[]>([])

const props = defineProps({
  closeAddAsset: {
    type: Function,
    required: true
  }
})

function paymentHandleSelect(value: string) {
  showPicture.value = value
  paymentType.value = value
  paytimeValue.value = value === '信用卡' ? '預支' : '現付'
  if (paymentType.value === '自定義種類') {
    showInput.value = true
  }
}

function addPayment() {
  paymentTypeOption.value.push({ label: typeValue.value, key: typeValue.value })
  showInput.value = false
  paymentType.value = typeValue.value
}

function reset() {
  nameValue.value = ''
  descriptionValue.value = ''
  cardLastFourCode.value = ''
  bankValue.value = ''
  paytimeValue.value = ''
  topAmountValue.value = 0
  amountValue.value = 0
  showPicture.value = '現金'
  defaultOrNot.value = false
  paymentType.value = ''
  showInput.value = false
}

function calculateExpense(payment: string) {
  filterPayment.value = lists.value.filter((item: any) => item.payment.includes(payment))
  const expenseAmount = filterPayment.value.reduce((sum, list) => sum + Number(list.amount), 0)
  return expenseAmount
}

const picSrc = computed(() => {
  switch (paymentType.value) {
    case '現金': return new URL('@/assets/cash.png', import.meta.url).href;
    case '金融卡': return new URL('@/assets/debitCard.png', import.meta.url).href;
    case '信用卡': return new URL('@/assets/creditCard.png', import.meta.url).href;
    case '悠遊卡': return new URL('@/assets/easyCard.png', import.meta.url).href;
    case '禮券': return new URL('@/assets/coupon.png', import.meta.url).href;
    default: return new URL('@/assets/poop.png', import.meta.url).href;
  }
});

function commitPayment() {
  if (paymentType.value === '信用卡') {
    if (!paymentType.value || !nameValue.value || !topAmountValue.value) {
      message.warning('種類、名稱、信用卡額度不能為空')
      return
    }
  }
  if (!paymentType.value || !nameValue.value || !amountValue.value) {
    message.warning('種類、名稱、初始金額不能為空')
    return
  }

  let defaultArr = largePayment.value.map(arr => arr.default)
  let defaultFilterArr = defaultArr.filter(thing => (thing))
  if (defaultFilterArr.length === 1 && defaultOrNot.value === true) {
    message.warning('預設支付方式只能有一個，請先取消其他的預設支付方式')
  }

  const paymentInfo = {
    paymentType: paymentType.value,
    paymentName: nameValue.value,
    paymentDescription: descriptionValue.value,
    cardLastCode: cardLastFourCode.value,
    cardBank: bankValue.value,
    paymentTime: paytimeValue.value,
    paymentBasicAmount: amountValue.value,
    creditCardTopAmount: topAmountValue.value,
    default: defaultOrNot.value,
    picture: picSrc.value,
    paymentNowAccount: amountValue.value - calculateExpense(nameValue.value),
    paymentExpense: calculateExpense(nameValue.value)
  }

  accountingStore.setPaymentData(paymentInfo)
  // 存本地local
  localStorage.setItem('paymentDataList', JSON.stringify(accountingStore.paymentData));
  props.closeAddAsset()
}

onMounted(() => {
  const savedDataTwo = localStorage.getItem('accountingDataList');
  if (savedDataTwo) {
    accountingStore.accountingData = JSON.parse(savedDataTwo);
  }
  lists.value = accountingStore.accountingData || [];

  const savedData = localStorage.getItem('paymentDataList');
  if (savedData) {
    accountingStore.paymentData = JSON.parse(savedData);
  }
  largePayment.value = accountingStore.paymentData || []
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
      padding: 15px 30px 30px 30px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d1d1;
        border-radius: 4px;
      }

      .picture {
        width: 100%;
        display: flex;
        justify-content: center;

        >img {
          background-color: #fff4e6;
          border-radius: 50%;
        }
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .eachone {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;

          .account {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 16px;
            letter-spacing: 2px;

            .n-input {
              width: 90px !important;
              --n-border-hover: 1px solid rgb(224, 224, 230) !important;
              --n-border-focus: 1px solid rgb(224, 224, 230) !important;
              --n-box-shadow-focus: transparent !important;
              --n-caret-color: black !important;
            }
          }

          .n-button {
            --n-width: calc(100% - 41.23px) !important;
            --n-color: transparent !important;
            --n-color-hover: transparent !important;
            --n-color-pressed: transparent !important;
            --n-color-focus: transparent !important;
            --n-text-color: black !important;
            --n-text-color-hover: black !important;
            --n-text-color-pressed: black !important;
            --n-text-color-focus: black !important;
            --n-border: 1px solid rgb(224, 224, 230) !important;
            --n-border-hover: 1px solid rgb(224, 224, 230) !important;
            --n-border-pressed: 1px solid rgb(224, 224, 230) !important;
            --n-border-focus: 1px solid rgb(224, 224, 230) !important;
            --n-padding: 0 !important;
            --n-ripple-color: transparent !important;
          }

          .n-input {
            width: calc(100% - 41.23px) !important;
            --n-border-hover: 1px solid rgb(224, 224, 230) !important;
            --n-border-focus: 1px solid rgb(224, 224, 230) !important;
            --n-box-shadow-focus: transparent !important;
            --n-caret-color: black !important;

            &.fourCode {
              margin-left: 10px;
            }
          }

          .n-radio {
            --n-box-shadow-active: inset 0 0 0 1px rgb(255, 103, 103) !important;
            --n-box-shadow-hover: inset 0 0 0 1px rgb(255, 103, 103) !important;
            --n-dot-color-active: rgb(255, 103, 103) !important;
            --n-button-box-shadow-focus: inset 0 0 0 1px rgb(255, 103, 103), transparent !important;
          }

          .n-switch {
            --n-rail-color-active: rgb(255, 103, 103) !important;
            --n-box-shadow-focus: transparent !important;
          }
        }
      }

      .confirm {
        display: flex;
        flex-direction: row;
        gap: 15px;
        justify-content: center;

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