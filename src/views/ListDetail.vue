<template>
  <div class="box" v-if="itemData">
    <div class="background">
      <n-icon class="edit" :component="EditFilled" @click="editMode" />
      <div class="topic">
        <div class="nameWithLogo">
          <div class="space">
            <div><n-icon :component="ArrowBackIosRound" @click="router.push('/')" /></div>
            <div class="nameWithPic">
              <img src="../assets/building.png" />
              <div class="name">沙雕記賬</div>
            </div>
            <div><n-icon :component="DensityMediumTwotone" /></div>
          </div>
        </div>
        <div class="monthTotalwithArrow">
          <n-icon :component="ArrowLeftRound" />
          <div class="biggerEachList">
            <div class="eachList output">
              <div class="project">
                <n-icon :component=itemData.icon size="20" />
                <p>{{ itemData.category }}</p>
                <p>{{ itemData.description ? '--' : '' }} {{ itemData.description }}</p>
              </div>
              <p class="num">{{ itemData.type ? '-' : '+' }}{{ itemData.amount }}</p>
            </div>
          </div>
          <n-icon :component="ArrowRightRound" />
        </div>
      </div>
      <div class="content">
        <!-- 基本信息 -->
        <div class="basics">
          <div class="topic">
            <p>基本信息</p>
            <div class="amount">
              金額：<span>{{ itemData.amount }}</span>元
            </div>
          </div>
          <div class="contentcontent">
            <div class="kind">
              <p>種類：</p>
              <div class="kindWithIcon" :style="{ backgroundColor: itemData.color }">
                <n-icon :component=itemData.icon />
                <p>{{ itemData.category }}</p>
              </div>
            </div>
            <div class="time"><span>時間：</span>{{ itemData.date.replace('2024年', '') }} {{ itemData.time }}</div>
            <div class="payment"><span>支付方式：</span>{{ itemData.payment[0], itemData.payment[1] ? itemData.payment[1] :
              '' }}</div>
            <div class="inout"><span>進出：</span>{{ itemData.type }}</div>
            <div class="description"><span>描述：</span>{{ itemData.description ? itemData.description : '-----' }}</div>
            <div class="attachment">
              <span>附件：</span>{{ itemData.attachment.file ? itemData.attachment.file.name : '-----'
              }}
              <img v-if="itemData.attachment" :src="itemData.attachment.imageUrl" style="width:100%;">
            </div>
            <div class="description"><span>標籤：</span>{{ itemData.label.length > 0 ? itemData.label.join(' | ') : '-----'
              }}
            </div>
          </div>
        </div>
        <!-- 更多細節 -->
        <div class="infoDetail">
          <p>更多詳情</p>
          <div class="detailContent">
            <template v-if="itemData.informationList && itemData.informationList.length > 0">
              <div v-for="(item, index) in itemData.informationList" :key="index">
                <div v-for="(value, key) in item" :key="key">
                  <span>{{ key }}：</span>{{ value }}
                </div>
              </div>
            </template>
            <template v-else>
              <div>
                <span>----：</span>----
              </div>
            </template>
            <div class="textarea">
              <span>其他：</span>{{ itemData.information ? itemData.information : '----' }}
            </div>
          </div>
        </div>
        <!-- 報銷借貸 -->
        <div class="reimburseOrLent">
          <div class="top">
            報銷與借貸
          </div>

          <!-- 報銷 -->
          <div v-if="itemData.reimburse.person" class="lentingContent">
            <div><span>種類：</span>報銷</div>
            <div><span>對象：</span>{{ itemData.reimburse.person }}</div>
            <div><span>聯絡方式：</span>{{ itemData.reimburse.contact ? itemData.reimburse.contact : '-----' }}</div>
            <div><span>截止日：</span>{{ itemData.reimburse.deadLine }}</div>
            <div><span>目前進度：</span>{{ itemData.reimburse.reimburseOrNot ? itemData.reimburse.doneDate + ' 已報銷' : ' 尚未報銷'
              }}</div>
            <div><span>部分 / 全額：</span>{{ itemData.reimburse.reimburseAll }}
              <span class="amount">{{ itemData.reimburse.amount + '元' }}</span>
            </div>
            <div class="reason"><span>備註：</span>{{ itemData.reimburse.detail ? itemData.reimburse.detail : '-----' }}
            </div>
            <div><span>回款賬號：</span>{{ itemData.reimburse.account }}</div>
          </div>

          <!-- 借貸 -->
          <div v-if="itemData.lent.person" class="lentingContent">
            <div><span>種類：</span>{{ itemData.lent.type ? '借出' : '欠款' }}</div>
            <div><span>對象：</span>{{ itemData.lent.person }}</div>
            <div><span>聯絡方式：</span>{{ itemData.lent.contact ? itemData.lent.contact : '-----' }}</div>
            <div><span>截止日：</span>{{ itemData.lent.deadLine }}</div>
            <div><span>目前進度：</span>{{ itemData.lent.payOrNot ? itemData.lent.doneDate + ' 已還款' : ' 尚未還款'
              }}</div>
            <div><span>部分 / 全額：</span>{{ itemData.lent.lentAll }}
              <span class="amount">{{ itemData.lent.amount + '元' }}</span>
            </div>
            <div class="reason"><span>備註：</span>{{ itemData.lent.detail ? itemData.lent.detail : '-----' }}
            </div>
            <div><span>回款賬號：</span>{{ itemData.lent.account }}</div>
          </div>

          <!-- 報銷借貸皆空白 -->
          <div class="lentingContent" v-if="!itemData.reimburse.person && !itemData.lent.person">
            <div><span>種類：</span>-----</div>
            <div><span>對象：</span>-----</div>
            <div><span>聯絡方式：</span>-----</div>
            <div><span>截止日：</span>-----</div>
            <div><span>目前進度：</span>-----</div>
            <div><span>部分 / 全額：</span>-----</div>
            <div class="reason"><span>備註：</span>-----</div>
            <div><span>回款賬號：</span>-----</div>
          </div>
        </div>
        <!-- 地圖 -->
        <div class="googleMap">
          <div class="top">
            地點
          </div>
          <div class="lentingContent">
            <GMapMap :center="center" :zoom="zoom" style="width: 100%; height: 200px; padding:20px;">
              <GMapMarker :position="center" />
            </GMapMap>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterBar />
