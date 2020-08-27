var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')


Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        phone: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    name: function(e) {
        console.log(e.detail.value)
        this.setData({
            name: e.detail.value
        })
    },
    phone: function(e) {
        console.log(e.detail.value)
        this.setData({
            phone: e.detail.value
        })
    },

    bindUser: function (e) {
        var that = this;
        // 表单验证
        if(this.data.name.length==0) {
            util.showText("请填写姓名")
            return false;
            }
        if(this.data.phone.length==0) {
                util.showText("手机号码不能为空！")
            return false;
            }
        if(this.data.phone.length!=11) {
            util.showText("请输入有效的手机号码！")
            return false;
            }
        
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(!myreg.test(mobile)) {
            util.showText("请输入有效的手机号码！")
            return false;
            }
        let params = {
            'mobile': that.data.phone,
            'openid': app.globalData.oid,
            'name': that.data.name
        }
        console.log(params)
        // let that = this
        util.post(api.BindUser, "100", params).then(res => {
            console.log(res.msg)
            if (res.msg == "OK") {
                wx.switchTab({
                  url: './index',
                })
            }
        });
    },
})