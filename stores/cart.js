import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    list: []
  }),

  getters: {
    // ✅ 【新增】按 id + specText 获取数量，供模板 v-if/v-else 高效调用
    getCount(state) {
      return (id, specText = '') => {
        const item = state.list.find(
          i => i.id === id && i.specText === specText
        )
        return item ? Number(item.count) || 0 : 0
      }
    },

    totalCount(state) {
      return state.list.reduce((sum, item) => {
        const count = Number(item.count) || 0
        return sum + count
      }, 0)
    },

    totalPrice(state) {
      const total = state.list.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const count = Number(item.count) || 0
        return sum + price * count
      }, 0)

      const safeTotal = Number(total.toFixed(2))
      return isNaN(safeTotal) ? 0 : safeTotal
    }
  },

  actions: {
    addItem(goods) {
      const exist = this.list.find(item => {
        return item.id === goods.id && item.specText === goods.specText
      })

      if (exist) {
        exist.count++
      } else {
        // ✅ 【修复】确保新商品一定有 count: 1，防止 undefined 导致 NaN
        this.list.push({ ...goods, count: 1 })
      }
    },

    // ✅ 【优化】支持传入完整 goods 或仅 { id, specText } 的对象
    minusItem(goods) {
      const index = this.list.findIndex(item => {
        return item.id === goods.id && item.specText === goods.specText
      })
      if (index === -1) return

      if (this.list[index].count > 1) {
        this.list[index].count--
      } else {
        // 减到 0 直接移除该项，保证 list 干净
        this.list.splice(index, 1)
      }
    },

    clearCart() {
      this.list = []
    }
  }
})