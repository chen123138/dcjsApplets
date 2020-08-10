var app = getApp()
var api = require('../utils/api.js')
var util = require('../utils/util.js')

Page({
    data: {
        id: 0,
        uid: app.globalData.uid,
        detail: [],
        user_txt: '',
        user_ids: [],
        product: [],
        product_ids: [],
        //
        index: 0,
        currentData: 0,
        // 
        guide: [],
        divides: [],
        divide: 0,
        data: {}
    },
    onLoad: function (options) {
        this.setData({
            id: parseInt(options.id)
        });
        this.getDetail();
        wx.setNavigationBarTitle({
            title: '任务详情'
        })
    },
    getDetail: function () {
        wx.showLoading({
            title: '加载中...',
        });
        let that = this;
        util.rpcRead(1001, api.EngineerTask, [this.data.id], []).then(function (res) {
            if (res) {
                // 
                let info = res[0]
                that.setData({
                    detail: info
                })
                // console.log(info);
                if (info.project_task_user_ids.length > 0) {
                    util.rpcRead(1005, api.EngineerTaskUser, info.project_task_user_ids, []).then(function (res) {
                        that.setData({
                            user_ids: res
                        });
                        console.log(res)
                    });
                }
                if (info.project_task_product_ids.length > 0) {
                    util.rpcRead(1005, api.EngineerTaskProduct, info.project_task_product_ids, []).then(function (res) {
                        that.setData({
                            product: res
                        })
                    });
                }
                if (info.state > 2) {
                    let params = []
                    if (info.project_task_user_ids.length > 1) {
                        params = ["", [
                            ['id', '>', 1]
                        ]]
                    } else {
                        params = ["", [
                            ['id', '=', 1]
                        ]]
                    }
                    util.rpcName(1005, api.EngineerDivide, params).then(function (res) {
                        let re = [
                            [0, "请选择"]
                        ];
                        that.setData({
                            divides: re.concat(res)
                        });
                    });
                }
            }
            wx.hideLoading();
        });
    },
    getGuideInfo: function (e) {
        let id = e.target.dataset.id
        wx.navigateTo({
            url: '/guide/info?id=' + id
        });
    },
    // 数量
    bindInputChange: function (e) {
        let tag = e.target.dataset.tag
        let index = e.target.dataset.index
        let value = e.detail.value
        let cate = this.data.detail.cate
        let data = this.data.data
        console.log('获取tag：' + tag + index + '输入框信息：' + value)
        if (value == 0) return false
        if (tag == "number") {
            value = parseFloat(value);
            if (cate == "1") {
                let product = this.data.product[index]
                let that = this
                util.post(api.ProductStock, "100", {
                    "product_id": product['project_product_id'][0]
                }).then(res => {
                    if (res) {
                        let stock = res.stock
                        let uom = res.uom
                        if (value > stock) {
                            util.showText('数量溢出，实际库存为' + stock + uom + '，请重试')
                            return false
                        } else {
                            let product_ids = this.data.product_ids
                            product_ids[index] = [
                                1,
                                product['id'],
                                {
                                    'number': value
                                }
                            ];
                            data['project_task_product_ids'] = product_ids
                            that.setData({
                                data: data,
                                product_ids: product_ids,
                            });
                        }
                    } else {
                        util.showError('服务异常')
                    }
                });
            } else {
                data['number'] = value
                this.setData({
                    data: data
                });
            }
        }
        // 
    },
    // 基础
    bindPickerChange(e) {
        let tag = e.target.dataset.tag
        let value = e.detail.value
        let data = this.data.data
        if (value == 0) return false
        console.log(tag + '选项改变，携带值为', value)
        switch (tag) {
            case "divide":
                this.setData({
                    divide: value
                });
                data['divide'] = this.data.divides[value][0]
                break;
        }
        this.setData({
            data: data
        });
    },
    // 表单保存
    formSubmit(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        let value = e.detail.value
        let data = this.data.data
        let detail = this.data.detail
        if (detail.state == '1') {
            data['state'] = '2'
        }
        if (detail.state == '2') {
            if (!value.hasOwnProperty('logs') || value.logs == '') {
                util.showText('请填报施工日志')
                return false
            }
            data['logs'] = value.logs
            data['state'] = '3'
        }
        if (detail.state == '3') {
            if (!data.hasOwnProperty('divide') || data.divide == 0) {
                util.showText('请选择考核规则')
                return false
            }
            data['state'] = '4'
        }
        // console.log(data)
        util.rpcWrite(1002, api.EngineerTask, [this.data.id], data).then(function (res) {
            wx.showToast({
                title: '提交成功'
            });
            setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
            }, 500);
        });
    },
    bindCancel(e) {
        let detail = this.data.detail
        console.log(detail)
        // 待确认、待自检模式下
        if (detail.state == '1' || detail.state == '2') {
            util.rpcWrite(1002, api.EngineerTask, [this.data.id], {
                'state': '-1'
            }).then(function (res) {
                wx.showToast({
                    title: '取消成功'
                });
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 1,
                      })
                }, 500);
            });
        } else {
            util.showText('当前状态，不可取消');
        }
    },
})