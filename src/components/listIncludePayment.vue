<template>
  <div class="mask">
    <div class="background">
      <div class="topic">
        <p>流水賬一覽表</p>
        <n-icon :component="CloseFilled" @click="closePaymentList()" />
      </div>
      <div class="content">
        <div class="paymentBasicInfo">
          <p><span>種類：</span>{{ paymentInfo.paymentType }}</p>
          <p><span>名稱：</span>{{ paymentInfo.paymentName }}</p>
        </div>
        <div class="paymentAmount">
          <p><span>現存金額：</span><span class="num">10000</span>元</p>
          <p><span>總消費：</span><span class="num">{{ expense }}</span>元</p>
        </div>
        <table>
          <tbody>
            <tr v-for="list in paymentDetailList">
              <td>
                <div class="kindWithIcon"><n-icon :component="list.icon" />
                  <p>{{ list.category }}</p>
                </div>
              </td>
              <td>{{ list.date.replace('2024年', '') }} {{ list.time }}</td>
              <td>{{ list.description }}</td>
              <td><span class="tableNum">{{ list.amount }}</span>元
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { CloseFilled, FreeBreakfastRound } from '@vicons/material'
import { useAccountingStore } from '@/stores/accountingStore'

const accountingStore = useAccountingStore()
const lists: any = ref([])
const paymentDetailList: any = ref([])
const paymentLists: any = ref([])
const paymentInfo: any = ref([])
const expense = ref(0)

const props = defineProps({
  closePaymentList: {
    type: Function,
    required: true
  },
  selectedAsset: {
    type: String,
    required: true
  }
})


watch(lists, (newVal) => {
  paymentDetailList.value = newVal.filter((item: any) => item.payment.includes(props.selectedAsset))
  console.log(paymentDetailList.value)
})

onMounted(() => {
  const savedData = localStorage.getItem('accountingDataList');
  if (savedData) {
    accountingStore.accountingData = JSON.parse(savedData);
  }
  lists.value = accountingStore.accountingData || [];
  const savedDataTwo = localStorage.getItem('paymentDataList');
  if (savedDataTwo) {
    accountingStore.paymentData = JSON.parse(savedDataTwo);
  }
  paymentLists.value = accountingStore.paymentData || [];
  const index = paymentLists.value.findIndex((item: any) => item.paymentName === props.selectedAsset)
  if (index !== -1) {
    paymentInfo.value = paymentLists.value[index]
  }
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
    height: 560px;
    width: 400px;
    border-radius: 3px;
    top: 80px;
    right: 45px;
    display: flex;
    flex-direction: column;

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
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: rgb(73, 73, 73);

      .paymentBasicInfo {
        display: flex;
        flex-direction: row;

        >p {
          width: 50%;

          >span {
            color: rgb(255, 103, 103);
          }
        }
      }

      .paymentAmount {
        display: flex;
        flex-direction: row;

        >p {
          width: 50%;

          >span {
            color: rgb(255, 103, 103);

            &.num {
              color: red;
            }
          }
        }
      }

      table {
        border-collapse: collapse;

        tr {

          &:nth-child(odd) {
            background-color: #fff4e6;
          }

          &:nth-child(even) {
            background-color: #ffebd1;
          }

          td {
            text-align: center;
            padding: 3px 0;

            .kindWithIcon {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
            }

            .tableNum {
              color: rgb(255, 103, 103);
            }

            &:nth-child(1) {
              width: 15%;
            }

            &:nth-child(2) {
              width: 35%;
            }

            &:nth-child(3) {
              width: 35%;
            }

            &:nth-child(4) {
              width: 15%;
            }
          }
        }
      }
    }
  }
}
</style>