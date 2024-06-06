const app = getApp();
const { translateVoice, translateText } = require('./translate.js');

Page({
    data: {
        sourceLanguages: ['自动检测', '汉语', '英语', '日语', '韩语', '法语', '德语', '西班牙语'],
        targetLanguages: ['汉语', '英语', '日语', '韩语', '法语', '德语', '西班牙语'],
        languageCodes: {
            '自动检测': 'auto',
            '汉语': 'zh',
            '英语': 'en',
            '日语': 'jp', // 确保使用 'jp'
            '韩语': 'kor',
            '法语': 'fra',
            '德语': 'de',
            '西班牙语': 'spa'
        },
        selectedSourceLanguage: '自动检测',
        selectedTargetLanguage: '汉语',
        tobetranslatedText: '', // 输入框中的内容
        translatedText: '',
        recordStatus: '点击开始录音'
    },

    onLoad() {
        this.recorderManager = wx.getRecorderManager();

        this.recorderManager.onStart(() => {
            this.setData({ recordStatus: '正在录音...' });
            console.log('recorder start');
        });

        this.recorderManager.onStop((res) => {
            this.setData({ recordStatus: '' });
            console.log('recorder stop', res);
            const { tempFilePath } = res;
            this.translateVoice(tempFilePath); // 在录音停止后进行语音识别和翻译
        });

        this.recorderManager.onError((res) => {
            this.setData({ recordStatus: '录音失败' });
            console.error('recorder error', res);
        });
    },

    startRecording() {
        const options = {
            duration: 60000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 96000,
            format: 'aac',
        };
        this.recorderManager.start(options);
    },

    stopRecording() {
        this.recorderManager.stop();
        this.setData({ recordStatus: '' });
    },

    addToFavorites() {
        const { tobetranslatedText, translatedText } = this.data;
        if (tobetranslatedText && translatedText) {
            // 这里可以实现将翻译结果保存到收藏夹的逻辑
            wx.showToast({
                title: '已收藏',
                icon: 'success'
            });
        } else {
            wx.showToast({
                title: '没有可收藏的内容',
                icon: 'none'
            });
        }
    },

    inputText(e) {
        this.setData({
            tobetranslatedText: e.detail.value
        });
    },

    translate() {
        const text = this.data.tobetranslatedText;
        if (text) {
            const { selectedSourceLanguage, selectedTargetLanguage } = this.data;
            translateText(text, selectedSourceLanguage, selectedTargetLanguage, (translatedText) => {
                this.setData({
                    translatedText: translatedText
                });
            });
        } else {
            wx.showToast({
                title: '请输入要翻译的文本',
                icon: 'none'
            });
        }
    },

    translateVoice(filePath) {
        translateVoice(filePath, (recognitionResult) => {
            this.inputText({ detail: { value: recognitionResult } });
            this.translate();
        });
    },

    selectSourceLanguage(e) {
        this.setData({
            selectedSourceLanguage: this.data.sourceLanguages[e.detail.value]
        });
    },

    selectTargetLanguage(e) {
        this.setData({
            selectedTargetLanguage: this.data.targetLanguages[e.detail.value]
        });
    },
    // 复制翻译文本
copyTranslatedText: function() {
  const that = this;
  const translatedText = that.data.translatedText;

  if (translatedText) {
    wx.setClipboardData({
      data: translatedText,
      success: function () {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function () {
        wx.showToast({
          title: '复制失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  } else {
    wx.showToast({
      title: '无可复制的文本',
      icon: 'none',
      duration: 2000
    });
  }
},
});