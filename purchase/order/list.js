var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        total: 1
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
        util.rpcList(1006, api.EngineerOrder, params, fields, 10, 'id DESC').then(function (res) {
            console.log(res)
            that.setData({
                list: res.records,
                total: res.length
            })
        })
    }

})