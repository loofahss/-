const translate = require('./translate.js');

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
    inputText: '',
    translatedText: '',
    outputPlaceholder: '翻译结果将显示在这里',
    favorites: [] // 新增收藏夹数组
  },

  // 更新输入框内容
  inputText: function(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 翻译文本
  translate: function() {
    const that = this;
    const sourceLang = that.data.languageCodes[that.data.selectedSourceLanguage];
    const targetLang = that.data.languageCodes[that.data.selectedTargetLanguage];
    const inputText = that.data.inputText;

    // 清空翻译结果和占位符
    that.setData({
      translatedText: '',
      outputPlaceholder: ''
    });
    
    translate(inputText, sourceLang, targetLang)
      .then(translatedText => {
        that.setData({
          translatedText: translatedText
        });
       
        // 将翻译记录保存到本地缓存
        const history = wx.getStorageSync('translationHistory') || [];
        history.push({ 
          inputText: inputText,
          translatedText: translatedText,
          sourceLanguage: that.data.selectedSourceLanguage,
          targetLanguage: that.data.selectedTargetLanguage
        });
        wx.setStorageSync('translationHistory', history);

      })
      .catch(error => {
        console.error('翻译失败', error);
        that.setData({
          translatedText: '翻译失败，请稍后再试。'
        });
      });
  },

  // 更新源语言选择
  selectSourceLanguage: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedSourceLanguage: this.data.sourceLanguages[index]
    });
  },

  // 更新目标语言选择
  selectTargetLanguage: function(e) {
    const index = e.detail.value;
    this.setData({
      selectedTargetLanguage: this.data.targetLanguages[index]
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
  // 添加到收藏夹
  addToFavorites: function() {
    const { inputText, translatedText, selectedSourceLanguage, selectedTargetLanguage } = this.data;
    if (inputText && translatedText) {
      // 添加到收藏夹
      const newFavorite = {
        inputText,
        translatedText,
        sourceLanguage: selectedSourceLanguage,
        targetLanguage: selectedTargetLanguage
      };
      // 更新页面收藏夹数据
      this.setData({
        favorites: [...this.data.favorites, newFavorite]
      });
      // 更新本地缓存
      wx.setStorageSync('favorites', this.data.favorites);
      
      wx.showToast({
        title: '已添加到收藏夹',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: '无法添加到收藏夹',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
