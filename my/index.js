const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息展示
        canIUse: wx.canIUse('button.open-type.getUserInfo')

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            app.globalData.user = res.userInfo
                        }
                    })
                }
            }
        })

    },

    // 跳转记录页面
    goList: function () {
        wx.navigateTo({
            url: '/task/list',
        })
    },
    goRequestBuy: function () {
        wx.navigateTo({
            url: '/purchase/list',
        })
    },
    goPlan: function () {
        wx.navigateTo({
            url: "/purchase/plan",
        })
    },
    goOrder: function () {
        wx.navigateTo({
            url: '/purchase/order',
        })
    },
    goApprove: function() {
        wx.navigateTo({
            url: '/approve/list',
        })
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