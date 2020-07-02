import wepy from '@wepy/core'

export default {
  data: {
    cateDataList: [],
    activeKey: 0,
    windowHeight: 0,
    secondCateList: []
  },
  onLoad() {
    this.getCateDataList()
    this.getWindowHeight()
  },
  methods: {
    async getCateDataList() {
      wepy.wx.showLoading({
        title: '加载中'
      })

      const { data: res } = await wepy.get('/categories')

      wepy.wx.hideLoading()

      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)
      this.cateDataList = res.message
      this.secondCateList = this.cateDataList[0].children
      console.log(this.secondCateList)
    },
    onChange(e) {
      console.log(e.$wx.detail)
      this.secondCateList = this.cateDataList[e.$wx.detail].children
      console.log(this.secondCateList)
    },
    async getWindowHeight() {
      const info = await wepy.wx.getSystemInfo()
      console.log(info)
      if (info.errMsg !== 'getSystemInfo:ok') return
      this.windowHeight = info.windowHeight
    },
    goGoodsList(cateId) {
      wepy.wx.navigateTo({
        url: '/pages/goods_list?cateId=' + cateId
      })
    }
  }
}
