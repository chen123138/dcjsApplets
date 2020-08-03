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
    system_nameOne: '',
    project_name: "",
    project_id: '',
    ids: [],
    system_name: "",
    mean: ''
  },


  // 数组去重
  unique: function (arr) {
    return Array.from(new Set(arr))
  },

  // 转向确认界面
  goApplication: function () {

    // 转向不同页面
    switch (this.data.mean) {
      case "purchase":
        wx.navigateTo({
          url: '/purchase/request/check'
        })
        break;
      case "task":
        wx.navigateTo({
          url: '/task/form'
        })
        break;
    }
  },
  checkboxChange(e) {
    //   
    console.log('checkbox发生change事件，携带value值为：', e.detail)
    // 
    let ids = this.data.ids.concat(e.detail.value)
    ids = Array.from(new Set(ids))
    // console.log(ids)
    this.setData({
      ids: ids
    })
    console.log("ids", this.data.ids)
  },


  getListTask: function (project, system) {
    let params = [
      "&",
      ["product_id", "like", this.data.searchstr],
      "&",
      ["system_id", "like", system],
      ["project_id", "like", project],
      ["stock", ">", 0],


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
  getListPurchase: function (project, system) {
    let params = [
      "&",
      ["product_id", "like", this.data.searchstr],
      "&",
      ["system_id", "like", system],
      ["project_id", "like", project],
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
        system_name: res.records,
        system_nameOne: res.records[0].name
      })

      switch (that.data.mean) {
        case "task":
          that.getListTask(that.data.project_name, that.data.system_name[0].name)
          break;
        case "purchase":
          that.getListPurchase(that.data.project_name, that.data.system_name[0].name)
          break;
      }
    })
  },

  onLoad(options) {
    // 上一页传递的项目名
    console.log("上一页传递的数据：", options)
    this.setData({
      project_name: this.options.projectName,
      project_id: this.options.projectId,
      mean: this.options.mean
    })

    console.log('项目名:' + this.data.project_name)
    console.log('项目id:' + this.data.project_id)
    console.log('项目来源:' + this.data.mean)
    wx.showLoading({
      title: '加载中...',
    });
    // 获取系统列表
    this.getSystemList()

  },
  onShow() {

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
    switch (this.data.mean) {
      case "task":
        this.getListTask()
        break;
      case "purchase":
        this.getListPurchase()
        break;
    }

  },
  //搜索回调
  endsearchList(e) {
    wx.showLoading({
      title: '加载中...',
    });
    switch (this.data.mean) {
      case "task":
        this.getListTask()
        break;
      case "purchase":
        this.getListPurchase()
        break;
    }
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

    switch (this.data.mean) {
      case "task":
        this.getListTask(this.data.project_name, e.currentTarget.dataset.name)
        break;
      case "purchase":
        this.getListPurchase(this.data.project_name, e.currentTarget.dataset.name)
        break;
    }
  }

})