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

    // 获取页面列表列表
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
            wx.hideLoading();
        })
    },

    // 点击进入详情页
    bindItemTap: function (e) {
      // console.log(e)
        wx.navigateTo({
          url: 'info?id=' + e.currentTarget.dataset.id
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getList();

        wx.setNavigationBarTitle({
          title: '请购列表'
        })
    }
})