<template>
  <n-message-provider>
    <div class="box">
      <div class="background">
        <div class="type">
          <div><n-icon :component="ArrowBackIosRound" @click="router.push('/')" /></div>
          <div class="incomeExpense">
            <div :class="moneyMoreOrLest ? '' : 'active'" @click="moneyMoreOrLest = false">支出</div>
            <div :class="moneyMoreOrLest ? 'active' : ''" @click="moneyMoreOrLest = true">收入</div>
          </div>
          <div><n-icon :component="DensityMediumTwotone" /></div>
        </div>
        <div class="category">
          <div class="eachCategory" v-for="(category, idx) in filterCategories" :key="category.name"
            @click="category.name === '添加分類' ? (showAddCategory = true, isEditMode = false) : vmodelicon(category.name, category.icon, category.color)"
            @contextmenu.prevent="category.name === '添加分類' ? () => { } : dropDownMenu($event, category)">
            <n-icon :component="category.icon" :style="{ backgroundColor: category.color }" />
            <p>{{ category.name }}</p>
          </div>
        </div>
        <div class="datePickder">
          <n-date-picker v-model:value="timestamp" type="datetime" clearable />
        </div>
        <div class="amount">
          <div class="moneyInfo">
            <div class="realCategory" :style="{ backgroundColor: categoryColor }">
              <n-icon :component="categoryIcon" />
              <p>{{ categoryName }}</p>
            </div>
            <div class="description">
              <n-input v-model:value="description" type="text" :placeholder="moneyMoreOrLest ? '請輸入收入描述' : '請輸入支出描述'" />
            </div>
            <n-icon @click="showCustomizeList = true" :component="EditNoteFilled" size="40"
              :style="{ cursor: 'pointer' }" />
          </div>
          <div class="account">
            <div class="paymentList">
              <n-dropdown trigger="click" placement="bottom-start" :options="paymentOption"
                @select="paymentHandleSelect">
                <n-button><n-icon :component="MoneyOutlined" />{{ realPayment }}</n-button>
              </n-dropdown>
              <p @click="showLabelInput = true"><n-icon :component="LabelSharp" />標籤</p>
              <p @click="showAddressInput = true" :class="address ? 'selected' : ''"><n-icon
                  :component="LocationOnRound" />地址</p>
              <p @click="openReimburse" :class="reimburse.person === '' ? '' : 'selected'"><n-icon
                  :component="ReceiptFilled" />報銷</p>
              <p @click="openLenting" :class="lenting.person === '' ? '' : 'selected'"><n-icon
                  :component="FrontHandRound" />借用</p>
              <p @click="showAttachment = true" :class="attachment.length > 0 ? 'selected' : ''"><n-icon
                  :component="AttachmentFilled" />附件</p>
            </div>
          </div>
          <div class="screen">
            <n-input v-model:value="screenValue" type="text" placeholder=" " :disabled="selectedOptions.length >= 2" />
          </div>
          <div class="calculator">
            <div class="rol">
              <p @click="num('7')">7</p>
              <p @click="num('4')">4</p>
              <p @click="num('1')">1</p>
              <p @click="num('00')">00</p>
            </div>
            <div class="rol">
              <p @click="num('8')">8</p>
              <p @click="num('5')">5</p>
              <p @click="num('2')">2</p>
              <p @click="num('0')">0</p>
            </div>
            <div class="rol">
              <p @click="num('9')">9</p>
              <p @click="num('6')">6</p>
              <p @click="num('3')">3</p>
              <p @click="point()">.</p>
            </div>
            <div class="rol">
              <p class="operator" @click="operator('divide')">÷</p>
              <p class="operator" @click="operator('multiply')">×</p>
              <p class="operator" @click="operator('plus')">+</p>
              <p class="operator" @click="operator('minus')">-</p>
            </div>
            <div class="rol">
              <p class="operator" @click="clear()">AC</p>
              <p class="operator" @click="deleted()">←</p>
              <p class="long" @click="commit()">OK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <n-dropdown :show="showDropdown" :options="options" @select="handleSelect" :x="menuPosition.x" :y="menuPosition.y"
      :theme-overrides="dropdownThemeOverrides"></n-dropdown>
    <!-- 自定義詳情 -->
    <CustomizeList v-if="showCustomizeList" :closeCustomizeModal="closeCustomizeModal"
      @commitMoreDetail="addMoreDetail" />
    <!-- 加分類彈窗 -->
    <AddCategory v-if="showAddCategory" :isEditMode="isEditMode" :categoryData="editCategoryData"
      :moneyMoreOrLest="moneyMoreOrLest" :close="closeAddCategoryModal" @commitCategory="AddCategoryList"
      @commitEditCategory="handleEditCategory" :category="categories" />
    <!-- 混合支付選擇彈窗 -->
    <PaymentChoose v-if="showPaymentChoose" :paymentList="paymentOption" :openMergeAmountModal="openMergeAmountModal"
      :paymentClose="closePaymentChooseModal" @commitMergePayment="AddMergePayment" />
    <!-- 混合支付金額設置彈窗 -->
    <MergePaymentAmount v-if="showMergePaymentAmount" :closeMergeAmountModel="closeMergeAmountModel"
      :paymentList="selectedOptions" @commitMergeAmount="AddMergeAmount" />
    <!-- 輸入地址彈窗 -->
    <AddressInput v-if="showAddressInput" :closeAddressInput="closeAddressInput" @commitAddress="addAddress"
      :initialData="address" />
    <!-- 報銷詳情彈窗 -->
    <Reimburse v-if="showReimburse" :closeReimburseModel="closeReimburseModel" @commitReimburse="addReimburse"
      :paymentList="paymentOption" :initialData="reimburse" :reimburseAmount="Number(screenValue)" />
    <!-- 借貸金額彈窗 -->
    <LentOther v-if="showLentingOther" :closeLentModel="closeLentOtherModel" @commitLent="addLenting"
      :paymentList="paymentOption" :initialData="lenting" :lentAmount="Number(screenValue)" />
    <LentMyself v-if="showLentingMyself" :closeLentModel="closeLentMyselfModel" @commitLent="addLenting"
      :paymentList="paymentOption" :initialData="lenting" :lentAmount="Number(screenValue)" />
    <!-- 附件彈窗 -->
    <Attachment v-if="showAttachment" :closeAttachmentModel="closeAttachmentModel" @fileSelected="commitAttachment"
      :recordId="selectedRecordId" />
    <LabelInput v-if="showLabelInput" :closeLabelInput="closeLabelInput" @commitLabels="commitLabels"
      :initialData="label" />

  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, h, onMounted, onBeforeUnmount, shallowRef, computed, watch, nextTick, type Component } from 'vue'
