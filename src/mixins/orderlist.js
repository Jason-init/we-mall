import wepy from '@wepy/core'

export default {
  data: {
    active: 0,
    allOrderlist: [],
    unpayedOrderlist: [],
    payedOrderlist: []
  },
  methods: {
    tabChanged(e) {
      this.active = e.$wx.detail.index
    },
    async getOrderlist(type) {
      const { data: res } = await wepy.get('/my/orders/all', {
        type: type + 1
      }, wepy.wx.getStorageSync('token') || '')

      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)

      res.message.orders.forEach(item => {
        item.order_detail = JSON.parse(item.order_detail)
      })

      if (this.active === 0) {
        this.allOrderlist = res.message.orders
      } else if (this.active === 1) {
        this.payedOrderlist = res.message.orders
      } else if (this.active === 2) {
        this.payedOrderlist = res.message.orders
      } else {
        wepy.baseToast('订单类型错误')
      }
    }
  },
  onLoad() {
    this.getOrderlist(this.active + 1)
  }
}
