const app = getApp()
const api = require('api.js')


function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

function formatDay(date) {
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, id, params = {}, method = "GET") {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            dataType: "json",
            data: {
                "id": id,
                "method": "call",
                "params": params
            },
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-Server-Session-Id': app.globalData.sid
            },
            success: function(res) {
                // 
                if (res.statusCode == 200) {
                    // 返回数据
                    let data = res.data
                    // 错误处理
                    if (data.hasOwnProperty("error")) {
                        // 提示信息             
                        let error = data.error
                        // 未登录
                        if (error.code == 100) {
                            // 需要登录
                            console.log('Session Login OR Expired' + data.error.code)
                            // 移除缓存
                            wx.clearStorageSync()
                            return _appLogin().then(res => {
                                // 再次请求
                                setTimeout(function () {
                                    // console.log(url, id, params, method)
                                    request(url, id, params, method)
                                }, 5000);
                                resolve(true)
                            });
                        } else {
                            showText(error.data.message)
                        }
                    } else {
                        resolve(data.result);
                    }
                } else {
                    reject(res.errMsg);
                    showError('服务异常')
                }
            },
            fail: function(err) {
                reject(err)
                showError("网络异常")
            }
        })
    });
}

function post(url, id, params = {}) {
    return request(url, id, params, 'POST')
}

function rpcList(id, model, domain = [], fields = [], limit = 0, sort = '') {
    let params = {
        "model": model,
        "domain": domain,
        "fields": fields,
        "limit": limit,
        "sort": sort
    }
    return post(api.DataList, id, params)
}

function getContext() {
    return {
        "lang": "zh_CN",
        "tz": "Asia/Shanghai",
        "uid": app.globalData.uid,
        "allowed_company_ids": [1]
    }
}

function rpcRead(id, model, domain = [], fields = []) {
    let context = getContext()
    let params = {
        "args": [
            domain, fields
        ],
        "model": model,
        "method": "read",
        "kwargs": {
            "context": context
        }
    }
    // 
    let url = api.DataRead.replace('%s', model);
    return post(url, id, params)
}

function rpcName(id, model, domain = []) {
    let context = getContext()
    let params = {
        "args": domain,
        "model": model,
        "method": "name_search",
        "kwargs": {
            //"args": [],
            "context": context
        }
    }
    let url = api.DataName.replace('%s', model)    
    return post(url, id, params)
}

function rpcCreate(id, model, data = [], context2 = {}) {
    let context1 = getContext()
    let context = Object.assign(context1, context2)
    let params = {
        "args": data,
        "model": model,
        "method": "create",
        "kwargs": {
            "context": context
        }
    }
    // console.log(params)
    let url = api.DataCreate.replace('%s', model);
    return post(url, id, params)
}

function rpcWrite(id, model, domain = [], data = []) {
    let context = getContext()
    let params = {
        "args": [
            domain, data
        ],
        "model": model,
        "method": "write",
        "kwargs": {
            "context": context
        }
    } 
    let url = api.DataWrite.replace('%s', model);
    return post(url, id, params)
}

/**
 * 检查微信会话是否过期
 */
function _checkWxSession() {
    return new Promise(function(resolve, reject) {
        console.log(app.globalData.env)
        if (app.globalData.env == "wxwork") {
            wx.qy.checkSession({
                success: function () {
                    resolve(true);
                },
                fail: function () {
                    reject(false);
                }
            })
        } else {
            wx.checkSession({
                success: function () {
                    resolve(true);
                },
                fail: function () {
                    reject(false);
                }
            })
        }
    });
}

/**
 * 调用微信登录
 */
function _wxLogin() {
    return new Promise(function(resolve, reject) {
        console.log(app.globalData.env)
        if (app.globalData.env == "wxwork") {
            wx.qy.login({
                success: function (res) {
                    if (res.code) {
                        resolve(res.code);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                }
            });
        }else{
            wx.login({
                success: function (res) {
                    if (res.code) {
                        resolve(res.code);
                    } else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                }
            });
        }
    });
}

// 授权用户
function authorize() {
    return new Promise(function(resolve, reject) {
        // 
        let key = app.globalData.key;
        let uid = app.globalData.uid;
        if (key && uid) {
            console.log('Session Cache Key:' + key);
            // 1.检查微信服务器登陆状态
            return _checkWxSession().then(() => {
                console.log('Wechat Session OK');
                resolve(true)
            }).catch((res) => {
                console.log('Wechat Session Expire');
                return _appLogin().then(res => {
                    resolve(true)
                });
            })
        } else {
            console.log('Session Cache Key: Null');
            return _appLogin().then(res => {
                resolve(true)
            });
        }
    });
}

/**
 * 应用登陆
 */
function _appLogin() {
    return new Promise((resolve, reject) => {
        // 1.先登录微信服务器
        return _wxLogin().then((code) => {
            // 2.再登录应用服务器
            console.log(app.globalData.env =='wxwork')
            let url = ""
            if (app.globalData.env == "wxwork") {
                url = api.AuthCorp
            }else{
                url = api.Auth
            }
            return post(url, "100", {
                "code": code
            }).then(res => {
                // 更新Cache
                wx.setStorageSync('uid', res.uid);
                wx.setStorageSync('sid', res.sid);
                wx.setStorageSync('key', res.key);
                wx.setStorageSync('role', res.role);
                wx.setStorageSync('identity', res.identity);
                // 更新APP
                app.globalData.uid = res.uid
                app.globalData.sid = res.sid
                app.globalData.key = res.key
                app.globalData.role = res.role
                app.globalData.identity = res.identity
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
            // 
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * 获取微信用户信息
 */
function getUserInfo() {
    return new Promise(function(resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
                if (res.errMsg === 'getUserInfo:ok') {
                    resolve(res);
                } else {
                    reject(res)
                }
            },
            fail: function(err) {
                reject(err);
            }
        })
    });
}

/**
 * 错误提示
 */
function showError(msg) {
    wx.showToast({
        title: msg,
        image: '/images/icon_error.png'
    })
}

function showText(content) {
    wx.showModal({
        // title: '输入警告',
        content: content,
        showCancel: false,
        confirmText: '确定'
    })
}

/**
 * 导入模块
 */
module.exports = {
    formatTime,
    formatDate,
    formatDay,
    showError,
    showText,
    getUserInfo,
    authorize,
    post,
    rpcList,
    rpcRead,
    rpcCreate,
    rpcWrite,
    rpcName
}