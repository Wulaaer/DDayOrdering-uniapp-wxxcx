import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // 购物车列表
    cartList: [],
    // 商品总数量
    totalNum: 0,
    // 总金额
    totalPrice: 0
  }),

  actions: {
    // 添加商品到购物车
    addGoods(goods) {
      this.cartList.push(goods)
      this.totalNum += 1
      this.totalPrice += goods.price
    },
    // 清空购物车
    clearCart() {
      this.$reset()
    }
  }
})