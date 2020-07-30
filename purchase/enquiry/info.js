var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_id: "",
    approval: [],    //询价信息
    approval_state: [],  //状态
    approval_product: [], //材料
    approval_visible: [],  //抄送
    // 状态数据
    processData: [{
      name: '起稿中',
      start: '#fff',
      end: '#EFF3F6',
      icon: '/images/process_1.png'
    },
    {
      name: '审批中',
      start: '#EFF3F6',
      end: '#EFF3F6',
      icon: '/images/process_1.png'
    },
    {
      name: '询价单',
      start: '#EFF3F6',
      end: '#fff',
      icon: '/images/process_1.png'
    }],
  },


  /**
   * 生命周期函数--监听页面加载
   * 前
   */
  onLoad: function (options) {

    // 页面传值
    console.log(options)
    this.setData({
      product_id: parseInt(options.id),
    })
    this.gitList()
    console.log(this.data.product_id)
  },
  getGuideInfo: function (e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/guide/info?id=' + id
    });
  },

  // 数据请求
  gitList: function () {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    let fields = []

    util.rpcRead(1000, api.EngineerEnquiry, [that.data.product_id], fields, 10, 'id DESC').then(function (res) {
      let info = res[0]
      that.setData({
        approval: res
      })
      console.log("询价：", that.data.approval)
      that.setPeocessIcon()
      if (info.approve_ids.length > 0) {
        util.rpcRead(1005, api.EngineerApprove, info.approve_ids, []).then(function (res) {
          that.setData({
            approval_state: res
          })
          console.log("审批状态：")
          console.log(res)

        })
      }
      //材料
      if (info.project_enquiry_product_ids.length > 0) {
        util.rpcRead(1005, api.EngineerEnquiryProduct, info.project_enquiry_product_ids, []).then(function (res) {
          that.setData({
            approval_product: res
          })

          console.log("材料信息：")
          console.log(res)

        })
      }
      //可见
      if (info.visible_ids.length > 0) {
        util.rpcRead(1005, api.EngineerVisible, info.visible_ids, []).then(function (res) {
          that.setData({
            approval_visible: res
          })

          console.log("可见抄送：")
          console.log(res)

        })
      }


    })
    wx.hideLoading();
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  //取消订单按钮 改变审批状态
  cancel: function (e) {
    let that = this
    wx.showModal({
      title: '是否取消？',

      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          console.log(that.data.approval[0])
          let detail = that.data.approval[0]

          if (detail.state == '1' || detail.state == '2') {
            console.log(detail.state)
            util.rpcWrite(1002, api.EngineerEnquiry, [detail.id], {
              'state': '-1'
            }).then(function (res) {
              wx.showToast({
                title: '取消成功'
              });
              that.gitList()
              console.log(res)
            });
          } else {
            util.showText('当前状态，不可取消');
          }

        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },

  //审批确认按钮 改变审批状态
  ApprovalConfirm: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      title: '确认同意?',

      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后

          util.rpcWrite(1002, api.EngineerApprove, [e.currentTarget.dataset.id], {
            'state': '1'
          }).then(function (res) {
            console.log(res)
            if (res) {
              wx.showToast({
                title: '审批通过'
              });
              that.gitList()
            }
          });

        } else { //这里是点击了取消以后
          console.log('用户点击取消')
        }
      }
    })
  },

  //审批驳回按钮 改变审批状态
  ApprovalReject: function (e) {
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
            that.gitList()
          });

        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },

  // 提交按钮
  submit: function () {
    let that = this
    let params = [this.data.approval[0].id]
    console.log(this.data.approval[0].id)
    util.rpcWrite(1002, api.EngineerEnquiry, params, {
      'state': '1'
    }).then(function (res) {
      console.log("提交：", res)
      if (res) {
        wx.showToast({
          title: '提交成功'
        });
        that.gitList()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.setPeocessIcon()
  },

  /**
   * 生命周期函数--监听页面显示
   * 后
   */
  onShow: function () {
  },
  //进度条的状态
  setPeocessIcon: function () {
    console.log("状态栏打印list", this.data.approval[0])
    let state = Number(this.data.approval[0].state)
    let processData = this.data.processData
    let that = this
    if (state == '-1') {
      let processData = [{
        name: '审批中',
        start: '#ffffff',
        end: '#ffffff',
        icon: '/images/process_0.png'
      }]
      that.setData({
        processData: processData
      })
    } else {
      for (let index1 = 0; index1 <= state; index1++) {
        if (index1 == 0) {
          processData[index1].icon = '/images/process_2.png'
        } else if (index1 == 3) {
          processData[index1].icon = '/images/process_2.png'
          processData[index1].start = '#0288d1'
          processData[index1 - 1].end = '#0288d1'

        } else {
          processData[index1 - 1].end = '#0288d1'
          processData[index1].icon = '/images/process_2.png'
          processData[index1].start = '#0288d1'
        }
        for (let index2 = 0; index2 < index1; index2++) {
          processData[index2].icon = '/images/process_3.png'
        }
      }
      that.setData({
        processData: processData
      })
    }
  },

})