import wepy from '@wepy/core'
import { mapState } from '@wepy/x'

export default {
  data: {
    address: null,
    checkedGoods: []
  },
  methods: {
    async chooseAddress() {
      const res = await wepy.wx.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok') return
      this.address = res
      wepy.wx.setStorageSync('address', res)
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
    }
  }
}
