const app = getApp()
Page({
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  previewImage1: function (e) {
    var imageList = ['https://jianghuling.top/images/feedback_publicQrCode.jpg']
    wx.previewImage({
      current: imageList[0],
      urls: imageList
    })
    wx.getImageInfo({
      src: imageList[0],
      success: function (res) {

      }
    })
  },
  previewImage2: function (e) {
    var imageList = ['https://jianghuling.top/images/feedback_userQrCode.jpg']
    wx.previewImage({
      current: imageList[0],
      urls: imageList
    })
    wx.getImageInfo({
      src: imageList[0],
      success: function (res) {
        
      }
    })
  },
})