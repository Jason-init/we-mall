import wepy from '@wepy/core'

const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1'

/**
 * Show toast function
 * @param {String} msg toast message
 */
wepy.baseToast = function(msg = 'request data failed') {
  wepy.wx.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
}

/**
 * request get function
 * @param {String} url request url, relative path starting with '/'
 * @param {Object} data request data
 */
wepy.get = function (url, data = {}) {
  return wepy.wx.request({
    url: baseURL + url,
    method: 'GET',
    data: data
  })
}

/**
 * request post function
 * @param {String} url request url, relative path starting with '/'
 * @param {Object} data request data
 */
wepy.post = function (url, data = {}) {
  return wepy.wx.request({
    url: baseURL + url,
    method: 'POST',
    data: data
  })
}
