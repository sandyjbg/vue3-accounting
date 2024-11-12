<template>
  <div class="background">
    <div class="topic">
      <p>添加分類</p>
      <n-icon :component="CloseFilled" @click="close" />
    </div>
    <div class="content">
      <div class="nameInput">
        <p>分類名稱：</p>
        <n-input v-model:value="categoryNameValue" type="text" placeholder="請輸入分類名稱" />
      </div>
      <div class="colorChoose">
        <p>分類背景：</p>
        <n-color-picker v-model:value="colorValue" @update:value="handleColorChange" />
      </div>
      <div class="iconChoose">
        <p>分類圖標：</p>
        <div class="icon">
          <n-icon v-for="(icon, idx) in iconList" :key="idx" @click="handleIconClick(idx)" :component="icon.name"
            :class="{ active: selectIconIdx === idx }" />
        </div>
      </div>
      <div class="confirm">
        <p @click="isEditMode === false ? adding() : saveEdit()">{{ isEditMode === false ? '添加' : '修改' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, markRaw } from 'vue'
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
  AttachMoneySharp,
  TrendingUpSharp,
  HandshakeFilled,
  AccountBalanceRound,
  DeliveryDiningTwotone,
  BackHandRound,
  CleanHandsSharp,
  AccountBalanceWalletFilled,
  CloseFilled,
  AcUnitOutlined,
  AccessAlarmOutlined,
  AccessibilityFilled,
  AccountBalanceFilled,
  AccountCircleRound,
  AddIcCallSharp,
  AddModeratorFilled,
  AddToHomeScreenRound,
  AirlineSeatIndividualSuiteRound,
  AirplanemodeActiveRound,
  AnchorRound,
  AppBlockingFilled,
  AssistantPhotoFilled,
  AudiotrackSharp,
  AutoFixHighSharp,
  BackHandSharp,
  BathtubRound,
  Battery6BarSharp,
  BeachAccessSharp,
  BlenderRound,
  BrunchDiningRound,
  Brightness2Round,
  CalendarTodayRound,
  BrushRound,
  CameraAltRound,
  ChildFriendlyRound,
  CardGiftcardRound,
  CheckCircleRound,
  CloudRound,
  ColorLensRound,
  ConfirmationNumberRound,
  CottageRound,
  ConstructionRound,
  DirectionsCarRound,
  DiscFullRound,
  CoffeeRound,
  DiscountRound,
  DownhillSkiingRound,
  EmojiEventsRound,
  ExtensionSharp,
  FavoriteOutlined,
  ToggleOnRound,
  FlashOnRound,
  FlightTakeoffSharp,
  FmdGoodRound,
  FolderRound,
  ForestRound,
  GavelRound,
  GolfCourseRound,
  HeadphonesRound,
  HighlightRound,
  IncompleteCircleSharp,
  HourglassFullRound,
  KeyRound,
  KitchenRound,
  LaptopWindowsSharp,
  LocalDiningOutlined,
  LocalPrintshopRound,
  MasksFilled,
  MinusRound,
  NearMeSharp,
  NotificationsSharp
} from '@vicons/material'
import { useMessage } from 'naive-ui';

