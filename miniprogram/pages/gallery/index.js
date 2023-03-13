import data from './data'


const app = getApp() // 全局APP

Page({
  data: {
    bg: '',
    images: data.images,
    group: {},
    showGallery: false,
  },

  onShow () {
    const bg = app.randomPick(data.bgs)
    this.setData({
      bg,
    })
  },

  handleClickGroup (e) {
    const {index} = e.currentTarget.dataset
    const group = this.data.images[index]
    this.setData({
      group: group,
      showGallery: true,
    })
  },
  handleCloseGroup () {
    this.setData({
      group: {},
      showGallery: false,
    })
  },

  handlePreview (e) {
    const {index} = e.currentTarget.dataset
    const group = this.data.group
    const url = app.img(group.path, group.children[index])
    const urls = group.children.map(item => {
      return app.img(group.path, item)
    })
    wx.previewImage({
      urls: urls,
      current: url,
    })
  },

  onShareAppMessage: app.onShareAppMessage,
  onShareTimeline: app.onShareTimeline,
})
