// translate.js
const md5 = require('../../utils/md5.js');

async function translate(inputText, sourceLang, targetLang) {
    if (!inputText) {
        throw new Error('Invalid input');
    }

    const appid = '20240506002043783'; // 你的百度翻译 App ID
    const secretKey = 'vZEfrZA9xDZ0EYUqzZ3E'; // 你的百度翻译密钥
    const salt = (new Date()).getTime();
    const str1 = appid + inputText + salt + secretKey;
    const sign = md5(str1);

    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            method: 'GET',
            data: {
                q: inputText,
                from: sourceLang,
                to: targetLang,
                appid: appid,
                salt: salt,
                sign: sign
            },
            success: function (res) {
                if (res.data.error_code) {
                    reject(`Translation failed: ${res.data.error_msg}`);
                } else {
                    resolve(res.data.trans_result[0].dst);
                }
            },
            fail: function (error) {
                reject(`Translation request failed: ${error}`);
            }
        });
    });
}

module.exports = translate;