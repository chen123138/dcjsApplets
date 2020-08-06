var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    enquiry: [],    //询价信息
    // 审批人列表
    approval_list: [],
    visible_list: [],  //抄送
    product_list: [], //材料
    // 状态数据
    isCreate: false,
    isEnquiry: false,
  },

  // 数据请求
  getInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let fields = []
    util.rpcRead(1000, api.EngineerEnquiry, [that.data.id], fields, 10, 'id DESC').then(function (res) {
      let info = res[0]
      that.setData({
        enquiry: res[0]
      })
      // console.log(that.data.enquiry)
      // 
      if (info.approve_ids.length > 0) {
        util.rpcRead(1005, api.EngineerApprove, info.approve_ids, []).then(function (res) {
          that.setData({
            approval_list: res
          })
        })
      }
      //材料
      if (info.project_enquiry_product_ids.length > 0) {
        util.rpcRead(1005, api.EngineerEnquiryProduct, info.project_enquiry_product_ids, []).then(function (res) {
          that.setData({
            product_list: res
          })
        })
      }
      //抄送
      if (info.visible_ids.length > 0) {
        util.rpcRead(1005, api.EngineerVisible, info.visible_ids, []).then(function (res) {
          that.setData({
            visible_list: res
          })

        })
      }
    })
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   * 前
   */
  onLoad: function (options) {
    console.log(app.globalData.uid)
    // 页面传值
    this.setData({
      id: parseInt(options.id),
    })
    this.getInfo()
    console.log(this.data.enquiry)

    wx.setNavigationBarTitle({
      title: '抄送我的'
    })
  },

})