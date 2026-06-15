import { defineStore } from 'pinia'

export const useUserData = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
    shopInfo: null
  }),

  actions: {
    // 保存登录信息（同时写入本地缓存）
    setLoginData(token, userInfo = null, shopInfo = null) {
      this.token = token
      this.userInfo = userInfo
      this.shopInfo = shopInfo
      // 持久化到本地存储
      uni.setStorageSync('token', token)
      if (userInfo) uni.setStorageSync('userInfo', userInfo)
    },

    // 从本地缓存恢复数据（小程序启动自动读取）
    restoreLoginData() {
      const token = uni.getStorageSync('token') || ''
      const userInfo = uni.getStorageSync('userInfo') || null
      this.token = token
      this.userInfo = userInfo
      return !!token // 返回是否存在token
    },

    // 退出登录（清空状态+缓存）
    logout() {
      this.$reset()
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }
})