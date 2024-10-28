<template>
  <div class="box">
    <div class="background">
      <div class="top">日曆管理</div>
      <div class="content">
        <div class=calendar>
          <n-calendar v-model:value="value" @update:value="handleUpdateValue">
          </n-calendar>
        </div>
        <div class="dailyDetail"></div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import FooterBar from './../components/FooterBar.vue'

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
      height: calc(100% - 100px);

      .calendar {
        height: 50%;
        padding: 20px;

        :deep(.n-calendar) {
          --n-border-color: transparent !important;
          --n-text-color: black !important;
          --n-title-font-weight: 800 !important;
          --n-date-color-current: rgb(255, 103, 103) !important;
          --n-bar-color: transparent !important;
          --n-cell-color: #42b883 !important;
          --n-font-size: 13px !important;

          .n-calendar-dates {
            flex: none;

            .n-calendar-cell {
              height: 60px !important;

              .n-calendar-date__date {
                width: 20px;
                height: 20px;
                font-weight: bolder;
              }

              .n-calendar-date__day {
                color: black;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                margin-left: 3px;
              }
            }
          }


        }
      }

      .dailyDetail {
        height: 50%;
      }
    }
  }
}
</style>
