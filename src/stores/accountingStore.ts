import { defineStore } from 'pinia'
import type { Component } from 'vue'
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
  CleanHandsSharp
} from '@vicons/material'

const iconMap = {
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
}

type AccountingEntry = {
  id: number,
  icon: Component | null,
  category: string,
  description: string | null,
  amount: string,
  date: string,
  time: string,
  timeStamp: number,
  color: string,
  type: string,
  payment: any,
  mixPayment: any,
  informationList: any,
  address: any,
  information: string,
  reimburse: any,
  lent: any,
  attachment: { name: string; image: string | null } | null;
}

type PaymentEntry = {
  paymentType: string,
  paymentName: string,
  paymentDescription: string,
  cardLastCode: string,
  cardBank: string,
  paymentTime: string,
  paymentBasicAmount: number,
  creditCardTopAmount: number,
  default: boolean,
  picture: string,
  paymentNowAccount: number,
  paymentExpense: number
}

export const useAccountingStore = defineStore('accounting', {
  state: () => ({
    accountingData: [] as AccountingEntry[],
    paymentData: [] as PaymentEntry[]
  }),
  actions: {
    // 增加收支項目
    setAccountingData(data: AccountingEntry) {
      this.accountingData.push(data)
      localStorage.setItem('accountingDataList', JSON.stringify(this.accountingData))
    },
    // 增加支出方式
    setPaymentData(data: PaymentEntry) {
      this.paymentData.push(data)
      localStorage.setItem('paymentDataList', JSON.stringify(this.paymentData))
    },
    // 修改收支項目
    updateAccountingData(id: number, data: AccountingEntry) {
      const index = this.accountingData.findIndex((item: any) => item.id === id)
      if (index !== -1) {
        this.accountingData[index] = { ...this.accountingData[index], ...data }
      }
    },
    // 增加附件
    setAttachmentData(id: number, name: any, image: any | null) {
      const record = this.accountingData.find((item: any) => item.id === id)
      if (record) {
        record.attachment = { name, image }
      }
    }
  }
})