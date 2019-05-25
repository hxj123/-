const app = getApp()
Page({
  onLoad: function () {
    var that = this;
    wx.login({
      success: res => {
        // console.log(res.code)
        wx.request({
          url: 'https://jianghuling.xyz/account/login',
          data: { jscode: res.code },
          success: function (res) {
            app.globalData.userId = res.data.message
            app.globalData.usageGuide = res.data.usageGuide
            app.globalData.phone = res.data.phone
            app.globalData.stuId = res.data.stuId
            app.globalData.gender = res.data.gender
            app.globalData.defaultDestination = res.data.defaultDestination
            app.globalData.defaultName = res.data.defaultName
            app.globalData.defaultPhone = res.data.defaultPhone
            app.globalData.defaultTakeAddress = res.data.defaultTakeAddress
            //app.globalData.feeAccount = res.data.feeAccount
            wx.switchTab({
              url: '../index/index'
            })
          },
          fail: function (res) {
            wx.showModal({
              title: '',
              content: '获取信息失败,请重试',
              showCancel: false,
            })
          }
        })
      }
    })
  }
})
