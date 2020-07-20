var api = require('../../utils/api.js')
var util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        project_id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = parseInt(options.id)
        console.log(options.id)
        this.setData({
            project_id: id
        });
        this.getList(id)
    },

    getList: function (id) {
        wx.showLoading({
            title: '加载中...',
        });
        let params = ["", [
            ['project_id', '=', id]
        ]];
        let that = this;
        util.rpcName(1006, api.EngineerUser, params).then(function (res) {            
            that.setData({
                list: res
            });
            console.log(res)
            wx.hideLoading();
        });
    },

    checkboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        const values = e.detail.value;
        // console.log(values);
        var users = [];
        var user_ids = [];
        values.forEach(item => {
            item = item.split(",");
            users.push(item[1]);
            let uid = parseInt(item[0]);
            user_ids.push([0, 'virtual_'+uid, {'project_id': this.data.project_id, 'project_user_id': uid}]);
        });
        console.log(users)
        console.log(user_ids)
        // 设置数据
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setData({
            users: users,
            user_ids: user_ids
        });
    },

    bindPrevTap() {
        // 返回
        wx.navigateBack({
            delta: 1
        })
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

    }
})