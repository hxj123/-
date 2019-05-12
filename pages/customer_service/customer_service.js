const app = getApp()
Page({
  data: {

  },
  toFunc: function (e) {
    var url = '';
    switch (e.currentTarget.dataset.index) {
      case '1':
        //url = ''
        wx.showModal({
          title: '',
          content: '暂未开放',
          showCancel: false
        })
        break;
      case '2':
        //url = ''
        wx.showModal({
          title: '',
          content: '暂未开放',
          showCancel: false
        })
        break;
      case '3':
        url = '../suggestion/suggestion'
        break;
      case '4':
        url = '../contact_us/contact_us'
        break;
    }
    if(url != ''){
      wx: wx.navigateTo({
        url: url,
      })
    }
  }
})