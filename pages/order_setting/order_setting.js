const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    defaultName: '',
    defaultPhone:'',
    defaultDestination: '',
    defaultTakeAddress: ''
  },
  onLoad: function (options) {
    this.setData({
      defaultName: app.globalData.defaultName,
      defaultPhone: app.globalData.defaultPhone,
      defaultDestination: app.globalData.defaultDestination,
      defaultTakeAddress: app.globalData.defaultTakeAddress
    })
  },
  submit:function(e){
    if (!util.isPoneAvailable(e.detail.value.defaultPhone)){
      wx.showModal({
        title: '',
        content: '电话输入错误，请重新确认',
        showCancel: false,
      })
      return;
    }
    wx.showLoading({
      title: '保存中',
    })
    wx.request({
      url: 'https://jianghuling.xyz/account/defaultOrderInfo',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        name: e.detail.value.defaultName,
        phone: e.detail.value.defaultPhone,
        destination: e.detail.value.defaultDestination,
        takeAddress: e.detail.value.defaultTakeAddress
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.code == 20){
          wx.showToast({
            title: '保存成功',
          })
          app.globalData.defaultName = e.detail.value.defaultName
          app.globalData.defaultPhone = e.detail.value.defaultPhone
          app.globalData.defaultDestination = e.detail.value.defaultDestination
          app.globalData.defaultTakeAddress = e.detail.value.defaultTakeAddress
        }else{
          wx.showModal({
            title: '',
            content: '保存失败',
            showCancel: false,
          })
        }
      },
      fail: function(){
        wx.showModal({
          title: '',
          content: '保存失败，请检查网络连接',
          showCancel: false,
        })
        wx.hideLoading()
      }
    })
  }
})
