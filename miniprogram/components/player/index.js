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
  },
  lifetimes: {
    attached () {
      this.initAudio()
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
    initAudio () {
      if (app.audio) {
        this.audio = app.audio
        this.setData({
          playing: !this.audio.paused,
        })
      } else {
        this.audio = wx.createInnerAudioContext({
          useWebAudioImplement: false
        })
        const src = app.globalData.imgPath + app.randomPick(this.data.audioList)
        this.audio.src = src
        app.audio = this.audio
        this.handlePlay()
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
    async handleChange () {
      const {audioList} = this.data
      let index = audioList.findIndex(item => app.globalData.imgPath + item === this.audio.src)
      if (index < audioList.length - 1) {
        index++
      } else {
        index = 0
      }
      await this.audio.stop()
      this.audio.src = app.globalData.imgPath + audioList[index]
      this.audio.play()
    },
  },
})