import { NIcon } from 'naive-ui'
import {
  FreeBreakfastRound,
  LunchDiningRound,
  DinnerDiningRound,
  LocalDrinkFilled,
  CakeFilled,
  WineBarFilled,
  DirectionsBusFilledFilled,
  ShoppingCartFilled,
  VideogameAssetFilled,
  LocalGroceryStoreTwotone,
  HouseFilled,
  PlusOutlined,
  DeleteFilled,
  ModeEditFilled,
  AccountBalanceWalletFilled,
  AttachMoneySharp,
  TrendingUpSharp,
  HandshakeFilled,
  AccountBalanceRound,
  DeliveryDiningTwotone,
  BackHandRound,
  CleanHandsSharp,
  ArrowBackIosRound,
  DensityMediumTwotone,
  MoneyOutlined,
  LocationOnRound,
  ReceiptFilled,
  AttachmentFilled,
  FrontHandRound,
  EditNoteFilled,
  LabelSharp
} from '@vicons/material'
import AddCategory from '../components/addlist/AddCategory.vue'
import MergePaymentAmount from '../components/addlist/MergePaymentAmount.vue'
import AddressInput from '../components/addlist/AddressInput.vue'
import PaymentChoose from '../components/addlist/PaymentChoose.vue'
import Reimburse from '../components/addlist/Reimburse.vue'
import LentOther from '../components/addlist/LentOther.vue'
import LentMyself from '../components/addlist/LentMyself.vue'
import Attachment from '../components/addlist/Attachment.vue'
import CustomizeList from '../components/addlist/CustomizeList.vue'
import LabelInput from '../components/addlist/LabelInput.vue'
import { useAccountingStore } from '@/stores/accountingStore'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui';

