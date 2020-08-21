var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        total: 1,
        size: 10
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        wx.showLoading({
            title: '加载中...',
        });
        // 获取订单列表
        this.getList();
        wx.hideLoading();
        wx.setNavigationBarTitle({
            title: '订单列表'
        })
    },
    // 跳转详情
    goDetails: function (e) {
        wx.navigateTo({
            url: './info?id=' + e.currentTarget.dataset.id
        })
    },
    // 获取明细
    getList: function () {
        // 发布者|处理人
        let params = [
            "|",
            ["create_uid", "=", app.globalData.uid],
            ["user_id.id", "=", app.globalData.uid]
        ]
        let fields = ["code", "create_date", "name", "state"]
        let that = this
        let size = this.data.size
        util.rpcList(1006, api.EngineerOrder, params, fields, size, 'id DESC').then(function (res) {
            console.log(res)
            that.setData({
                list: res.records,
                total: res.length
            })
        })
    },
    upper: function () {
        console.log("upper");
        wx.showNavigationBarLoading()
        this.refresh();
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },
  
    lower: function (e) {
        console.log("lower")
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
    },
    // 刷新
    refresh: function() {
      let that = this
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        this.data.size = 10
        console.log(this.data.size)
        that.getList()
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },
  
    // 使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 4000
        })
            this.setData({
                size: this.data.size + 5
            })
            console.log(this.data.size)
            this.getList();
        setTimeout(function() {
            wx.showToast({
                title: '加载成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },

})