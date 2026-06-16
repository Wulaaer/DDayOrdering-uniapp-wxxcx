import { defineStore } from 'pinia'

export const useUserData = defineStore('user', {
  state: () => ({
	id: '',
	openid: '',
    token: '',
  }),

  actions: {
    // 保存登录信息（同时写入本地缓存）
    setLoginData(data) {
		this.id = data.id
		this.openid = data.openid
		this.token = data.token
    },
  }
})