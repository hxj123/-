// pages/book_detail/book_detail.js
const MAX_IMAGE_HEIGHT = 500;
const BASE_URL = "https://jianghuling.xyz/book";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {}
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const book_info = JSON.parse(options.book_info);
    const that = this;
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          scrollHeight: res.windowHeight - 50
        });
      }
    });
    this.setData({
      book: book_info,
      idx: options.id
    })
  },

  buy: function(event) {
    const that = this;
    const book = this.data.book;
    if(parseInt(book.state) !== 0) {
      wx.showToast({
        title: "此书已被购买了哦",
        icon: "none",
        duration: 2000
      });
    } else {
      wx.showLoading({
        title: "请稍候...",
        mask: true,
        success: (res) => {
          wx.request({
            url: BASE_URL + "/buy",
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: "json",
            data: {
              secretId: app.globalData.userId,
              bookId: book.id
            },
            success: (res) => {
              console.log(res);
              const data = res.data;
              wx.hideLoading();
              if(data.code !== undefined) {
                if(parseInt(data.code) !== 20) {
                  wx.showToast({
                    title: data.message + "code: "+ data.code,
                    icon: "none",
                    duration: 2000
                  });
                } else {
                  wx.showToast({
                      title: "请前往订单查看卖家联系方式",
                    duration: 1000,
                    mask: true
                  });
                  const pages = getCurrentPages();
                  const lastPage = pages[pages.length-2];
                  lastPage.setData({
                    boughtSuccess: true,
                    boughtIdx: that.data.idx
                  });
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 1000);
                }
              } else {
                wx.showToast({
                  title: "未知错误，code: " + data.status,
                  icon: "none",
                  duration: 2000
                });
              }
            },
          });
        }
      });
    }
  },

  call: function(event) {
    console.log(event);
    wx.makePhoneCall({
      phoneNumber: this.data.book.sellerPhone
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
