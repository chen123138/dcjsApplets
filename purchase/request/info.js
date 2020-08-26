var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  
  data: {
      uid: 0,
    id: "",
    list: [],
    state: '',
    purchase: [],
    // 审批
    approval: [],
    approval_id: '',
    // 审批流程数据
    uid: app.globalData.uid,
    approval_state: 0,
    // 抄送列表
    copy: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 页面传值
    // console.log(options)
    this.setData({
        uid: app.globalData.uid,
        id: options.id
    })

    console.log("项目id",typeof  this.data.id)
    this.getInfo()

    wx.setNavigationBarTitle({
      title: '请购详情'
    })
  },

  // 数据请求
  getInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    let params = [
      ["id", "=", that.data.id]
    ]
    let fields = []
    util.rpcList(1000, api.EngineerPurchase, params, fields, 1, 'id DESC').then(
      function (res) {
        let info = res.records[0]
        console.log("res:", res)
        that.setData({
          list: info,
        })
        console.log(info)
        // 材料列表
        if (info.project_purchase_product_ids.length > 0) {
          util.rpcRead(1005, api.EngineerPurchaseProduct, info.project_purchase_product_ids, []).then(function (res) {
            var createdId = res[0].create_uid[0]
            that.setData({
              purchase: res
            })
            console.log("材料列表：",res)
            if (that.data.uid == createdId) {
              var arr = that.data.approval_state
              arr = arr + 1
              that.setData({
                approval_state: arr
              })
              console.log("当前用户是创建人", that.data.approval_state)
            }
          })
        }
        // 取审批人列表
        if (info.approve_ids.length > 0) {
          util.rpcRead(1005, api.EngineerApprove, info.approve_ids, []).then(function (res) {
            that.setData({
              approval: res,
            })
            // console.log("审批人", that.data.approval)
            var arr = that.data.approval
            var approvalList = []
            var approvalIdList = []
            for (var i = 0; i < arr.length; i++) {
              approvalList.push(arr[i].user_id[0])
              approvalIdList.push(arr[i].id)
            }
            if (approvalList.indexOf(that.data.uid) > -1) {
              var arr2 = that.data.approval_state
              arr2 = arr2 + 2
              that.setData({
                approval_state: arr2,
                approval_id: approvalIdList[approvalList.indexOf(that.data.uid)]
              })
            }
          })
        }
        // 取抄送人列表
        if (info.visible_ids.length > 0) {
          util.rpcRead(1005, api.EngineerVisible, info.visible_ids, []).then(function (res) {
            console.log("抄送人列表", res)
            that.setData({
              copy: res,
            })
            console.log("抄送人",res)
          })
        }
      }
    )
    wx.hideLoading();
  },

  // 审核通过
  ApprovalConfirm: function () {
    wx.showLoading({
      title: '加载中...',
    })
    // 
    let that = this
    util.rpcWrite(1002, api.EngineerApprove, [this.data.approval_id], { 'state': '1' }).then(function (res) {
      console.log(res)
      wx.showToast({
        title: '审核通过'
      });
      that.getInfo()
    })
    // 
    wx.hideLoading();
  },
  // 审核驳回
  ApprovalReject: function () {
    wx.showLoading({
      title: '加载中...',
    })
    //
    let that = this
    util.rpcWrite(1002, api.EngineerApprove, [this.data.approval_id], { 'state': '2' }).then(function (res) {
      console.log(res)
      wx.showToast({
        title: '审核驳回'
      });
      that.getInfo()
    })
    // 
    wx.hideLoading();
  },
  // 请购人员取消
  cancel: function () {
    wx.showLoading({
      title: '加载中...',
    })
    //
    console.log("取消")
    util.rpcWrite(1002, api.EngineerPurchase, [this.data.id], { 'state': '-1' }).then(function (res) {
      console.log(res)
      wx.showToast({
        title: '取消成功'
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 500);
    })
    // 
    wx.hideLoading();
  },

})