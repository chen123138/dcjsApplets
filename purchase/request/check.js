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
    project_id: 0,
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
    // TODO
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    // 
    let data = prevPage.data
    let project_id = data.project_id;
    let project_name = data.project_name;
    let product_ids = data.ids.map(Number);
    // 
    console.log("获取上一页Ids", product_ids)
    // 更新数据
    this.setData({
        project_name: project_name,
        project_id: project_id
    });
    // 获取材料列表
    this.getList(product_ids)
  },
    // 材料
    getList: function (ids) {
        // 
        let fields = ["project_id", "name", "number", "project_system_id", "brand", "type", "uom_id", "stock"]
        let that = this;
        util.rpcRead(1000, api.EngineerProduct, ids, fields, 1000, '').then(function (res) {
            console.log("res", res)
            let list = that.data.list.concat(res)
            that.setData({
                list: list
            })
            wx.hideLoading();
        });
    },
  // 选择材料数量
  bindBlur: function (e) {
    let list = this.data.list
      list[e.currentTarget.dataset.index].number = Number(e.detail.value)
      this.setData({
        list: list
      })
      console.log("改变数量", this.data.list)
  },
  // 选择到货时间
  bindDateChangeDate: function (e) {
    let list = this.data.list
    list[e.currentTarget.dataset.index].date = e.detail.value
    this.setData({
      list: list
    })
    console.log("改变时间", this.data.list)
  },
  // 选择品牌
  bindBlurBrand: function (e) {
    let list = this.data.list
    list[e.currentTarget.dataset.index].brand = e.detail.value
    this.setData({
      list: list
    })
    console.log("品牌", this.data.list)
  },
  // 选择品牌类型
  bindBlurType: function (e) {
    let list = this.data.list
      list[e.currentTarget.dataset.index].type = e.detail.value
      this.setData({
        list: list
      })
      console.log("类型", this.data.list)
  },
  // 包装信息
  bindBlurPiker: function (e) {
    let list = this.data.list
      list[e.currentTarget.dataset.index].piker = e.detail.value
      this.setData({
        list: list
      })
      console.log("包装", this.data.list)
  },
  // 选择收货信息
  user: function (e) {
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
  remarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  // 提交信息
  Submit: function () {
    console.log("data", this.data.list)
    let listData = this.data.list
    let productLists = []
    // 表单验证
    if(this.data.user =="") {
      util.showText('请填写收货人')
        return false
    }else if(this.data.phone == "") {
      util.showText('请填写收货电话')
        return false
    }else if(this.data.house == ""){
      util.showText('请填写收货地址')
        return false
    }
    for (let i = 0; i < listData.length; i++) {
      let product = {}
      product.brand = listData[i].brand
      if(listData[i].date == undefined) {
        let num = ++i
        util.showText('请选择第' + num + '个材料到货时间')
        return false
      }
      product.date = listData[i].date
      if(listData[i].number == 1) {
        let num = ++i
        util.showText('请选择第' + num + '个材料请购数量')
        return false
      }
      product.number = listData[i].number
      product.pack = listData[i].uom_id[1]
      product.project_id = listData[i].project_id[0]
      product.project_product_id = listData[i].id
      product.project_system_id = listData[i].project_system_id[0]
      product.remarks = listData[i].remarks
      product.sn = i + 1
      product.type = listData[i].type
      product.uom_id = listData[i].uom_id[0]
      console.log("product", product)
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
      state: "1",
      user_id: app.globalData.uid,
      remarks: this.data.remarks
    }

    console.log("这是params：", params)
    util.rpcCreate(1002, api.EngineerPurchase, [params]).then(function (res) {
      console.log(res)
      wx.showToast({
        title: '提交成功'
      });
      setTimeout(function () {
        wx.redirectTo({
          url: './list'
        })
      }, 500);

    })
  },

})