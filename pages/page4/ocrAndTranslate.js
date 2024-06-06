const md5 = require('../../utils/md5.js');
const ocrApiKey = '71e9f34203885468'; // 极速数据 API密钥
const appid = '20240506002043783'; // 你的百度翻译 App ID
const secretKey = 'cdFybXHDRh4pwVHdcKGgklg384be93SC'; // 你的百度翻译密钥

async function ocrAndTranslate(imagePath, targetLang) {
  // 从图像中提取文本
  const extractedText = await extractTextFromImage(imagePath);
  // 翻译提取的文本
  const translatedText = await translateText(extractedText, 'auto', targetLang);
  return {
    extractedText,
    translatedText
  };
}

// 从图像中提取文本
async function extractTextFromImage(imagePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: function(res) {
        const base64Image = res.data;
        wx.request({
          url: 'https://api.jisuapi.com/ocr/documents',
          method: 'POST',
          data: {
            appkey: ocrApiKey,
            image: base64Image
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function(response) {
            const data = response.data;
            if (data.status !== '0') {
              reject('OCR failed: ' + data.msg);
            } else {
              resolve(data.result[0].content);
            }
          },
          fail: function(error) {
            reject('OCR request failed: ' + error);
          }
        });
      },
      fail: function(error) {
        reject('Failed to read image file: ' + error);
      }
    });
  });
}

// 翻译文本
async function translateText(text, fromLang, toLang) {
  const salt = Date.now().toString(); // 使用当前时间戳作为 salt 值
  const sign = md5(appid + text + salt + secretKey);

  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      method: 'GET',
      data: {
        q: text,
        from: fromLang,
        to: toLang,
        appid: appid,
        salt: salt,
        sign: sign
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(response) {
        const data = response.data;
        if (data.error_code) {
          reject('Translation failed: ' + data.error_msg);
        } else {
          resolve(data.trans_result[0].dst);
        }
      },
      fail: function(error) {
        reject('Translation request failed: ' + error);
      }
    });
  });
}

module.exports = ocrAndTranslate;