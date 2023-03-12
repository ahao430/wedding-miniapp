const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data: {
    spage: 0, // 切换页面开始，勿改
    epage: 0, // 切换页面结束，勿改
    len: 5,
  },

  onLoad () {
    that = this
    this.init() // 初始化
  },
  onUnload () {
    this.clearTimer()
  },

  async init () {
    this.startTimer()
  },
  async startTimer () {
    this.clearTimer()
    this.timer = setTimeout(() => {
      let { epage, len } = that.data // 获取data中的结束页
      const spage = that.data.epage // 将结束页传给开始页，要从这里动作
      if (epage < len - 1) epage++ // 在结束页小于4时加1，因为一共就4页
     
      if (spage !== epage) { // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({ // 更新存储
          spage: spage,
          epage: epage
        })
        that.startTimer()
      }
    }, 5000)
  },
  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },

  movepage (e) {
    this.clearTimer()
    const { clientY } = e.changedTouches[0] // 获取触摸点Y轴位置
    if (e.type === 'touchstart') { // 如果是触摸开始
      that.startmove = clientY // 记录一下开始点
    }
    if (e.type === 'touchend') { // 如果是触摸结束
      let { epage, len } = that.data // 获取data中的结束页
      const spage = that.data.epage // 将结束页传给开始页，要从这里动作
      if (that.startmove > clientY) { // 如果触摸点比初次高
        if (epage < len - 1) epage++ // 在结束页小于4时加1，因为一共就4页
      } else if (that.startmove < clientY) { // 如果触摸点比初次低
        if (epage > 0) epage-- // 在结束页大于0时减1
      }
      if (spage !== epage) { // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({ // 更新存储
          spage: spage,
          epage: epage
        })
        // that.startTimer()
      }
    }
  },

  handleGoGallery () {
    wx.switchTab({
      url: '/pages/gallery/index'
    })
  },

  handleGoMap (e) {
    const {target} = e.currentTarget.dataset
    wx.switchTab({
      url: `/pages/contact/index?target=${target}`
    })
  },

  handleLeaveMessage () {
    wx.switchTab({
      url: `/pages/message/index`
    })
  },
})
