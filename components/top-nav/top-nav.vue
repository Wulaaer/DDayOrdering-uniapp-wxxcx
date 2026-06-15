<template>
	<view class="top-nav">
		<view class="shop-name">某某美食店</view>
		<view class="user-info">
			<image class="avatar" src="/static/default-avatar.png"></image>
			<text class="username">{{ nickname || '游客' }}</text>
		</view>
	</view>
</template>

<script setup>
	// 从父组件传入用户名
	const props = defineProps({
		nickname: {
			type: String,
			default: ''
		}
	})
</script>

<style scoped>
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
	}

	.shop-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		background-color: #f2f2f2;
		margin-right: 12rpx;
	}

	.username {
		font-size: 26rpx;
		color: #666;
	}
</style>