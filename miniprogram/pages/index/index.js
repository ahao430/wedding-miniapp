const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data: {
    spage: 0, // 切换页面开始，勿改
    epage: 0, // 切换页面结束，勿改
    status: 0, // 报名状态
    form: {}, // 报名信息填写
    info: {
      start: {
        title: '云开发峰会', // 活动名称
        local: '中国·北京', // 地点
        time: '11/29', // 时间
        hold: '小程序·云开发' // 下方的举办方
      },
      invite: {
        title: '尊敬的开发者：', // 邀请对象
        text: '一年一度的小程序云开发技术峰会即将于2020年11月29日在北京隆重举行。回顾这一年，云开发继续深化丰富基础能力，提供高可用、自动弹性扩缩的后端云服务，包含计算、存储、托管等 serverless 化能力，为广大小程序开发者切实降低开发门槛与实现成本，并且新增支持环境共享、公众号云开发、静态网站、云托管、微信支付等多项重磅新能力。特邀请你参与此次峰会，共同探讨云开发的发展策略，共同进步！'
      },
      meeting: [{ // 会议流程
        time: '9:00-9:30',
        text: '嘉宾入场签到'
      }, {
        time: '9:30-9:50',
        text: '云赋能，新开发'
      }, {
        time: '9:50-10:10',
        text: '云时代前端开发的边界拓展'
      }, {
        time: '10:10-10:30',
        text: '茶歇'
      }, {
        time: '10:30-10:50',
        text: '重新定义开发'
      }, {
        time: '10:50-11:10',
        text: '不止小程序，云开发的多场景应用'
      }, {
        time: '11:10-11:30',
        text: '合影留念'
      }],
      address: {
        point: [39.927015684602196, 116.46096798904512], // 地图展示的中心点
        marker: { // 地图当前标记点
          id: 0, // 标记点ID，不用变更
          latitude: 39.927015684602196, // 标记点所在纬度
          longitude: 116.46096798904512, // 标记点所在经度
          iconPath: '../../images/show.png', // 标记点图标，png或jpg类型
          width: '40', // 标记点图标宽度
          height: '48' // 标记点图标高度
        },
        local: '北京市康莱德酒店三层宴会厅', // 地址
        time: '2020年11月29日', // 举办时间
        tel: '020 6624 9042' // 联系电话
      },
      review: { // 审核信息
        2: { // 报名成功信息
          image: '../../images/success.svg',
          title: '报名成功',
          des: '云开发发布会期待您的到来'
        },
        1: { // 审核中信息
          image: '../../images/review.svg',
          title: '审核中',
          des: '报名信息正在审核中'
        }
      },
      form: { // 报名填写项
        name: {
          name: '姓名',
          place: '请填写您的姓名'
        },
        tel: {
          name: '手机',
          place: '请填写您的手机号码'
        },
        people: {
          name: '参与人数',
          place: '请填写参会人数'
        },
        retext: {
          name: '备注',
          place: '请填写备注'
        }
      }
    }
  },
  /**
   * 页面加载
   */
  onLoad () {
    that = this
    this.init() // 初始化
  },
  /**
   * 初始化加载信息
   */
  async init () {
    const result = await app.call({ name: 'get' }) // 调用云函数，获取当前用户报名状态
    that.setData({
      status: result // 将状态存入data，0-未报名，1-审核中，2-报名成功
    })
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
  /**
   * 更新输入框输入值
   * @param {*} e 页面信息
   */
  oninput (e) {
    const key = `form.${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
    that.setData({ // 更改对应路径为输入信息
      [key]: e.detail.value
    })
  },
  /**
   * 提交报名
   */
  async submit () {
    let flag = true // 先设置flag为true，用于检查
    const check = that.data.info.form // 取出form原始结构
    const form = that.data.form // 取出输入的
    for (const i in check) { // 对原始结构进行循环
      if (form[i] == null || form[i] === '') { // 如果原始需要填写的没有写
        wx.showModal({ // 提示要补充
          content: `${check[i].name}未填写，请补充！`,
          showCancel: false
        })
        flag = false // 设置false，跳过提交环节
        break // 退出for循环
      }
    }
    if (flag === true) { // 如果flag=true，证明验证通过
      wx.showLoading({ // 显示加载中
        title: '提交中',
        mask: true
      })
      await app.call({ // 发起云函数，提交信息
        name: 'add',
        data: form
      })
      await that.init() // 更新信息
      wx.hideLoading() // 隐藏加载中
    }
  }
})
