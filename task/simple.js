var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 默认值
        now_date: util.formatDate(new Date()),
        projects: [],
        project: 0,
        units: [],
        unit: 0,
        users: "",
        user_ids: [],
        // 
        task: {
            cate: "2",
            uom_id: 6
        }
    },
    // 获取输入框信息
    bindInputChange: function (e) {
        let tag = e.target.dataset.tag;
        let value = e.detail.value;
        if (value == 0) return false
        let task = this.data.task
        task[tag] = value
        this.setData({
            task: task
        });
    },
    // 监听页面加载
    onLoad: function (options) {
        console.log('onLoad');
        this.getProjectList();
    },
    // 项目列表
    getProjectList: function () {
        let params = []
        let that = this;
        util.rpcName(1006, api.EngineerProject, params).then(function (res) {
            var re = [
                [0, "请选择"]
            ]
            that.setData({
                projects: re.concat(res)
            });
        });
    },
    // 单位工程
    getProjectUnit: function () {
        let params = ["", [
            ['project_id', '=', this.data.task.project_id]
        ]]
        let that = this;
        util.rpcName(1006, api.EngineerUnit, params).then(function (res) {
            let re = [
                [0, "请选择"]
            ];
            that.setData({
                units: re.concat(res)
            });
        });
    },
    // 基础
    bindPickerChange(e) {
        let tag = e.target.dataset.tag
        let value = e.detail.value
        if (value == 0) return false
        console.log(tag + '选项改变，携带值为', value)
        let task = this.data.task
        switch (tag) {
            case "project":
                this.setData({
                    project: value
                });
                task['project_id'] = this.data.projects[value][0];
                // 重置人员信息
                this.setData({
                    users: '',
                    user_ids: []
                });
                // 加载单位工程
                this.getProjectUnit()
                break;
            case "unit":
                this.setData({
                    unit: value
                });
                task['project_unit_id'] = this.data.units[value][0];
                break;
            case "start":
                task['stt_date'] = value
                break;
            case "stop":
                task['end_date'] = value
                break;
        }
        // 
        this.setData({
            task: task
        });
    },
    bindUsersTap(e) {
        // 人员选择 + e.currentTarget.dataset.id
        let project_id = this.data.task.project_id
        if (project_id) {
            wx.navigateTo({
                url: '/select/user?project_id=' + project_id
            });
        } else {
            util.showText('请选择项目')
            return false
        }
    },
    formSubmit(e) {
        let task = this.data.task
        let user_ids = this.data.user_ids
        let product_ids = this.data.product_ids
        console.log(task, user_ids)
        //
        if (!task.hasOwnProperty('project_id') || task['project_id'] == 0) {
            util.showText('请选择项目')
            return false;
        }
        if (user_ids.length == 0) {
            util.showText('请指派人员')
            return false;
        } else {
            task['project_task_user_ids'] = user_ids
        }
        if (!task.hasOwnProperty('stt_date') || !task.hasOwnProperty('end_date')) {
            util.showText('请选择时间')
            return false;
        }
        if (!task.hasOwnProperty('position') || task['position'] == "") {
            util.showText('请输入部位')
            return false;
        }
        if (!task.hasOwnProperty('content')) {
            util.showText('请输入内容')
            return false;
        }
        if (!task.hasOwnProperty('number') || task['number'] == "") {
            util.showText('请输入数量')
            return false;
        }
        // 
        console.log(task);
        wx.showLoading({
            title: '加载中...',
        });
        // let that = this;
        util.rpcCreate(1002, api.EngineerTask, [task]).then(function (res) {
            wx.hideLoading();
            wx.showToast({
                title: '提交成功'
            });
            // that.init();
            setTimeout(function () {
                wx.redirectTo({
                    url: './list'
                })
            }, 500);
        });
    }
})