const iconList = [
  { name: markRaw(FreeBreakfastRound) },
  { name: markRaw(LunchDiningRound) },
  { name: markRaw(DinnerDiningRound) },
  { name: markRaw(LocalDrinkFilled) },
  { name: markRaw(CakeFilled) },
  { name: markRaw(WineBarFilled) },
  { name: markRaw(DirectionsBusFilledFilled) },
  { name: markRaw(ShoppingCartFilled) },
  { name: markRaw(VideogameAssetFilled) },
  { name: markRaw(LocalGroceryStoreTwotone) },
  { name: markRaw(HouseFilled) },
  { name: markRaw(PlusOutlined) },
  { name: markRaw(DeleteFilled) },
  { name: markRaw(ModeEditFilled) },
  { name: markRaw(AttachMoneySharp) },
  { name: markRaw(TrendingUpSharp) },
  { name: markRaw(HandshakeFilled) },
  { name: markRaw(AccountBalanceRound) },
  { name: markRaw(DeliveryDiningTwotone) },
  { name: markRaw(BackHandRound) },
  { name: markRaw(CleanHandsSharp) },
  { name: markRaw(AcUnitOutlined) },
  { name: markRaw(AccessAlarmOutlined) },
  { name: markRaw(AccessibilityFilled) },
  { name: markRaw(AccountBalanceFilled) },
  { name: markRaw(AccountBalanceWalletFilled) },
  { name: markRaw(AccountCircleRound) },
  { name: markRaw(AddIcCallSharp) },
  { name: markRaw(AddModeratorFilled) },
  { name: markRaw(AddToHomeScreenRound) },
  { name: markRaw(AirlineSeatIndividualSuiteRound) },
  { name: markRaw(AirplanemodeActiveRound) },
  { name: markRaw(AnchorRound) },
  { name: markRaw(AppBlockingFilled) },
  { name: markRaw(AssistantPhotoFilled) },
  { name: markRaw(AudiotrackSharp) },
  { name: markRaw(AutoFixHighSharp) },
  { name: markRaw(BackHandSharp) },
  { name: markRaw(BathtubRound) },
  { name: markRaw(Battery6BarSharp) },
  { name: markRaw(BeachAccessSharp) },
  { name: markRaw(BlenderRound) },
  { name: markRaw(Brightness2Round) },
  { name: markRaw(BrunchDiningRound) },
  { name: markRaw(BrushRound) },
  { name: markRaw(CalendarTodayRound) },
  { name: markRaw(CameraAltRound) },
  { name: markRaw(CardGiftcardRound) },
  { name: markRaw(ChildFriendlyRound) },
  { name: markRaw(CheckCircleRound) },
  { name: markRaw(CloudRound) },
  { name: markRaw(ColorLensRound) },
  { name: markRaw(CoffeeRound) },
  { name: markRaw(ConfirmationNumberRound) },
  { name: markRaw(ConstructionRound) },
  { name: markRaw(CottageRound) },
  { name: markRaw(DirectionsCarRound) },
  { name: markRaw(DiscFullRound) },
  { name: markRaw(DiscountRound) },
  { name: markRaw(DownhillSkiingRound) },
  { name: markRaw(EmojiEventsRound) },
  { name: markRaw(ExtensionSharp) },
  { name: markRaw(FavoriteOutlined) },
  { name: markRaw(ToggleOnRound) },
  { name: markRaw(FlashOnRound) },
  { name: markRaw(FlightTakeoffSharp) },
  { name: markRaw(FmdGoodRound) },
  { name: markRaw(FolderRound) },
  { name: markRaw(ForestRound) },
  { name: markRaw(GavelRound) },
  { name: markRaw(GolfCourseRound) },
  { name: markRaw(HeadphonesRound) },
  { name: markRaw(HighlightRound) },
  { name: markRaw(HourglassFullRound) },
  { name: markRaw(IncompleteCircleSharp) },
  { name: markRaw(KeyRound) },
  { name: markRaw(KitchenRound) },
  { name: markRaw(LaptopWindowsSharp) },
  { name: markRaw(LocalDiningOutlined) },
  { name: markRaw(LocalPrintshopRound) },
  { name: markRaw(MasksFilled) },
  { name: markRaw(MinusRound) },
  { name: markRaw(NearMeSharp) },
  { name: markRaw(NotificationsSharp) },
]
const colorValue = ref('rgb(255, 103, 103)')
const categoryNameValue = ref('')
const selectIconIdx = ref(-1)

const message = useMessage()

const props = defineProps({
  isEditMode: {
    type: Boolean,
    required: true
  },
  close: {
    type: Function,
    required: true
  },
  categoryData: {
    type: Object,
    required: true
  },
  category: {
    type: Array,
    required: true
  },
  moneyMoreOrLest: {
    type: Boolean,
    required: true
  }
})

// 子傳父新增分類內容
const emit = defineEmits(['commitCategory', 'commitEditCategory'])

// isEdit === false 添加模式 -------------------------
if (props.isEditMode === false) {
  colorValue.value = 'rgb(255, 103, 103)'
  categoryNameValue.value = ''
  selectIconIdx.value = -1
}

// 點擊圖標傳入圖標index
function handleIconClick(idx: number) {
  selectIconIdx.value = idx
}

// 最終選擇顏色
function handleColorChange(value: any) {
  colorValue.value = value
}

