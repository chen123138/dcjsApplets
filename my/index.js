const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息展示
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        name: "",
        role: ""
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
        this.setData({
            name: app.globalData.name,
            role: app.globalData.role
        });
    },

    // 跳转记录页面
    task: function () {
        wx.navigateTo({
            url: '/task/list',
        })
    },
    request: function () {
        wx.navigateTo({
            url: '/purchase/request/list',
        })
    },
    order: function () {
        wx.navigateTo({
            url: '/purchase/order/list',
        })
    },
    plan: function() {
        wx.showToast({
            title: '敬请期待',
        })
    },
    enquiry: function() {
        })
    },
    enquiry: function() {
        wx.navigateTo({
            url: '/purchase/enquiry/list',
        })
    },
    plan: function() {
        wx.showToast({
          title: '敬请期待',
        })
        
    },

})