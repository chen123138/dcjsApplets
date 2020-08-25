var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({
    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },
    bindGetUserInfo(e) {
        // 
        if (e.detail.errMsg == "getUserInfo:ok") {
            let params = {
                'data': e.detail.encryptedData,
                'iv': e.detail.iv,
                'key': app.globalData.key
            }
            // let that = this
            util.post(api.UserInfo, "100", params).then(res => {
                util.showText("信息登记成功，请联系客服。")
            });
        }
    },
})