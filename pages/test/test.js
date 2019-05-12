// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[0,1,2,3,4,5,6,6,7,8,9,10,11],
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  eventchange: function (event) {
    this.setData({
      currentTab: event.detail.current
    })
    if (event.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.currentTab == 0 && this.data.preIndex > 1) {//卡死时，重置currentTab为正确索引
        this.setData({ currentTab: this.data.preIndex });
      }
      else {//正常轮转时，记录正确页码索引
        this.setData({ preIndex: this.data.currentTab });
      }
    }
  },

  tab: function (event) {
    this.setData({
      currentTab: event.target.dataset.current
    })
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
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  aaa:function(){
    console.log(1)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})