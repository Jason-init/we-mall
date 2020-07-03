import Vuex from '@wepy/x'
import wepy from '@wepy/core'

export default new Vuex.Store({
  state: {
    cart: []
  },
  mutations: {
    addGoodsToCart(state, goods) {
      const index = state.cart.findIndex(item => {
        return item.goods_id === goods.goods_id
      })
      if (index !== -1) {
        state.cart[index].count ++
        wepy.wx.setStorageSync('cart', state.cart)
        return
      }
      const info = {
        goods_id: goods.goods_id,
        goods_name: goods.goods_name,
        goods_small_logo: goods.goods_small_logo,
        goods_price: goods.goods_price,
        count: 1,
        isChecked: true
      }
      state.cart.push(info)
      wepy.wx.setStorageSync('cart', state.cart)
    },
    initCart(state, cart) {
      state.cart = cart
    }
  }
})
