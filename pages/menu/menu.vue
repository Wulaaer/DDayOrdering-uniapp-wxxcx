<template>
	<top-nav :nickname="Wulaaer"></top-nav>

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
					<view v-for="food in item.foods" :key="food.id" class="food-item">
						<image class="food-pic" :src="food.pic" mode="aspectFill"></image>
						<view class="food-info">
							<view class="food-name">{{ food.name }}</view>
							<view class="food-price">¥{{ food.price }}</view>
						</view>
						<!-- 选规格按钮 -->
						<view class="spec-btn" @click.stop="openSpec(food)">
							选规格
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import TopNav from '@/components/top-nav/top-nav.vue'

	export default {

		data() {
			return {
				// 菜品数据
				foodList: [{
						typeId: 1,
						typeName: "热销菜品",
						foods: [{
								id: 101,
								name: "麻辣小龙虾",
								price: 88,
								pic: "/static/food1.jpg"
							},
							{
								id: 102,
								name: "香辣烤鱼",
								price: 128,
								pic: "/static/food2.jpg"
							}
						]
					},
					{
						typeId: 2,
						typeName: "凉菜",
						foods: [{
							id: 201,
							name: "凉拌黄瓜",
							price: 12,
							pic: "/static/food3.jpg"
						}]
					},
					{
						typeId: 3,
						typeName: "热菜",
						foods: [{
								id: 301,
								name: "鱼香肉丝",
								price: 32,
								pic: "/static/food4.jpg"
							},
							{
								id: 302,
								name: "宫保鸡丁",
								price: 36,
								pic: "/static/food5.jpg"
							}
						]
					},
					{
						typeId: 4,
						typeName: "汤品",
						foods: [{
							id: 401,
							name: "紫菜蛋花汤",
							price: 10,
							pic: "/static/food6.jpg"
						}]
					}
				],
				currentType: 1, // 当前选中分类
				toView: "" // 滚动锚点ID
			};
		},
		methods: {
			// 切换分类，跳转到对应菜品
			switchType(typeId) {
				this.currentType = typeId;
				this.toView = "type-" + typeId;
			},
			// 加上这个方法
			openSpec(food) {
				uni.showModal({
					title: '选择规格',
					content: food.name
				})
			}
		}
	};
</script>

<style scoped>
	/* 选规格按钮 */
	.spec-btn {
		font-size: 24rpx;
		color: #fff;
		background-color: #ff4d4f;
		padding: 8rpx 16rpx;
		border-radius: 6rpx;
		align-self: flex-end;
		margin-left: auto;
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
		width: 100%;
		/* 占满整行 */
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #f2f2f2;
	}

	.food-pic {
		width: 100%;
		height: 240rpx;
		border-radius: 12rpx;
		background: #f2f2f2;
	}

	.food-pic {
		width: 140rpx;
		height: 140rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
	}

	.food-info {
		flex: 1;
	}

	.food-price {
		font-size: 26rpx;
		color: #ff4d4f;
		margin-top: 10rpx;
	}
</style>