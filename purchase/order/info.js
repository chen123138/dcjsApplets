var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid: 0,
        // 项目编号
        order_id: '',
        order_info: [],
        project_order_product_ids: [],
        project_order_product_list: [],
        isCreated: 0,
        // 收货信息-订单号
        tracking: '',
        // 收货信息-金额
        tracking_ment: '',
        showModal1: false,
        showModal2: false,
        // 签收信息
        signer_images: '',
        signer_time: '',
        signer_number: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        wx.showLoading({
            title: '加载中...',
        });
        console.log("当前id", e.id)
        this.setData({
            uid: app.globalData.uid,
            order_id: Number(e.id)
        })
        console.log(this.data.order_info)
        wx.hideLoading();
        // 请求订单详情
        this.getDetails()

    },
    // 请求订单详情
    getDetails: function () {
        let that = this
        util.rpcRead(1005, api.EngineerOrder, [that.data.order_id], []).then(function (res) {
            let info = res[0]
            that.setData({
                order_info: info,
                project_order_product_ids: info.project_order_product_ids
            })
            console.log("订单详情:", that.data.order_info)
            // 材料信息
            if (that.data.project_order_product_ids.length > 0) {
                console.log("材料id列表:", that.data.project_order_product_ids)
                util.rpcRead(1000, api.EngineerOrderProduct, that.data.project_order_product_ids, []).then(function (res) {
                    console.log("材料列表：", res)
                    that.setData({
                        project_order_product_list: res
                    })
                })
            }
        })
    },
    goConfirm: function () {
        console.log(this.data.order_info)
        let that = this
        util.rpcWrite(1002, api.EngineerOrder, [this.data.order_id], { 'state': '1' }).then(function (res) {
            console.log(res)
            if (res) {
                wx.showToast({
                    title: '已确认订单信息，待发货',
                    icon: 'success',
                    duration: 2000
                })
                that.hideModal();
                that.getDetails()
            } else {
                wx.showToast({
                    title: '确认失败'
                });
            }
        })
    },

    // 发货
    goSend: function () {
        this.setData({
            showModal1: true
        })
    },
    // 收货
    goReceive: function () {
        this.setData({
            showModal2: true
        })
    },

    // 隐藏对话框
    hideModal: function () {
        this.setData({
            showModal1: false,
            showModal2: false
        });
    },
    // 物流单号
    tracking: function (e) {
        this.setData({
            tracking: e.detail.value
        })
        console.log(this.data.tracking)
    },
    // 金额
    trackingMent: function (e) {
        this.setData({
            tracking_ment: e.detail.value
        })
        console.log(this.data.tracking_ment)
    },
    signer_number: function (e) {
        this.setData({
            signer_number: e.detail.value
        })
        console.log(this.data.signer_number)
    },
    // 签收信息
    signer_images: function () {
        wx.chooseImage({
            success: res => {
                console.log(res.tempFilePaths[0])
                wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                        console.log('data:image/png;base64,' + res.data)
                        this.setData({
                            signer_images: res.data
                        })
                    }
                })
            }
        })
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        let that = this
        util.rpcWrite(1002, api.EngineerOrder, [this.data.order_info.id], { 'logistic_freight': this.data.tracking_ment, 'logistic_number': this.data.tracking }).then(function (res) {
            console.log("是否成功", res)
            if (res) {
                wx.showToast({
                    title: '发货成功',
                    icon: 'success',
                    duration: 2000
                })
                that.hideModal();
                that.getDetails();
            } else {
                wx.showToast({
                    title: '发货失败，请联系管理员'
                });
            }
        })
    },
    bindtracking: function () {
        let that = this
        util.rpcWrite(1002, api.EngineerOrder, [this.data.order_info.id], { 'signer_images': this.data.signer_images, 'signer_number': this.data.signer_number }).then(function (res) {
            console.log("是否成功", res)
            if (res) {
                wx.showToast({
                    title: '签收成功',
                    icon: 'success',
                    duration: 2000
                })
                that.hideModal();
                that.getDetails()
            } else {
                wx.showToast({
                    title: '签收失败，请联系管理员'
                });
            }
        })
    },

    //进度条的状态
    setPeocessIcon: function () {
        console.log(this.data.order_info)
        let state = Number(this.data.order_info.state)
        let processData = this.data.processData
        let that = this
        for (let index1 = 0; index1 <= state; index1++) {
            if (index1 == 0) {
                processData[index1].icon = '/images/process_2.png'
            } else if (index1 == 3) {
                processData[index1].icon = '/images/process_2.png'
                processData[index1].start = '#0288d1'
                processData[index1 - 1].end = '#0288d1'

            } else {
                processData[index1 - 1].end = '#0288d1'
                processData[index1].icon = '/images/process_2.png'
                processData[index1].start = '#0288d1'
                // processData[index1].end = '#0288d1'
            }
            for (let index2 = 0; index2 < index1; index2++) {
                processData[index2].icon = '/images/process_3.png'
            }
        }
        that.setData({
            processData: processData
        })
    },
})