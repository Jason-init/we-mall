import wepy from '@wepy/core'

export default {
  data: {
    swiperDataList: [],
    cateDataList: [],
    floorDataList: []
  },
  onLoad() {
    this.getSwiperDataList()
    this.getCateDataList()
    this.getFloorDataList()
  },
  methods: {
    async getSwiperDataList() {
      const {
        data: res
      } = await wepy.get('/home/swiperdata')
      if (res.meta.status !== 200) {
        return wepy.baseToast(res.meta.msg)
      }
      this.swiperDataList = res.message
    },
    async getCateDataList() {
      const { data: res } = await wepy.get('/home/catitems')
      if (res.meta.status !== 200) {
        return wepy.baseToast(res.meta.msg)
      }
      this.cateDataList = res.message
      console.log(this.cateDataList)
    },
    async getFloorDataList() {
      wepy.wx.showLoading({
        title: 'Loading'
      })

      const { data: res } = await wepy.get('/home/floordata')

      wepy.wx.hideLoading()

      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)
      this.floorDataList = res.message
      console.log(this.floorDataList)
    },
    goGoodsList(url) {
      wepy.wx.navigateTo({
        url: url
      })
    }
  }
}
