const ocrAndTranslate = require('./ocrAndTranslate.js');

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
    tobetranslatedText: '',
    translatedText: ''
  },

  chooseImage: function(sourceType) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: [sourceType],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.translateImage(tempFilePaths[0]);
      },
      fail: function(error) {
        console.error('选择图片失败', error);
      }
    });
  },

  startVoice: function() {
    this.chooseImage('album');
  },

  takePhoto: function() {
    this.chooseImage('camera');
  },

  translateImage: function(imagePath) {
    var that = this;
    const { selectedSourceLanguage, selectedTargetLanguage, languageCodes } = this.data;
    const targetLang = languageCodes[selectedTargetLanguage];

    ocrAndTranslate(imagePath, targetLang)
      .then(result => {
        that.setData({
          tobetranslatedText: result.extractedText,
          translatedText: result.translatedText
        });
      })
      .catch(error => {
        console.error('图片翻译失败', error);
      });
  },

  selectSourceLanguage: function(e) {
    var index = e.detail.value;
    this.setData({
      selectedSourceLanguage: this.data.sourceLanguages[index]
    });
  },

  selectTargetLanguage: function(e) {
    var index = e.detail.value;
    this.setData({
      selectedTargetLanguage: this.data.targetLanguages[index]
    });
  },

  addToFavorites: function() {
    const { tobetranslatedText, translatedText } = this.data;
    if (tobetranslatedText && translatedText) {
      wx.showToast({
        title: '已收藏',
        icon: 'success'
      });
      // 这里可以实现将翻译结果保存到收藏夹的逻辑
    } else {
      wx.showToast({
        title: '没有可收藏的内容',
        icon: 'none'
      });
    }
  }
});