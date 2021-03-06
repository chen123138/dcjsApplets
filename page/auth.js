var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({
    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isGetuserInfo: false
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
        //
    },

    bindGetUserInfo(e) {
        // 
        if (e.detail.errMsg == "getUserInfo:ok") {
            let params = {
                'data': e.detail.encryptedData,
                'iv': e.detail.iv,
                'key': app.globalData.key
            }
            console.log(params)
            // let that = this
            util.post(api.UserInfo, "100", params).then(res => {
                util.showText("请完善用户信息。")
                wx.redirectTo({
                  url: './perfect',
                })
            });
        }
    },

    getPhoneNumber: function (e) {
        var that = this;
        console.log(e.detail.errMsg == "getPhoneNumber:ok");
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            console.log(e.detail.encryptedData)
            let params = {
                'data': e.detail.encryptedData,
                'iv': e.detail.iv,
                'key': app.globalData.key,
                'oid': app.globalData.oid,
                'name': app.globalData.name
            }
            console.log(params)
            // let that = this
            util.post(api.UserPhone, "100", params).then(res => {
                console.log(res)
            });
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