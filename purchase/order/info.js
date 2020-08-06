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
        // 照片
        image: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        wx.showLoading({
            title: '加载中...',
        });
        this.setData({
            uid: app.globalData.uid,
            order_id: Number(e.id)
        })
        // 请求订单详情
        this.getInfo()
        // 
        wx.hideLoading();
        wx.setNavigationBarTitle({
            title: '订单详情'
          })
    },

    // 请求订单详情
    getInfo: function () {
        let that = this
        util.rpcRead(1005, api.EngineerOrder, [that.data.order_id], []).then(function (res) {
            let info = res[0]
            that.setData({
                order_info: info,
                project_order_product_ids: info.project_order_product_ids
            })

            // 材料信息
            if (that.data.project_order_product_ids.length > 0) {
                console.log("材料id列表:", that.data.project_order_product_ids)
                util.rpcRead(1000, api.EngineerOrderProduct, that.data.project_order_product_ids, []).then(function (res) {
                    that.setData({
                        project_order_product_list: res
                    })
                })
            }
        })
    },

    // 确认操作
    goConfirm: function () {
        let that = this
        util.rpcWrite(1002, api.EngineerOrder, [this.data.order_id], { 'state': '1' }).then(function (res) {
            if (res) {
                wx.showToast({
                    title: '已确认订单信息，待发货',
                    icon: 'success',
                    duration: 2000
                })
                that.hideModal();
                that.getInfo()
            } else {
                wx.showToast({
                    title: '确认失败'
                });
            }
        })
    },

    // 发货操作
    goSend: function () {
        this.setData({
            showModal1: true
        })
    },
    // 发货操作
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
                that.getInfo();
            } else {
                wx.showToast({
                    title: '发货失败，请联系管理员'
                });
            }
        })
    },

    // 收货打开对话框
    goReceive: function () {
        this.setData({
            showModal2: true
        })
    },
    // 签收操作
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
                that.getInfo()
            } else {
                wx.showToast({
                    title: '签收失败，请联系管理员'
                });
            }
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
    },

    // 物流费用
    trackingMent: function (e) {
        this.setData({
            tracking_ment: e.detail.value
        })
    },

    // 签收数量
    signer_number: function (e) {
        this.setData({
            signer_number: e.detail.value
        })
        console.log(this.data.signer_number)
    },

    // 签收照片
    signer_images: function () {
        wx.chooseImage({
            //选择原图或压缩
            sizeType: ['original', 'compressed'],  
            //选择开放访问相册、相机
            sourceType: ['album', 'camera'], 
            success: res => {
                this.setData({
                    image: res.tempFilePaths
                })
                console.log("照片：", this.data.image)
                wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePaths[0], //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res => { //成功的回调
                        this.setData({
                            signer_images: res.data
                        })
                    }
                })
            }
        })
    },

    // 弹出框的取消操作
    onCancel: function () {
        this.hideModal();
    },

})