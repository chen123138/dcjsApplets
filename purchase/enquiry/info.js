var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

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
      // 创建者
      if (info.create_uid[0] == app.globalData.uid) {
        that.setData({
          isCreate: true
        })
      }
      if (info.user_id[0] == app.globalData.uid) {
        that.setData({
          isEnquiry: true
        })
      }
    })
    wx.hideLoading();
  },

  //取消
  cancel: function (e) {
    let that = this
    wx.showModal({
      title: '是否取消？',

      success: function (res) {
        if (res.confirm) {
          let detail = that.data.enquiry[0]
          if (detail.state == '1' || detail.state == '2') {
            util.rpcWrite(1002, api.EngineerEnquiry, [detail.id], {
              'state': '-1'
            }).then(function (res) {
              wx.showToast({
                title: '取消成功'
              });
              that.getInfo()
            });
          } else {
            util.showText('当前状态，不可取消');
          }

        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  //审批确认
  confirm: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '确认同意?',
      success: function (res) {
        if (res.confirm) {
          util.rpcWrite(1002, api.EngineerApprove, [e.currentTarget.dataset.id], {
            'state': '1'
          }).then(function (res) {
            if (res) {
              wx.showToast({
                title: '审批通过'
              });
              that.getInfo()
            }
          });

        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

  //审批驳回
  reject: function (e) {
    let that = this
    wx.showModal({
      title: '确认驳回?',
      success: function (res) {
        if (res.confirm) {

          util.rpcWrite(1002, api.EngineerApprove, [e.currentTarget.dataset.id], {
            'state': '2'
          }).then(function (res) {
            wx.showToast({
              title: '审批驳回'
            });
            that.getInfo()
          });

        } else {
          console.log('用户点击取消')

        }
      }
    })
  },

  // 提交
  submit: function () {
    let that = this
    let params = [this.data.enquiry[0].id]
    console.log(this.data.enquiry[0].id)
    util.rpcWrite(1002, api.EngineerEnquiry, params, {
      'state': '1'
    }).then(function (res) {
      if (res) {
        wx.showToast({
          title: '提交成功'
        });
        that.getInfo()
      }
    })
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
    title: '询价详情'
  })
  },
  

})