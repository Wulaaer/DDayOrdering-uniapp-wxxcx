<template>
  <view class="confirm-page">

    <!-- 1. 桌号 + 就餐方式 -->
    <view class="section base-section">
      <view class="item">
        <text class="label">桌号</text>
        <text class="value">A08</text>
      </view>
	  
      <view class="check-section">
        <view class="check-row">
          <!-- 左侧 -->
          <view class="check-item" @click="eatType = 1">
            <view class="check-box" :class="{ checked: eatType === 1 }">
              <text class="check-mark" v-if="eatType === 1">✓</text>
            </view>
            <text class="check-text">店内就餐</text>
          </view>
      
          <!-- 竖线 -->
          <view class="divider"></view>
      
          <!-- 右侧 -->
          <view class="check-item" @click="eatType = 2">
            <view class="check-box" :class="{ checked: eatType === 2 }">
              <text class="check-mark" v-if="eatType === 2">✓</text>
            </view>
            <text class="check-text">打包带走</text>
          </view>
        </view>
      </view>
	  
    </view>

    <!-- 2. 待下单商品（直接用全局购物车） -->
    <view class="section">
      <view class="section-title">待下单菜品</view>
      <view class="goods-list">
        <view class="goods-item" v-for="item in cartList" :key="item.id">
          <view class="name">{{ item.name }}</view>
          <view class="right">
            <text>¥{{ item.price }} × {{ item.count }}</text>
          </view>
        </view>

        <!-- 打包费 -->
        <view class="goods-item package-fee" v-if="eatType === 2">
          <view class="name">打包费</view>
          <view class="right">
            <text>¥1.00</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 3. 搭配推荐（横向滚动） -->
    <view class="section">
      <view class="section-title">搭配推荐</view>
      <scroll-view class="recommend-scroll" scroll-x>
        <view class="recommend-item" v-for="item in recommendList" :key="item.id">
          <view class="rec-name">{{ item.name }}</view>
          <view class="rec-price">¥{{ item.price }}</view>
          <button class="add-btn" @click="addToCart(item)">+</button>
        </view>
      </scroll-view>
    </view>

    <!-- 4. 备注 -->
    <view class="section">
      <view class="section-title">备注</view>
      <textarea v-model="remark" class="remark-input" placeholder="口味、忌口等需求（选填）" />
    </view>

    <!-- 5. 底部栏 -->
    <view class="bottom-bar">
      <view class="total">
        <text>实付：</text>
        <text class="price">¥{{ finalTotal }}</text>
      </view>
      <view class="pay-btn" @click="toSubmitOrder">
        下单并支付
      </view>
    </view>
	
  </view>
  
</template>

<script>
// 引入
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

export default {
	
  data() {
    return {
      eatType: 1,
      remark: '',
      recommendList: [
        { id: 101, name: '薯条', price: 6 },
        { id: 102, name: '鸡翅', price: 8 },
        { id: 103, name: '甜筒', price: 3 },
        { id: 104, name: '鸡块', price: 9 },
        { id: 105, name: '咖啡', price: 12 }
      ],
      showPwdPopup: false,
      paySuccess: false
    }
  },

  computed: {
    // 正确用法：先创建 store，再解构
    cartStore() {
      return useCartStore()
    },
    // 购物车列表（响应式）
    cartList() {
      const { list } = storeToRefs(this.cartStore)
      return list.value
    },
    // 总价
    totalPrice() {
      return this.cartStore.totalPrice
    },
    // 最终实付
    finalTotal() {
      let total = this.totalPrice
      if (this.eatType === 2) total += 1
      return Number(total.toFixed(2))
    }
  },

  methods: {
    // 添加推荐到购物车
    addToCart(item) {
      this.cartStore.addItem(item)
    },

	// 点击下单支付 → 弹出确认框
    toSubmitOrder() {
		// 弹出确认框
    },


    // 返回首页
    goBack() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>
<style scoped>
.confirm-page {
  background: #f6f6f6;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.section {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.base-section {
  padding: 30rpx 30rpx 10rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 20rpx;
  color: #333;
}

/* 桌号 + 方式 */
.item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.label {
  width: 120rpx;
  font-size: 28rpx;
  color: #333;
}
.value {
  font-size: 28rpx;
  color: #333;
}


/* 就餐方式独立区块：整行宽度 */
.eat-section {
  padding: 0;
  margin-bottom: 20rpx;
}
.check-row {
  display: flex;
  width: 100%;
  height: 80rpx;
  align-items: center;
}
.check-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}


.check-box {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #ccc;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #fff;
}

.check-box.checked {
  background: #ff4d4f;
  border-color: #ff4d4f;
}

.check-mark {
  line-height: 1;
}

.check-text {
  font-size: 28rpx;
  color: #333;
}

.divider {
  width: 1rpx;
  height: 40rpx;
  background-color: #e5e5e5;
}

/* 商品列表 */
.goods-list {
  margin-top: 10rpx;
}
.goods-item {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.goods-item:last-child {
  border-bottom: none;
}
.package-fee {
  color: #ff6633;
}

/* 横向推荐 */
.recommend-scroll {
  white-space: nowrap;
}
.recommend-item {
  display: inline-block;
  width: 140rpx;
  margin-right: 20rpx;
  text-align: center;
  padding: 20rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
}
.rec-name {
  font-size: 24rpx;
  margin-bottom: 10rpx;
}
.rec-price {
  font-size: 24rpx;
  color: #ff6633;
  margin-bottom: 10rpx;
}
.add-btn {
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6rpx;
}

/* 备注 */
.remark-input {
  width: 100%;
  height: 120rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background: #fff;
  display: flex;
  justify-content: space-between; /* 左右分开 */
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  box-sizing: border-box;
}

.total {
  font-size: 28rpx;
}

.price {
  color: #ff6633;
  font-weight: bold;
}

/* 简单、干净、不搞特殊 */
.pay-btn {
  background: #ff4d4f;
  color: #fff;
  padding: 16rpx 30rpx;
  border-radius: 10rpx;
  font-size: 24rpx;
}
</style>