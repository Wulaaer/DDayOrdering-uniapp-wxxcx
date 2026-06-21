<template>
  <view class="history-page">
    <!-- 顶部标题 -->
    <view class="page-title">历史订单</view>

    <!-- 订单列表 -->
    <scroll-view 
      scroll-y 
      class="order-list"
      @scrolltolower="loadMore"
    >
      <!-- 单个订单项 -->
      <view class="order-item" v-for="order in orderList" :key="order.id" @click="handleOrderDetail(order)">
        <view class="order-header">
          <text>订单号：{{ order.orderNo }}</text>
          <text class="status">{{ order.statusText }}</text>
        </view>

        <view class="goods-list">
          <view class="goods-item" v-for="good in order.goods" :key="good.id">
            <view class="name">{{ good.name }}</view>
            <view class="price-count">
              ¥{{ good.amount }} × {{ good.number }}
            </view>
          </view>
        </view>

        <view class="order-footer">
          <text>{{ order.createTime }}</text>
          <text>实付：¥{{ order.totalPrice }}</text>
        </view>
      </view>

      <!-- 底部加载提示 -->
      <view class="load-more" v-if="noMore === false">
        <text v-if="loading">加载中...</text>
        <text v-else>上拉加载更多</text>
      </view>

      <!-- 无更多数据 -->
      <view class="load-more" v-if="noMore === true">
        没有更多订单了
      </view>

      <!-- 无订单时显示 -->
      <view class="empty" v-if="orderList.length === 0 && !loading">
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
      loading: false,    // 是否正在加载
      pageNo: 1,        // 当前页码
      pageSize: 10,     // 每页条数
      noMore: false,    // 是否还有更多数据
    }
  },

  onLoad() {
	uni.showLoading({ title: '加载中' })
    this.getOrderList()
	uni.hideLoading()
  },

  methods: {
	  handleOrderDetail(order) {
		  console.log(JSON.stringify(order, null, 2))
		  if (order.statusText === '待支付') {
			  uni.navigateTo({
			    url: `/pages/order/pending/pending?id=${order.id}`
			  })
		  } else {
			  uni.navigateTo({
			    url: `/pages/order/success/success?id=${order.id}`
			  })
		  }
	  },
	  
    // 初始化 / 下拉刷新用（重置列表）
    async getOrderList() {
      this.pageNo = 1
      this.orderList = []
      this.noMore = false
      await this.requestOrderList()
    },

    // 上拉加载更多（追加数据）
    async loadMore() {
      if (this.loading || this.noMore) return
      this.pageNo++
      await this.requestOrderList()
    },

    // 真正请求接口
    async requestOrderList() {
      this.loading = true

      try {
        const res = await queryOrderUserPage({
          page: this.pageNo,
          pageSize: this.pageSize
        })

        const list = res.data?.records || []

        // 判断是否到底了
        if (list.length < this.pageSize) {
          this.noMore = true
        }

        // 格式化
        const formatList = list.map(item => ({
          id: item.id,
          orderNo: item.number,
          statusText: this.formatStatus(item.status),
          createTime: item.orderTime,
          totalPrice: item.amount,
          goods: item.orderDetailList || []
        }))

        // 第一页覆盖，后面页追加
        if (this.pageNo === 1) {
          this.orderList = formatList
        } else {
          this.orderList = [...this.orderList, ...formatList]
        }

      } catch (err) {
        console.error('加载失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },

    formatStatus(status) {
      const statusMap = {
        1: '待支付',
        2: '已支付',
        3: '已完成',
        4: '已取消'
      }
      return statusMap[status] || '未知状态'
    }
  }
}
</script>

<style scoped>
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
  display: block;
}

.order-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  margin-bottom: 30rpx;
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

.order-footer {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #999;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  font-size: 26rpx;
  color: #999;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>