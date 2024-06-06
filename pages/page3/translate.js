const md5 = require('../../utils/md5.js'); // 确保在项目中添加了 MD5 库

function translateVoice(filePath, callback) {
    const appid = '71046668';
    const apikey = 'vlixbOSqD9mUMRndXVwOcDeY';

    wx.uploadFile({
        url: `https://vop.baidu.com/server_api?dev_pid=1536&cuid=${appid}&token=${apikey}`,
        filePath: filePath,
        name: 'speech',
        header: {
            'Content-Type': 'audio/pcm;rate=16000'
        },
        success(res) {
            const data = JSON.parse(res.data);
            if (data.err_no === 0) {
                const recognitionResult = data.result[0];
                callback(recognitionResult);
            } else {
                wx.showToast({
                    title: '语音识别失败',
                    icon: 'none'
                });
            }
        },
        fail() {
            wx.showToast({
                title: '语音识别请求失败',
                icon: 'none'
            });
        }
    });
}

function translateText(text, selectedSourceLanguage, selectedTargetLanguage, callback) {
    const appid = '20240506002043783';
    const key = 'vZEfrZA9xDZ0EYUqzZ3E';
    const salt = Date.now();
    const query = text;
    const str1 = appid + query + salt + key;
    const sign = md5(str1);

    wx.request({
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        method: 'GET',
        data: {
            q: query,
            from: selectedSourceLanguage,
            to: selectedTargetLanguage,
            appid: appid,
            salt: salt,
            sign: sign
        },
        success: (res) => {
            if (res.data && res.data.trans_result) {
                const translatedText = res.data.trans_result[0].dst;
                callback(translatedText);
            } else {
                wx.showToast({
                    title: '翻译失败',
                    icon: 'none'
                });
            }
        },
        fail: () => {
            wx.showToast({
                title: '网络请求失败',
                icon: 'none'
            });
        }
    });
}

module.exports = {
    translateVoice,
    translateText
};