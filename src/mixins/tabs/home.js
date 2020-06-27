import wepy from '@wepy/core'

export default {
  data: {
    swiperDataList: [],
    cateDataList: []
  },
  onLoad() {
    this.getSwiperDataList()
    this.getCateDataList()
  },
  methods: {
    async getSwiperDataList() {
      const {
        data: res
      } = await wepy.wx.request({
        url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        method: 'GET',
        data: {}
      })
      if (res.meta.status !== 200) {
        return wepy.wx.showToast({
          title: res.meta.msg,
          icon: 'none',
          duration: 3000
        })
      }
      this.swiperDataList = res.message
    },
    async getCateDataList() {
      const { data: res } = await wepy.wx.request({
        url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems',
        method: 'GET',
        data: {}
      })
      if (res.meta.status !== 200) {
        return wepy.wx.showToast({
          title: res.meta.msg,
          icon: 'none',
          duration: 3000
        })
      }
      this.cateDataList = res.message
      console.log(this.cateDataList)
    }
  }
}
