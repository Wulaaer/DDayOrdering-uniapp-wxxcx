import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: []
  }),

  getters: {
    totalCount(state) {
      return state.list.reduce((sum, item) => sum + item.count, 0)
    },
    totalPrice(state) {
      const total = state.list.reduce((sum, item) => sum + item.price * item.count, 0)
	  return Number(total.toFixed(2)) // 修复精度
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