// pages/2hand_trade/2hand_trade.js
const util = require('../../utils/util.js');
const app = getApp();
let pageNum = 0;
let searchPageNum = 0;
const pageSize = 20;
const BASE_URL = "https://jianghuling.xyz/book";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 我的订单部分数据
        myCurrentTab: 0,
        book_order_list: [],
        my_accept_list: [],
        my_release_list: [],
        book_list_page: 0,
        accept_list_page: 0,
        release_list_page: 0,
        hiddenModal: false,
        hiddenModal1: false,
        hiddenModal2: false,
        hiddenModal3: false,
        isHiddenTipBlock2: true,
        isHiddenTipBlock3: true,
        tipBlockContent2: '',
        tipBlockContent3: '',
        book_my: {
            'type': '教科类',
            'level': '大一',
            'college': '华西',
            'course': '',
            'name': '',//书名
            'author': '',
            'press': '',//出版社
            'new': '',//成色
            'price': '',
            'phone': '',
            'address': '',//交易地址
            'note': '',
        },

        // 我要卖书和我要买书部分数据
        book_type: [],
        grade_info: [],
        trade_places: [],
        college: [],
        book: {},
        books_released: [],
        books_released_bak: []
        // inputVal: "",
        // currentTab: 0,
        // book_type_index: 0,
        // suit_grade_index: 0,
        // lastActivated: 35,
        // searchMode: false,
        // showMask: false,
        // showSelectCollege: false,
        // showSelectTradePlace: false,
        // inputShowed: false,
    },

    refresh: function () {
        const that = this;
        const Crefresh = this.selectComponent("#released-book-list");
        pageNum = 0;
        wx.request({
            url: BASE_URL + "/getReleasedBook",
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            dataType: "json",
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                keyword: that.data.inputVal
            },
            success: (res) => {
                console.log(res);
                const data = res.data;
                if (data instanceof Array) {
                    const hasMore = !(data.length < pageSize);
                    if (data.length !== 0) {
                        pageNum += 1;
                        that.setData({
                            books_released: data
                        });
                    }
                    that.setData({
                        hasMore: hasMore
                    });
                }
                else {
                    console.error(data.status);
                    wx.showToast({
                        title: "出错了，请稍后再试",
                        icon: "none",
                        duration: 2000,
                        mask: false
                    });
                }
            },
            complete: (res) => {
                Crefresh.reset();
            }
        })
    },

    loadmore: function () {
        const that = this;
        if (this.data.hasMore) {
            wx.request({
                url: BASE_URL + "/getReleasedBook",
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                dataType: "json",
                data: {
                    pageNum: pageNum,
                    pageSize: pageSize,
                    keyword: that.data.inputVal
                },
                success: (res) => {
                    console.log(res);
                    const data = res.data;
                    if (data instanceof Array) {
                        const hasMore = !(data.length < pageSize);
                        if (data.length !== 0) {
                            pageNum += 1;
                            const d = this.data.books_released.concat(data);
                            that.setData({
                                books_released: d
                            });
                        }
                        console.log(hasMore);
                        that.setData({
                            hasMore: hasMore
                        });
                    }
                    else {
                        console.error(data.status);
                        wx.showToast({
                            title: "出错了，请稍后再试",
                            icon: "none",
                            duration: 2000,
                            mask: false
                        });
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this;
        pageNum = 0;
        searchPageNum = 0;
        this.setData({
            college: ["经济", "法学", "文新", "外语", "艺术", "历史", "数学", "物理", "化学", "电子", "生科", "制造", "电气", "计软", "建环", "水利", "化工", "轻纺", "网安", "基法", "临床", "口腔", "公卫", "药学", "公管", "商学", "空天", "体育", "高分子", "马克思", "匹兹堡", "吴玉章", "国际关系", "灾后重建", "所有学院"],
            trade_places: ["望江", "江安", "华西"],
            grade_info: ["大一", "大二及以上", "大三及以上", "大四及以上", "研一及以上", "研二及以上", "研三及以上"],
            book_type: ["教科类", "非教科类"],
            book: {
                type: "教科类",
                suit_grade: "大一",
                suit_college: "",
                suit_course: "",
                book_name: "",
                author: "",
                press: "",
                condition: "",
                price: 30,
                phone: "",
                trade_place: "",
                remarks: "",
                photo: ""
            },
            books_released: [],
            inputVal: "",
            currentTab: 0,
            book_type_index: 0,
            suit_grade_index: 0,
            lastActivated: 35,
            searchMode: false,
            showMask: false,
            showSelectCollege: false,
            showSelectTradePlace: false,
            inputShowed: false,
            boughtSuccess: false,
            hasMore: false
        });
        // 我的订单部分
        const book = this.data.book_my;
        book.phone = app.globalData.defaultPhone;
        book.address = app.globalData.defaultTakeAddress;
        this.setData({
            book_my: book,
            isHiddenTipBlock2: false,
            isHiddenTipBlock3: false,
            tipBlockContent2: '空空如也',
            tipBlockContent3: '空空如也',
        });

    },

    bookTypeChange: function (event) {
        const type = this.data.book_type[event.detail.value];
        this.setData({
            ["book.type"]: type,
            book_type_index: event.detail.value
        });
    },
    suitGradeChange: function (event) {
        const grade = this.data.grade_info[event.detail.value];
        this.setData({
            ["book.suit_grade"]: grade,
            suit_grade_index: event.detail.value
        });
    },
    radioChange: function (event) {
        const nowActivated = event.detail.value;
        const nowCollege = this.data.college[nowActivated];
        if (nowActivated !== this.data.lastActivated) {
            this.setData({
                lastActivated: nowActivated,
                ['book.suit_college']: nowCollege
            });
        }
    },
    checkboxChange: function (event) {
        const that = this;
        const places = this.data.trade_places;
        const place = event.detail.value;
        let str = "";
        place.forEach(x => {
            str += places[x] + ", ";
        });
        str = str.substr(0, str.length - 2);
        this.setData({
            ["book.trade_place"]: str
        });
    },
    inputChange: function (event) {
        const attr = "book." + event.target.dataset.index;
        this.setData({
            [attr]: event.detail.value
        });
        // console.log(this.data.book);
    },
    chooseImage: function (event) {
        const that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.showToast({
                    title: "正在检查图片...",
                    icon: "loading",
                    mask: true,
                    duration: 500
                });
                that.setData({
                    ["book.photo"]: res.tempFilePaths[0]
                })
            }
        });
    },
    tab: function (event) {
        changeTab(event.target.dataset.current, this);
    },
    eventchange: function (event) {
        console.log(event);
        const that = this;
        this.setData({
            currentTab: event.detail.current
        });
        if (event.detail.source === "touch") {
            //防止swiper控件卡死
            if (this.data.currentTab === 0 && this.data.preIndex > 1) {//卡死时，重置currentTab为正确索引
                this.setData({ currentTab: this.data.preIndex });
            }
            else {//正常轮转时，记录正确页码索引
                this.setData({ preIndex: this.data.currentTab });
            }
        }
        if (this.data.currentTab === 1) {
            if (this.data.books_released.length === 0) {
                wx.showLoading({
                    title: "加载中...",
                    mask: true,
                    success: (res) => {
                        wx.request({
                            url: BASE_URL + "/getReleasedBook",
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            dataType: "json",
                            data: {
                                pageNum: 0,
                                pageSize: pageSize,
                                keyword: that.data.inputVal
                            },
                            success: (res) => {
                                console.log(res);
                                wx.hideLoading();
                                const data = res.data;
                                if (data instanceof Array) {
                                    const hasMore = !(data.length < pageSize);
                                    if (res.data.length !== 0) {
                                        pageNum++;
                                        that.setData({
                                            books_released: res.data,
                                            hasMore: hasMore
                                        });
                                    }
                                }
                                else {
                                    console.error(data.status);
                                    wx.showToast({
                                        title: "出错了，请稍后再试",
                                        icon: "none",
                                        duration: 2000,
                                        mask: false
                                    });
                                }
                            }
                        })
                    }
                })
            }
        } else if (this.data.currentTab === 2) {
            if (this.data.my_accept_list.length === 0) {
                wx.request({
                    url: BASE_URL + '/mybuy',
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
                        if (res.data.length === 0) {
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
                            content: '出错了，请检查当前网络连接状况',
                            showCancel: false
                        })
                    }
                });
            }
            if (this.data.my_release_list.length === 0) {
                wx.request({
                    url: BASE_URL + '/mysell',
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
                        if (res.data.length === 0) {
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
            }
        }
    },
    selectCollege: function (event) {
        this.setData({
            showSelectCollege: !this.data.showSelectCollege,
            showMask: !this.data.showMask
        });
    },
    selectTradePlace: function (event) {
        this.setData({
            showSelectTradePlace: !this.data.showSelectTradePlace,
            showMask: !this.data.showMask
        });
    },
    closeMask: function () {
        this.setData({
            showSelectCollege: false,
            showSelectTradePlace: false,
            showMask: false
        })
    },
    maskTouchMove: function () {
    },
    submit: function (event) {
        const that = this;
        const book = this.data.book;
        let info = "";

        if (book.type === "教科类") {
            for (let i = 0; info === "" && i < 2; i++) {
                switch (i) {
                    case 0:
                        if (book.suit_grade === "")
                            info = "请选择适用年级";
                        break;
                    case 1:
                        if (book.suit_college === "")
                            info = "请选择适用学院";
                        break;
                    default:
                        break;
                }
            }
        } else if (book.type === "非教科类") {

        } else {
            info = "请选择正确的书籍类型";
        }
        for (let i = 0; info === "" && i < 6; i++) {
            switch (i) {
                case 0:
                    if (book.book_name === "")
                        info = "请填写书籍名称";
                    break;
                case 1:
                    if (book.author === "")
                        info = "请填写书籍作者";
                    break;
                case 2:
                    if (book.price === "")
                        info = "请填写价格";
                    break;
                case 3:
                    if (book.phone === "")
                        info = "请填写您的联系方式";
                    else if (!util.isPoneAvailable(book.phone))
                        info = "联系方式不符合规范";
                    break;
                case 4:
                    if (book.trade_place === "")
                        info = "请选择交易地点";
                    break;
                case 5:
                    if (book.photo === "")
                        info = "请上传一张书籍的照片";
                default:
                    break;
            }
        }
        if (info === "") {
            wx.showModal({
                title: '',
                content: '确认发布商品？',
                success: function(res){
                    if (!res.confirm) return;
                    wx.showLoading({
                        title: "正在发布，请稍候...",
                        mask: true,
                        success: (res) => {
                            const formdata = {
                                secretId: app.globalData.userId,
                                bookType: book.type,
                                suitGrade: book.suit_grade,
                                suitCollege: book.suit_college,
                                suitCourse: book.suit_course,
                                bookName: book.book_name,
                                author: book.author,
                                press: book.press,
                                bookCondition: book.condition,
                                price: book.price,
                                phoneNum: book.phone,
                                tradePlace: book.trade_place,
                                remarks: book.remarks
                            };

                            wx.uploadFile({
                                url: BASE_URL + "/subBook",
                                filePath: book.photo,
                                name: "photo",
                                dataType: "json",
                                formData: formdata,
                                success: (res) => {
                                    wx.hideLoading();
                                    const data = JSON.parse(res.data);
                                    if (data.code !== undefined) {
                                        if (parseInt(data.code) === 20) {
                                            console.log(res);
                                            wx.showToast({
                                                title: "发布成功",
                                                duration: 1600,
                                                mask: false
                                            });
                                        } else {
                                            console.error(data);
                                            wx.showToast({
                                                title: "发布失败，错误代码：" + data.code,
                                                icon: "none",
                                                duration: 2000,
                                                mask: false
                                            });
                                        }
                                    } else {
                                        console.error(data);
                                        wx.showToast({
                                            title: "发布失败，错误代码：" + data.status,
                                            icon: "none",
                                            duration: 2000,
                                            mask: false
                                        });
                                    }
                                },
                                fail: (res) => {
                                    console.error(res);
                                    wx.showToast({
                                        title: "未知错误",
                                        icon: "none",
                                        duration: 2000,
                                        mask: false
                                    });
                                }
                            });
                        }
                    });
                }
            })
            
        } else {
            wx.showToast({
                title: info,
                icon: "none",
                duration: 2000
            });
        }
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        const that = this;
        searchPageNum = 0;
        if (this.data.searchMode) {
            that.setData({
                books_released: that.data.books_released_bak,
                books_released_bak: [],
                searchMode: false,
                inputShowed: false,
                inputVal: ""
            });
        }
        else {
            that.setData({
                inputVal: "",
                inputShowed: false
            });
        }
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        })
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    search: function () {
        const that = this;
        wx.showLoading({
            title: "数据加载中...",
            mask: true,
            success: (res) => {
                wx.request({
                    url: BASE_URL + "/search",
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    dataType: "json",
                    data: {
                        keyword: this.data.inputVal,
                        pageNum: searchPageNum,
                        pageSize: pageSize
                    },
                    success: (res) => {
                        console.log(res);
                        searchPageNum++;
                        wx.hideLoading();
                        const data = res.data;
                        if (data.length === 0 || data instanceof Array) {
                            if (that.data.books_released_bak.length === 0) {
                                that.setData({
                                    searchMode: true,
                                    books_released_bak: that.data.books_released,
                                    books_released: data
                                })
                            }
                            else {
                                that.setData({
                                    searchMode: true,
                                    books_released: data
                                })
                            }
                        }
                        else {
                            wx.showToast({
                                title: "出错了，请稍后再试",
                                icon: "none",
                                duration: 2000,
                                mask: false
                            });
                        }
                    }
                })
            }
        })
    },
    bookDetail: function (event) {
        const idx = event.currentTarget.dataset.idx;
        wx.navigateTo({
            url: "../book_detail/book_detail?book_info=" + JSON.stringify(this.data.books_released[idx]) + "&id=" + idx
        });
    },

    // 我的订单部分函数
    myTab: function (e) {
        this.setData({
            myCurrentTab: e.currentTarget.dataset.current
        });
    },
    boughtButtonClick: function (e) {
        var that = this
        var item = e.currentTarget.dataset.item
        var index = e.currentTarget.dataset.index
        that.dataset({
            clickItem: item,
            clickItemIndex: index,

        })
    },
    callPhone: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
        })
    },
    cancel: function (e) {
        this.setData({
            [e.currentTarget.dataset.modal]: false
        })
    },
    cancelOrder: function (e) {
        var that = this
        var id = e.currentTarget.dataset.id
        var state = e.currentTarget.dataset.state
        wx.showModal({
            title: '',
            content: '确认删除订单，删除后不再显示？',
            success: function (res) {
                if (!res.confirm) return
                wx.request({
                    url: BASE_URL + '/cancel',
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        secretId: app.globalData.userId,
                        bookId: id
                    },
                    success: function (res) {
                        that.setData({
                            hiddenModal3: false
                        })
                        if (res.data.code == 20) {
                            var index = that.data.clickItemIndex
                            that.data.my_release_list[index].state = 4//修改订单状态
                            that.setData({
                                my_release_list: that.data.my_release_list
                            })
                            wx.showModal({
                                title: '取消成功',
                                content: '',
                                showCancel: false
                            })
                        } else if (res.data.code == 30) {
                            wx.showModal({
                                title: '取消失败',
                                content: '',
                                showCancel: false
                            })
                        }
                    }
                })
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
    },
    scan: function (e) {
        console.log(e)
        var that = this
        var item = e.currentTarget.dataset.item
        var index = e.currentTarget.dataset.index
        that.setData({
            itemClick: item,
            clickItemIndex: index
        })
        var state = item.state
        if (state) {
            that.setData({
                hiddenModal1: true
            })
        } else {
            switch (state) {
                case 0:
                    that.setData({
                        hiddenModal3: true
                    })
                    break;
                case 2:
                    that.setData({
                        hiddenModal2: true
                    })
                    break;
            }
        }
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
        if (this.data.boughtSuccess) {
            let books = this.data.books_released;
            books.splice(this.data.boughtIdx, 1);
            this.setData({
                books_released: books,
                boughtSuccess: false
            });
            if (books.length < 10) {
                this.loadmore();
            }
        }
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

function changeTab(tabNum, t) {
    t.setData({
        currentTab: tabNum
    });
}
