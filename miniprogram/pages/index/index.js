import {wife_address, husband_address} from '../../constants';

const app = getApp(); // 全局APP

Page({
  data: {
    spage: 0, // 切换页面开始，勿改
    epage: 0, // 切换页面结束，勿改
    len: 0,
    husband_address,
    pictures: [
      {
        bg: true,
        wait: 3000,
        children: [
          {
            src: 'chinese/8.jpg',
            mode: 'aspectFill',
            class: 'left-in',
            style: '',
          },
        ],
      },
      {
        bg: false,
        wait: 3000,
        children: [
          {
            src: 'chinese/11.jpg',
            mode: 'aspectFill',
            class: 'right-in',
            style: '',
          },
        ],
      },
      {
        bg: false,
        children: [
          {
            src: 'chinese/7.jpg',
            mode: 'aspectFill',
            class: 'fade-in delay-1s',
            style: '',
          },
        ],
      },
      {
        bg: true,
        children: [
          {
            src: 'west/11.jpg',
            mode: 'aspectFill',
            class: 'left-in',
            style: '',
          },
        ],
      },
      {
        bg: false,
        children: [
          {
            src: 'west/13.jpg',
            mode: 'aspectFill',
            class: 'right-in',
            style: '',
          },
        ],
      },
      {
        bg: false,
        children: [
          {
            src: 'west/18.jpg',
            mode: 'aspectFill',
            class: 'fade-in delay-1s',
            style: '',
          },
        ],
      },
      {
        bg: false,
        children: [
          {
            src: 'west/35.jpg',
            mode: 'aspectFill',
            class: 'scale-in',
            style: '',
          },
        ],
      },
      {
        bg: false,
        children: [
          {
            src: 'minguo/12.jpg',
            mode: 'aspectFill',
            class: 'fade-in',
            style: '',
          },
        ],
      },
      {
        bg: true,
        children: [
          {src: 'hk/14.jpg', mode: 'aspectFill', class: 'fade-in', style: ''},
        ],
      },
      {
        bg: false,
        children: [
          {src: 'hk/13.jpg', mode: 'aspectFill', class: 'fade-in', style: ''},
        ],
      },
      {
        bg: false,
        children: [
          {src: 'hk/10.jpg', mode: 'aspectFill', class: 'fade-in', style: ''},
        ],
      },
    ],
  },

  onLoad() {
    this.init(); // 初始化
  },
  onUnload() {
    this.clearTimer();
  },

  async init() {
    this.setData({
      len: this.data.pictures.length + 3,
    });
    this.startTimer();
  },
  async startTimer() {
    let that = this;
    let wait = 6000;
    this.clearTimer();
    let {epage, len, pictures} = that.data;
    if (epage === 0) {
      wait = 8000;
    } else if (epage === len - 2) {
      wait = 8000;
    } else if (epage === len - 1) {
      wait = 8000;
    } else {
      wait = pictures[epage - 1].wait || 5000;
    }

    this.timer = setTimeout(() => {
      let {epage, len} = that.data; // 获取data中的结束页
      const spage = that.data.epage; // 将结束页传给开始页，要从这里动作
      if (epage < len - 1) epage++; // 在结束页小于4时加1，因为一共就4页

      if (spage !== epage) {
        // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({
          // 更新存储
          spage: spage,
          epage: epage,
        });
        that.startTimer();
      }
    }, wait);
  },
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  movepage(e) {
    let that = this;
    this.clearTimer();
    const {clientY} = e.changedTouches[0]; // 获取触摸点Y轴位置
    if (e.type === 'touchstart') {
      // 如果是触摸开始
      that.startmove = clientY; // 记录一下开始点
    }
    if (e.type === 'touchend') {
      // 如果是触摸结束
      let {epage, len} = that.data; // 获取data中的结束页
      const spage = that.data.epage; // 将结束页传给开始页，要从这里动作
      if (that.startmove > clientY) {
        // 如果触摸点比初次高
        if (epage < len - 1) epage++; // 在结束页小于4时加1，因为一共就4页
      } else if (that.startmove < clientY) {
        // 如果触摸点比初次低
        if (epage > 0) epage--; // 在结束页大于0时减1
      }
      if (spage !== epage) {
        // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({
          // 更新存储
          spage: spage,
          epage: epage,
        });
        that.startTimer()
      }
    }
  },

  handleGoGallery() {
    wx.switchTab({
      url: '/pages/gallery/index',
    });
  },

  handleGoMap(e) {
    const {target} = e.currentTarget.dataset;
    wx.switchTab({
      url: `/pages/contact/index?target=${target}`,
    });
  },

  handleLeaveMessage() {
    wx.switchTab({
      url: `/pages/message/index`,
    });
  },

  goTo(e) {
    const {address} = e.target.dataset;
    wx.openLocation({
      latitude: address.point[0],
      longitude: address.point[1],
      name: address.local,
    });
  },

  onShareAppMessage: app.onShareAppMessage,
  onShareTimeline: app.onShareTimeline,
});
