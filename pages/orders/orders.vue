<template>
  <view class="history-page">
    <!-- 顶部标题 -->
    <view class="page-title">历史订单</view>
	<!-- 加载中提示 -->
	<view class="loading" v-if="loading">
	  加载中...
	</view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list">
      <!-- 单个订单项 -->
      <view class="order-item" v-for="order in orderList" :key="order.id">
        <!-- 订单头：订单号 + 状态 -->
        <view class="order-header">
          <text>订单号：{{ order.orderNo }}</text>
          <text class="status">{{ order.statusText }}</text>
        </view>

        <!-- 商品列表 -->
        <view class="goods-list">
          <view class="goods-item" v-for="good in order.goods" :key="good.id">
            <view class="name">{{ good.name }}</view>
            <view class="price-count">
              ¥{{ good.amount }} × {{ good.number }}
            </view>
          </view>
        </view>

        <!-- 订单底部：时间 + 实付 -->
        <view class="order-footer">
          <text>{{ order.createTime }}</text>
          <text>实付：¥{{ order.totalPrice }}</text>
        </view>
      </view>

      <!-- 无订单时显示 -->
      <view class="empty" v-if="orderList.length === 0">
        暂无历史订单
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { queryOrderUserPage } from '@/pages/api/api'

export default {
  data() {
    return {
      orderList: [],
      loading: false // 加载状态
    }
  },

  onLoad() {
    this.getOrderList()
  },

  methods: {
    // 获取历史订单列表
    async getOrderList() {
      this.loading = true

      try {
        // 调用接口
        const res = await queryOrderUserPage({
          page: "1",
          pageSize: "10"
        })

        // 返回结构 res.data.records
        const list = res.data?.records || []

        // 格式化数据（和前端字段对应）
        this.orderList = list.map(item => ({
          id: item.id,
          orderNo: item.number,
          statusText: this.formatStatus(item.status), // 状态翻译
          createTime: item.orderTime,
          totalPrice: item.amount,
          // 订单项，后端一般叫 orderItemList / items
          goods: item.orderDetailList || []
        }))

      } catch (err) {
        console.error('获取订单失败', err)
        uni.showToast({
          title: '加载订单失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 订单状态翻译（后端数字 → 中文）
    formatStatus(status) {
      const statusMap = {
        1: '待支付',
        2: '已支付',
        5: '已完成',
        6: '已取消'
      }
      return statusMap[status] || '未知状态'
    }
  }
}
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 50rpx 0;
  font-size: 28rpx;
  color: #666;
}
	
.history-page {
  padding: 20rpx 30rpx;
  background-color: #f6f6f6;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  margin-bottom: 20rpx; /* 用这个控制账单之间的间距 */
}

.order-header {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.status {
  color: #07c160;
  font-weight: 500;
}

.goods-list {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
  margin-bottom: 20rpx;
}

.goods-item {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.goods-item:last-child {
  margin-bottom: 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>