const message = useMessage()
const route = useRoute()
const router = useRouter()
const accountingStore = useAccountingStore()

// 日期選擇器
const timestamp = ref(Date.now())

// 彈窗開關
const showDropdown = ref(false)
const showAddCategory = ref(false)
const showAddressInput = ref(false)
const showPaymentChoose = ref(false)
const showMergePaymentAmount = ref(false)
const showReimburse = ref(false)
const showLentingOther = ref(false)
const showLentingMyself = ref(false)
const showAttachment = ref(false)
const showCustomizeList = ref(false)
const showLabelInput = ref(false)

// 計算機
const screenValue = ref('0')
const operatorValue = ref('0')
const symbol = ref<string | null>(null)
const coverOldNum = ref(false)

const selectedRecordId = ref(1)
const categoryName = ref('早餐')
const categoryIcon = ref<Component>(FreeBreakfastRound)
const categoryColor = ref('#dc6980')
const description = ref(null)
const moneyMoreOrLest = ref(false)
const isEditMode = ref(false)
const menuPosition = ref({ x: 0, y: 0 })
const existingCategory = ref({ id: -1, name: '', color: '', icon: FreeBreakfastRound })
const editCategoryData = ref({ id: -1, name: '', color: '', icon: null })
const moreDetail = ref<{ [key: string]: string }[]>([])
const moreDetailTextArea = ref('')
const address = ref('')
const reimburse = ref({
  person: '',
  contact: '',
  detail: '',
  amount: null,
  account: '',
  reimburseOrNot: false,
  doneDate: Date.now(),
  deadLine: Date.now(),
  reimburseAll: '全部報銷'
})
const lenting = ref({
  type: true,
  person: '',
  contact: '',
  detail: '',
  amount: null,
  account: '',
  payOrNot: false,
  doneDate: Date.now(),
  deadLine: Date.now(),
  lentAll: '全部借款'
})
// 已有的所有支付方式
const paymentOption = ref([
  { label: '混合支付（兩種支付方式）', key: '混合' }
])
const attachment = ref({})
const label = ref<string[]>([])
// 選擇的支付方式
const selectedOptions = ref<string[]>([])
// 混合支付金額設定
const inputValues = ref({})
const realPayment = ref(paymentOption.value[0].key)
const gotPayment = ref(false)
const lists = ref<any[]>([])
const largePayment = ref<any[]>([])

const options = [
  {
    label: '編輯',
    key: 1,
    icon: () => h(NIcon, null, { default: () => h(ModeEditFilled) })
  },
  {
    label: '刪除',
    key: 2,
    icon: () => h(NIcon, null, { default: () => h(DeleteFilled) })
  },
]

// 關閉彈窗
function closeAddCategoryModal() {
  showAddCategory.value = false
}
function closePaymentChooseModal() {
  showPaymentChoose.value = false
}
function closeAddressInput() {
  showAddressInput.value = false
}
function closeReimburseModel() {
  showReimburse.value = false
}
function closeLentMyselfModel() {
  showLentingMyself.value = false
}
function closeLentOtherModel() {
  showLentingOther.value = false
}
function closeAttachmentModel() {
  showAttachment.value = false
}
function closeMergeAmountModel() {
  showMergePaymentAmount.value = false
}
function openMergeAmountModal() {
  showMergePaymentAmount.value = true
}
function closeCustomizeModal() {
  showCustomizeList.value = false
}
function closeLabelInput() {
  showLabelInput.value = false
}

// 選擇種類和下方輸入同步
function vmodelicon(name: string, icon: Component, color: string) {
  categoryName.value = name
  categoryIcon.value = icon
  categoryColor.value = color
}

// 篩選預設支出和收入分類
const filterCategories = computed(() => {
  return categories.value.filter(category => {
    if (moneyMoreOrLest.value === true) {
      return category.type === '收入' || category.type === ''
    } else {
      return category.type === '支出' || category.type === ''
    }
  })
})

