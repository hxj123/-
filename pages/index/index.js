const app = getApp()
Page({
  onLoad:function(){
    var that = this;
    if(app.globalData.usageGuide == 1){
      that.setData({
        isHiddenRule: true
      })
    }
    var reg = new RegExp("\n", "g");
    wx.request({
      url: 'https://jianghuling.xyz/cst/carouselNtf',
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var message = res.data.message;
        var changedText = message.replace(/\n/g, "")
        that.setData({
          text: message,
          changedText: changedText
        })
        var singleLengthChar = changedText.replace(/[^0-9a-zA-Z -+\/.,:!~]/ig, "").length //计算单个字符的个数
        var length = (changedText.length - singleLengthChar/2) * that.data.size;//文字长度
        var windowWidth = 0.55 * wx.getSystemInfoSync().windowWidth;//屏幕宽度
        that.setData({
          length: length,
          windowWidth: windowWidth
        })
        that.scrollText();// 第一个字消失后立即从右边出现
      },
      fail: function (res) {
      }
    })

    var weekday = ['日', '一', '二', '三', '四', '五', '六'];
    var year = ['一八', '一九', '二零', '二一', '二二'];
    var weekday_english = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    var month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    var month_english = ['JANUARY', 'FEBRURY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMPER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var date = new Date();
    that.setData({
      weekday: weekday[date.getDay()],
      weekday_english: weekday_english[date.getDay()],
      month: month[date.getMonth()],
      month_english: month_english[date.getMonth()],
      day: date.getDate().toString(),
      fullYear: date.getFullYear().toString(),
      year: year[Number(date.getFullYear()) - 2018],
    })
  },
  data: {
    text: "",
    marqueePace: 2,//滚动速度
    marqueeDistance: 0,//滚动初始距离
    marquee_margin: 200,
    size: 14,
    interval: 40,//时间间隔
    banner: [{
      imagePath: "http://120.77.212.58:3000/images/main_bg3.png",
      id: 1
    }
    // ,
    // {
    //   imagePath: "/image/main_bg3.png",
    //   id: 2
    // },
    // {
    //   imagePath: "/image/main_bg3.png",
    //   id: 3
    // },
    // {
    //   imagePath: "/image/main_bg3.png",
    //   id: 4
    // }
    ],
    isHiddenToast: true,
    isHiddenRule: false
  },
  onShow: function () {
    var that = this

  },
  scrollText: function (){
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    that.setData({
      marquee_margin: 30
    })
    if(length > windowWidth){
      var interval = setInterval(function () {
        var maxscrollwidth = length + 30;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentLeft = that.data.marqueeDistance;
        if (crentLeft <= maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentLeft + that.data.marqueePace
          })
        } else {
          that.setData({
            marqueeDistance: 0// 直接重新滚动
          })
          clearInterval(interval);
          that.scrollText();
        }
      }, that.data.interval)
    } else {
      that.setData({
        marquee_margin: '1000'//只显示一条不滚动右边间距加大，防止重复显示
      })
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  navigatorTo: function (event) {
    // console.log(event);
    // this.openPastAnnouncement();
    // return;
    const strID = event.target.id.substring(3);
    const iID = parseInt(strID);

    let nt = "";
    switch (iID) {
      case 1:
        nt = "../take_express/take_express";
        break;
      case 4:
        nt = "../2hand_trade/2hand_trade";
        break;
      default:
        break;
    }
    wx:wx.navigateTo({
      url: nt,
    });


    if (app.globalData.usageGuide == 0) {
      wx.request({
        url: 'https://jianghuling.xyz/account/usage',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          secretId: app.globalData.userId,
        },
        success: function (res) {
          app.globalData.usageGuide = 1;
        }
      })
      /*
      wx.showModal({
        title: '',
        content: '各位亲爱的用户，目前线上的支付功能还未开发完成，所以关于赏金的支付需要你们在完成线下交易时进行转账的操作，对您造成的不便请谅解',
        showCancel:false,
        success: function(){
          wx.navigateTo({
            url: '../take_express/take_express',
          })
          wx.request({
            url: 'https://jianghuling.xyz/account/usage',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              secretId: app.globalData.userId,
            },
            success: function(res){
              app.globalData.usageGuide = 1;
            }
          })
        }
      })
      */
    }
  },
  showToast: function(){
    var that = this
    if (!that.data.isHiddenToast) return
    that.setData({
      isHiddenToast: false
    })
    setTimeout(() => {
      that.setData({
        isHiddenToast: true
      })
    }, 2000);
  },
  closeCross: function () {
    var that = this
    if (that.data.isHiddenRule) return
    that.setData({
      isHiddenRule: true
    })
    if(app.globalData.usageGuide == 0){
      wx.request({
        url: 'https://jianghuling.xyz/account/usage',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          secretId: app.globalData.userId,
        },
        success: function (res) {
          app.globalData.usageGuide = 1;
        }
      })
    }
  },
  openPastAnnouncement: function () {
    var that = this
    if (!that.data.isHiddenRule) return
    that.setData({
      isHiddenRule: false
    })
  }
})
