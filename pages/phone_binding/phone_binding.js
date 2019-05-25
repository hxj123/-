const app = getApp()
var util = require('../../utils/util.js');
Page({
  data:{
    bt_content: '获取验证码',
    phone:'',
    isHiddenToast: true,
    sendCode: false,
    isDisabled: false
  },
  onLoad: function () {
    if (app.globalData.phone != '')
      wx.setNavigationBarTitle({
        title: '更改手机号',
      })
  },
  inputChange:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  getCode:function(){
    var that = this
    var phone = this.data.phone
    if (!util.isPoneAvailable(phone)){
      wx.showModal({
        title: '',
        content: '手机号输入错误',
        showCancel: false,
      })
      return
    }
    if (!that.data.sendCode) {
      that.setData({
        sendCode: true,
        isDisabled: true
      })
    } else return
    wx.request({
      url: 'https://jianghuling.xyz/account/sms',
      method: 'POST',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        phone: phone
      },
      success:function(res){
        if(res.data.code==20){
          that.setData({
            isHiddenToast: false,
          })
          setTimeout(()=>{
            that.setData({
              isHiddenToast:true
            })
          }, 2000)
          var startTime = new Date().getTime();
          var time = 60
          var interval = setInterval(function () {
            that.setData({
              bt_content: (time--)+'s后可发送'
            })
            if(time == 0) {
              that.setData({
                bt_content: '发送验证码',
                sendCode: false,
                isDisabled: false
              })
              clearInterval(interval)
            }
          }, 1000);
        }else{
          wx.showModal({
            title: '',
            content: '手机号输入错误',
            showCancel: false,
          })
        }
      }
    })
  },
  submit: function (e) {
    wx.showLoading({
      title: '校验中'
    })
    var phone = e.detail.value.phone;
    var vCode = e.detail.value.verifycode;
    var that = this
    wx.request({
      url: 'https://jianghuling.xyz/account/bondPhone',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        phone: phone,
        vCode: vCode
      },
      success: function (res) {
        wx.hideLoading()
        if(res.data.code == 20){
          app.globalData.phone = phone
          wx.showModal({
            title: '',
            content: '绑定手机成功',
            showCancel: false,
            success:function(res){
              wx.navigateBack({
                delta:1
              })
            }
          })
        } else if (res.data.code == 40){
          wx.showModal({
            title: '',
            content: '学号已被绑定',
            showCancel: false,
          })
        }else{
          wx.showModal({
            title: '',
            content: '绑定失败，请再次尝试，或联系管理员',
            showCancel: false,
          })
        }
      }
    })
  }
})
