const app = getApp() // 全局APP

Page({
  data: {
    list: [],
    message: '',
    loading: false,
    nickname: '',
  },

  onShow () {
    this.init() 
  },

  async init () {
    const result = await app.call({ name: 'getlist' })
    const nickname = this.data.nickname || wx.getStorageSync('nickname') || ''

    this.setData({
      list: result || [],
      nickname,
    })

    wx.pageScrollTo({
      selector: '#bottom'
    })
  },


  oninput (e) {
    this.setData({ // 更改对应路径为输入信息
      message: e.detail.value
    })
  },

  oninputname(e) {
    const nickname = e.detail.value 
    this.setData({
      nickname,
    })
    wx.setStorageSync('nickname', nickname)
  },
  async handleAddMessage () {
    if (!this.data.nickname) {
      app.toast('请输入姓名')
      return false
    }
    if (!this.data.message) {
      app.toast('请填写内容')
      return false
    }

    this.setData({
      loading: true
    })
    wx.showLoading({ // 显示加载中
      title: '留言中',
      mask: true
    })
    await app.call({ // 发起云函数，提交信息
      name: 'add',
      data: {
        text: this.data.message,
        time: Date.now(),
        nickname: this.data.nickname,
      }
    })
    await this.init() // 更新信息
    wx.hideLoading() // 隐藏加载中
    this.setData({
      loading: false,
      message: '',
    })
  }
})
