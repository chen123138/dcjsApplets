var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 默认值
        date: util.formatDate(new Date()),
        index: 0,
        // 数据项
        cates: [
            { lable: '任务', value: '1', checked: 'true' },
            { lable: '零星', value: '2' },
        ],
        projects: [],
        project: 0,
        users: "",
        user_ids: [],
        products: [],
        product: 0,
        product_ids: [],
        // 
        task: {
            cate:"1"
        },
        currentData: 0
    },

    //获取当前滑块的index
    bindchange: function (e) {
        console.log('标签滑块，携带value值为：', e.detail.current)
        const that = this;
        that.setData({
            currentData: e.detail.current
        })
    },
    
    //点击切换，滑块index赋值
    checkCurrent: function (e) {
        console.log('滑块标签，携带value值为：', e.target.dataset.current)        
        const that = this;
        if (that.data.currentData === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentData: e.target.dataset.current
            })
        }
    },

    /**新增*/
    addNewWorker: function(e) {
        console.log('新增标签，携带value值为：', e.detail.value)
        let index = this.data.index
        let value = e.detail.value
        let task = this.data.task
        if (value == 0) return false
        // 
        let products = this.data.products
        let product = products[value]
        let that = this
        util.post(api.ProductStock, "100", { "product_id": product[0] }).then(res => {
            if (res) {
                let stock = res.stock
                let uom = res.uom
                if (!stock) {
                    util.showText('数量溢出，实际库存为' + stock + uom + '，请重试')
                    return false
                } else {
                    that.getGuideList(res.system_id);
                    let product_ids = {                        
                        uom: uom,
                        stock: stock,
                        product: product[1],
                        number: 0,
                        guide_id: 0,
                        uom_id: res.uom_id,                        
                        project_id: task.project_id,
                        project_product_id: product[0]
                    }
                    that.setData({
                        index: index+1,
                        product_ids: this.data.product_ids.concat(product_ids)
                    });                    
                }
            } else {
                util.showError('服务异常')
            }
        });
    },

    /****删除*/
    deleteWorker: function(e) {
        let that = this
        let index = e.target.dataset.index //数组下标
        let arrayLength = that.data.product_ids.length //数组长度
        let newArray = []
        if (arrayLength > 1) {
            // 数组长度>1 才能删除
            for (let i = 0; i < arrayLength; i++) {
                if (i !== index) {
                    newArray.push(that.data.product_ids[i])
                }else{
                    console.log(that.data.product_ids[i])
                }
            }
            that.setData({
                product_ids: newArray
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '必须保留一个内容',
            })
        }
    },

    // 获取输入框信息
    bindInputChange: function(e) {
        let tag = e.target.dataset.tag;
        let value = e.detail.value;
        if (value==0) return false
        let task=this.data.task
        task[tag] = value
        this.setData({
            task: task
        });
    },
    bindInputGroupChange: function(e) {
        let tag = e.target.dataset.tag;
        let index = e.target.dataset.index;
        let value = e.detail.value;
        let product_ids=this.data.product_ids
        if (value==0) return false; 
        if (tag == "number") {
            value = parseFloat(value)            
            if (this.data.task.cate === '1'){
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
    onLoad: function(options) {
        console.log('onLoad');
        this.init()
    },
    // 
    init: function(){
        let task = {}
        task['cate'] = '1'
        this.setData({
            task: task
        });
        this.getProjectList()
    },
    // 项目
    getProjectList: function() {
        let params = []
        let that = this;
        util.rpcName(1006, api.EngineerProject, params).then(function(res) {
            var re = [
                [0, "请选择"]
            ]
            console.log(re.concat(res))
            that.setData({
                projects: re.concat(res)
            });
        });
    },
    // 材料
    getProductList: function() {
        let params = ["", [
            ['stock', '>', 0],
            ['project_id', '=', this.data.task.project_id]
        ]]
        let that = this;
        util.rpcName(1006, api.EngineerProduct, params).then(function(res) {
            let re = [
                [0, "请选择"]
            ];
            that.setData({
                products: re.concat(res)
            });
        });
    },
    // 指导
    getGuideList: function(system_id) {
        let params = [];
        let that = this;
        util.rpcName(1006, api.EngineerGuide, params).then(function(res) {
            let re = [
                [0, "请选择"]
            ];
            that.setData({
                guides: re.concat(res)
            });
        });
    },
    // 类别
    bindRadioChange: function (e) {
        let task = {}
        let uom = ''
        task['cate'] = e.detail.value
        if(task['cate']=='2'){
            uom = '小时'
            task['uom_id'] = 6
        }
        this.setData({
            uom: uom,
            task: task
        });
    },
    // 基础
    bindPickerChange(e){
        let tag = e.target.dataset.tag
        let value = e.detail.value
        if (value == 0) return false
        console.log(tag+'选项改变，携带值为', value)
        let task = this.data.task
        switch (tag) {
            case "project":
                this.setData({
                    project: value
                });
                task['project_id'] = this.data.projects[value][0];
                // 重置
                this.setData({
                    users:'',
                    user_ids:[],
                    product_ids: []
                });
                this.getProductList()
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
    // 组模式
    bindPickerGroupChange(e){
        let tag = e.target.dataset.tag
        let index = e.target.dataset.index
        let value = e.detail.value
        if (value == 0) return false
        console.log(tag+'选项改变，携带值为', value)
        switch (tag) {
            case "guide":
                let guide = this.data.guides[value]
                let product_ids = this.data.product_ids
                product_ids[index]['guide'] = guide[1]
                product_ids[index]['guide_id'] = guide[0]
                this.setData({
                    product_ids: product_ids
                });
                break;
        }
    },
    bindUsersTap(e) {
        // 人员选择 + e.currentTarget.dataset.id
        let project_id = this.data.task.project_id
        if (project_id){
            wx.navigateTo({
                url: './select/user?id='+project_id
            });
        }else{
            util.showText('请选择项目')
            return false
        }
    },
    formSubmit(e) {
        let task = this.data.task
        let user_ids = this.data.user_ids
        let product_ids = this.data.product_ids
        console.log(task,user_ids)
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
                    delete tmp['uom']
                    delete tmp['guide']
                    delete tmp['stock']
                    delete tmp['product']
                    // console.log(tmp)
                    worker_ids[index] = [0, "virtual_2" + index, tmp]
                }
                task['project_task_product_ids']=worker_ids
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
        // 
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
                    url: '../info/index?id=' + res
                })
            }, 500);
        });
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