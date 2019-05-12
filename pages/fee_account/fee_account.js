const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    feeAccount: '',
    sendCode: false,
  },
  onLoad: function () {
    if (app.globalData.feeAccount != '')
      wx.setNavigationBarTitle({
        title: '更改收款账号',
      })
    wx.showModal({
      title: '系统通知',
      content: '亲爱的用户：非常抱歉，因为流程原因，小程序目前只能支付宝转账，造成的不便敬请谅解',
      showCancel: false
    })
  },
  inputChange: function (e) {
    this.setData({
      feeAccount: e.detail.value
    })
  },
  submit: function (e) {
    wx.showLoading({
      title: '校验中'
    })
    var feeAccount = e.detail.value.feeAccount
    if(feeAccount == ''){
      wx.hideLoading()
      wx.showModal({
        title: '',
        content: '请输入账号',
        showCancel: false
      })
      return
    }
    var that = this
    wx.request({
      url: 'https://jianghuling.top/account/bondFeeAccount',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        feeAccount: feeAccount
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 20) {
          app.globalData.feeAccount = feeAccount
          console.log("app.globalData.feeAccount:" + app.globalData.feeAccount)
          wx.showModal({
            title: '',
            content: '绑定账户成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.code == 40) {
          wx.showModal({
            title: '',
            content: '账户已被绑定',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '',
            content: '绑定失败，请再次尝试，或联系管理员',
            showCancel: false,
          })
        }
      }
    })
  },
  setFeeAccount: function () {
    if(app.globalData.phone == ''){
      wx.showModal({
        title: '',
        content: '请先绑定手机号',
        showCancel: false
      })
      return
    } else {
      var that = this
      wx.request({
        url: 'https://jianghuling.top/account/bondFeeAccount',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          secretId: app.globalData.userId,
          feeAccount: app.globalData.phone
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 20) {
            app.globalData.feeAccount = app.globalData.phone
            wx.showModal({
              title: '',
              content: '绑定账户成功',
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else if (res.data.code == 40) {
            wx.showModal({
              title: '',
              content: '账户已被绑定',
              showCancel: false,
            })
          } else {
            wx.showModal({
              title: '',
              content: '绑定失败，请再次尝试，或联系后台管理员',
              showCancel: false,
            })
          }
        }
      })
    }
  }
})