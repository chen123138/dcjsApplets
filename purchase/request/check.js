var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')
var arr = []
Page({
  data: {
    // 请购项目
    project_name: "",
    // 请购人员
    applicationUser: "",
    // 请购状态
    applicationStatus: "",
    // 请购材料id集合
    product_ids: [],
    // 请求所有材料合集
    list: [],
    // 采购方式
    mode: "1",
    // 项目id
    project_id: '',
    // 备注
    remarks: '',
    // 收货信息
    user: '',
    phone: '',
    house: '',
    cates: [
      { lable: '委托', value: "1", checked: 'true' },
      { lable: '现场', value: "2" },
    ]
  },
  // 取消按钮
  cancel: function (index) {
    console.log(index.currentTarget.dataset.index)
    var arr = this.data.list
    arr.splice(index.currentTarget.dataset.index, 1)
    this.setData({
      list: arr
    })
  },
  // 采购方式函数
  bindRadioChange: function (e) {
    this.setData({
      mode: e.detail.value
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    });
    // 设置数据
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];
    Page.setData({
      // 传递的材料列表
      product_ids: prevPage.data.product_list1.map(Number),
      // 传递的项目名
      project_name: prevPage.data.project_name,
      project_id: prevPage.data.project_id,
    });
    // 请求材料
    for (var i = 0; i < this.data.product_ids.length; i++) {

      this.getList(Number(this.data.product_ids[i]))
    }
  },
  // 请求材料接口
  getList: function (m) {
    let params = [
      ["id", "=", m]
    ]
    let fields = ["project_id", "number", "system_id",  "product_id", "brand", "type", "uom_id","remarks"]
    let that = this;
    util.rpcList(1000, api.EngineerProduct, params, fields, 1000, '').then(function (res) {
      console.log("res",res)
      that.setData({
        list: that.data.list.concat(res.records)
      })
      wx.hideLoading();
    });
  },
  // 选择材料数量
  bindBlur: function(e) {
    let list = this.data.list
    if (e.detail.value > list[e.currentTarget.dataset.index].number) {
      util.showText('数量溢出，实际库存为' + list[e.currentTarget.dataset.index].number + '，请重试')
    }else {
      list[e.currentTarget.dataset.index].number = Number(e.detail.value)
      this.setData({
        list: list
      })
      console.log("改变数量",this.data.list)
    }
  },
  // 选择到货时间
  bindDateChangeDate: function(e) {
    let list = this.data.list
    list[e.currentTarget.dataset.index].date = e.detail.value
    this.setData({
      list: list
    })
    console.log("改变时间", this.data.list)
  },
  // 选择收货信息
  user: function(e) {
    this.setData({
      user: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  house: function (e) {
    this.setData({
      house: e.detail.value
    })
  },
  // 提交信息
  Submit: function() {
    console.log("data", this.data.list)
    let listData = this.data.list.slice()
    let product = {}
    let productLists = []
    for (let i = 0; i < listData.length; i++) {
      product.brand = listData[i].brand
      product.date = listData[i].date
      product.number = listData[i].number
      product.pack = listData[i].uom_id[1]
      product.project_id = listData[i].project_id[0]
      product.project_product_id = listData[i].id
      product.project_system_id = listData[i].system_id[0]
      product.remarks = listData[i].remarks
      product.sn = i+1
      product.type = listData[i].type
      product.uom_id = listData[i].uom_id[0]
      productLists.push([0, "virtual_" + i, product])
    }
    console.log("productLists", productLists)
    console.log("listData", listData)

    let params = {
      buy_mode: this.data.mode || "1",
      project_id: Number(this.data.project_id),
      receive_address: this.data.house,
      receive_phone: this.data.phone,
      receive_user: this.data.user,
      project_purchase_product_ids: productLists,
      state: "1"
    }
    console.log("这是params：",params)
    util.rpcCreate(1002, api.EngineerPurchase, [params]).then(function (res) {
      console.log(res)
      wx.showToast({
        title: '提交成功'
    });
    setTimeout(function () {
        wx.navigateTo({ url: './list' });
    }, 500);
    })
  },
  
})