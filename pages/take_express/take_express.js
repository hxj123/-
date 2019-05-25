const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    express_type: ['顺丰', '圆通', '韵达', '申通', '中通', 'EMS', '百世汇通', '天天', '东骏', '京东','品骏','苏宁易购'],
    weight_type: ['1kg以下', '1-3kg', '3-5kg', '5kg以上'],
    start_time: '00:00',
    end_time: '00:00',
    currentIndex: 18, //选择器当前index
    autoCancelTime: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
    express: {
      'type': '圆通',
      'take_address': '',
      'delivery_address': '',
      //'start_time': '00:00',
      //'end_time': '23:59',
      'weight': '1kg以下',
      'name': '',
      'phone': '',
      'number': '',
      'bounty': '3',
      'remark': '',
      'delivery_time': '',
      'release_time': ''
    },
    currentTab: 0, //当前所在滑块的 index
    preIndex: '',
    myCurrentTab: 0, //当前所在滑块的 index
    express_order_list: [],
    my_accept_list: [],
    my_release_list: [],
    hiddenModal1: false,
    hiddenModal2: false,
    hiddenModal3: false,
    hiddenModal4: false,
    clickItem: null,
    clickItemIndex: 0,
    express_list_page: 0,
    accept_list_page: 0,
    release_list_page: 0,
    hasMore1: true,
    hasMore2: true,
    hasMore3: true,
    isRefresh1: false,
    isRefresh2: false,
    isRefresh3: false,
    isLoadMore1: false,
    isLoadMore2: false,
    isLoadMore3: false,
    isHideLoadMore1: true,
    isHideLoadMore2: true,
    isHideLoadMore3: true,
    isHiddenLoadMore: true,
    isHiddenTipBlock1: true,
    isHiddenTipBlock2: true,
    isHiddenTipBlock3: true,
    tipBlockContent1: '',
    tipBlockContent2: '',
    tipBlockContent3: '',
  },
  onLoad: function () {
    var that = this
    var express = this.data.express
    express.name = app.globalData.defaultName,
      express.phone = app.globalData.defaultPhone,
      express.delivery_address = app.globalData.defaultDestination,
      express.take_address = app.globalData.defaultTakeAddress
    that.setData({
      isHiddenTipBlock1: false,
      isHiddenTipBlock2: false,
      isHiddenTipBlock3: false,
      tipBlockContent1: '加载中...',
      tipBlockContent2: '加载中...',
      tipBlockContent3: '加载中...',
      express: express
    });
    wx.request({
      url: 'https://jianghuling.xyz/order/getOrderRelease',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.express_list_page,
        pageSize: 15
      },
      success: function (res) {
        console.log(res);
        if (res.data.length == 0) {
          that.setData({
            tipBlockContent1: '空空如也'
          })
        } else {
          that.setData({
            isHiddenTipBlock1: true,
            express_order_list: res.data,
            express_list_page: that.data.express_list_page + 1
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '',
          content: '出错了，请检查当前网络连接状态',//
          showCancel: false
        })
      }
    })
    wx.request({
      url: 'https://jianghuling.xyz/order/getMyMission',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.accept_list_page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            tipBlockContent2: '空空如也'
          })
        } else {
          that.setData({
            isHiddenTipBlock2: true,
            my_accept_list: res.data,
            accept_list_page: that.data.accept_list_page + 1
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '',
          content: '出错了，请检查当前网络连接状态',//
          showCancel: false
        })
      }
    })
    wx.request({
      url: 'https://jianghuling.xyz/order/myReleaseOrder',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.release_list_page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            tipBlockContent3: '空空如也'
          })
        } else {
          that.setData({
            isHiddenTipBlock3: true,
            my_release_list: res.data,
            release_list_page: that.data.release_list_page + 1
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '',
          content: '出错了，请检查当前网络连接状态',//
          showCancel: false
        })
      }
    })
  },
  tab: function (event) {
    console.log(event)
    this.setData({
      currentTab: event.target.dataset.current
    })
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
  bindDateChange: function (e) {
    this.setData({
      currentIndex: e.detail.value
    });
  },
  /*
  bindDateChange1: function (e) {
    this.setData({
      ['express.start_time']: e.detail.value
    });
    if (!util.compareTime(this.data.express.start_time, this.data.express.end_time)) {
      this.setData({
        ['express.end_time']: e.detail.value
      });
    }
  },
  bindDateChange2: function (e) {
    this.setData({
      ['express.end_time']: e.detail.value
    });
  },
  */
  bindPickerChange1: function (e) {
    var type = this.data.express_type[e.detail.value];
    this.setData({
      ['express.type']: type
    });
  },
  bindPickerChange2: function (e) {
    var weight = this.data.weight_type[e.detail.value];
    this.setData({
      ['express.weight']: weight
    });
  },
  bindPickerChange3: function (e) {
    var volume = this.data.volume_type[e.detail.value];
    this.setData({
      ['express.volume']: volume
    });
  },
  inputChange: function (e) {
    var data;
    switch (e.target.dataset.index) {
      case '0':
        data = 'express.take_address';
        break;
      case '1':
        data = 'express.delivery_address';
        break;
      case '2':
        data = 'express.name';
        break;
      case '3':
        data = 'express.phone';
        break;
      case '4':
        data = 'express.number';
        break;
      case '5':
        data = 'express.bounty';
        break;
      case '6':
        data = 'express.remark';
        break;
      case '7':
        data = 'express.delivery_time';
        break;
    }
    this.setData({
      [data]: e.detail.value
    })
  },
  sumbit: function (e) {
    var that = this
    console.log(e);
    //console.log("app.globalData.phone :" + app.globalData.phone)
    //console.log("app.globalData.stuId :" + app.globalData.stuId)
    if (app.globalData.phone == '' || app.globalData.stuId == '') {
      wx.showModal({
        title: '',
        content: '发布任务前请先绑定手机号和学号',
        confirmText: '去绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../user_info/user_info',
            })
          }
        }
      })
    } else {
      var data = this.data.express;
      data.release_time = util.getCurrentTime();
      var content = '';
      for (var item in data) {
        if (data[item] == '') {
          content = item;
          break;
        }
      }
      switch (content) {
        case 'take_address':
          content = '请填写取货地点'
          break;
        case 'delivery_address':
          content = '请填写送货地址'
          break;
        case 'name':
          content = '请填写收货人姓名'
          break;
        case 'phone':
          content = '请填写收货人电话'
          break;
        case 'number':
          content = '请填写取货码'
          break;
        case 'remark':
          content = ''
          break;
        case 'delivery_time':
         content = '请填写取货时间'
         break;
      }
      if (content != '') {
        wx.showModal({
          title: '',
          content: content,
          showCancel: false,
        })
      } else if (!util.isNumber(data['bounty'])) {
        wx.showModal({
          title: '',
          content: '请输入正确的金额',
          showCancel: false,
        })
      } else if (data['bounty'] < 1) {
        wx.showModal({
          title: '',
          content: '赏金必须大于1元',
          showCancel: false,
        })
      } else if (!util.isPoneAvailable(data['phone'])) {

      } else {
        console.log("currentIndex:" + that.data.currentIndex)
        console.log("autoCancelTime[currentIndex]:" + that.data.autoCancelTime[that.data.currentIndex])
        wx.showModal({
          title: '提示',
          content: '确认发布订单？发布后30分钟内可自行取消订单，超过30分钟若无人接单可取消订单',
          success: function (res) {
            if (!res.confirm) return
            wx.showLoading({
              title: '发布中',
            })
            var bounty = String(Number(data.bounty) * 100)
            wx.request({
              url: 'https://jianghuling.xyz/order/issue',
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                secretId: app.globalData.userId,
                goodsCode: data.number,
                note: data.remark,
                reward: data.bounty,
                hostName: data.name,
                hostPhone: data.phone,
                takeAddress: data.take_address,
                destination: data.delivery_address,
                goodsWeight: data.weight,
                deliveryTime: data.delivery_time,
                autoCancelTime: that.data.autoCancelTime[that.data.currentIndex],
                //starttime: util.getCurrentDate() + " " + data.start_time + ":00",
                //deadline: util.getCurrentDate() + " " + data.end_time + ":00",
                expressType: data.type
              },
              success: function (res) {
                console.log(res.data)
                wx.hideLoading()
                that.setData({
                  my_release_list: [],
                  release_list_page: 0,
                  hasMore3: true
                })
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
                    wx.navigateBack({
                      delta: 1,
                      success: function (res) {
                        wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          duration: 2000
                        })
                      },
                      fail: function (res) {
                        wx.hideLoading()
                        wx.showModal({
                          title: '',
                          content: '返回失败，请检查当前网络连接状态',//
                          showCancel: false
                        })
                      },
                    })
                    wx.showModal({
                      title: '',
                      content: '发布成功,可以我的订单->我发放的中查看已发布的订单',
                      showCancel: false,
                    })
                  },
                  fail: function (res) {

                  }
                })
                wx.request({
                  url: 'https://jianghuling.xyz/order/myReleaseOrder',
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    secretId: app.globalData.userId,
                    pageNum: that.data.release_list_page,
                    pageSize: 15
                  },
                  success: function (res) {
                    if (res.data.length == 0) {
                      that.setData({
                        isHiddenTipBlock3: false,
                        tipBlockContent3: '空空如也',
                      })
                    } else {
                      that.setData({
                        isHiddenTipBlock3: true,
                        my_release_list: res.data,
                        release_list_page: that.data.release_list_page + 1,
                      }, () => {
                        wx.stopPullDownRefresh()
                        that.setData({
                          isRefresh3: false
                        })
                      })
                    }
                  },
                  fail: function () {
                    wx.showModal({
                      title: '',
                      content: '刷新失败，请检查当前网络连接状态',//
                      showCancel: false,
                    })
                  }
                })
              },
              fail: function () {
                wx.hideLoading()
                wx.showModal({
                  title: '',
                  content: '发布失败，that.data.currentIndex',//
                  showCancel: false,
                })
              }
            })
          }
        })
      }
    }
  },
  evupper: function () {
    var that = this
    if (that.data.isLoadMore1) return
    if (!that.data.isRefresh1) {
      that.setData({
        isRefresh1: true
      })
    } else return;
    this.setData({
      express_order_list: [],
      express_list_page: 0,
      hasMore1: true
    })
    wx.showLoading({
      title: '刷新中'
    })
    wx.request({
      url: 'https://jianghuling.xyz/order/getOrderRelease',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.express_list_page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            isHiddenTipBlock1: false,
            tipBlockContent1: '空空如也',
          })
        } else {
          that.setData({
            isHiddenTipBlock1: true,
            express_order_list: res.data,
            express_list_page: that.data.express_list_page + 1,
          }, () => {
            wx.stopPullDownRefresh()
            wx.hideLoading()
            wx.showToast({
              mask: true,
              title: '刷新成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              isRefresh1: false
            })
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '',
          content: '刷新失败，请检查当前网络连接状态',
          showCancel: false,
        })
      }
    })
  },
  evlower: function () {
    var that = this
    if (that.data.isRefresh1) return
    if (!that.data.hasMore1) {
      if (that.data.isHiddenLoadMore) {
        that.setData({
          isHiddenLoadMore: false
        })
        setTimeout(() => {
          that.setData({
            isHiddenLoadMore: true
          })
        }, 1000);
      }
      return;
    }
    if (that.data.isLoadMore1) return
    else {
      that.setData({
        isLoadMore1: true,
        isHideLoadMore1: false
      }, () => {
        wx.request({
          url: 'https://jianghuling.xyz/order/getOrderRelease',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            secretId: app.globalData.userId,
            pageNum: that.data.express_list_page,
            pageSize: 15
          },
          success: function (res) {
            that.setData({
              isLoadMore1: false,
              isHideLoadMore1: true,
              express_order_list: that.data.express_order_list.concat(res.data),
              express_list_page: that.data.express_list_page + 1,
            }, () => {
              if (res.data.length < 15) {
                that.setData({
                  hasMore1: false,
                })
              }
            })
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '加载失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      })
    }
  },
  evupper1: function () {
    var that = this
    if (that.data.isLoadMore2) return
    if (!that.data.isRefresh2) {
      that.setData({
        isRefresh2: true
      })
    } else return;
    that.setData({
      my_accept_list: [],
      accept_list_page: 0,
      hasMore2: true
    })
    wx.showLoading({
      title: '刷新中'
    })
    wx.request({
      url: 'https://jianghuling.xyz/order/getMyMission',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.accept_list_page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            isHiddenTipBlock2: false,
            tipBlockContent2: '空空如也',
          })
        } else {
          that.setData({
            isHiddenTipBlock2: true,
            my_accept_list: res.data,
            accept_list_page: that.data.accept_list_page + 1,
          }, () => {
            wx.stopPullDownRefresh()
            wx.hideLoading()
            wx.showToast({
              mask: true,
              title: '刷新成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              isRefresh2: false
            })
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '',
          content: '刷新失败，请检查当前网络连接状态',
          showCancel: false,
        })
      }
    })
  },
  evlower1: function () {
    var that = this
    if (that.data.isRefresh2) return
    if (!that.data.hasMore2) {
      if (that.data.isHiddenLoadMore) {
        that.setData({
          isHiddenLoadMore: false
        })
        setTimeout(() => {
          that.setData({
            isHiddenLoadMore: true
          })
        }, 1000);
      }
      return;
    }
    if (that.data.isLoadMore2) return;
    else {
      that.setData({
        isLoadMore2: true,
        isHideLoadMore2: false
      }, () => {
        wx.request({
          url: 'https://jianghuling.xyz/order/getMyMission',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            secretId: app.globalData.userId,
            pageNum: that.data.accept_list_page,
            pageSize: 15
          },
          success: function (res) {
            console.log(res.data)
            that.setData({
              isLoadMore2: false,
              isHideLoadMore2: true,
              my_accept_list: that.data.my_accept_list.concat(res.data),
              accept_list_page: that.data.accept_list_page + 1,
            }, () => {
              if (res.data.length < 15) {
                that.setData({
                  hasMore2: false,
                })
              }
            })
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '加载失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      })
    }
  },
  evupper2: function () {
    var that = this
    if (that.data.isLoadMore3) return
    if (!that.data.isRefresh3) {
      that.setData({
        isRefresh3: true
      })
    } else return;
    that.setData({
      my_release_list: [],
      release_list_page: 0,
      hasMore3: true
    })
    wx.showLoading({
      title: '刷新中'
    })
    wx.request({
      url: 'https://jianghuling.xyz/order/myReleaseOrder',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        secretId: app.globalData.userId,
        pageNum: that.data.release_list_page,
        pageSize: 15
      },
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            isHiddenTipBlock3: false,
            tipBlockContent3: '空空如也',
          })
        } else {
          that.setData({
            isHiddenTipBlock3: true,
            my_release_list: res.data,
            release_list_page: that.data.release_list_page + 1,
          }, () => {
            wx.stopPullDownRefresh()
            wx.hideLoading()
            wx.showToast({
              mask: true,
              title: '刷新成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              isRefresh3: false
            })
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '',
          content: '刷新失败，请检查当前网络连接状态',
          showCancel: false,
        })
      }
    })
  },
  evlower2: function () {
    var that = this
    if (that.data.isRefresh3) return
    if (!that.data.hasMore3) {
      if (that.data.isHiddenLoadMore) {
        that.setData({
          isHiddenLoadMore: false
        })
        setTimeout(() => {
          that.setData({
            isHiddenLoadMore: true
          })
        }, 1000);
      }
      return;
    }
    if (that.data.isLoadMore3) return
    else {
      that.setData({
        isLoadMore3: true,
        isHideLoadMore3: false
      }, () => {
        wx.request({
          url: 'https://jianghuling.xyz/order/myReleaseOrder',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            secretId: app.globalData.userId,
            pageNum: that.data.accept_list_page,
            pageSize: 15
          },
          success: function (res) {
            that.setData({
              isLoadMore3: false,
              isHideLoadMore3: true,
              my_accept_list: that.data.my_release_list.concat(res.data),
              accept_list_page: that.data.accept_list_page + 1,
            }, () => {
              if (res.data.length < 15) {
                that.setData({
                  hasMore3: false,
                })
              }
            })
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '加载失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      })
    }
  },
  itemClick: function (e) {
    console.log(e)
    console.log("app.globalData.phone:" + app.globalData.phone)
    console.log("app.globalData.stuId:" + app.globalData.stuId)
    //console.log("app.globalData.feeAccount:" + app.globalData.feeAccount)
    //if (app.globalData.phone == '' || app.globalData.stuId == '' || app.globalData.feeAccount == '') {
    if (app.globalData.phone == '' || app.globalData.stuId == '') {
      wx.showModal({
        title: '',
        content: '接单前请先绑定手机号、学号和收款账号',
        confirmText: '去绑定',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../my/my',
            })
          }
        }
      })
    } else {
      var modal = e.currentTarget.dataset.modal
      var index = e.currentTarget.dataset.index
      var item = this.data.express_order_list[index]
      if (item.orderState != 0) return
      if (item.note == '') item.note = '无'
      this.setData({
        [modal]: true,
        clickItem: item,
        clickItemIndex: index
      });
    }
  },
  acceptButtonClick: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var state = item.orderState
    that.setData({
      clickItem: item,
      clickItemIndex: index
    })
    switch (state) {
      case -1:
      case 4:
      case 5:
      case 2:
        that.setData({
          hiddenModal2: true
        })
        break;
      case 1:
        that.setData({
          hiddenModal3: true
        })
        break;
      case 3:
        wx.showModal({
          title: '',
          content: '等待发单人确认收货，若发单人两天没有确认收货，则订单会自动完成',
          showCancel: false
        })
        break;
    }
  },
  releaseButtonClick: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var state = item.orderState
    that.setData({
      clickItem: item,
      clickItemIndex: index
    })
    switch (state) {
      case -1:
      case 4:
      case 5:
      case 2:
        that.setData({
          hiddenModal2: true,
        })
        break;
      case 3:
      case 1:
        that.setData({
          hiddenModal4: true
        })
        break;
      case 0:
        that.setData({
          hiddenModal5: true
        })
        break;
    }
  },
  myTab: function (e) {
    this.setData({
      myCurrentTab: e.currentTarget.dataset.current
    });
  },
  cancel: function (e) {
    this.setData({
      [e.currentTarget.dataset.modal]: false
    })
  },
  acceptOrder: function (e) {
    var that = this;
    /*
    var feeAccount = app.globalData.feeAccount
    if(feeAccount == ''){
      wx.showModal({
        title: '',
        content: '请先绑定收款账号',
        showCancel: false
      })
      return
    }
    */
    wx.showModal({
      title: '',
      content: '确认接单，接了后无法取消订单？快递送达后会转账至您的账户',
      success: function (res) {
        if (!res.confirm) return
        wx.showLoading({
          title: '正在接单',
        })
        wx.request({
          url: 'https://jianghuling.xyz/order/take',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            secretId: app.globalData.userId,
            orderId: e.currentTarget.dataset.id
          },
          success: function (res) {
            if (res.data.code == 20) {
              var index = that.data.clickItemIndex
              that.data.express_order_list[index].orderState = 1
              that.setData({
                express_order_list: that.data.express_order_list,
                [e.currentTarget.dataset.modal]: false
              }, () => {
                wx.showModal({
                  title: '',
                  content: '接单成功',
                  showCancel: false,
                })
              })
              that.setData({
                my_accept_list: [],
                accept_list_page: 0,
                hasMore2: true
              })
              wx.request({
                url: 'https://jianghuling.xyz/order/getMyMission',
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  secretId: app.globalData.userId,
                  pageNum: that.data.accept_list_page,
                  pageSize: 15
                },
                success: function (res) {
                  wx.hideLoading()
                  if (res.data.length == 0) {
                    that.setData({
                      isHiddenTipBlock2: false,
                      tipBlockContent2: '空空如也',
                    })
                  } else {
                    that.setData({
                      isHiddenTipBlock2: true,
                      my_accept_list: res.data,
                      accept_list_page: that.data.accept_list_page + 1,
                    }, () => {
                      that.setData({
                        isRefresh2: false
                      })
                    })
                  }
                },
                fail: function () {
                  wx.hideLoading()
                  wx.showModal({
                    title: '',
                    content: '刷新失败，请检查当前网络连接状态',
                    showCancel: false,
                  })
                }
              })
            } else {
              wx.showModal({
                title: '',
                content: '接单失败，该单可能已被其他人接了，请刷新后再尝试其他订单',
                showCancel: false,
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '接单失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      }
    })
  },
  deleteOrder: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确认删除订单，删除后不再显示？',
      success: function (res) {
        if (!res.confirm) return
        wx.request({
          url: 'https://jianghuling.xyz/order/delete',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            orderId: id,
            role: that.data.myCurrentTab == 0 ? 1 : 0
          },
          success: function (res) {
            if (res.data.code == 20) {
              if (that.data.myCurrentTab == 0) {
                that.data.my_accept_list.splice(that.data.clickItemIndex, 1)
                that.setData({
                  hiddenModal2: false,
                  my_accept_list: that.data.my_accept_list
                })
                if (that.data.my_accept_list.length == 0) {
                  that.setData({
                    isHiddenTipBlock2: false,
                    tipBlockContent2: '空空如也',
                  })
                }
              } else {
                that.data.my_release_list.splice(that.data.clickItemIndex, 1)
                that.setData({
                  hiddenModal2: false,
                  my_release_list: that.data.my_release_list
                })
                if (that.data.my_release_list.length == 0) {
                  that.setData({
                    isHiddenTipBlock3: false,
                    tipBlockContent3: '空空如也',
                  })
                }
              }
              wx.showToast({
                title: '删除成功',
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '删除失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      }
    })
  },
  arriveOrder: function (e) {
    console.log(1)
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确认已送达？',
      success: function (res) {
        if (!res.confirm) return
        wx.request({
          url: 'https://jianghuling.xyz/order/msuccess',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            orderId: id
          },
          success: function (res) {
            that.setData({
              hiddenModal3: false
            })
            if (res.data.code == 20) {
              console.log('送达成功')
              var index = that.data.clickItemIndex
              that.data.my_accept_list[index].orderState = 3
              that.setData({
                my_accept_list: that.data.my_accept_list
              })
              wx.showModal({
                title: '送达成功',
                content: '稍后转账至您的账户上',
                showCancel: false
              })
            }
            else if(res.data.code == 30){
              wx.showModal({
                title: '操作失败',
                content: '发单人已取消订单',
                showCancel: false
              })
            }
            /*
            that.onLoad()//刷新
            that.setData({
              currentTab: 2,
              myCurrentTab: 0
            })
            //待考虑
            /*
            wx.showModal({
              title: '送达成功',
              content: '稍后转账至您的账户上',
              showCancel: false
            })
            */
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '操作失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      }
    })
  },
  confirmOrder: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function (res) {
        if (!res.confirm) return
        wx.request({
          url: 'https://jianghuling.xyz/order/msuccess',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            orderId: id
          },
          success: function (res) {
            console.log(res)
            that.setData({
              hiddenModal4: false
            })
            if (res.data.code == 20) {
              console.log('收货成功')
              var index = that.data.clickItemIndex
              that.data.my_release_list[index].orderState = 2//
              that.setData({
                my_release_list: that.data.my_release_list
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '操作失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      }
    })
  },
  cancelOrder: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var state = e.currentTarget.dataset.state
    wx.showModal({
      title: '提示',
      content: state == 1 ? '此订单已被接，接单人已掌握快递信息，若取消订单，可能会有快递被冒领的风险，确认取消订单吗？' : '确认取消订单？',
      success: function (res) {
        if (!res.confirm) return
        wx.request({
          url: 'https://jianghuling.xyz/order/cancel',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            orderId: id
          },
          success: function (res) {
            that.setData({
              hiddenModal5: false
            })
            if (res.data.code == 20) {
              var index = that.data.clickItemIndex
              that.data.my_release_list[index].orderState = 4
              that.setData({
                my_release_list: that.data.my_release_list
              })
              wx.showModal({
                title: '取消成功',
                content: '稍后会自动转账至您的账号',
                showCancel: false
              })
            } else if(res.data.code == 30) {//
              wx.showModal({
                title: '',
                content: '取消失败，请重试',
                showCancel: false
              })
            } else if(res.data.code == 50){//
              wx.showModal({
                title: '',
                content: '取消失败，发单超过30分钟且订单状态已改变',
                showCancel: false,
                success: function () {
                  that.evupper2()
                }
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '',
              content: '操作失败，请检查当前网络连接状态',
              showCancel: false,
            })
          }
        })
      }
    })
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  refund: function (e) {
    var orderId = e.currentTarget.dataset.id
    wx.request({
      url: 'https://jianghuling.xyz/pay/payrefund',
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      data: {
        orderId: orderId
      },
      success: function (res) {
        console.log(res.data)
        wx.showModal({
          title: '',
          content: '退款申请已受理',
          showCancel: false
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showModal({
          title: '',
          content: '操作失败，请检查当前网络连接状态',
          showCancel: false,
        })
      }
    })
  },
  onShow: function (){

  }
})
