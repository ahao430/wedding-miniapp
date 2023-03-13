const app = getApp()

Component({
  properties: {},
  data: {
    audioList: [
      'audio/gouzhiqishi.mp3',
      'audio/beautiful_in_white.mp3',
      'audio/jintianniyaojiageiwo.mp3',
      'audio/xiaoxiaoliange.mp3',
    ],
    playing: true,
    showPlayer: false,
  },
  lifetimes: {
    attached () {
      this.init()
    },
  },
  pageLifetimes: {
    show () {
      if (this.audio) {
        this.setData({
          playing: !this.audio.paused,
        })
      }
    },
  },
  methods: {
    async init () {
      const config = await app.getConfig()
      if (config.music) {
        this.setData({
          showPlayer: true,
        })
        this.initAudio()
      }
    },
    initAudio () {
      if (app.audio) {
        this.audio = app.audio
        this.setData({
          playing: !this.audio.paused,
        })
      } else {
        // 当点击图片预览时，触发app.onhide,音频停止播放
        this.audio = wx.createInnerAudioContext({
          useWebAudioImplement: false
        })

        // 背景音频
        // this.audio = wx.getBackgroundAudioManager()

        const src = app.globalData.imgPath + app.randomPick(this.data.audioList)
        this.audio.src = src
        app.audio = this.audio

        setTimeout(() => {
          this.handlePlay()
        }, 1000)
      }
    },
    async handlePlay () {
      if (this.audio.paused) {
        await this.audio.play()
        this.setData({
          playing: true,
        })
      } else {
        await this.audio.pause()
        this.setData({
          playing: false,
        })
      }
    },
    handleChange () {
      const {audioList} = this.data
      let index = audioList.findIndex(item => app.globalData.imgPath + item === this.audio.src)
      if (index < audioList.length - 1) {
        index++
      } else {
        index = 0
      }
      this.audio.src = app.globalData.imgPath + audioList[index]
      setTimeout(() => {
        this.audio.play()
      }, 1000)
    },
  },
})