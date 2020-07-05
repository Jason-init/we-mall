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
    },
    updateCount(state, params) {
      const id = state.cart.findIndex(item => {
        return item.goods_id === params.id
      })
      if (id !== -1) {
        state.cart[id].count = params.count
        wepy.wx.setStorageSync('cart', state.cart)
      }
    },
    updateChecked(state, params) {
      const id = state.cart.findIndex(item => {
        return item.goods_id === params.id
      })
      if (id !== -1) {
        state.cart[id].isChecked = params.checked
        wepy.wx.setStorageSync('cart', state.cart)
      }
    },
    deleteItem(state, id) {
      const index = state.cart.findIndex(item => {
        return item.goods_id === id
      })
      if (index !== -1) {
        state.cart.splice(index, 1)
        wepy.wx.setStorageSync('cart', state.cart)
      }
    },
    toggleChecked(state, isChecked) {
      state.cart.forEach(item => {
        item.isChecked = isChecked
      })
      wepy.wx.setStorageSync('cart', state.cart)
    }
  }
})
