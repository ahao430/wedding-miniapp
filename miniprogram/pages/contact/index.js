import { wife_address, husband_address } from "../../constants.js"

const app = getApp() // 全局APP

Page({
  data: {
    address: husband_address,
  },

  onLoad () {

  },
  onShow () {
  },

  handleGoMap () {
    const {address} = this.data
    wx.openLocation({
      latitude: address.point[0],
      longitude: address.point[1],
      name: address.local
    })
  },

  onShareAppMessage: app.onShareAppMessage,
  onShareTimeline: app.onShareTimeline,
})
