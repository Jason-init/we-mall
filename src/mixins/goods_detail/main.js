import wepy from '@wepy/core'
import { mapMutations, mapState } from '@wepy/x'

export default {
  data: {
    goodsId: '',
    goodsDetail: {},
    address: null
  },
  methods: {
    ...mapMutations(['addGoodsToCart', 'initCart']),
    async getGoodsDetail() {
      wepy.wx.showLoading({
        title: '加载中'
      })

      const { data: res } = await wepy.get('/goods/detail', {
        goods_id: this.goodsId
      })
      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)
      this.goodsDetail = res.message

      wepy.wx.hideLoading()

      console.log(this.goodsDetail)
    },
    previewImg(currentUrl) {
      wepy.wx.previewImage({
        urls: this.goodsDetail.pics.map(item => {
          return item.pics_big
        }),
        current: currentUrl
      })
    },
    async chooseAddress() {
      const res = await wepy.wx.chooseAddress().catch(error => error)
      if (res.errMsg !== 'chooseAddress:ok') return wepy.baseToast('获取收货地址失败')
      this.address = res
      wepy.wx.setStorageSync('address', res)
      console.log(this.address)
    },
    handleContact(e) {
      console.log(e.$wx)
    },
    addToCart() {
      this.addGoodsToCart(this.goodsDetail)
      wepy.wx.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
      console.log(this.cart)
    }
  },
  computed: {
    ...mapState(['cart']),
    addressStr() {
      if (this.address === null) return '请选择收货地址'
      return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
    },
    total() {
      let itemCount = 0
      this.cart.forEach(item => {
        if (item.isChecked) {
          itemCount += item.count
          console.log(itemCount)
        }
      })
      return itemCount
    }
  },
  onLoad(options) {
    this.goodsId = options.goods_id || ''
    this.getGoodsDetail()
    const cart = wepy.wx.getStorageSync('cart') || []
    this.initCart(cart)
  }
}
