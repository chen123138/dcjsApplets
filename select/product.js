var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({
  data: {
    list: [],
    addflag: false,
    addimg: '../../images/icon/加号.png',
    searchstr: '',
    currentSelectTripName: '',
    project_name: "",
    project_id: '',
    product_list: [],
    product_list1: [],
    system_name: ""
  },


  // 数组去重
  unique: function (arr) {
    return Array.from(new Set(arr))
  },

  // 转向确认界面
  goApplication: function () {
    
    wx.navigateTo({
      url: '/purchase/request/check'
    })
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      product_list1: e.detail.value
    })
    console.log(this.data.product_list)
    // console.log(this.data.list)
    this.setData({
      product_list: this.data.product_list.concat(this.data.product_list1)
    })
    console.log("list1",this.data.product_list)
    this.setData({
      product_list: this.unique(this.data.product_list)
    })
    console.log("list2",this.data.product_list)
  },

  // 搜索列表函数
  getList: function (project, system) {
    let params = [
      "&",
      ["product_id", "like", this.data.searchstr],
      "&",
      ["system_id", "like", system],
      ["project_id", "like", project]

    ]
    let fields = []
    let that = this;
    util.rpcList(1000, api.EngineerProduct, params, fields, 1000, '').then(function (res) {
      that.setData({
        list: res.records
      })
      wx.hideLoading();
      console.log(that.data.list)

    });
  },

  // 获取系统列表
  getSystemList: function () {
    var that = this;
    let params = [
      ["project_id", "=", that.data.project_name]
    ]
    console.log(that.data.project_id)
    util.rpcList(1000, api.EngineerSystem, params, [], 1000, '').then(function (res) {
      console.log("项目对应下的系统：")
      console.log(res.records)
      that.setData({
        system_name: res.records
      })
    })
  },

  onLoad(options) {
    // 上一页传递的项目名
    console.log("上一页传递的数据：")
    console.log(options)
    this.setData({
      project_name: this.options.projectName,
      project_id: this.options.projectId
    })

    console.log('项目名:' + this.data.project_name)
    console.log('项目id:' + this.data.project_id)
    wx.showLoading({
      title: '加载中...',
    });

    this.getList(this.data.project_name, "综合布线系统")


  },
  onShow() {
    // 获取系统列表
    this.getSystemList()
  },

  tap(e) {

  },

  // 搜索框右侧 事件
  addhandle() {
    console.log('触发搜索框右侧事件')
  },

  //搜索框输入时触发
  searchList(ev) {
    let e = ev.detail;
    this.setData({
      searchstr: e.detail.value
    })
    console.log(this.data.searchstr)
    this.getList()

  },
  //搜索回调
  endsearchList(e) {
    wx.showLoading({
      title: '加载中...',
    });
    this.getList()
    // wx.hideLoading();

  },
  // 取消搜索
  cancelsearch() {
    this.setData({
      searchstr: ''
    })
  },
  //清空搜索框
  activity_clear(e) {

    this.setData({
      searchstr: ''
    })
  },

  // 按钮管理
  selectSystem: function (e) {
    wx.showLoading({
      title: '加载中...',
    });
    console.log("选择系统：")
    console.log(e.currentTarget.dataset.name)
    this.setData({
      currentSelectTripName: e.currentTarget.dataset.name
    })

    this.getList(this.data.project_name, e.currentTarget.dataset.name)
  }

})