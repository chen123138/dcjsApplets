var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({

    /**
     * 页面的初始数据
     */
    data: {
        hiddenLoading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('Session Loading');
        let that = this
        util.authorize().then((res) => {
            console.log(app.globalData.uid)
            if (app.globalData.uid) {
                // that.data.hidden = true
                wx.switchTab({
                    url: '/page/index'
                });
            } else {
                wx.redirectTo({
                    url: '/page/auth',
                  })
            }
            // 
        }).catch((err) => {
            console.log("失败")
            util.showError('稍后重试')
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