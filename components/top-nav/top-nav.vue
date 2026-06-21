<template>
  <view class="top-nav">
    <!-- 左侧用户图标 -->
    <view class="user-btn" @click="openMenu">
      <text class="uni-icon uni-icon-person">☰</text>
    </view>

    <!-- 右侧桌号 -->
    <view class="table">桌号：{{userData.tableNumber}}</view>
  </view>
</template>

<script setup>
import { useUserData } from '../../stores/userData';

const userData = useUserData()	

function openMenu() {
  uni.showActionSheet({
    itemList: ['我的账单', '退出登录'],
    success(res) {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: '/pages/history/history'
        })
      } else if (res.tapIndex === 1) {
        uni.showToast({ title: '退出登录', icon: 'none' })
        // 这里可加退出逻辑
      }
    }
  })
}
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.user-btn {
  font-size: 32rpx;
  color: #333;
  line-height: 1;
}

.table {
  font-size: 24rpx;
  color: #666;
}

/* 线性图标字体样式 */
.icon {
  font-family: "uniicons";
  font-size: 34rpx;
  color: #333;
}
</style>