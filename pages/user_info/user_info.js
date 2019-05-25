const app = getApp()
Page({
  data: {
    stuId: '',
    phone: '',
    gender: ''
  },
  onShow:function(){
    this.setData({
      stuId: app.globalData.stuId,
      phone: app.globalData.phone,
      gender: app.globalData.gender
    })
  },
  radioChange: function(e){
    app.globalData.gender = e.detail.value
    wx.request({
      url: 'https://jianghuling.xyz/account/gender',
      data: { secretId: app.globalData.userId, gender: e.detail.value },
      success: function (res) {

      }
    })
  },
  toFunc: function (e) {
    var url;
    switch (e.currentTarget.dataset.index) {
      case '1':
        url = '../studentid_binding/studentid_binding'
        break;
      case '2':
        url = '../phone_binding/phone_binding'
        break;
    }
    wx: wx.navigateTo({
      url: url,
    })
  }
})
