const BrowserWrapper = require('./BrowserWrapper.js');
const logger = require('log4js').getLogger('Main');
logger.level = 'debug';

module.exports = {
    main: (browser) => {
        logger.info('Start wait for message and reply.');
        BrowserWrapper(browser, {
            stepPauseTime: 0,
            waitForMessageInterval: 200
        })
            .url('https://wx.qq.com/')
            .waitForElementVisible('body > div.main > div > div.panel > div.header > div.avatar > img', 60000)
            .pause(10000)
            .waitForMessageAndReply();
    }
};