var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },
    getList: function() {
        wx.showLoading({
            title: '加载中...',
        });
        let params = [
			"|",
            ["create_uid", "=", app.globalData.uid],
            "&",
            ["visible_ids.project_purchase_id", "!=", ''],
            ["visible_ids.user_id.id", "=", app.globalData.uid]
            
        ]
        let fields = []
        let that = this;
        util.rpcList(1000, api.EngineerPurchase, params, fields, 10, 'id DESC').then(function(res) {
          that.setData({
            list: res.records
          })
            console.log(res)
            wx.hideLoading();
        })
    },

    // 点击事件
    bindItemTap: function (e) {
      // console.log(e)
        wx.navigateTo({
          url: 'info?id=' + e.currentTarget.dataset.id + '&pid=' + JSON.stringify(e.currentTarget.dataset.pid)
        })
    },

    


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getList();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.total > this.data.page) {
            this.setData({
                page: this.data.page + 1
            });
        } else {
            return false;
        }
        this.getList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})