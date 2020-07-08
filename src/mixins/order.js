import wepy from '@wepy/core'
import { mapState } from '@wepy/x'

export default {
  data: {
    address: null,
    checkedGoods: [],
    isLogin: false,
    orderInfo: {}
  },
  methods: {
    async chooseAddress() {
      const res = await wepy.wx.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok') return
      this.address = res
      wepy.wx.setStorageSync('address', res)
    },
    getUserInfo(userInfo) {
      console.log(userInfo)
      if (userInfo.$wx.detail.errMsg !== 'getUserInfo:ok') return wepy.baseToast('获取用户信息失败')
      this.login(userInfo.$wx.detail.encryptedData, userInfo.$wx.detail.iv, userInfo.$wx.detail.rawData, userInfo.$wx.detail.signature)
    },
    async login(encryptedData, iv, rawData, signature) {
      const res = await wepy.wx.login()
      if (res.errMsg !== 'login:ok') return wepy.baseToast('微信登录失败')
      const loginParams = {
        code: res.code,
        encryptedData,
        iv,
        rawData,
        signature
      }
      console.log(loginParams)
      const { data: res2 } = await wepy.post('/users/wxlogin', loginParams)
      console.log(res2)
      if (res2.meta.status !== 200) return wepy.baseToast(res2.meta.msg)
      wepy.wx.setStorageSync('token', res2.message.token)
      this.isLogin = true
    },
    async onSubmit() {
      if (this.totalPrice <= 0) return wepy.baseToast('订单金额不能为零')
      if (this.address === null) return wepy.baseToast('收货地址不能为空')

      const { data: createOrderResult } = wepy.post('/my/orders/create', {
        order_price: this.totalPrice,
        consignee_addr: this.addressString,
        order_detail: JSON.stringify(this.checkedGoods),
        goods: this.checkedGoods.map(item => {
          return {
            goods_id: item.goods_id,
            goods_number: item.count,
            goods_price: item.goods_price
          }
        }, wepy.wx.getStorageSync('token') || '')
      })
      if (createOrderResult.meta.status !== 200) return wepy.baseToast(createOrderResult.meta.msg)
      this.orderInfo = createOrderResult.message

      const { data: unifyOrderResult } = await wepy.post('/my/orders/req_unifiedorder', {
        order_number: this.orderInfo.order_number
      }, wepy.getStorageSync('token') || '')
      if (unifyOrderResult.meta.status !== 200) return wepy.basetOAST(unifyOrderResult.meta.msg)

      const payResult = await wepy.wx.requestPayment(unifyOrderResult.message.pay).catch(err => err)
      if (payResult.errMsg === 'requestPayment:fail cancel') return wepy.baseToast('支付已取消')

      const { data: checkPaymentResult } = await wepy('/my/orders/chkOrder', {
        order_number: this.orderInfo.order_number
      }, wepy.getStorageSync('token') || '')
      if (checkPaymentResult.meta.status !== 200) return wepy.baseToast(checkPaymentResult.meta.msg)

      wepy.wx.showToast({
        title: '支付成功'
      })

      wepy.wx.navigateTo({
        url: '/pages/orderlist'
      })
    }
  },
  onLoad() {
    this.address = wepy.wx.getStorageSync('address') || null
    this.checkedGoods = this.cart.filter(item => {
      return item.isChecked === true
    })
  },
  computed: {
    ...mapState(['cart']),
    hasSavedAddress() {
      return this.address !== null
    },
    addressString() {
      if (this.address === null) return ''
      return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
    },
    totalPrice() {
      let total = 0
      this.checkedGoods.forEach(item => {
        total += item.goods_price * item.count
      })
      return total * 100
    }
  }
}
