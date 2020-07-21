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
  },

  /**
   * 生命周期函数--监听页面加载
   * 前
   */
  onLoad: function(options) {

    // 页面传值
    console.log(options)
    this.setData({
      product_id: parseInt(options.id),
    })
    console.log(this.data.product_id)
  },
  getGuideInfo: function(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/guide/info?id=' + id
    });
  },

  // 数据请求
  gitList: function() {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    let params = [
      ["id", "=", that.data.product_id]
    ]
    let fields = []

    util.rpcRead(1005, api.EngineerEnquiry, [that.data.product_id], []).then(function(res) {

      let info = res[0]
      that.setData({
        approval: res
      })
      console.log("询价：")
      console.log(info)

      //
      if (info.approve_ids.length > 0) {
        util.rpcRead(1005, api.EngineerApprove, info.approve_ids, []).then(function(res) {
          that.setData({
            approval_state: res
          })

          console.log("审批状态：")
          console.log(res)

        })
      }
      //材料
      if (info.project_enquiry_product_ids.length > 0) {
        util.rpcRead(1005, api.EngineerEnquiryProduct, info.project_enquiry_product_ids, []).then(function(res) {
          that.setData({
            approval_product: res
          })

          console.log("材料信息：")
          console.log(res)

        })
      }
      //可见
      if (info.visible_ids.length > 0) {
        util.rpcRead(1005, api.EngineerVisible, info.visible_ids, []).then(function(res) {
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
  bindchange: function(e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function(e) {
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
  cancel: function(e) {
    let that = this
    wx.showModal({
      title: '提示',


      success: function(res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')
          console.log(that.data.approval[0])
          let detail = that.data.approval[0]

          if (detail.state == '1' || detail.state == '2') {
            console.log(detail.state)
            util.rpcWrite(1002, api.EngineerEnquiry, [detail.id], {
              'state': '-1'
            }).then(function(res) {
              wx.showToast({
                title: '取消成功'
              });
              setTimeout(function() {
                wx.navigateTo({
                  url: '../../approve/list/index'
                });
              }, 500);
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
  ApprovalConfirm: function(e) {
    let that = this
    wx.showModal({
      title: '提示',


      success: function(res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')

          let detail = that.data.approval[0]
          console.log(detail)
          console.log(detail.state)

          util.rpcWrite(1002, api.EngineerApprove, [detail.id], {
            'state': '1'
          }).then(function(res) {
            wx.showToast({
              title: '审批通过'
            });
            setTimeout(function() {
              wx.navigateTo({
                url: '../info/index'
              });
            }, 500);
          });

        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },

  //审批驳回按钮 改变审批状态
  ApprovalReject: function(e) {
    let that = this
    wx.showModal({
      title: '提示',


      success: function(res) {
        if (res.confirm) { //这里是点击了确定以后
          console.log('用户点击确定')

          let detail = that.data.approval[0]
          console.log(detail)
          console.log(detail.state)

          util.rpcWrite(1002, api.EngineerApprove, [detail.id], {
            'state': '2'
          }).then(function(res) {
            wx.showToast({
              title: '审批驳回'
            });
            setTimeout(function() {
              wx.navigateTo({
                url: '../../approve/list/index'
              });
            }, 500);
          });

        } else { //这里是点击了取消以后
          console.log('用户点击取消')

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   * 后
   */
  onShow: function() {
    this.gitList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})