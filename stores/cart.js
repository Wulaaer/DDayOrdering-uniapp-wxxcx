import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: []
  }),

  getters: {
      totalCount(state) {
        return state.list.reduce((sum, item) => {
          // 防御性处理：确保 count 是有效数字，无效时当作 0
          const count = Number(item.count) || 0
          return sum + count
        }, 0)
      },
  
      totalPrice(state) {
        const total = state.list.reduce((sum, item) => {
			// 调试日志：定位具体是哪个商品导致了 NaN
			// if (isNaN(item.price) || isNaN(item.count)) {
			//   console.warn(`[购物车异常] 商品"${item.name}"价格或数量无效:`, {
			//     rawPrice: item.price,
			//     rawCount: item.count,
			//     id: item.id
			//   })
			// }
			
          // 核心修复：强制将 price 和 count 转为数字
          // 当 item.price 为 undefined/null/空字符串 时，Number() 返回 0 而非 NaN
          const price = Number(item.price) || 0
          const count = Number(item.count) || 0
  
          return sum + price * count
        }, 0)
  
        console.log('全局购物车货物总价值:', total)
  
        // 最终兜底：即使 reduce 意外产出 NaN，也返回 0 而不是把 NaN 传给页面
        const safeTotal = Number(total.toFixed(2))
        return isNaN(safeTotal) ? 0 : safeTotal
      }
    },

  actions: {
    // 添加（按 id + specText 判断）
    addItem(goods) {
      const exist = this.list.find(item => {
        return item.id === goods.id && item.specText === goods.specText
      })
      if (exist) {
        exist.count++
      } else {
        this.list.push({ ...goods })
      }
	  console.log("添加商品")
	  this.list.forEach(item => {
	    console.log(JSON.stringify(item, null, 2))
	  })
    },

    // 减少（传入完整 item）
    minusItem(goods) {
      const index = this.list.findIndex(item => {
        return item.id === goods.id && item.specText === goods.specText
      })
      if (index === -1) return

      if (this.list[index].count > 1) {
        this.list[index].count--
      } else {
        this.list.splice(index, 1)
      }
    },

    clearCart() {
      this.list = []
    }
  }
})