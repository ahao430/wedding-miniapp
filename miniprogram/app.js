App({
  flag: false,
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
      } else { // 如果文件中 envlist 存在，提示要配置环境
        this.cloud = () => {
          throw new Error('当前小程序没有配置云开发环境，请在 envList.js 中配置你的云开发环境')
        }
      }
    }
  },
  /**
   * 封装的云函数调用方法
   * @param {*} obj 传入对象
   */
  async call (obj) {
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
			if (res.result.name === 'invite') {
				if (res.result.data !== false) { // 如果返回值不为false，则证明正常访问
					return res.result.data
				} else { // 否则
					wx.hideLoading()
					wx.showModal({ // 提示一下
						content: '函数服务没有支持该操作！',
						showCancel: false
					})
				}
			} else {
				// 不同模版的云函数服务均共享quickstartFunctions名字
				// 如果你访问部署多个时，会出现此问题，重新部署即可
				wx.hideLoading()
				wx.showModal({
					content: '云函数quickstartFunctions被其他模版覆盖，请更新上传西数后再次体验',
					showCancel: false
				})
			}
    } catch (e) { // 网络问题出现
      console.error('【云函数调用失败】', e.toString())
      wx.hideLoading()
      wx.showModal({
        content: '请上传cloudfunctions文件夹中的云函数，然后再次体验', // 此提示可以在正式时改为 "网络服务异常，请确认网络重新尝试！"
        showCancel: false
      })
    }
  }
})