// 添加 (1. 防空 / 2. 賦值 / 3. 傳遞(v) / 4. 清空表格等下次開啟時是空白 / 5. 關閉彈窗)
function adding() {
  if (!categoryNameValue.value) {
    message.warning('請輸入分類名稱')
  }

  if (selectIconIdx.value === -1) {
    message.warning('請選擇分類圖標')
    return
  }

  const newCategory = {
    name: categoryNameValue.value,
      color: colorValue.value,
      icon: iconList[selectIconIdx.value].name,
      id: props.category.length,
      type: props.moneyMoreOrLest ? '收入' : '支出'
  }

  emit('commitCategory', newCategory)

  categoryNameValue.value = ''
  colorValue.value = 'rgb(255, 103, 103)'
  selectIconIdx.value = -1

  close()
}
// -----------------------------------------------------

if (props.isEditMode === true) {
  categoryNameValue.value = props.categoryData._value.name
  colorValue.value = props.categoryData._value.color
  selectIconIdx.value = iconList.findIndex(icon => icon.name.name === props.categoryData._value.icon.name)
}

// 保存修改
function saveEdit() {

  if (!categoryNameValue.value || selectIconIdx.value === -1) {
    message.warning('請填寫完整資料')
    return
  }

  const updatedCategory = {
    id: props.categoryData._value.id,
    name: categoryNameValue.value,
      color: colorValue.value,
      icon: iconList[selectIconIdx.value].name,
      type: props.moneyMoreOrLest ? '收入' : '支出'
  }

  emit('commitEditCategory', updatedCategory)

  close()
}
</script>

<style scoped lang="scss">
.background {
  position: absolute;
  top: 22%;
  right: 39%;
  height: 535px;
  width: 400px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  z-index: 2001;

  .topic {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: rgb(255, 103, 103);
    border-radius: 5px 5px 0 0;

    >p {
      font-weight: bolder;
      font-size: 18px;
    }

    .n-icon {
      font-size: 24px;
      color: black;
      cursor: pointer;
    }
  }

  .content {
    height: calc(100% - 48.8px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-weight: bolder;

    .nameInput {
      display: flex;
      flex-direction: row;
      align-items: center;

      >p {
        font-size: 15px;
        padding-right: 5px;
        color: rgb(255, 103, 103);
      }

      .n-input {
        --n-font-size: 14px !important;
        --n-height: 30px !important;
        --n-border-radius: 3px !important;
        --n-border: 1px solid rgb(224, 224, 230) !important;
        --n-border-hover: 1px solid rgb(224, 224, 230) !important;
        --n-border-focus: 1px solid rgb(224, 224, 230) !important;
        --n-box-shadow-focus: 0 0 0 2px transparent !important;
        width: 230px;
      }
    }

    .colorChoose {
      display: flex;
      flex-direction: row;
      align-items: center;

      >p {
        font-size: 15px;
        padding-right: 5px;
        color: rgb(255, 103, 103);
      }

      :deep(.n-color-picker) {
        --n-border-radius: 3px !important;
        --n-text-color: transparent !important;
        color: transparent !important;
        --n-height: 30px !important;
        width: 70px;

        .n-color-picker-trigger {
          .n-color-picker-trigger__value {
            color: transparent !important;
          }
        }
      }
    }

    .iconChoose {
      display: flex;
      flex-direction: column;
      gap: 10px;

      >p {
        color: rgb(255, 103, 103);
      }

      .icon {
        height: 280px;
        border-radius: 3px;
        border: 1px solid rgb(224, 224, 230);
        box-shadow: inset 1px 2px 5px 0px rgba(0, 0, 0, 0.137);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        overflow: auto;
        color: rgb(58, 58, 58);
        padding: 3px;

        /* 滚轮宽度 */
        &::-webkit-scrollbar {
          width: 5px;
        }

        /* 滑块 */
        &::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 4px;
        }

        .n-icon {
          height: 41px;
          width: 41px;
          font-size: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          cursor: pointer;

          &.active {
            background-color: rgb(228, 228, 228);
          }

          &:hover {
            background-color: rgb(228, 228, 228);
          }
        }
      }
    }

    .confirm {
      display: flex;
      justify-content: flex-end;

      >p {
        background-color: rgb(255, 103, 103);
        height: 30px;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        color: white;
        cursor: pointer;
      }
    }
  }

}
</style>