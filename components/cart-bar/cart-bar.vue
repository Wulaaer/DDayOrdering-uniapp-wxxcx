<template>
  <view class="cart-bar">
    <!-- 底部固定条 -->
    <view class="cart-bar-header" @click="expand = !expand">
      <view class="cart-icon">
        🛒
        <view class="badge" v-if="cartStore.totalCount > 0">
          {{ cartStore.totalCount }}
        </view>
      </view>
      <view class="total">合计 ¥{{ cartStore.totalPrice }}</view>
      <view class="arrow">{{ expand ? '∨' : '∧' }}</view>
    </view>

    <!-- 展开列表 -->
    <view class="cart-list" v-show="expand">
      <scroll-view scroll-y class="list-box">
        <view class="item" v-for="(item, idx) in cartStore.list" :key="idx">
          <view class="name-box">
            <view class="name">{{ item.name }}</view>
            <view class="spec" v-if="item.specText">{{ item.specText }}</view>
          </view>
          <view class="price">¥{{ item.price }}</view>
          <view class="ctrl">
            <view @click="cartStore.minusItem(item)">−</view>
            <view class="c">{{ item.count }}</view>
            <view @click="cartStore.addItem(item)">+</view>
          </view>
        </view>
      </scroll-view>

      <view class="tool-bar">
        <view class="clear" @click="handleClear">清空购物车</view>
        <view class="checkout" @click="toCheckout">去结算</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const expand = ref(false)

uni.$on('cart-bar-close', () => {
  expand.value = false
})

// 清空
function handleClear() {
  uni.showModal({
    title: '确认清空',
    success: (res) => {
      if (res.confirm) cartStore.clearCart()
    }
  })
}

// 去结算
function toCheckout() {
  if (cartStore.totalCount === 0) {
    uni.showToast({ title: '购物车为空', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/order/confirm/confirm' })
}
</script>

<style scoped>
.cart-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.cart-bar-header {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  font-size: 28rpx;
}

.cart-icon {
  position: relative;
  font-size: 36rpx;
  margin-right: 20rpx;
}

.badge {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 32rpx;
  height: 32rpx;
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.total {
  flex: 1;
  color: #ff4d4f;
  font-weight: bold;
}

.arrow {
  font-size: 24rpx;
  color: #666;
}

.cart-list {
  max-height: 50vh;
  border-top: 1rpx solid #eee;
}

.list-box {
  max-height: 300rpx;
  padding: 0 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  width: 100%;
  box-sizing: border-box;
}

.name-box {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.name {
  font-size: 26rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spec {
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  margin-right: 20rpx;
  color: #ff4d4f;
  flex-shrink: 0;
}

.ctrl {
  display: flex;
  gap: 16rpx;
  align-items: center;
  flex-shrink: 0;
}

.ctrl>view {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6rpx;
}

.tool-bar {
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear {
  color: #999;
  font-size: 24rpx;
}

.checkout {
  background: #ff4d4f;
  color: #fff;
  padding: 16rpx 40rpx;
  border-radius: 10rpx;
}
</style>