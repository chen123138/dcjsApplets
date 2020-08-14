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
        task_size: 10,
        approval_size: 10,
        visible_size: 10,
        total: 1,
        isload: false,
        part: '0'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        // 登录判断
        wx.showLoading({
            title: '加载中...',
        });
        console.log('Session Loading');
        let that = this
        console.log(app.globalData.uid)
        util.authorize().then((res) => {            
            if (app.globalData.uid == false || app.globalData.uid == null){
                wx.navigateTo({
                    url: '/page/auth'
                })
            }
            this.getTaskList()
        }).catch((err) => {
            util.showError('稍后重试')
        });
        wx.hideLoading()
        // 
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
        let size = this.data.task_size
        let that = this;
        util.rpcList(1000, api.EngineerTask, params, fields, size, 'id DESC').then(function (res) {
            that.setData({
                list: res.records,
                total: res.length,
                isload: true
            });
            console.log("待办列表",that.data.list)
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
        let size = this.data.approval_size
        let that = this;
        util.rpcList(1000, api.EngineerApprove, params, fields, size, 'id DESC').then(function (res) {
            let info = res.records;
            that.setData({
                list: info
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
        let size = this.data.visible_size
        let that = this;
        util.rpcList(1000, api.EngineerVisible, params, fields, size, 'id DESC').then(function (res) {
            let info = res.records;
            that.setData({
                list: info
            })
            console.log(that.data.list)
            wx.hideLoading();
        })
    },

    // 点击事件
    bindItemTap: function (e) {
        console.log(e)
        if (this.data.part == '0') {
            // 转向待办
            wx.navigateTo({
                url: '/task/info?id=' + e.currentTarget.dataset.id
            })
        } else if (this.data.part == '2') {
            // 转向抄送
            if(e.currentTarget.dataset.eid) {
                wx.navigateTo({
                    url: '/purchase/enquiry/info?id=' + e.currentTarget.dataset.eid
                })
            }else {
                wx.navigateTo({
                    url: '/purchase/enquiry/info?id=' + e.currentTarget.dataset.pid
                })
            }
        } else if (this.data.part == '1') {
            // 转向审批
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
        console.log("upper");
        wx.showNavigationBarLoading()
        this.refresh();
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
        }, 2000);
    },

    lower: function (e) {
        console.log("lower")
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function () {
            wx.hideNavigationBarLoading();
            that.nextLoad();
        }, 1000);
        
    },

    // 刷新
    refresh: function() {
        let that = this
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
        });
        if(this.data.part == '0') {
            this.getTaskList();
        }else if (this.data.part == '1') {
            this.getApprovalList();
        }else {
            this.getVisibleList();
        }
        setTimeout(function() {
            wx.showToast({
                title: '刷新成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },

    // 使用本地 fake 数据实现继续加载效果
    nextLoad: function() {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 4000
        })
        if(this.data.part == '0') {
            this.setData({
                task_size: this.data.task_size + 5
            })
            this.getTaskList();
        }else if (this.data.part == '1') {
            this.setData({
                approval_size: this.data.approval_size + 5
            })
            this.getApprovalList();
        }else {
            this.setData({
                visible_size: this.data.visible_size + 5
            })
            this.getVisibleList();
        }
        setTimeout(function() {
            wx.showToast({
                title: '加载成功',
                icon: 'success',
                duration: 2000
            })
        }, 3000)
    },

})