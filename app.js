App({
    onLaunch: function() {
        if (this.globalData.env==null){
            const res = wx.getSystemInfoSync()
            this.globalData.env = res.environment
        }
        if(this.globalData.uid==null){
            this.globalData.uid = wx.getStorageSync('uid');
            this.globalData.sid = wx.getStorageSync('sid');
            this.globalData.key = wx.getStorageSync('key');
            this.globalData.role = wx.getStorageSync('role');
        }
    },
    globalData: {
        env: null,
        uid: null,
        sid: null,
        key: null,
        user: null,
        role: null
    },
})