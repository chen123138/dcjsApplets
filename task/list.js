var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
		page: 1,
		size: 10,
    total: 1,
		click: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: '施工任务'
		})
	},
	getList: function() {
		wx.showLoading({
			title: '加载中...',
		});
		// 我发布的|我已做的
		let params = [
			"|",
			["create_uid", "=", app.globalData.uid],
			"&",
			["state", ">=", "3"],
			["project_task_user_ids.project_user_id.user_id.id", "=", app.globalData.uid]
		]
		let fields = ["code", "name", "state", "end_date"]
		let that = this;
		util.rpcList(1000, api.EngineerTask, params, fields, 10, 'id DESC').then(function(res) {
			that.setData({
				list: res.records,
				total: res.length
			});
			// console.log(res)
			wx.hideLoading();
		});
	},

	// 点击事件
	bindItemTap: function (e) {
		wx.navigateTo({
			url: './info?id=' + e.currentTarget.dataset.id
		})
	},
	// 按钮点击事件
	worker_click: function() {
		this.setData({
			click: !this.data.click
		})
	},

	worker_click_false: function() {
		this.setData({
			click: false
		})
	},


	upper: function() {
		wx.showNavigationBarLoading()
		this.refresh();
		console.log("upper");
		setTimeout(function() {
			wx.hideNavigationBarLoading();
			wx.stopPullDownRefresh();
		}, 2000);
	},

	lower: function(e) {
		wx.showNavigationBarLoading();
		var that = this;
		setTimeout(function() {
			wx.hideNavigationBarLoading();
			that.nextLoad();
		}, 1000);
		console.log("lower")
	},

	refresh: function () {
		wx.showToast({
			title: '刷新中',
			icon: 'loading',
			duration: 3000
		});
		this.getList();
		setTimeout(function () {
			wx.showToast({
				title: '刷新成功',
				icon: 'success',
				duration: 2000
			})
		}, 3000)
	},

	// 使用本地 fake 数据实现继续加载效果
	nextLoad: function () {
		wx.showToast({
			title: '加载中',
			icon: 'loading',
			duration: 4000
		})
		this.getList();
		setTimeout(function () {
			wx.showToast({
				title: '加载成功',
				icon: 'success',
				duration: 2000
			})
		}, 3000)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.getList();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		if (this.data.total > this.data.page) {
			this.setData({
				page: this.data.page + 1
			});
		} else {
			return false;
		}
		this.getList();
	}
})