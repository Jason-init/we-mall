import wepy from '@wepy/core'

export default {
  data: {
    queryParams: {
      query: '',
      cid: '',
      pagenum: 1,
      pagesize: 20
    },
    goodsDataList: [],
    total: 0,
    showEndline: false,
    isLoading: false
  },
  methods: {
    async getGoodsDataList(callback) {
      this.isLoading = true
      wepy.wx.showLoading({
        title: 'Loading'
      })

      const { data: res } = await wepy.get('/goods/search', this.queryParams)
      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)
      this.goodsDataList = [...this.goodsDataList, ...res.message.goods]
      this.total = res.message.total

      this.isLoading = false
      wepy.wx.hideLoading()

      callback && callback()

      console.log(this.goodsDataList)
      console.log(this.total)
    },
    goGoodsDetail(goodsId) {
      wepy.wx.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    }
  },
  onLoad(options) {
    console.log(options)
    this.queryParams.query = options.query || ''
    this.queryParams.cid = options.cateId || ''
    this.getGoodsDataList()
  },
  onReachBottom() {
    if (this.isLoading === true) return

    if (this.total <= this.queryParams.pagenum * this.queryParams.pagesize) {
      this.showEndline = true
      return
    }

    this.queryParams.pagenum ++
    this.getGoodsDataList()
  },
  onPullDownRefresh() {
    this.queryParams.pagenum = 1
    this.total = 0
    this.showEndline = this.isLoading = false
    this.goodsDataList = []

    this.getGoodsDataList(() => {
      wepy.wx.stopPullDownRefresh()
    })
  }
}
