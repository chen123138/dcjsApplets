var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_id: "",
    list: [],
    state: '',
    purchase: [],
    // 审批
    approval: [],
    approvalId: '',
    // 审批流程数据
    uid: app.globalData.uid,
    approvalState: 0,
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
      product_id: options.id,
    })
    // console.log("用户id", this.data.uid)
    console.log("项目id", this.data.product_id)

    this.getList()

  },

  // 数据请求
  getList: function () {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    let params = [
      ["id", "=", that.data.product_id]
    ]
    let fields = []
    util.rpcList(1000, api.EngineerPurchase, params, fields, 1, 'id DESC').then(
      function (res) {
        let info = res.records[0]
        console.log("info：", info)
        that.setData({
          list: res.records,
          state: res.records[0].state
        })
        console.log(typeof that.data.state)
        
        if (info.project_purchase_product_ids.length > 0) {
          util.rpcRead(1005, api.EngineerPurchaseProduct, info.project_purchase_product_ids, []).then(function (res) {
            var createdId = res[0].create_uid[0]
            that.setData({
              purchase: res
            })
            if (that.data.uid == createdId) {
              var arr = that.data.approvalState
              arr = arr + 1
              that.setData({
                approvalState: arr
              })
              console.log("当前用户是创建人", that.data.approvalState)
            }
          })
        }
        // 取审批人列表
        if (info.approve_ids.length > 0) {
          util.rpcRead(1005, api.EngineerApprove, info.approve_ids, []).then(function (res) {
            that.setData({
              approval: res,
            })
            console.log("审批人", that.data.approval)
            var arr = that.data.approval
            var approvalList = []
            var approvalIdList = []
            console.log(arr)
            for (var i = 0; i < arr.length; i++) {
              approvalList.push(arr[i].user_id[0])
              approvalIdList.push(arr[i].id)
            }
            if (approvalList.indexOf(that.data.uid) > -1) {
              var arr2 = that.data.approvalState
              arr2 = arr2 + 2
              that.setData({
                approvalState: arr2,
                approvalId: approvalIdList[approvalList.indexOf(that.data.uid)]
              })
              console.log("当前用户是审批人", that.data.approvalState)
              console.log("审批人id", that.data.approvalId)
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
  goAgree: function () {
    util.rpcWrite(1002, api.EngineerFlowRecord, [this.data.approvalId], { 'state': '1' }).then(function (res) {
      console.log(res)
    })
  },
  // 审核驳回
  goReject: function () {
    util.rpcWrite(1002, api.EngineerFlowRecord, [this.data.approvalId], { 'state': '2' }).then(function (res) {
      console.log(res)
    })
  },
  // 请购人员取消
  goCancel: function () {
    console.log("取消")
    util.rpcWrite(1002, api.EngineerPurchase, [this.data.product_id], { 'state': '-1' }).then(function (res) {
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