function paymentHandleSelect(value: any) {
  gotPayment.value = true
  realPayment.value = value
  if (value === '混合') {
    showPaymentChoose.value = true
    selectedOptions.value = value
  } else {
    selectedOptions.value.push(value)
    showPaymentChoose.value = false
  }
}

function openReimburse() {
  if (lenting.value.person !== '') {
    message.warning('你不能同時報銷又借錢，我說不行就不行')
    return
  }
  showReimburse.value = true
}

function openLenting() {
  if (reimburse.value.person !== '') {
    message.warning('你不能同時報銷又借錢，我說不行就不行')
    return
  }
  if (moneyMoreOrLest.value) {
    showLentingMyself.value = true
  } else {
    showLentingOther.value = true
  }
}

// ------------------------ 【子傳父】 -----------------------------
// 傳入選了哪兩個付款方式
function AddMergePayment(list: any) {
  showPaymentChoose.value = false
  selectedOptions.value = list
}

// 傳入兩種付款方式分別是多少錢
function AddMergeAmount(object: any) {
  showMergePaymentAmount.value = false
  inputValues.value = object
}

// 傳入自定義詳情
function addMoreDetail(detail: any) {
  showCustomizeList.value = false
  moreDetail.value = detail[0]
  moreDetailTextArea.value = detail[1]
}

// 傳入地址
function addAddress(add: string) {
  address.value = add
}

// 傳入報銷詳情
function addReimburse(info: any) {
  reimburse.value = info
  console.log(reimburse.value)
}

// 傳入欠款詳情
function addLenting(info: any) {
  lenting.value = info
}

// 傳入附件
function commitAttachment(data: any) {
  attachment.value = data
}

// 傳入標籤
function commitLabels(data: any) {
  label.value = data
}

// ------------------------ 計算機區域 -----------------------------
function num(number: string) {
  if (coverOldNum.value === true || screenValue.value === '0') {
    screenValue.value = number
    coverOldNum.value = false
  } else {
    screenValue.value += number
  }
}

function point() {
  if (!screenValue.value.includes('.')) {
    screenValue.value += '.'
  }
}

function clear() {
  screenValue.value = '0'
  operatorValue.value = '0'
  symbol.value = null
  coverOldNum.value = false
}

function deleted() {
  screenValue.value = screenValue.value.slice(0, -1)
}

function operator(sym: string) {
  if (coverOldNum.value === false && symbol.value) {
    equal()
  }
  operatorValue.value = screenValue.value
  symbol.value = sym
  coverOldNum.value = true
}

function equal() {
  if (symbol.value === null) return

  const b = Number(screenValue.value)
  const a = Number(operatorValue.value)

  console.log(screenValue.value, operatorValue.value)

  switch (symbol.value) {
    case 'divide':
      screenValue.value = (a / b).toString()
      break
    case 'multiply':
      screenValue.value = (a * b).toString()
      break
    case 'plus':
      screenValue.value = (a + b).toString()
      break
    case 'minus':
      screenValue.value = (a - b).toString()
      break
  }
  symbol.value = null
  coverOldNum.value = true
}

