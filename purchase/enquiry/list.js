var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getList();
    wx.setNavigationBarTitle({
      title: '询价列表'
    })
  },

  // 询价列表
  getList: function () {
    wx.showLoading({
      title: '加载中...',
    });
    let params = [
      "|",
      ["create_uid", "=", app.globalData.uid],
      ["user_id", "=", app.globalData.uid]
    ]
    let fields = []
    let that = this;
    util.rpcList(1000, api.EngineerEnquiry, params, fields, 10, 'id DESC').then(function (res) {
      that.setData({
        list: res.records
      })
      // console.log("res:", res)
      wx.hideLoading();
    })
  },

  // 点击选择列表事件
  bindItemTap: function (e) {
    wx.navigateTo({
      url: 'info?id=' + e.currentTarget.dataset.id
    })
  },

})