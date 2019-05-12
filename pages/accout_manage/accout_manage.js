Page({
  data: {
  
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