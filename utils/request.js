import { baseUrl } from './env'
// 引入 Pinia 仓库
import { useUserData } from '@/stores/userData'

export function request({ url = '', params = {}, method = 'GET' }) {
  const userData = useUserData()

  // 组装请求头，携带token
  const header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authentication': userData.token || ''
  }

  return new Promise((resolve, reject) => {

    // 自动处理地址斜杠，防止拼接错误
    const fullUrl = baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '')

    uni.request({
      url: fullUrl,
      data: params,
      header,
      method: method.toUpperCase(),

      success: (res) => {
        const { data } = res

        // 后端成功码判断
        if (data.code === 200 || data.code === 1) {
          resolve(data)
        } else {
          uni.showToast({
            title: data.msg || '业务请求失败',
            icon: 'none'
          })
          reject(data)
        }
      },

      fail: (err) => {
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject({ msg: '网络异常', err })
      }
    })
  })
}