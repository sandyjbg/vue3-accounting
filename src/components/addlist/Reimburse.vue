<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <div class="left">
          <p>報銷</p>
        </div>
        <n-icon @click="closeReimburseModel()" :component="CloseFilled" />
      </div>
      <div class="reimburseDetail">
        <div class="status">
          <n-space>
            狀態：<n-switch v-model:value="reimburseOrNot" />已報銷
          </n-space>
          <div class="date" v-if="reimburseOrNot === true">
            <p>日期：</p>
            <n-date-picker v-model:value="doneDate" type="date" />
          </div>
        </div>
        <div class="info">
          <div class="inputWrap">
            <p>報銷對象: </p>
            <n-input v-model:value="person" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>聯絡方式: </p>
            <n-input v-model:value="contact" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>報銷原因: </p>
            <n-input v-model:value="detail" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>回款賬戶: </p>
            <n-dropdown trigger="click" placement="bottom-start" :options="paymentOptions"
              @select="paymentHandleSelect">
              <n-button>回款賬戶{{ '：' + account }}<n-icon :component="KeyboardArrowDownOutlined"
                  :style="{ paddingLeft: '10px' }" /></n-button>
            </n-dropdown>
          </div>
          <div class="inputWrap">
            <p>報銷截止日: </p>
            <n-date-picker v-model:value="deadLine" type="date" />
          </div>
          <div class="amountWrap">
            <p>報銷金額: </p>
            <n-input v-model:value="amount" type="text" placeholder="" :disabled="reimburseAll" />
            <div class="amount">
              <p @click="reimburseAll = true" :class="reimburseAll === true ? 'selected' : ''">全額報銷</p>
              <p @click="reimburseAll = false" :class="reimburseAll === true ? '' : 'selected'">部分報銷</p>
            </div>
          </div>
        </div>
        <div class="confirm">
          <p @click="commitReimburseInfo">確定</p>
          <p @click="clearAll">重新輸入</p>
          <p @click="cancelActing">取消報銷</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { CloseFilled, KeyboardArrowDownOutlined } from '@vicons/material'
import { useMessage } from 'naive-ui';

const message = useMessage()

const props = defineProps({
  closeReimburseModel: {
    type: Function,
    required: true
  },
  reimburseAmount: {
    type: Number,
    required: true
  },
  paymentList: {
    type: Array,
    required: true
  },
  initialData: {
    type: Object,
    required: false
  }
})

const reimburseOrNot = ref(props.initialData?.reimburseOrNot || false)
const person = ref(props.initialData?.person || '')
const contact = ref(props.initialData?.contact || '')
const detail = ref(props.initialData?.detail || '')
const account = ref(props.initialData?.account || '')
const doneDate = ref(props.initialData?.doneDate || Date.now())
const deadLine = ref(props.initialData?.deadLine || Date.now())
const amount = ref(props.initialData?.amount || props.reimburseAmount)
const reimburseAll = ref(props.initialData?.reimburseAll || true)

if (reimburseAll) {
  amount.value = props.reimburseAmount
}

const paymentOptions = ref([...props.paymentList])
function paymentHandleSelect(value: string) {
  account.value = value
}

function clearAll() {
  reimburseOrNot.value = false
  doneDate.value = Date.now()
  person.value = ''
  contact.value = ''
  detail.value = ''
  account.value = ''
  deadLine.value = Date.now()
  amount.value = props.reimburseAmount
  reimburseAll.value = true
}

function cancelActing() {
  clearAll()
  emit('commitReimburse', reimburseInfo.value)
  props.closeReimburseModel()
}

const reimburseInfo = computed(() => ({
  person: person.value,
  contact: contact.value,
  detail: detail.value,
  amount: amount.value,
  reimburseAll: reimburseAll.value ? '全部報銷' : '部分報銷',
  account: account.value,
  reimburseOrNot: reimburseOrNot.value,
  doneDate: doneDate.value,
  deadLine: deadLine.value,
  doneDateProcess: doneDate.value,
  deadLineProcess: deadLine.value
}))

const emit = defineEmits(['commitReimburse'])

function commitReimburseInfo() {
  if (person.value === '' || account.value === '') {
    message.warning('報銷對象及回款方式為必填')
    return
  }
  emit('commitReimburse', reimburseInfo.value)
  props.closeReimburseModel()
}

onMounted(() => {
  paymentOptions.value.pop()
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
    height: 445px;
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

      .left {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        gap: 15px;

        >p {
          color: rgb(255, 103, 103);
          border-bottom: 2px solid rgb(255, 103, 103);
        }
      }

      .n-icon {
        font-size: 25px;
        cursor: pointer;
      }
    }

    .reimburseDetail {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .status {
        height: 40px;
        background-color: rgb(255, 242, 199);
        padding: 5px 10px;
        border-radius: 3px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .n-switch {
          --n-box-shadow-focus: transparent !important;
        }

        .date {
          padding-left: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .n-date-picker {
            width: 125px;
            --n-height: 30px !important;
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
            width: 90px;
          }

          .n-input {
            width: 260px;
            --n-caret-color: black !important;
            --n-border-hover: 1px solid rgb(224, 224, 230) !important;
            --n-border-focus: 1px solid rgb(224, 224, 230) !important;
            --n-box-shadow-focus: transparent !important;

            &.payMethod {
              width: 150px;
              margin-right: 10px;
            }
          }

          .n-button {
            width: 260px;
            --n-text-color-hover: rgb(51, 54, 57) !important;
            --n-text-color-pressed: rgb(51, 54, 57) !important;
            --n-text-color-focus: rgb(51, 54, 57) !important;
            --n-border-hover: 1px solid rgb(224, 224, 230) !important;
            --n-border-pressed: 1px solid rgb(224, 224, 230) !important;
            --n-border-focus: 1px solid rgb(224, 224, 230) !important;
            --n-ripple-color: transparent !important;
          }

          .n-date-picker {
            width: 260px;
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
            width: 120px;
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

              &.selected {
                background-color: rgb(204, 204, 204);
              }
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
          color: white;
        }
      }
    }
  }
}
</style>