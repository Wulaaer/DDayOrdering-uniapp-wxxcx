import { request } from "../../utils/request.js"

// 用户登录
export const userLogin = (params) => {
	return request({
		url: '/user/user/login',
		method: 'POST',
		params
	})
}

// 获取菜品分类列表	
export const getList = (params) =>
	request({
		url: `/user/category/list`,
		method: 'GET',
		params,
	})

// 根据分类获取菜品列表
export const getDishList = (params) =>
	request({
		url: `/user/dish/list`,
		method: 'GET',
		params
	})


// 查询历史订单
export const queryOrderUserPage = (params) => {
	return request({
		url: '/user/order/historyOrders',
		method: 'GET',
		params
	})
}

// 用户下单
export const submitOrderSubmit = (params) => {
	return request({
		url: '/user/order/submit',
		method: 'POST',
		params
	})
}

// 使用微信支付订单
export const payOrder = (params) =>
	request({
		url: '/user/order/submit',
		method: 'POST',
		params
	})
