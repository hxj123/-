const app = getApp()
Page({
  data: {

  },
  onShow:function(){
    if (app.globalData.phone == '' || app.globalData.stuId == ''){
      wx.showModal({
        title: '',
        content: '填写意见反馈前请先绑定手机号和学号',
        confirmText: '去绑定',
        success:function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../user_info/user_info',
            })
          }else{
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  },
  formSubmit: function (e) {
    if (e.detail.value.comment.length == 0){
      wx.showModal({
        title: '',
        content: '提交内容不能为空',
        showCancel: false,
      })
      return
    }
    wx.request({
      url: 'https://jianghuling.top/cst/comment',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        phone:app.globalData.phone,
        comment: e.detail.value.comment
      },
      success: function(res){
        if(res.data.code == 20){
          wx.showModal({
            title: '',
            content: '提交成功',
            showCancel: false,            
            success: function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.showModal({
            title: '',
            content: '提交失败',
          })
        }
      },
      fail: function(){
        wx.showModal({
          title: '',
          content: '服务器出错',
          showCancel:false
        })
      }
    })
  },
})