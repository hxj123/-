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
            success: function (res) {
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

    buy: function (event) {
        const that = this;
        const book = this.data.book;
        if (parseInt(book.state) !== 0) {
            wx.showToast({
                title: "此书已被购买了哦",
                icon: "none",
                duration: 2000
            });
        } else {
            wx.showModal({
                title: '提示',
                content: '确认购买吗？购买后可以查看买家联系方式',
                success: function (res) {
                    if (res.confirm) {
                        var bounty = String(that.data.book.price);
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
                                        wx.hideLoading();
                                        console.log(res)
                                        if (res.data.code == 20) {
                                            console.log(pay);
                                            var pay = res.data
                                            var timeStamp = String(pay.timeStamp)
                                            var prepayId = 'prepay_id='.concat(pay.prepayId)
                                            var paySign = pay.paySign
                                            var nonceStr = pay.nonceStr
                                            var code = pay.code
                                            var e = { "timeStamp": timeStamp, "prepayId": prepayId, "paySign": paySign, "nonceStr": nonceStr, "signType": "MD5" }
                                            wx.requestPayment({
                                                timeStamp: e.timeStamp,
                                                nonceStr: e.nonceStr,
                                                package: e.prepayId,
                                                signType: e.signType,
                                                paySign: e.paySign,
                                                success: function (res) {
                                                    
                                                    wx.showModal({
                                                        title: '',
                                                        content: '购买成功，请前往我的订单查看卖家联系方式',
                                                        showCancel: false,
                                                        success:function(){
                                                            wx.navigateBack({
                                                                delta: 1,
                                                            })
                                                        }
                                                    })
                                                    const pages = getCurrentPages();
                                                    const lastPage = pages[pages.length - 2];
                                                    lastPage.setData({
                                                        boughtSuccess: true,
                                                        boughtIdx: that.data.idx
                                                    });
                                                    
                                                },
                                                fail: function (res) {

                                                }
                                            })
                                        } else {
                                            if (res.data.code == 30) {
                                                console.log(res.data.message);
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '此书已经被购买',
                                                })
                                            } else if (res.data.code == 31) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '不能买自己的书哦',
                                                })
                                            }
                                        }
                                    },
                                    fail: function(e){
                                        wx.hideLoading()
                                        wx.showModal({
                                            title: '提示',
                                            content: '网络错误，请联系管理员或稍后再试',
                                        })
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    },

    call: function (event) {
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
