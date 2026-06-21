<template>
  <view class="confirm-page">

    <!-- 1. 桌号 + 就餐方式 -->
    <view class="section base-section">
      <view class="item">
        <text class="label">桌号</text>
        <text class="value">{{userStore.tableNumber}}</text>
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
import { useCartStore } from '@/stores/cart'
import { useUserData } from '@/stores/userData'
import { storeToRefs } from 'pinia'
import { submitOrderSubmit, payOrder } from '@/pages/api/api.js'

export default {
  data() {
    return {
      eatType: 1,
      remark: '',
      paySuccess: false,
      submitting: false
    }
  },

  computed: {
    userStore() {
      return useUserData()
    },
    cartStore() {
      return useCartStore()
    },
    cartList() {
      const { list } = storeToRefs(this.cartStore)
      return list.value
    },
    totalPrice() {
      return this.cartStore.totalPrice
    },
    finalTotal() {
      let total = this.totalPrice
      if (this.eatType === 2) total += 1
      return Number(total.toFixed(2))
    },
    userNum() {
      return this.userStore.userNum
    },
    tableNumber() {
      return this.userStore.tableNumber
    }
  },

  methods: {
    async toSubmitOrder() {
      if (!this.cartList || this.cartList.length === 0) {
        uni.showToast({ title: '购物车为空', icon: 'none' })
        return
      }
      if (this.submitting) return

      // 先创建订单，成功后再进入支付确认流程
      const orderRes = await this.handleCreateOrder()
      if (orderRes) {
        await this.handlePayOrder(orderRes)
      }
    },

    async handleCreateOrder() {
      this.submitting = true
      uni.showLoading({ title: '提交订单中...' })

      try {
        const dishList = this.cartList.map(item => ({
          dishId: item.id,
          number: item.count,
          name: item.name,
          image: item.image,
          amount: item.price * item.count,
          dishFlavor: item.specText || ''
        }))

        const orderParams = {
          amount: this.finalTotal,
          payMethod: 1,
          remark: this.remark,
          userNum: this.userNum,
          tableNumber: this.tableNumber,
          dishList: dishList
        }

        const orderRes = await submitOrderSubmit(orderParams)
        const orderNumber = orderRes.data?.orderNumber
        if (!orderNumber) throw new Error('订单创建失败')

        return orderRes
      } catch (err) {
        console.error('下单失败:', err)
        uni.showToast({
          title: err.message || '下单失败，请重试',
          icon: 'none'
        })
        return null
      } finally {
        this.submitting = false
        uni.hideLoading()
      }
    },

    async handlePayOrder(orderRes) {
      const orderNumber = orderRes.data?.orderNumber

      // 先弹窗确认，用户点确认后再showLoading
      uni.showModal({
        title: '确认支付',
        content: `订单已创建，共${this.cartList.length}件商品，实付 ¥${this.finalTotal}\n`,
        confirmText: '确认支付',
        cancelText: '再想想',
        success: async (res) => {
          if (res.confirm) {
            // 用户确认后才显示loading并调支付接口
            uni.showLoading({ title: '唤起支付中...' })
            try {
              const payRes = await payOrder({
                orderNumber: orderNumber,
                payMethod: 1
              })

              // 如需真实微信支付，取消下面注释：
              // if (payRes.data && payRes.data.timeStamp) {
              //   await uni.requestPayment({ provider: 'wxpay', ...payRes.data })
              // }

              this.cartStore.clearCart()
              this.paySuccess = true
              uni.showToast({ title: '支付成功', icon: 'success' })

              setTimeout(() => {
				  // console.log(JSON.stringify(payRes, null, 2))
                uni.redirectTo({
                  url: `/pages/order/success/success?id=${payRes.data.id}`
                })
              }, 1500)
            } catch (err) {
              console.error('支付失败:', err)
              if (err.errMsg && err.errMsg.includes('cancel')) {
                uni.showToast({ title: '已取消支付', icon: 'none' })
              } else {
                uni.showToast({
                  title: err.message || '支付失败，请重试',
                  icon: 'none'
                })
              }
            } finally {
              // 确保loading一定被关闭
              uni.hideLoading()
            }
          } else {
            // 用户选择"再想想"，提示未支付订单已保留
            uni.showToast({ title: '订单已保存至待支付', icon: 'none' })
          }
        }
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