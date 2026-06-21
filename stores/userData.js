import { defineStore } from 'pinia'

export const useUserData = defineStore('user', {
  state: () => ({
	id: '',
	openid: '',
    token: '',
	userNum: 1,
	tableNumber: 'T1',
  }),

  actions: {
    // 保存登录信息（同时写入本地缓存）
    setLoginData(data) {
		this.id = data.id
		this.openid = data.openid
		this.token = data.token
    },
	setUserInput(data) {
		this.userNum = data.userNum
		this.tableNumber = `T${data.tableNumber.value}`
		console.log('userData写入userNum: ' + this.userNum )
		console.log('userData写入tableNumber: ' + this.tableNumber )
	}
  }
})