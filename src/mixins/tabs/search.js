import wepy from '@wepy/core'

export default {
  data: {
    value: '',
    suggestDataList: [],
    keyWordList: []
  },
  onLoad() {
    this.getKeyWordList()
  },
  methods: {
    onSearch(e) {
      const kw = e.$wx.detail.trim()

      if (kw.length === 0) return

      if (this.keyWordList.indexOf(kw) === -1) {
        this.keyWordList.unshift(kw)
        this.keyWordList = this.keyWordList.slice(0, 10)
        wepy.wx.setStorageSync('kw', this.keyWordList)
      }

      wepy.wx.navigateTo({
        url: '/pages/goods_list?query=' + kw
      })
    },
    onCancel(e) {
      this.suggestDataList = []
      this.value = ''
    },
    onChange(e) {
      this.value = e.$wx.detail.trim()
      if (e.$wx.detail.trim().length === 0) {
        this.suggestDataList = []
        return
      }
      this.getSuggestDataList(e.$wx.detail)
      console.log(this.value)
    },
    async getSuggestDataList(query) {
      const { data: res } = await wepy.get('/goods/qsearch', {
        query: query
      })
      if (res.meta.status !== 200) return wepy.baseToast(res.meta.msg)
      this.suggestDataList = res.message
      console.log(this.suggestDataList)
    },
    goGoodsDetail(goodsId) {
      wepy.wx.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goodsId
      })
    },
    getKeyWordList() {
      this.keyWordList = wepy.wx.getStorageSync('kw') || []
      console.log(this.keyWordList)
    },
    goGoodsList(query) {
      wepy.wx.navigateTo({
        url: '/pages/goods_list?query=' + query
      })
    },
    clearHistory() {
      this.keyWordList = []
      wepy.wx.setStorageSync('kw', [])
    }
  },
  computed: {
    showHistory() {
      if (this.value.length !== 0) return false
      return true
    }
  }
}
