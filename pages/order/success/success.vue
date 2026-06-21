<template>
  <view class="success-page">
    <!-- 1. 顶部感谢区 -->
    <view class="header-section">
      <view class="success-icon">✓</view>
      <text class="title">已完成</text>
      <text class="subtitle">感谢您的光临，欢迎再来</text>
    </view>
	
	<!-- 2. 菜品明细卡片 -->
    <view class="card dish-card">
      <view class="card-title">菜品明细 ({{ dishList.length }}件)</view>
      <view class="dish-list">
        <view class="dish-item" v-for="(item, index) in dishList" :key="index">
          <image class="dish-img" :src="item.image" mode="aspectFill" />
          <view class="dish-info">
            <text class="dish-name">{{ item.name }}</text>
            <text class="dish-flavor" v-if="item.dishFlavor">{{ item.dishFlavor }}</text>
            <view class="dish-bottom">
              <text class="dish-price">¥{{ item.amount }}</text>
              <text class="dish-count">×{{ item.number }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
	
    <!-- 3. 订单信息卡片 -->
    <view class="card order-info-card">
      <view class="info-row highlight">
        <text class="label">桌台号</text>
        <text class="value table-num">{{ orderInfo.tableNumber }}</text>
      </view>
      <view class="divider"></view>
      <view class="info-row">
        <text class="label">订单编号</text>
        <text class="value">{{ orderInfo.number }}</text>
      </view>
      <view class="info-row">
        <text class="label">下单时间</text>
        <text class="value">{{ orderInfo.orderTime }}</text>
      </view>
      <view class="info-row">
        <text class="label">支付方式</text>
        <text class="value">{{ payMethodText }}</text>
      </view>
      <view class="info-row" v-if="orderInfo.remark">
        <text class="label">备注</text>
        <text class="value remark">{{ orderInfo.remark }}</text>
      </view>
      <view class="divider"></view>
      <view class="info-row total-row">
        <text class="label">实付金额</text>
        <text class="value price">¥{{ orderInfo.amount }}</text>
      </view>
    </view>

    

    <!-- 4. 底部按钮 -->
    <view class="bottom-action">
      <button class="btn-home" @click="goHome">返回首页</button>
    </view>
  </view>
</template>

<script>
import { getOrderDetailById } from '@/pages/api/api.js'

export default {
  data() {
    return {
      orderInfo: {},
      dishList: [],
      loading: true
    }
  },

  computed: {
    payMethodText() {
      const map = { 1: '微信支付', 2: '支付宝', 3: '余额支付' }
      return map[this.orderInfo.payMethod] || '在线支付'
    }
  },

  async onLoad(options) {
    this.loading = true
    try {
      const res = await getOrderDetailById(options.id)

      if (res.code === 1 && res.data) {
        this.orderInfo = res.data
        this.dishList = res.data.orderDetailList || []
      } else {
        uni.showToast({ title: '订单信息加载失败', icon: 'none' })
      }
    } catch (err) {
      console.error('获取订单详情失败:', err)
      uni.showToast({ title: '网络异常，请重试', icon: 'none' })
    } finally {
      this.loading = false
    }
  },

  methods: {
    goHome() {
      uni.reLaunch({ url: '/pages/menu/menu' })
    }
  }
}
</script>

<style lang="scss" scoped>
.success-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

/* --- 顶部感谢区 --- */
.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 40rpx;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
  border-radius: 0 0 30rpx 30rpx;
  color: #fff;

  .success-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50rpx;
    margin-bottom: 20rpx;
  }
  .title { font-size: 40rpx; font-weight: bold; margin-bottom: 10rpx; }
  .subtitle { font-size: 26rpx; opacity: 0.9; }
}

/* --- 通用卡片样式 --- */
.card {
  margin: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

/* --- 订单信息 --- */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14rpx 0;
  .label { color: #999; font-size: 26rpx; flex-shrink: 0; }
  .value { color: #333; font-size: 26rpx; text-align: right; word-break: break-all; }
  .table-num { font-size: 36rpx; font-weight: bold; color: #333; }
  .price { font-size: 36rpx; font-weight: bold; color: #ff4d4f; }
  .remark { max-width: 400rpx; font-size: 24rpx; color: #666; }
}
.highlight { padding-bottom: 20rpx; }
.total-row { padding-top: 20rpx; }
.divider { height: 1rpx; background: #eee; margin: 8rpx 0; }

/* --- 菜品明细 --- */
.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.dish-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  &:last-child { border-bottom: none; }
}
.dish-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
  background: #f5f5f5;
}
.dish-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.dish-name { font-size: 28rpx; color: #333; font-weight: 500; }
.dish-flavor {
  font-size: 22rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  align-self: flex-start;
  margin-top: 6rpx;
}
.dish-bottom { display: flex; justify-content: space-between; align-items: center; }
.dish-price { font-size: 28rpx; color: #333; font-weight: 500; }
.dish-count { font-size: 24rpx; color: #999; }

/* --- 底部按钮 --- */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.btn-home {
  background: #07c160;
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  border: none;
}
</style>