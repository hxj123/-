const app = getApp()
var util = require('../../utils/util.js');
Page({
  onShow: function () {
   
  },
  data:{
    
  },
  toFunc: function(e){
    var url;
    switch(e.currentTarget.dataset.index){
      case '1':
        url = '../user_info/user_info'
        break;
      case '2':
        url = '../order_setting/order_setting'
        break;
      case '3':
        url = '../customer_service/customer_service'
        break;
      /*
      case '4':
        url = '../fee_account/fee_account';
        break;
      */
    }
    wx:wx.navigateTo({
      url: url,
    })
  }
})
