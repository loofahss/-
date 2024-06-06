Page({
  data: {
    favorites: [] // 收藏夹数组
  },

  onLoad: function(options) {
    // 加载收藏夹数据
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({
      favorites: favorites
    });
  },

  // 删除收藏项
  deleteFavorite: function(e) {
    const index = e.currentTarget.dataset.index;
    let favorites = this.data.favorites;
    favorites.splice(index, 1);
    this.setData({
      favorites: favorites
    });
    // 更新本地缓存
    wx.setStorageSync('favorites', favorites);
  },

  // 清空收藏夹
  clearHistory: function() {
    this.setData({
      favorites: []
    });
    // 更新本地缓存
    wx.setStorageSync('favorites', []);
  }
});
