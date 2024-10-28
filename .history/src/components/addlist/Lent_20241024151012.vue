<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <div class="left">
          <p @click="lentType = '借出'" :class="lentType === '借出' ? 'selected' : ''">借出</p>
          <p @click="lentType = '欠款'" :class="lentType === '欠款' ? 'selected' : ''">欠款</p>
        </div>
        <n-icon @click="closeLentModel()" :component="CloseFilled" />
      </div>
      <div class="reimburseDetail">
        <div class="status">
          <n-space>
            狀態：<n-switch v-model:value="payOrNot" />已還錢
          </n-space>
          <div class="date" v-if="payOrNot === true">
            <p>日期：</p>
              <n-date-picker v-model:value="timestamp" type="date" />
          </div>
        </div>
        <div class="info">
          <div class="inputWrap">
            <p>{{ lentType === '借出' ? '借出' : '欠款' }}對象: </p>
            <n-input v-model:value="person" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>聯絡方式: </p>
            <n-input v-model:value="contact" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>{{ lentType === '借出' ? '借出' : '欠款' }}備註: </p>
            <n-input v-model:value="detail" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>還款方式: </p>
            <n-input v-model:value="account" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>還款日期: </p>
            <n-date-picker v-model:value="timestamp" type="date" />
          </div>
          <div class="amountWrap">
            <p>{{ lentType === '借出' ? '借出' : '欠款' }}金額: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
            <div class="amount">
              <p class="amount">全額{{ lentType === '借出' ? '借出' : '欠款' }}</p>
              <p class="amount">部分{{ lentType === '借出' ? '借出' : '欠款' }}</p>
            </div>
          </div>
        </div>
        <div class="confirm">
          <p>確定</p>
          <p>重新輸入</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CloseFilled } from '@vicons/material'

const payOrNot = ref(false)
const timestamp = ref(1183135260000)
const lentType = ref('借出')
const person = ref('')
const contact = ref('')
const detail = ref('')
const account = ref('')
const deadLine = ref('')
const value = ref('')

const props = defineProps({
  closeLentModel:{
    type: Function,
    required: true
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
  font-weight: bolder;

  .background {
    position: absolute;
    background-color: white;
    height: 435px;
    width: 400px;
    border-radius: 3px;
    top: 130px;
    right: 45px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .whichOne {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      
      .left{
        display: flex;
        flex-direction: row;
        font-size: 16px;
        gap: 15px;

        >p {
          cursor: pointer;

          &.selected {
            color: rgb(255, 103, 103);
            border-bottom: 2px solid rgb(255, 103, 103);
          }
        }
      }

      .n-icon{
        font-size:25px;
        cursor:pointer;
      }
    }

    .reimburseDetail {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .status {
        height:40px;
        background-color: rgb(255, 242, 199);
        padding: 5px 10px;
        border-radius: 3px;
        display:flex;
        flex-direction: row;
        align-items: center;

        .n-switch {
          --n-box-shadow-focus: transparent !important;
        }

        .date{
          padding-left:20px;
          display:flex;
          flex-direction:row;
          align-items:center;

          .n-date-pickder{
            width:125px;
            --n-height:30px !important;
          }
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .inputWrap {
          display: flex;
          flex-direction: row;
          align-items: center;

          >p {
            width: 105px;
          }

          .n-input {
            --n-caret-color: black !important;
            --n-border-hover: 1px solid rgb(224, 224, 230) !important;
            --n-border-focus: 1px solid rgb(224, 224, 230) !important;
            --n-box-shadow-focus: transparent !important;
          }
        }

        .amountWrap {
          display: flex;
          flex-direction: row;
          align-items: center;

          >p {
            width: 105px;
          }

          .n-input {
            width: 150px;
          }

          .amount {
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding-left: 10px;

            >p {
              border: 1px gray solid;
              padding: 2px 8px;
              border-radius: 3px;
              text-align: center;
              width: 75px;
              cursor: pointer;
            }
          }
        }
      }

      .confirm {
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;

        >p {
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          background-color: rgb(255, 103, 103);
          color:white;
        }
      }
    }
  }
}
</style>