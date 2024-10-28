<template>
  <div class="mask">
    <div class="background">
      <div class="whichOne">
        <p class="selected">報銷</p>
        <p>借用</p>
      </div>
      <div class="reimburseDetail">
        <div class="status">
          <n-space>
            狀態：<n-switch v-model:value="checkStrategyIsChild" />已報銷
          </n-space>
        </div>
        <div class="info">
          <div class="inputWrap">
            <p>報銷對象: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>聯絡方式: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>報銷原因: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>回款方式: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
          </div>
          <div class="inputWrap">
            <p>報銷日期: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
          </div>
          <div class="amountWrap">
            <p>報銷金額: </p>
            <n-input v-model:value="value" type="text" placeholder="" />
            <p class="amount">全額報銷</p>
            <p class="amount">部分報銷</p>
          </div>
        </div>
        <div class="confirm">
          <p>確定</p>
          <p>取消</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const checkStrategyIsChild = ref('')
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
    height: 500px;
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

    .reimburseDetail {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .status {
        background-color: rgb(255, 242, 199);
        padding: 5px 10px;
        border-radius: 3px;

        .n-switch {
          --n-box-shadow-focus: transparent !important;
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

        .amountWrap{
          display:flex;
          flex-direction:row;
          align-items:center;

          >p{
              width:105px;
          }

          .n-input {
            width:10px;
          }

          .amount{
              border:1px gray solid;
              padding:2px 8px;
              border-radius:3px;
              text-align:right;
          }
        }
      }

      .confirm {
        display: flex;
        flex-direction: row;
        gap: 10px;

        >p {
          border: 1px gray solid;
          padding:2px 8px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>