</template>

<script setup lang="ts">
import { ref, onMounted, type FunctionalComponent } from 'vue'
import FooterBar from './../components/FooterBar.vue'
import { DensityMediumTwotone, ArrowBackIosRound, FreeBreakfastRound, ArrowLeftRound, ArrowRightRound, EditFilled } from '@vicons/material'
import { useRouter, useRoute } from 'vue-router'
import { useAccountingStore } from '@/stores/accountingStore'

const router = useRouter()
const route = useRoute()
const id = route.params.id
const accountingStore = useAccountingStore()
const itemData = ref<ItemData | null>(null)

interface ItemData {
  icon: FunctionalComponent | null,
  category: string,
  description: string,
  amount: string,
  date: string,
  time: string,
  timeStamp: number,
  color: string,
  type: string,
  payment: any,
  mixPayment: any,
  informationList: string,
  address: string,
  information: string,
  reimburse: any,
  lent: any,
  attachment: any,
  id: number,
  label: any
}

const center = ref({ lat: 25.033964, lng: 121.564468 });
const zoom = ref(15);

function editMode() {
  if (itemData.value) {
    router.push({
      path: '/AddList',
      query: {
        mode: 'edit',
        dataId: itemData.value.id
      }
    })
  }
}

onMounted(() => {
  itemData.value = accountingStore.accountingData[id] || null;
})
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
    line-height: 30px;
    position: relative;

    .edit {
      position: absolute;
      font-size: 50px;
      height: 80px;
      width: 80px;
      border-radius: 50%;
      background-color: rgb(255, 103, 103);
      top: 77%;
      right: 8%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      z-index: 999;
    }

    .topic {
      display: flex;
      flex-direction: column;

      .nameWithLogo {
        background-color: rgb(255, 103, 103);
        color: rgb(255, 255, 255);
        height: 100px;
        width: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 5px;
        font-size: 40px;
        font-weight: bolder;

        .space {
          background-color: transparent;
          position: absolute;
          width: 500px;
          height: 100px;
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .nameWithPic {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .n-icon {
            font-size: 30px;
            cursor: pointer;
          }
        }

        img {
          width: 70px;
          padding: 0 20px 5px 0;
        }
      }

      .monthTotalwithArrow {
        color: white;
        display: flex;
        font-size: 18px;
        font-weight: bolder;
        flex-direction: row;
        height: 76px;
        background-color: rgb(255, 103, 103);
        padding: 0 20px 10px 20px;
        justify-content: space-between;
        align-items: center;

        .n-icon {
          font-size: 40px;
          color: #ffffff;
        }

        .biggerEachList {
          width: 100%;

          .eachList {
            padding: 8px 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background-color: #ffa743;
            // background-color: #ffa743;

            &.more {
              width: calc(100% - 300px);
            }

            &.input {
              border-radius: 5px;
              margin: 2px 0;
            }

            &.output {
              border-radius: 5px;
              margin: 2px 0;
            }

            .project {
              display: flex;
              flex-direction: row;
              gap: 10px;
              align-items: center;

              .n-icon {
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }

            .payment {
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              align-items: center;
              gap: 10px;

              .else {
                color: white;
                height: 26px;
                width: 26px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                &.lentOut {
                  background-color: rgb(165, 0, 0);
                }

                &.reimburse,
                &.lentIn {
                  background-color: rgb(0, 138, 202);
                }

                &.done {
                  background-color: rgb(168, 168, 168);
                }
              }


              .pay {
                border: none;
                padding: 1px 5px;
                border-radius: 3px;
                background-color: rgb(255, 203, 154);
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .num {
                text-align: right;
                width: 50px;
              }
            }
          }

          .moreBtn {
            width: 10px;
            height: 43.6px;
            background-color: rgb(255, 103, 103);
            margin: 2px 0;
            border-radius: 0 5px 5px 0;
            cursor: pointer;
          }

          .list {
            width: 300px;
            height: 43.6px;
            background-color: rgb(255, 103, 103);
            margin: 2px 0;
            border-radius: 0 5px 5px 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;

            .function {
              font-size: 18px;
              width: 28px;
              height: 28px;
              background-color: white;
              color: rgb(255, 103, 103);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;

              &:hover {
                background-color: rgb(255, 247, 178);
              }
            }

            .back {
              font-size: 20px;
              color: white;
              cursor: pointer;
            }
          }
        }
      }
    }

    .content {
      height: calc(100% - 276px);
      padding: 20px 30px;
      overflow: auto;
      color: rgb(65, 65, 65);
      font-weight: bolder;

      /* 滚轮宽度 */
      &::-webkit-scrollbar {
        width: 5px;
      }

      /* 滑块 */
      &::-webkit-scrollbar-thumb {
        background: #d1d1d1;
        border-radius: 4px;
      }

      .basics {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .topic {
          font-weight: bolder;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          width: 100%;
          padding-bottom: 3px;
          border-bottom: 2px solid gray;
          height: 40px;

          >p {
            width: 60%;
          }

          .amount {
            width: 40%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            >span {
              font-size: 30px;
              padding: 0 3px 0 3px;
              color: red;
            }
          }
        }

        .contentcontent {
          display: flex;
          flex-wrap: wrap;
          padding-top: 10px;

          .kind {
            display: flex;
            flex-direction: row;
            width: 50%;
            align-items: flex-end;

            >p {
              color: rgb(255, 143, 143);
            }

            .kindWithIcon {
              display: flex;
              flex-direction: row;
              gap: 3px;
              padding: 0 10px 0 5px;
              border-radius: 24px;
              align-items: center;

              .n-icon {
                width: 24px;
                height: 24px;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }

          .time,
          .payment {
            width: 50%;

            >span {
              color: rgb(255, 143, 143);
            }
          }

          .inout {
            width: 50%;
            color: red;

            >span {
              color: rgb(255, 143, 143);
            }
          }

          .description,
          .attachment {
            width: 100%;

            >span {
              color: rgb(255, 143, 143);
            }

            >img {
              padding-top: 10px;
            }
          }
        }
      }

      .infoDetail {
        padding-top: 10px;

        >p {
          border-bottom: solid 2px gray;
          padding-bottom: 3px;
          margin-bottom: 10px;
          font-weight: bolder;
        }

        .detailContent {
          display: flex;
          flex-wrap: wrap;

          >div {
            width: 50%;

            &.textarea {
              width: 100%;
            }

            >span {
              color: rgb(255, 143, 143);
            }

            >div {
              >span {
                color: rgb(255, 143, 143);
              }
            }
          }


        }
      }

      .reimburseOrLent {
        .top {
          font-weight: bolder;
          padding: 10px 0 3px 0;
          border-bottom: 2px solid gray;
          margin-bottom: 10px;
        }

        .lentingContent {
          display: flex;
          flex-wrap: wrap;

          >div {
            width: 50%;

            &.reason {
              width: 100%;
            }

            >span {
              color: rgb(255, 103, 103);

              &.amount {
                color: red;
              }
            }
          }
        }
      }

      .googleMap {
        .top {
          font-weight: bolder;
          padding: 10px 0 3px 0;
          border-bottom: 2px solid gray;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
