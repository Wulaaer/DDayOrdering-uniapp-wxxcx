<template>
  <view class="sku-page">
    <!-- 1. 顶部区域：左侧信息 + 右侧小图 -->
    <view class="header">
      <image 
        class="small-pic" 
        :src="food.image" 
        mode="aspectFill"
      ></image>
      <view class="header-info">
        <view class="name">{{ food.name }}</view>
        <view class="price">
          <text class="price-symbol">¥</text>{{ currentPrice.toFixed(2) }}
        </view>
      </view>
    </view>

    <!-- 2. 多组 DIY 选项（口味/规格） -->
    <view class="spec-group" v-for="(group, gIdx) in parsedFlavors" :key="gIdx">
      <view class="title">{{ group.name }}</view>
      <view class="taste-list">
        <view
          v-for="(opt, oIdx) in group.options"
          :key="oIdx"
          class="taste"
          :class="{ active: selectedMap[gIdx] === oIdx }"
          @click="selectOption(gIdx, oIdx)"
        >
          {{ opt.label }}
          <text v-if="opt.extraPrice > 0" class="extra-tag">+¥{{ opt.extraPrice }}</text>
        </view>
      </view>
    </view>

    <!-- 3. 推荐搭配 -->
    <view class="spec-group">
      <view class="title">推荐加餐</view>
      <view class="recommend-list">
        <view v-for="item in recommendList" :key="item.id" class="item">
          <image :src="item.image" mode="aspectFill"></image>
          <view class="rec-name">{{ item.name }}</view>
        </view>
      </view>
    </view>

    <!-- 4. 底部占位 + 固定加购按钮 -->
    <view class="bottom-placeholder"></view>
    <view class="add-cart" @click="addToCart">加入购物车</view>
  </view>
</template>

<script>
import { useCartStore } from '../../../stores/cart'

export default {
  onLoad(options) {
    try {
      this.food = JSON.parse(decodeURIComponent(options.food))
    } catch (e) {
      console.error('菜品数据解析失败', e)
      this.food = {}
    }
  },

  data() {
    return {
      food: {},
      selectedMap: {},
      recommendList: [
        { id: 1, name: "酸梅汤", image: "/static/drink.jpg" },
        { id: 2, name: "小酥肉", image: "/static/food.jpg" }
      ]
    }
  },

  computed: {
    parsedFlavors() {
      if (!this.food.flavors || !Array.isArray(this.food.flavors)) return []
      
      return this.food.flavors.map(group => {
        let labels = []
        let prices = []
        
        try {
          labels = typeof group.value === 'string' ? JSON.parse(group.value) : group.value
          prices = typeof group.price === 'string' ? JSON.parse(group.price) : group.price
        } catch (e) {
          console.warn(`口味 ${group.name} 数据解析异常`, e)
        }

        const options = (labels || []).map((label, idx) => ({
          label,
          extraPrice: Number(prices?.[idx]) || 0
        }))

        return { name: group.name, options }
      })
    },

    currentPrice() {
      let base = Number(this.food.price) || 0
      for (const [gIdx, oIdx] of Object.entries(this.selectedMap)) {
        const group = this.parsedFlavors[gIdx]
        if (group && group.options[oIdx]) {
          base += group.options[oIdx].extraPrice
        }
      }
      return base
    }
  },

  methods: {
    selectOption(groupIdx, optionIdx) {
      if (this.selectedMap[groupIdx] === optionIdx) {
        delete this.selectedMap[groupIdx]
      } else {
        this.selectedMap[groupIdx] = optionIdx
      }
      this.$forceUpdate?.()
    },

    addToCart() {
      const specParts = []
      this.parsedFlavors.forEach((group, gIdx) => {
        const opt = group.options[this.selectedMap[gIdx]]
        if (opt) specParts.push(opt.label)
      })

      const goods = {
        id: this.food.id,
        name: this.food.name,
        price: this.currentPrice,
		image: this.food.image,
        specText: specParts.join('｜'),
        count: 1
      }

      const cartStore = useCartStore()
      cartStore.addItem(goods)

      uni.showToast({ title: '已加入购物车' })
      setTimeout(() => uni.navigateBack(), 500)
    }
  }
}
</script>

<style scoped>
.sku-page {
  padding: 0 20rpx 140rpx;
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
}

/* ===== 1. 头部渐变背景 + 图片柔光阴影 ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 浅橙渐变，弱化低清图片边缘 */
  background: linear-gradient(180deg, #FFF5F0 0%, #FFFFFF 100%);
  border-radius: 0 0 24rpx 24rpx;
  padding: 40rpx 30rpx;
  margin: 0 -20rpx 30rpx; /* 负边距让渐变撑满屏幕宽度 */
}
.header-info {
  flex: 1;
  margin-right: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200rpx;
}
.name {
  font-size: 34rpx;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 20rpx;
  margin-left: 20rpx;
  color: #1a1a1a;
}

/* ===== 2. 价格标签化装饰 ===== */
.price {
  display: inline-flex;
  align-items: baseline;
  font-size: 40rpx;
  color: #ff4d4f;
  font-weight: bold;
  background: rgba(255, 77, 79, 0.08);
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  align-self: flex-start;
  margin-left: 20rpx;
}
.price-symbol {
  font-size: 26rpx;
  margin-right: 4rpx;
}

/* ===== 图片柔光阴影 ===== */
.small-pic {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  background: #f5f5f5;
  /* 柔和投影，模糊低清边界 */
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

/* ===== 3. 口味选项：描边+浅色填充选中态 ===== */
.spec-group {
  margin: 36rpx 0;
  margin-left: 20rpx;
}
.title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
  /* 为伪元素定位做准备 */
  position: relative; 
  padding-left: 16rpx;
}

/* 左侧装饰竖杠 */
.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  
  /* 👇 核心样式：在这里自由调整 */
  width: 6rpx;          /* 竖杠粗细 */
  height: 24rpx;        /* 竖杠高度（独立于文字行高） */
  background: #ff4d4f;  /* 品牌红色 */
  border-radius: 3rpx;  /* 两端圆润，更精致 */
}
.taste-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.taste {
  padding: 14rpx 28rpx;
  background: #f7f7f7;
  /* 预留透明边框，防止选中时布局跳动 */
  border: 2rpx solid transparent;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #333;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6rpx;
}
/* 选中态：浅底 + 描边 + 品牌色文字，替代实心填充 */
.taste.active {
  background: rgba(255, 77, 79, 0.08);
  border-color: #ff4d4f;
  color: #ff4d4f;
}
.extra-tag {
  font-size: 20rpx;
  opacity: 0.85;
}

/* ===== 推荐搭配 ===== */
.recommend-list {
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
  padding-bottom: 8rpx;
}
.item {
  width: 140rpx;
  text-align: center;
  flex-shrink: 0;
}
.item image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}
.rec-name {
  font-size: 24rpx;
  margin-top: 10rpx;
  color: #666;
}

/* ===== 底部固定按钮 ===== */
.bottom-placeholder {
  height: 100rpx;
}
.add-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, #ff6b6b 0%, #ff4d4f 100%);
  color: #fff;
  text-align: center;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-sizing: border-box;
  z-index: 99;
  /* 顶部微阴影，与内容区隔 */
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
}
</style>