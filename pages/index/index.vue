<template>
  <view class="container">
    <!-- 欢迎区域 -->
    <view class="welcome-section">
      <image class="logo" src="/static/砍肉粉logo.png" mode="aspectFit"></image>
      <text class="welcome-title">欢迎使用</text>
      <text class="welcome-subtitle">湖南砍肉粉点餐小程序</text>
    </view>

    <!-- 表单卡片 -->
    <view class="form-card">
      <view class="form-item">
        <text class="label">桌号</text>
        <view class="input-wrapper">
          <text class="prefix">T</text>
          <input 
            class="input" 
            type="number" 
            v-model="tableNumber" 
            placeholder="请输入桌号数字" 
            maxlength="4"
          />
        </view>
      </view>

      <view class="form-item">
        <text class="label">用餐人数</text>
        <view class="input-wrapper">
          <input 
            class="input" 
            type="number" 
            v-model="userNum" 
            placeholder="请输入用餐人数" 
            maxlength="3"
          />
        </view>
      </view>

      <button class="confirm-btn" :disabled="!canConfirm" @click="handleConfirm">
        确认进入菜单
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserData } from '../../stores/userData'

// 响应式数据
const tableNumber = ref('')
const userNum = ref('')
const userStore = useUserData()

// 计算按钮是否可点击（两个字段都填写后才启用）
const canConfirm = computed(() => {
  return tableNumber.value.trim() !== '' && userNum.value.trim() !== ''
})

// 获取全局 app 实例以访问 globalData
const app = getApp()

const handleConfirm = () => {
  if (!canConfirm.value) return

  // 将输入值保存到全局 userData 中
  userStore.setUserInput({
	  tableNumber,
	  userNum
  })

  // 跳转到菜单页
  uni.navigateTo({
    url: '/pages/menu/menu'
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff5f0 0%, #ffffff 40%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48rpx;
  box-sizing: border-box;
}

/* ===== 欢迎区域 ===== */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
  margin-bottom: 60rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 32rpx;
}

.welcome-title {
  font-size: 32rpx;
  color: #999;
  letter-spacing: 2rpx;
}

.welcome-subtitle {
  font-size: 40rpx;
  font-weight: bold;
  color: #d4380d;
  margin-top: 12rpx;
  text-align: center;
  line-height: 1.4;
}

/* ===== 表单卡片 ===== */
.form-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(212, 56, 13, 0.08);
}

.form-item {
  margin-bottom: 36rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #fafafa;
  border: 2rpx solid #eee;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 96rpx;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: #d4380d;
}

.prefix {
  font-size: 36rpx;
  font-weight: bold;
  color: #d4380d;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.input {
  flex: 1;
  font-size: 32rpx;
  color: #333;
  height: 96rpx;
}

/* ===== 确认按钮 ===== */
.confirm-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #d4380d;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 48rpx;
  border: none;
  margin-top: 12rpx;
  letter-spacing: 4rpx;
}

.confirm-btn[disabled] {
  background: #e8e8e8;
  color: #bbb;
}
</style>