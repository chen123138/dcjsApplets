var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_list: [],
        project_order_product_ids: [],
        order_index: ''
    },



    goDetails: function(e) {
        // console.log(e.currentTarget.dataset.index)
        wx.navigateTo({
            url: 'info'
        })
        this.setData({
            order_index: e.currentTarget.dataset.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        wx.showLoading({
            title: '加载中...',
        });
        // 获取订单列表
        this.getList();
        wx.hideLoading();

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /*
    自定义函数
    */
    getList: function() {
        let params = []
        let fields = ["code", "create_date", "name", "state", "project_order_product_ids", "user_id"]
        let that = this
        util.rpcList(1006, api.EngineerOrder, params, fields, 80, '').then(function(res) {
            console.log("订单列表：", res)
            that.setData({
                order_list: res.records,
                project_order_product_ids: res.records[0].project_order_product_ids
            })
        })
    }

})