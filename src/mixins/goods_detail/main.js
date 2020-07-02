import wepy from '@wepy/core'

export default {
  data: {
    goodsId: '',
    goodsDetail: {},
    temp: '',
    address: null
  },
  methods: {
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
    }
  },
  computed: {
    addressStr() {
      if (this.address === null) return '请选择收货地址'
      return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
    }
  },
  onLoad(options) {
    this.goodsId = options.goods_id || ''
    this.getGoodsDetail()
  }
}
