var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_list: [],
    mean: ''
  },

  // 获取项目列表
  getProjectList: function() {
    let params = []
    let fileds = ["id", "name"]
    var that = this
    util.rpcList(1000, api.EngineerProject, params, fileds, 100, '').then(function(res) {
      that.setData({
        project_list: res.records
      })
    })
  },

  // 选择项目
  goSelectProduct: function(e) {
    wx.navigateTo({
      url: './product?projectName=' + e.currentTarget.dataset.name + '&projectId=' + e.currentTarget.dataset.id + '&mean=' + this.data.mean,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 项目来源--task or purchaser
    this.setData({
      mean: options.mean
    })
    this.getProjectList()
  },

})