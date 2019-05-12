const app = getApp()
Page({
  data: {
  },
  onLoad:function(){
    if(app.globalData.stuId!='')
    wx.setNavigationBarTitle({
      title: '更改学号',
    })
  },
  submit:function(e){
    wx.showLoading({
      title: '校验中'
    })
    var studentid = e.detail.value.studentid;
    var password = e.detail.value.password;
    wx.request({
      url: 'https://jianghuling.top/account/bondStu',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        secretId: app.globalData.userId,
        stuId: studentid,
        stuPsd: password
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.code == 20){
          app.globalData.stuId = studentid
          wx.showModal({
            title: '',
            content: '绑定学号成功',
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.showModal({
            title: '',
            content: '绑定学号失败，请检查学号和密码是否正确',
            showCancel: false,
          })
        }
      }
    })
  }
})