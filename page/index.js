var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        page: 1,
        size: 10,
        total: 1,
        isload: false,
        part: '0'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTaskList()
    },

    // 获取工单列表
    getTaskList: function () {
        wx.showLoading({
            title: '加载中...',
        });
        // 我要做的
        let params = [
            "|",
            "&",
            ["state", "=", "3"],
            ["create_uid", "=", app.globalData.uid],
            "&",
            ["state", ">", "0"],
            ["state", "<", "3"],
            ["project_task_user_ids.user_id.id", "=", app.globalData.uid]
        ]
        let fields = ["code", "name", "state", "end_date"]
        // let fields = []
        let that = this;
        util.rpcList(1000, api.EngineerTask, params, fields, 10, 'id DESC').then(function (res) {
            //
            that.setData({
                list: res.records,
                total: res.length,
                isload: true
            });
            // console.log("待办列表",that.data.list)
            wx.hideLoading();
        }).catch((e) => {
            console.log(e)
        });
    },

    // 获取审核列表
    getApprovalList: function () {
        wx.showLoading({
            title: '加载中...',
        });
        let params = [
            ["user_id.id", "=", app.globalData.uid]
        ]
        let fields = []
        let that = this;
        util.rpcList(1000, api.EngineerApprove, params, fields, 10, 'id DESC').then(function (res) {
            that.setData({
                list: res.records
            })
            console.log(that.data.list)
            wx.hideLoading();
        })
    },

    // 获取抄送列表
    getVisibleList: function () {
        wx.showLoading({
            title: '加载中...',
        });
        let params = [
            ["user_id.id", "=", app.globalData.uid]
        ]
        let fields = []
        let that = this;
        util.rpcList(1000, api.EngineerVisible, params, fields, 10, 'id DESC').then(function (res) {
            that.setData({
                list: res.records
            })
            wx.hideLoading();
        })
    },

    // 点击事件
    bindItemTap: function (e) {
        if (this.data.part == '0') {
            // 转向待办
            wx.navigateTo({
                url: '/task/info?id=' + e.currentTarget.dataset.id
            })
        } else if (this.data.part == '2') {
            // 转向抄送
            wx.navigateTo({
                url: '/visible/info?id=' + e.currentTarget.dataset.eid
            })
        } else if (this.data.part == '1') {
            switch (e.currentTarget.dataset.type) {
                case 1:
                    // 请购流程
                    wx.navigateTo({
                        url: '/purchase/request/info?id=' + e.currentTarget.dataset.pid
                    })
                    break;
                case 2:
                    // 询价流程
                    wx.navigateTo({
                        url: '/purchase/enquiry/info?id=' + e.currentTarget.dataset.eid
                    })
                    break;
            }

        }



    },

    // 点击切换列表
    selectPart: function (options) {
        this.setData({
            part: options.currentTarget.dataset.part
        })
        let part = Number(options.currentTarget.dataset.part)
        switch (part) {
            // 我的待办
            case 0:
                this.getTaskList()
                break;
            // 我的审核
            case 1:
                this.getApprovalList()
                break;
            case 2:
                this.getVisibleList()
                break;
        }
    },

    upper: function () {
        wx.showNavigationBarLoading()
        this.refresh();
        console.log("upper");
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },

    lower: function (e) {
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
        console.log("lower")
    },

    // 刷新
    // refresh: function() {
    //     wx.showToast({
    //         title: '刷新中',
    //         icon: 'loading',
    //         duration: 3000
    //     });
    //     this.getList();
    //     setTimeout(function() {
    //         wx.showToast({
    //             title: '刷新成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     }, 3000)
    // },

    // 使用本地 fake 数据实现继续加载效果
    // nextLoad: function() {
    //     wx.showToast({
    //         title: '加载中',
    //         icon: 'loading',
    //         duration: 4000
    //     })
    //     this.getList();
    //     setTimeout(function() {
    //         wx.showToast({
    //             title: '加载成功',
    //             icon: 'success',
    //             duration: 2000
    //         })
    //     }, 3000)
    // },


    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function() {
    //     if (this.data.total > this.data.page) {
    //         this.setData({
    //             page: this.data.page + 1
    //         });
    //     } else {
    //         return false;
    //     }
    //     this.getList();
    // },
})