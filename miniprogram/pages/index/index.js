const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data: {
    spage: 0, // 切换页面开始，勿改
    epage: 0, // 切换页面结束，勿改
  },

  onLoad () {
    that = this
    this.init() // 初始化
  },

  async init () {

  },
  /**
   * 覆盖全局的上下页切换，用于地图和表单组件中，禁用全局上下翻页
   * @param {*} e 页面信息
   */
  changeno (e) {
    if (e.type === 'begin' || e.type === 'touchstart') { // 如果触发状态为触摸开始，或者地图移动开始
      that.no = true // 设置不干预变量为true
    } else if (e.type === 'end' || e.type === 'touchend') { // 如果触发状态未触摸结束，或地图移动结束
      setTimeout(function () { // 延迟100ms设置，防止低端机型的线程强占
        that.no = false // 设置不干预变量为false
      }, 100)
    }
  },
  /**
   * 上下翻页
   * @param {*} e 页面信息
   */
  movepage (e) {
    if (that.no === true) return // 如果不干预变量为true，说明禁用翻页
    const { clientY } = e.changedTouches[0] // 获取触摸点Y轴位置
    if (e.type === 'touchstart') { // 如果是触摸开始
      that.startmove = clientY // 记录一下开始点
    }
    if (e.type === 'touchend') { // 如果是触摸结束
      let { epage } = that.data // 获取data中的结束页
      const spage = that.data.epage // 将结束页传给开始页，要从这里动作
      if (that.startmove > clientY) { // 如果触摸点比初次高
        if (epage < 4) epage++ // 在结束页小于4时加1，因为一共就4页
      } else if (that.startmove < clientY) { // 如果触摸点比初次低
        if (epage > 0) epage-- // 在结束页大于0时减1
      }
      if (spage !== epage) { // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({ // 更新存储
          spage: spage,
          epage: epage
        })
      }
    }
  },
})
