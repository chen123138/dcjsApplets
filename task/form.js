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
        index: 0,
        users: "",
        user_ids: [],
        products: [],
        product: 0,
        product_ids: [],
        // 
        task: {
            cate: "1"
        },
        // 请求所有材料合集
        list: [],
        guides: [],
        units: [],
        unit: 0
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
        console.log(this.data.task)
    },
    bindInputGroupChange: function (e) {
        let tag = e.target.dataset.tag;
        let index = e.target.dataset.index;
        let value = e.detail.value;
        let product_ids = this.data.product_ids
        if (value == 0) return false;
        if (tag == "number") {
            value = parseFloat(value)
            if (this.data.task.cate === '1') {
                let product = product_ids[index]
                let stock = product['stock']
                if (value > stock) {
                    util.showText('数量溢出，实际库存为' + stock + product['uom'] + '，请重试')
                    return false
                }
            }
        }
        product_ids[index][tag] = value
        this.setData({
            product_ids: product_ids
        });
    },

    // 监听页面加载
    onLoad: function (options) {
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
        let task = this.data.task
        task['project_id'] = project_id
        // 
        this.setData({
            project_name: project_name,
            task: task
        });
        console.log("task", this.data.task)
        // 获取材料列表
        this.getList(product_ids)
        // 获取文库列表
        this.getGuideList()
    },
    // 材料
    getList: function (ids) {
        // 
        let fields = ["project_id","name", "number", "project_system_id","brand", "type", "uom_id","stock"]
        let that = this;
        util.rpcRead(1000, api.EngineerProduct, ids, fields, 1000, '').then(function (res) {
            console.log("res", res)
            let product_ids = that.data.product_ids.concat(res)
            that.setData({
                product_ids: product_ids
            })
            wx.hideLoading();
        });
    },
    // 指导
    getGuideList: function () {
        let params = [];
        let that = this;
        util.rpcName(1006, api.EngineerGuide, params).then(function (res) {
            let re = [
                [0, "请选择"]
            ];
            that.setData({
                guides: re.concat(res)
            });
            // console.log("指导书列表:",that.data.guides)
        });
    },
    // 基础填充
    bindPickerChange(e) {
        let tag = e.target.dataset.tag
        let value = e.detail.value
        if (value == 0) return false
        // console.log(tag + '选项改变，携带值为', value)
        let task = this.data.task
        switch (tag) {
            case "start":
                task['stt_date'] = value
                break;
            case "stop":
                task['end_date'] = value
                break;
        }
        this.setData({
            task: task
        });
        // console.log('task改变', this.data.task)
    },
    // 材料组内选择
    bindPickerGroupChange(e) {
        let tag = e.target.dataset.tag
        console.log(tag)
        let index = e.target.dataset.index
        let value = e.detail.value
        if (value == 0) return false
        // console.log(tag + '选项改变，携带值为', value)
        switch (tag) {
            case "guide":
                let guide = this.data.guides[value]
                let product_ids = this.data.product_ids
                product_ids[index]['guide'] = guide[1]
                product_ids[index]['guide_id'] = guide[0]
                this.setData({
                    product_ids: product_ids
                });
                console.log(this.data.product_ids)
                break;
        }
        console.log(tag + '选项改变，携带值为', value)
    },
    // 选人员
    bindUsersTap(e) {
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
        console.log("task:",task)
        console.log("user_ids:",user_ids)
        console.log("product_ids:",product_ids)

        //
        if (!task.hasOwnProperty('project_id') || task['project_id'] == 0) {
            util.showText('请选择项目')
            return false;
        }
        if (user_ids.length==0) {
            util.showText('请指派成员')
            return false;
        }else{
            task['project_task_user_ids']=user_ids
        }
        if (!task.hasOwnProperty('stt_date') || !task.hasOwnProperty('end_date')) {
            util.showText('请选择时间')
            return false;
        }
        if (!task.hasOwnProperty('position') || task['position'] == "") {
            util.showText('请输入部位')
            return false;
        }
        if (task['cate'] == '1') {
            if (product_ids.length==0){
                util.showText('请添加内容')
                // return false;
            }
            else{
                let worker_ids = []
                for (let index in product_ids) {
                    let item = product_ids[index];
                    // console.log(item);
                    let tmp = {}
                    Object.assign(tmp, item);
                    tmp['project_id'] = tmp['project_id'][0]
                    tmp['uom_id'] = tmp['uom_id'][0]
                    tmp.project_product_id = tmp['id']
                    tmp['project_system_id'] = tmp['project_system_id'][0]
                    delete tmp['brand']
                    delete tmp['guide']
                    delete tmp['stock']
                    delete tmp['product']
                    delete tmp['product_id']
                    delete tmp['type']
                    worker_ids[index] = [0, "virtual_2" + index, tmp]
                }
                task['project_task_product_ids']=worker_ids
                console.log("task",task)
            }
        }
        if (task['cate'] == '2') {
            if (!task.hasOwnProperty('content')) {
                util.showText('请输入内容')
                return false;
            }
            if (!task.hasOwnProperty('number') || task['number'] == "") {
                util.showText('请输入数量')
                return false;
            }
        }
        
        console.log(task);
        wx.showLoading({
            title: '加载中...',
        });
        // let that = this;
        util.rpcCreate(1002, api.EngineerTask, [task]).then(function(res) {
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
    },

    
    // 选择材料数量
    bindBlur: function (e) {
        let product_ids = this.data.product_ids
        if (e.detail.value > product_ids[e.currentTarget.dataset.index].number) {
            util.showText('数量溢出，实际库存为' + product_ids[e.currentTarget.dataset.index].number + '，请重试')
        } else {
            product_ids[e.currentTarget.dataset.index].number = Number(e.detail.value)
            this.setData({
                product_ids: product_ids
            })
            console.log("改变数量", this.data.product_ids)
        }
    },
    
    // 取消按钮
    cancel: function (index) {
        console.log(index.currentTarget.dataset.index)
        var arr = this.data.product_ids
        arr.splice(index.currentTarget.dataset.index, 1)
        this.setData({
            product_ids: arr
        })
    },
})