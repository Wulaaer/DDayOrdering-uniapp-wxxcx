<script>
	import {userLogin} from './pages/api/api'
	import {useUserData} from './stores/userData'

	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.wxLogin()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}, // 微信登录方法
		methods: {
			async wxLogin() {
				try {
					// 1. 获取微信 code
					const loginRes = await uni.login({
						provider: 'weixin'
					})

					const code = loginRes.code
					if (!code) {
						uni.showToast({
							title: '获取授权码失败',
							icon: 'none'
						})
						return
					}

					// 2. 调用后端接口，code 放在 body 里
					const res = await userLogin({
						code: code
					})
					console.log(`登录接口返回res.code = ${res.code}`)

					// 3. 接口返回格式：data.id / data.openid / data.token
					if (res.code === 1) {
						// 4. 保存 token
						uni.setStorageSync('token', res.data.token)

						// 5. 存入 Pinia 全局用户仓库
						const userStore = useUserData()
						userStore.setLoginData(res.data)
						// console.log(`用户id = ${userStore.id}`)

						uni.showToast({
							title: '登录成功',
							icon: 'success'
						})
						return res.data
					} else {
						console.log("登录失败")
						console.log(res.data)
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none',
						})
					}
				} catch (err) {
					console.error('登录异常', err)
					uni.showToast({
						title: '登录异常',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>