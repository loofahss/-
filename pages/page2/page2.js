Page({
  data: {
    translationHistory: []
  },

  onLoad: function(options) {
    // 获取本地缓存中的翻译记录
    const history = wx.getStorageSync('translationHistory') || [];
    console.log('Loaded translation history:', history); // 记录历史以进行调试
    this.setData({
      translationHistory: history
    });
  },

  clearHistory: function() {
    // 清空所有历史记录
    wx.setStorageSync('translationHistory', []);
    this.setData({
      translationHistory: []
    });

    wx.showToast({
      title: '所有历史记录已清空',
      icon: 'success',
      duration: 2000
    });
  },

  deleteHistory: function(e) {
    const index = e.currentTarget.dataset.index;
    let history = wx.getStorageSync('translationHistory') || [];
    
    // 删除对应的历史记录
    history.splice(index, 1);

    // 更新本地缓存和页面数据
    wx.setStorageSync('translationHistory', history);
    this.setData({
      translationHistory: history
    });

    wx.showToast({
      title: '已删除',
      icon: 'success',
      duration: 2000
    });
  }
});
