import wepy from '@wepy/core'
import { mapState, mapMutations } from '@wepy/x'

export default {
  data: {},
  methods: {
    ...mapMutations(['initCart', 'updateCount', 'updateChecked', 'deleteItem', 'toggleChecked']),
    changeCount(e) {
      console.log(e.$wx.detail)
      console.log(e.$wx.target.dataset.id)
      this.updateCount({
        id: e.$wx.target.dataset.id,
        count: e.$wx.detail
      })
    },
    changeChecked(e) {
      console.log(e.$wx.detail)
      console.log(e.$wx.target.dataset.id)
      this.updateChecked({
        id: e.$wx.target.dataset.id,
        checked: e.$wx.detail
      })
    },
    deleteGoods(id) {
      this.deleteItem(id)
    },
    toggleAllChecked(e) {
      this.toggleChecked(e.$wx.detail)
    },
    async renderCartBadge() {
      let itemCount = 0
      this.cart.forEach(item => {
        if (item.isChecked) {
          itemCount += item.count
          console.log(itemCount)
        }
      })
      const res = await wepy.wx.setTabBarBadge({
        index: 3,
        text: itemCount + ''
      }).catch(err => { return err })
      console.log(res)
      if (res.errMsg !== 'setTabBarBadge:ok') {}
    }
  },
  onLoad() {
    const cart = wepy.wx.getStorageSync('cart') || []
    this.initCart(cart)
  },
  computed: {
    ...mapState(['cart']),
    totalPrice() {
      let total = 0
      this.cart.forEach(item => {
        if (item.isChecked) {
          total += item.goods_price * item.count
        }
      })
      console.log(total)
      return total * 100
    },
    isFullChecked() {
      let countChecked = 0
      this.cart.forEach(item => {
        if (item.isChecked) {
          countChecked++
        }
      })
      return countChecked === this.cart.length
    }
  },
  watch: {
    cart: {
      handler(newVal, oldVal) {
        this.renderCartBadge()
      },
      deep: true
    }
  }
}
