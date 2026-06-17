<template>
  <view class="sku-page">
    <!-- 商品大图 -->
    <image class="big-pic" :src="food.image" mode="widthFix"></image>

    <!-- 商品信息 -->
    <view class="info">
      <view class="name">{{ food.name }}</view>
      <view class="price">¥{{ food.price }}</view>
    </view>

    <!-- 多组 DIY 选项 -->
    <view class="spec-group" v-for="(group, idx) in diyOptions" :key="idx">
      <view class="title">{{ group.name }}</view>
      <view class="taste-list">
        <view
          v-for="opt in group.options"
          :key="opt"
          class="taste"
          :class="{ active: selectedOptions[idx] === opt }"
          @click="selectedOptions[idx] = opt"
        >
          {{ opt }}
        </view>
      </view>
    </view>

    <!-- 推荐搭配 -->
    <view class="spec-group">
      <view class="title">推荐加餐</view>
      <view class="recommend-list">
        <view v-for="item in recommendList" :key="item.id" class="item">
          <image :src="item.image"></image>
          <view>{{ item.name }}</view>
        </view>
      </view>
    </view>

    <!-- 加购按钮（固定底部） -->
    <view class="add-cart" @click="addToCart">加入购物车</view>
  </view>
</template>

<script>
import { useCartStore } from '../../../stores/cart'
	
export default {
  onLoad(options) {
    this.food = JSON.parse(decodeURIComponent(options.food))
    // 模拟后端返回的 DIY 配置
    this.diyOptions = [
      {
        name: "辣度",
        options: ["不辣", "微辣", "中辣", "特辣"]
      },
      {
        name: "温度",
        options: ["常温", "热", "冰", "少冰"]
      },
      {
        name: "份量",
        options: ["正常", "小份", "大份"]
      }
    ]
  },

  data() {
    return {
      food: {},
      diyOptions: [],
      // 多规格选中结果：下标对应 diyOptions 下标
      selectedOptions: [],
      recommendList: [
        { id: 1, name: "酸梅汤", image: "/static/drink.jpg" },
        { id: 2, name: "小酥肉", image: "/static/food.jpg" }
      ]
    }
  },

  methods: {
    addToCart() {
      // 校验所有DIY选项
      for (let i = 0; i < this.diyOptions.length; i++) {
        if (!this.selectedOptions[i]) {
          uni.showToast({
            title: `请选择${this.diyOptions[i].name}`,
            icon: 'none'
          })
          return
        }
      }
    
      const specText = this.selectedOptions.join('｜')
    
      const goods = {
        id: this.food.id,
        name: this.food.name,
        price: this.food.price,
        specText: specText,
        count: 1
      }
    
      // 使用新版 Pinia 方法
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
  padding: 20rpx;
  min-height: 100vh;
  background: #fff;
}
.big-pic {
  width: 100%;
  height: auto;
  border-radius: 12rpx;
}
.info {
  margin: 20rpx 0;
}
.name {
  font-size: 32rpx;
  font-weight: bold;
}
.price {
  font-size: 30rpx;
  color: #ff4d4f;
  margin-top: 10rpx;
}
.spec-group {
  margin: 30rpx 0;
}
.title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.taste-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.taste {
  padding: 12rpx 24rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}
.taste.active {
  background: #ff4d4f;
  color: #fff;
}
.recommend-list {
  display: flex;
  gap: 20rpx;
}
.item {
  width: 120rpx;
  text-align: center;
}
.item image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}
.add-cart {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #ff4d4f;
  color: #fff;
  text-align: center;
  padding: 24rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}
</style>