// 將時間戳轉換為年月日
const processingDate = (num: number) => {
  const date = new Date(num)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 將時間戳轉換為時間
const processingTime = (num: number) => {
  const date = new Date(num)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours} : ${minutes}`
}

function commit() {
  if (coverOldNum.value === false && symbol.value) {
    const b = Number(screenValue.value)
    const a = Number(operatorValue.value)

    switch (symbol.value) {
      case 'divide':
        screenValue.value = (a / b).toString()
        break
      case 'multiply':
        screenValue.value = (a * b).toString()
        break
      case 'plus':
        screenValue.value = (a + b).toString()
        break
      case 'minus':
        screenValue.value = (a - b).toString()
        break
    }
    symbol.value = null
    coverOldNum.value = true
  }

  if (route.query.mode !== 'edit') {
    // 如果是新增的話
    selectedRecordId.value = accountingStore.accountingData.length + 1

    const dataToSubmit = {
      id: selectedRecordId.value,
      icon: categoryIcon.value,
      category: categoryName.value,
      description: description.value,
      amount: screenValue.value,
      date: processingDate(timestamp.value),
      time: processingTime(timestamp.value),
      timeStamp: new Date(timestamp.value).toISOString(),
      color: categoryColor.value,
      type: moneyMoreOrLest.value ? '收入' : '支出',
      payment: gotPayment.value ? selectedOptions.value : ['現金'],
      mixPayment: selectedOptions.value.length === 2 ? { ...inputValues.value } : null,
      informationList: moreDetail.value,
      address: address.value,
      information: moreDetailTextArea.value,
      reimburse: reimburse.value,
      lent: lenting.value,
      attachment: attachment.value,
      label: label.value
    }

    accountingStore.setAccountingData(dataToSubmit)
    localStorage.setItem('accountingDataList', JSON.stringify(accountingStore.accountingData));
    router.push('/')
    console.log(dataToSubmit)
  } else {
    // 如果是修改的話
    const dataId = Number(route.query.dataId)

    const updatedData = {
      id: selectedRecordId.value,
      icon: categoryIcon.value,
      category: categoryName.value,
      description: description.value,
      amount: screenValue.value,
      date: processingDate(timestamp.value),
      time: processingTime(timestamp.value),
      timeStamp: new Date(timestamp.value).toISOString(),
      color: categoryColor.value,
      type: moneyMoreOrLest.value ? '收入' : '支出',
      payment: gotPayment.value ? selectedOptions.value : ['現金'],
      mixPayment: selectedOptions.value.length === 2 ? { ...inputValues.value } : null,
      informationList: moreDetail.value,
      address: address.value,
      information: moreDetailTextArea.value,
      reimburse: reimburse.value,
      lent: lenting.value,
      attachment: attachment.value
    }

    accountingStore.updateAccountingData(dataId, updatedData)
    localStorage.setItem('accountingListData', JSON.stringify(accountingStore.accountingData));
    router.push('/')
  }
}
//------------------------------------------------------------------

// 修改菜单背景颜色
const dropdownThemeOverrides = {
}

watch(showReimburse, (newVal) => {
  console.log(newVal);
});

// 下拉框點擊其他地方會收起
function handleGlobalClick(event: MouseEvent) {
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
  const savedData = localStorage.getItem('paymentDataList');
  if (savedData) {
    accountingStore.paymentData = JSON.parse(savedData);
  }
  largePayment.value = accountingStore.paymentData || []
  lists.value = accountingStore.accountingData || [];

  for (let i = 0; i < largePayment.value.length; i++) {
    paymentOption.value.push({ label: largePayment.value[i].paymentName, key: largePayment.value[i].paymentName })
  }

  if (route.query.mode === 'edit') {
    const dataId = Number(route.query.dataId)
    const thisOne = lists.value.find((item: any) => item.id === dataId)
    if (thisOne) {
      screenValue.value = thisOne.amount
      categoryName.value = thisOne.category
      categoryIcon.value = thisOne.icon
      categoryColor.value = thisOne.color
      description.value = thisOne.description
      moneyMoreOrLest.value = thisOne.type === '收入' ? true : false
      moreDetail.value = thisOne.informationList
      moreDetailTextArea.value = thisOne.information
      address.value = thisOne.address
      reimburse.value = thisOne.reimburse
      lenting.value = thisOne.lent
      selectedOptions.value = thisOne.payment
      timestamp.value = thisOne.timeStamp
      inputValues.value = thisOne.mixPayment
      attachment.value = thisOne.attachment
    }
    console.log(route.query.mode)
    console.log(thisOne)
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleGlobalClick)
})

// 增加分類 (必須加在倒數第二，'添加分類'前面)
function AddCategoryList(newCategory: { name: string, color: string, icon: Component }) {
  const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1;
  const categoryType = moneyMoreOrLest.value ? '收入' : '支出'

  const completeCategory = {
    id: newId,
    name: newCategory.name,
    color: newCategory.color,
    icon: newCategory.icon,
    type: categoryType
  };

  let categoryPushIdx = categories.value.length - 1
  categories.value.splice(categoryPushIdx, 0, completeCategory)
  closeAddCategoryModal()
}

// 打開下拉框
function dropDownMenu(event: MouseEvent, category: Category) {
  existingCategory.value = category
  showDropdown.value = true
  menuPosition.value = { x: event.clientX + 40, y: event.clientY }
}

// 下拉框選擇 1編輯 or 2刪除
function handleSelect(key: number) {
  if (key === 1) {
    editCategory(existingCategory)
  } else {
    deleteCategory(existingCategory)
  }
}

// 編輯分類行為
function editCategory(category: any) {
  editCategoryData.value = { ...category }
  isEditMode.value = true
  showAddCategory.value = true
  return editCategoryData.value
}

// 保存編輯分類行為
function handleEditCategory(updatedCategory: any) {
  const idx = categories.value.findIndex(category => category.id === updatedCategory.id)
  if (idx !== -1) {
    categories.value[idx] = updatedCategory
  }
  closeAddCategoryModal()
}

function deleteCategory(category: any) {
  const idx = categories.value.findIndex(item => item.id === category._value.id)
  if (idx !== -1) {
    categories.value.splice(idx, 1)
  }
  showDropdown.value = false
}

type Category = {
  id: number,
  name: string,
  color: string,
  icon: any,
  type: string
}

const categories = ref<Category[]>([
  {
    id: 1,
    icon: FreeBreakfastRound,
    color: '#dc6980',
    name: '早餐',
    type: '支出'
  },
  {
    id: 2,
    icon: LunchDiningRound,
    color: '#d5be4f',
    name: '午餐',
    type: '支出'
  },
  {
    id: 3,
    icon: DinnerDiningRound,
    color: '#2ea662',
    name: '晚餐',
    type: '支出'
  },
  {
    id: 4,
    icon: LocalDrinkFilled,
    color: '#73a1bd',
    name: '飲料',
    type: '支出'
  },
  {
    id: 5,
    icon: CakeFilled,
    color: '#baa4c9',
    name: '點心',
    type: '支出'
  },
  {
    id: 6,
    icon: WineBarFilled,
    color: '#6f84ba',
    name: '煙酒',
    type: '支出'
  },
  {
    id: 7,
    icon: DirectionsBusFilledFilled,
    color: '#76b1bd',
    name: '交通',
    type: '支出'
  },
  {
    id: 8,
    icon: ShoppingCartFilled,
    color: '#da8f86',
    name: '購物',
    type: '支出'
  },
  {
    id: 9,
    icon: VideogameAssetFilled,
    color: '#d3b97c',
    name: '娛樂',
    type: '支出'
  },
  {
    id: 10,
    icon: LocalGroceryStoreTwotone,
    color: '#23c9b5',
    name: '借錢',
    type: '支出'
  },
  {
    id: 11,
    icon: HouseFilled,
    color: '#dad6b9',
    name: '房租',
    type: '支出'
  },
  {
    id: 12,
    icon: AccountBalanceWalletFilled,
    color: '#8d5554',
    name: '薪水',
    type: '收入'
  },
  {
    id: 13,
    icon: AttachMoneySharp,
    color: '#76604c',
    name: '獎金',
    type: '收入'
  },
  {
    id: 14,
    icon: TrendingUpSharp,
    color: '#f9c32e',
    name: '股票',
    type: '收入'
  },
  {
    id: 15,
    icon: HandshakeFilled,
    color: '#f09678',
    name: '交易',
    type: '收入'
  },
  {
    id: 16,
    icon: DeliveryDiningTwotone,
    color: '#b0be61',
    name: '贈予',
    type: '收入'
  },
  {
    id: 17,
    icon: AccountBalanceRound,
    color: '#76c8e8',
    name: '投資',
    type: '收入'
  },
  {
    id: 18,
    icon: CleanHandsSharp,
    color: '#d43d3c',
    name: '乞討',
    type: '收入'
  },
  {
    id: 19,
    icon: BackHandRound,
    color: '#ed768e',
    name: '撿到',
    type: '收入'
  },
  {
    id: 20,
    icon: PlusOutlined,
    color: '#afafaf',
    name: '添加分類',
    type: ''
  }
])

</script>


<style scoped lang="scss">
.box {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  font-weight: 300;

  .background {
    width: 500px;
    background-color: rgb(255, 244, 230);

    .type {
      display: flex;
      flex-direction: row;
      background-color: rgb(255, 103, 103);
      height: 100px;
      color: white;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;

      .n-icon {
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .incomeExpense {
        display: flex;
        flex-direction: row;
        cursor: pointer;

        >div {
          width: 150px;
          height: 40px;
          border: 2px white solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bolder;
          font-size: 20px;

          &.active {
            background-color: white;
            color: rgb(255, 103, 103);
          }

          &:nth-child(1) {
            border-radius: 5px 0 0 5px;
          }

          &:nth-child(2) {
            border-left: none;
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }

    .category {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(3, 1fr);
      justify-content: center;
      align-items: center;
      gap: 10px;
      max-height: 220px;
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

      .eachCategory {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        height: 80px;

        .n-icon {
          font-size: 20px;
          height: 40px;
          width: 40px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }

        >p {
          font-size: 15px;
        }
      }
    }

    .mask {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.336);
      top: 100px;
      right: 710px;
      height: 220px;
      width: 500px;
      font-weight: bolder;

      .background {
        position: absolute;
        width: 300px;
        background-color: rgb(255, 255, 255);
        top: 9%;
        right: 19%;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 15px 25px;
        border-radius: 5px;

        .eachPayment {
          display: flex;
          flex-direction: row;
          gap: 5px;
          align-items: center;

          >p {
            width: 30%;
            font-size: 15px;
            font-weight: bolder;
          }

          :deep(.n-input) {
            --n-height: 40px !important;
            --n-font-size: 14px !important;
            --n-height: 40px !important;
            --n-border-radius: 5px !important;
            --n-padding-left: 20px !important;
            --n-border: 1px solid rgb(209, 209, 209) !important;
            --n-border-disabled: 1px solid rgb(209, 209, 209) !important;
            --n-border-hover: 1px solid rgb(209, 209, 209) !important;
            --n-border-focus: 1px solid rgb(209, 209, 209) !important;
            --n-box-shadow-focus: 0 0 0 2px rgb(209, 209, 209) !important;
            --n-caret-color: black !important;
            width: 75%;
          }
        }

        .result {
          display: flex;
          flex-direction: row;
          gap: 30px;
          justify-content: center;
          padding-top: 2px;

          >div {
            height: 30px;
            width: 50px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(255, 103, 103);
            cursor: pointer;

            &.cancel {
              background-color: rgb(255, 103, 103);
            }
          }
        }
      }
    }

    .datePickder {
      :deep(.n-date-picker) {

        .n-input,
        .n-input--resizable,
        .n-input--stateful {
          --n-color: rgb(255, 103, 103) !important;
          --n-color-focus: rgb(255, 103, 103) !important;
          --n-font-size: 20px !important;
          --n-height: 40px !important;
          --n-text-color: rgb(255, 255, 255) !important;
          --n-border: 1px solid transparent !important;
          --n-border-hover: 1px solid black !important;
          --n-border-focus: 1px solid black !important;
          --n-box-shadow-focus: transparent !important;
          --n-icon-color: transparent !important;
          // --n-border-radius: 20px !important;
          width: 500px;

          .n-input__input-el {
            text-align: center;
          }

          .n-input__placeholder {
            text-align: center;
          }
        }
      }
    }

    .amount {
      // 添加錶盤
      width: 500px;
      background-color: rgb(255, 180, 94);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      gap: 23px;
      height: calc(100% - 360px);

      .screen {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 350px;
        height: 50px;
        background-color: white;
        border-radius: 20px;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.356);

        .n-input {
          width: 200px;
          --n-font-size: 30px !important;
          --n-height: 50px !important;
          --n-border-radius: 20px !important;
          --n-padding-left: 20px !important;
          --n-border: 1px solid transparent !important;
          --n-border-disabled: 1px solid transparent !important;
          --n-border-hover: 1px solid transparent !important;
          --n-border-focus: 1px solid transparent !important;
          --n-box-shadow-focus: 0 0 0 2px transparent !important;
          --n-caret-color: black !important;
        }

        .warning {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding-right: 10px;
          cursor: pointer;

          .n-icon {
            font-size: 20px;
            color: red;
          }

          >p {
            font-size: 16px;
            font-weight: bolder;
          }
        }
      }

      .moneyInfo {
        display: flex;
        flex-direction: row;
        color: rgb(0, 0, 0);
        width: 400px;
        align-items: center;
        font-weight: bolder;
        justify-content: center;

        .realCategory {
          font-size: 20px;
          background-color: rgb(255, 103, 103);
          // box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.356);
          padding: 5px 10px 5px 12px;
          font-weight: bolder;
          display: flex;
          flex-direction: row;
          border-radius: 21px 0 0 21px;
          align-items: center;

          >p {
            padding-left: 10px;
          }
        }

        .description {
          font-size: 18px;
          width: 250px;
          border-bottom: 1px solid rgb(0, 0, 0);
          // box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.356);
          color: rgb(0, 0, 0);
          margin-left: 10px;

          .n-input {
            --n-color: transparent !important;
            --n-color-focus: transparent !important;
            --n-border: 1px solid transparent !important;
            --n-border-hover: 1px solid transparent !important;
            --n-border-focus: 1px solid transparent !important;
            --n-box-shadow-focus: 0 0 0 2px transparent !important;
            --n-placeholder-color: black !important;
            --n-font-size: 18px !important;
            --n-font-weight: bolder !important;
            --n-caret-color: black !important;
          }
        }
      }

      .account {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 500px;
        justify-content: center;
        padding: 0 50px;
        white-space: nowrap;

        .board {
          font-weight: bolder;

          .payment {
            font-size: 18px;
            font-weight: bolder;
            // border: 1px solid black;
            width: 100px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px 0 0 20px;
            background-color: rgb(255, 215, 82);
            padding: 5px 10px 5px 12px;
          }
        }


        .paymentList {
          display: flex;
          flex-direction: row;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 5px;
          width: 350px;

          /* 滚轮宽度 */
          &::-webkit-scrollbar {
            height: 3px;
          }

          /* 滑块 */
          &::-webkit-scrollbar-thumb {
            background: #d1d1d1;
            border-radius: 4px;
          }

          :deep(.n-dropdown),
          :deep(.n-dropdown-menu) {
            --n-font-size: 18px !important;
          }

          :deep(.n-button) {
            --n-height: 35px !important;
            --n-width: 90px !important;
            --n-color: rgb(255, 199, 15) !important;
            --n-color-hover: rgb(255, 199, 15) !important;
            --n-color-pressed: rgb(255, 199, 15) !important;
            --n-color-focus: rgb(255, 199, 15) !important;
            --n-text-color: black !important;
            --n-text-color-hover: black !important;
            --n-text-color-pressed: black !important;
            --n-text-color-focus: black !important;
            --n-border: transparent !important;
            --n-border-hover: transparent !important;
            --n-border-pressed: transparent !important;
            --n-border-focus: transparent !important;
            --n-font-size: 18px !important;
            --n-padding: 0 !important;
            --n-ripple-color: transparent !important;

            .n-icon {
              margin-right: 5px;
            }
          }

          >p {
            height: 35px;
            font-size: 18px;
            font-weight: bolder;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            color: black;
            flex-shrink: 0;
            cursor: pointer;
            padding: 0 8px;
            background-color: rgb(255, 215, 82);

            .n-icon {
              margin-right: 5px;
            }

            &.selected {
              background-color: rgb(255, 199, 15);
            }
          }
        }

      }

      .calculator {
        display: flex;
        flex-direction: row;
        gap: 15px;
        padding: 0 20px;
        justify-content: center;

        .rol {
          display: flex;
          flex-direction: column;
          gap: 15px;

          >p {
            cursor: pointer;
            font-size: 30px;
            font-weight: bolder;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: rgb(255, 244, 230);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.356);

            &.long {
              height: 140px;
              border-radius: 30px;
              background-color: rgb(255, 103, 103);
            }

            &.operator {
              background-color: rgb(137, 188, 236);
            }
          }
        }
      }
    }
  }
}
</style>