var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        size: 10
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
    },
    getList: function() {
        wx.showLoading({
            title: '加载中...',
          })
          let size = this.data.size
          let that = this; 
          util.rpcList(1000, api.EngineerGuide, [], [], size).then(function(res) {
              that.setData({
                  list: res.records
              })
          }).then(function(error) {
              console.log(error)
          })
          wx.hideLoading();
    },

    // 点击事件
    bindItemTap: function (e) {
        wx.navigateTo({
            url: '/guide/info?id=' + e.currentTarget.dataset.id
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