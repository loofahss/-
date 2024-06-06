Page({

  /**
   * 页面的初始数据
   */
  // 点击历史记录按钮
  showHistory: function() {
    wx.navigateTo({
      url: '../page2/page2' 
    })
  },

  // 点击收藏按钮
  showFavorites: function() {
    wx.navigateTo({
      url: '../page5/page5' // 同样，假设 page5 页面也在 pages 目录下
    })
  },
  textTranslate: function() {
    wx.navigateTo({
      url: '../page1/page1' 
    })
  },
  speechTranslate: function() {
  wx.navigateTo({
    url: '../page3/page3' 
  })
},
 imageTranslate: function() {
  wx.navigateTo({
    url: '../page4/page4' 
  })
},
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})