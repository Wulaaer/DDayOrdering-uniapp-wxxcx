<template>
	<top-nav></top-nav>

	<view class="menu-page">


		<!-- 左侧分类 -->
		<scroll-view class="left-types" scroll-y>
			<view v-for="item in foodList" :key="item.typeId" class="type-item"
				:class="{ active: currentType === item.typeId }" @click="switchType(item.typeId)">
				{{ item.typeName }}
			</view>
		</scroll-view>

		<!-- 右侧菜品列表 -->
		<scroll-view class="right-foods" scroll-y :scroll-into-view="toView" scroll-with-animation>
		    <view v-for="item in foodList" :key="item.typeId" :id="'type-' + item.typeId" class="food-group">
		        <view class="group-title">{{ item.typeName }}</view>
		        <view class="food-list">
		            <!-- 加 Array.isArray 防御，防止 safeSort 返回异常值 -->
		            <template v-if="Array.isArray(item.foods)">
		                <view v-for="food in item.foods" :key="food.id" class="food-item">
		                    <image class="food-pic" :src="food.image" mode="aspectFill"></image>
		                    <view class="food-info">
		                        <view class="food-name">{{ food.name }}</view>
		                        <view class="food-price">¥{{ food.price }}</view>
		                    </view>
		
		                    <!-- 有规格：显示"选规格"按钮 -->
		                    <view v-if="food.flavors && food.flavors.length > 0"
		                          class="spec-btn"
		                          @click.stop="openSpec(food)">
		                        选规格
		                    </view>
		
		                    <!-- 无规格：显示加号图标，直接加入购物车 -->
		                    <view v-else
		                          class="add-cart-btn"
		                          @click.stop="addToCart(food)">
		                        <text class="icon-plus">+</text>
		                    </view>
		                </view>
		            </template>
		        </view>
		    </view>
		</scroll-view>
	</view>
	<!-- 购物车组件 -->
	<cart-bar></cart-bar>
</template>

<script>
	import TopNav from '@/components/top-nav/top-nav.vue'
	import { getList } from '../api/api';
	import { getDishList } from '../api/api';
	import { useCartStore } from '../../stores/cart';
	import CartBar from '@/components/cart-bar/cart-bar.vue'

	export default {

		data() {
			return {
				// 分类列表
				typeList: [],
				// 最终渲染的菜品结构
				foodList: [],
				currentType: 1, // 当前选中分类
				toView: "" // 滚动锚点ID
			};
		},
		
		onLoad() {
			this.initPageData()
		},
		
		methods: {
			// 安全排序工具函数
			safeSort(arr, key) {
			    if (!Array.isArray(arr)) return []
			    return [...arr].sort((a, b) => (Number(a[key]) || 0) - (Number(b[key]) || 0))
			},
			
			addToCart(food) {
				const cartStore = useCartStore()
				cartStore.addItem({
					id: food.id,
					name: food.name,
					price: food.price,
					image: food.image,
					specText: '',
					count: 1
				})
			},
			
			// 统一入口：初始化页面数据
			  async initPageData() {
			    // 先等分类加载完成
			    await this.loadTypeList()
			    // 分类有了，再加载所有菜品
			    await this.loadAllFoods()
			  },
			
			  // 1. 获取全部分类
			  async loadTypeList() {
			    try {
			      const res = await getList()
			      if (res.code === 1) {
			        this.typeList = this.safeSort(res.data, 'sort')
			        console.log("分类列表：", this.typeList)
			      }
			    } catch (err) {
			      console.log("获取分类失败", err)
			    }
			  },
			
			  // 2. 根据分类加载所有菜品
			  async loadAllFoods() {
			    this.foodList = []
			
			    for (let cate of this.typeList) {
			      try {
			        const res = await getDishList({
			          categoryId: cate.id
			        })
			        if (res.code === 1) {
			          this.foodList.push({
			            typeId: cate.id,
			            typeName: cate.name,
			            foods: this.safeSort(res.data, 'sortInCategory')
			          })
			        }
			      } catch (err) {
			        console.log(`加载分类【${cate.name}】失败`, err)
			      }
			    }
			
			    console.log("最终菜品列表：", this.foodList)
			  },
			
			// 切换分类，跳转到对应菜品
			switchType(typeId) {
				this.currentType = typeId;
				this.toView = "type-" + typeId;
			},
			// 跳转到选菜品规格页面
			openSpec(food) {
				uni.navigateTo({
				    url: `/pages/menu/components/sku?food=${encodeURIComponent(JSON.stringify(food))}`
				  })
			}
		}
	};
</script>

<style scoped>
	/* 圆形红色背景按钮 */
	.add-cart-btn {
	    width: 48rpx;
	    height: 48rpx;
	    border-radius: 50%;       /* 正圆 */
	    background-color: #e64340; /* 微信/外卖常用红色，可换成你的主题色 */
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    flex-shrink: 0;           /* 防止在 flex 布局中被挤压变形 */
	}
	
	/* 白色加号 */
	.icon-plus {
	    color: #ffffff;
	    font-size: 36rpx;
	    line-height: 1;
	    font-weight: bold;
	}
	
	/* 选规格按钮 */
	.spec-btn {
		font-size: 24rpx;
		color: #fff;
		background-color: #ff4d4f;
		padding: 8rpx 16rpx;
		border-radius: 6rpx;
		border: none;
		box-sizing: border-box;
		white-space: nowrap;
	}
	
	.menu-page {
		display: flex;
		height: 100vh;
		box-sizing: border-box;
	}
	
	/* 左侧分类 */
	.left-types {
		width: 150rpx;
		background: #f5f5f5;
	}
	
	.type-item {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		color: #333;
	}
	
	.type-item.active {
		background: #fff;
		color: #ff4d4f;
		font-weight: bold;
		border-left: 6rpx solid #ff4d4f;
	}
	
	/* 右侧菜品 */
	.right-foods {
		flex: 1;
		background: #fff;
		padding: 20rpx;
		box-sizing: border-box;
	}
	
	.food-group {
		margin-bottom: 40rpx;
	}
	
	.group-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding-left: 10rpx;
		border-left: 6rpx solid #ff4d4f;
	}
	
	.food-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.food-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #f2f2f2;
		box-sizing: border-box;
	}
	
	.food-pic {
		width: 140rpx;
		height: 140rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	
	.food-info {
		flex: 1;
		overflow: hidden;
	}
	
	.food-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.food-price {
		font-size: 26rpx;
		color: #ff4d4f;
		margin-top: 10rpx;
	}
</style>