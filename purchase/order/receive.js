// purchase/order/receive.js
var app = getApp()
var api = require('../../utils/api.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  // 购买信息
  payImage: function () {
    wx.chooseImage({
      success: res => {
        console.log(res.tempFilePaths[0])
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data)
            this.setData({
              payment_images: res.data
            })
          }
        })
      }
    })
  },

  payment: function (e) {
    this.setData({
      payment: e.detail.value
    })
    console.log(this.data.payment)
  },
  // 签收信息
  signer_images: function () {
    wx.chooseImage({
      success: res => {
        console.log(res.tempFilePaths[0])
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log('data:image/png;base64,' + res.data)
            this.setData({
              signer_images: res.data
            })
          }
        })
      }
    })
  },
  signer_number: function (e) {
    this.setData({
      signer_number: e.detail.value
    })
    console.log(this.data.signer_number)
  },
  bindtracking: function () {
    util.rpcWrite(1002, api.EngineerOrder, [this.data.order_list_id], { 'signer_images': this.data.signer_images, 'signer_number': this.data.signer_number,'state':'3' } ).then(function (res) {
      console.log("是否成功", res)
      console.log("是否成功", res)
      if (res) {
      wx.showToast({
        title: '已签收'
      });
      wx.navigateTo({
        url: './list',
      })
    }else {
      wx.showToast({
        title: '签收失败，请联系管理员'
      });
    }
    })
  }
})