import { defineStore } from 'pinia'
import type { Component } from 'vue'

type AccountingEntry = {
  icon: Component | null,
  category: string,
  description: string | null,
  amount: string,
  date: string,
  color: string
  type: string
}
export const useAccountingStore = defineStore('accounting', {
  state: () => ({
    accountingData: [] as AccountingEntry[]
  }),
  actions: {
    setAccountingData(data: AccountingEntry) {
      this.accountingData.push(data)
    }
  }
})