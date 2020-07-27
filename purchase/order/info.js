var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 项目编号
        order_info: [],
        project_order_product_ids: [],
        project_order_product_list: [],
        isCreated: 0,
        // 进度条
        processData: [{
            name: '待确认',
            start: '#fff',
            end: '#EFF3F6',
            icon: '/images/process_1.png'
        },
        {
            name: '待付款',
            start: '#EFF3F6',
            end: '#EFF3F6',
            icon: '/images/process_1.png'
        },
        {
            name: '代发货',
            start: '#EFF3F6',
            end: '#EFF3F6',
            icon: '/images/process_1.png'
        },
        {
            name: '运输中',
            start: '#EFF3F6',
            end: '#EFF3F6',
            icon: '/images/process_1.png'
        },
        {
            name: '已签收',
            start: '#EFF3F6',
            end: '#fff',
            icon: '/images/process_1.png'
        }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {

        wx.showLoading({
            title: '加载中...',
        });
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1]; //当前页
        var prevPage = pages[pages.length - 2];
        Page.setData({
            // 传递的订单信息
            order_index: prevPage.data.order_index,
            order_info: prevPage.data.order_list[prevPage.data.order_index],
            project_order_product_ids: prevPage.data.project_order_product_ids,
        });
        console.log("当前点击index", this.data.order_index)
        console.log("当前的订单信息", this.data.order_info)
        // 判断当前用户是否为创建用户
        if (this.data.order_info.user_id[0] == app.globalData.uid) {
            this.setData({
                isCreated: 1
            })
        }

        console.log("当前的订单材料", this.data.project_order_product_ids)
        wx.hideLoading();

        // 获取材料信息
        this.getProductList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

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

    },

    getProductList: function () {
        let that = this
        util.rpcRead(1005, api.EngineerOrderProduct, this.data.project_order_product_ids, []).then(function (res) {
            console.log("材料列表：", res)
            that.setData({
                project_order_product_list: res
            })
        })
    },

    goConfirm: function () {
        console.log(this.data.order_info)
        let that = this
        util.rpcWrite(1002, api.EngineerOrder, [this.data.order_info.id], { 'state': '1' }).then(function (res) {
            console.log(res)
            if (res) {
                wx.showToast({
                    title: '已确认订单信息，待发货'
                });
                wx.reLanch({
                    url: './list'
                  })
            } else {
                wx.showToast({
                    title: '确认失败'
                });
            }
        })
    },
    goSend: function () {
        wx.navigateTo({
            url: './receipt',
        })

    },
    goReceive: function () {
        wx.navigateTo({
            url: './receive',
        })
    },

    //进度条的状态
    setPeocessIcon: function () {
        var index = 0 //记录状态为1的最后的位置
        var processArr = this.data.processData
        console.log("progress", this.data.order_list)
        for (var i = 0; i < this.data.order_list.length; i++) {
            var item = this.data.order_list[i]
            // processArr[i].name = item.word
            if (item.state == "1") {
                index = i
                processArr[i].icon = "/images/process_3.png"
                processArr[i].start = "#45B2FE"
                processArr[i].end = "#45B2FE"
            } else {
                processArr[i].icon = "/images/process_1.png"
                processArr[i].start = "#EFF3F6"
                processArr[i].end = "#EFF3F6"
            }
        }
        processArr[index].icon = "/images/process_2.png"
        processArr[index].end = "#EFF3F6"
        processArr[0].start = "#fff"
        processArr[this.data.detailData.progress.length - 1].end = "#fff"
        this.setData({
            processData: processArr
        })
    },
})