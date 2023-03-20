import {imgPath} from './constants'

App({
  flag: false,
  config: null,
  globalData: {
    imgPath,
  },
  audio: null,

  async onLaunch (e) {
    this.initcloud()
  },

  /**
   * 初始化云开发环境（支持环境共享和正常两种模式）
   */
  async initcloud () {
    const shareinfo = wx.getExtConfigSync() // 检查 ext 配置文件
    const normalinfo = require('./envList.js').envList || [] // 读取 envlist 文件
    if (shareinfo.envid != null) { // 如果 ext 配置文件存在，环境共享模式
      this.c1 = new wx.cloud.Cloud({ // 声明 cloud 实例
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid
      })
      // 装载云函数操作对象返回方法
      this.cloud = async function () {
        if (this.flag !== true) { // 如果第一次使用返回方法，还没初始化
          await this.c1.init() // 初始化一下
          this.flag = true // 设置为已经初始化
        }
        return this.c1 // 返回 cloud 对象
      }
      this.afterInit()
    } else { // 如果 ext 配置文件存在，正常云开发模式
      if (normalinfo.length !== 0 && normalinfo[0].envId != null) { // 如果文件中 envlist 存在
        wx.cloud.init({ // 初始化云开发环境
          traceUser: true,
          env: normalinfo[0].envId
        })
        // 装载云函数操作对象返回方法
        this.cloud = () => {
          return wx.cloud // 直接返回 wx.cloud
        }
        this.afterInit()
      } else { // 如果文件中 envlist 存在，提示要配置环境
        this.cloud = () => {
          throw new Error('当前小程序没有配置云开发环境，请在 envList.js 中配置你的云开发环境')
        }
        this.afterInit()
      }
    }
  },
  afterInit () {
    this.getConfig()
  },
  async getConfig () {
    if (this.config) {
      return this.config
    } else {
      const res = await this.call({ // 发起云函数，提交信息
        name: 'getConfig',
      })
      this.config = res || {}
      return this.config
    }
  },
  /**
   * 封装的云函数调用方法
   * @param {*} obj 传入对象
   */
  async call (obj) {
    console.log('【发起云函数调用】', obj)
    try {
      const cloud = await this.cloud()
      const res = await cloud.callFunction({ // 调用云函数
        name: 'quickstartFunctions', // 应用唯一的服务函数
        data: {
          type: obj.name, // 传入name为type
          data: obj.data // 传入data为data
        }
      })
			console.log('【云函数调用成功】', res)
      return res.result.data
    } catch (e) { // 网络问题出现
      console.error('【云函数调用失败】', e.toString())
      wx.hideLoading()
      wx.showModal({
        content: '请上传cloudfunctions文件夹中的云函数，然后再次体验', // 此提示可以在正式时改为 "网络服务异常，请确认网络重新尝试！"
        showCancel: false
      })
    }
  },

  toast (text) {
    wx.showToast({
      icon: 'none',
      title: text,
    })
  },

  img (path, name) {
    if (name && path) {
      return imgPath + path + '/' + name
    } else if (path) {
      return imgPath + path
    } else {
      return ''
    }
  },

  randomPick (arr = []) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
  },

  request (option = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...option,
        success: resolve,
        fail: reject,
      })
    })
  },

  sleep (time = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  },

  onShareAppMessage () {
    return {
      title: '王昊和吴凤媛的婚礼',
      path: 'pages/index/index',
      // imageUrl: '',
    }
  },
  onShareTimeline () {
    return {
      title: '王昊和吴凤媛的婚礼',
      query: '',
      // imageUrl: '',
    }
  },

  formatDate (date, format='yyyy-MM-dd hh:mm:ss') {
    if (typeof date === 'string' || typeof date === 'number') {
      date = new Date(date)
    }
    const map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分钟
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, (all, t) => {
      let v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = `0${v}`.slice(-2);
        }
        return v;
      } else if (t === 'y') {
        return (`${date.getFullYear()}`).substr(4 - all.length);
      }
      return all;
    });
    return format;
  }
})
