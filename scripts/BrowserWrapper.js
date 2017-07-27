const logger = require('log4js').getLogger('BrowserWrapper');
logger.level = 'debug';

function BrowserWrapper(browser, options) {
    this.options = options;

    this.lastMessage = null;

    for (const fn in browser) {
        if (browser.hasOwnProperty(fn) && typeof browser[fn] === 'function') {
            BrowserWrapper.prototype[fn] = (...args) => {
                browser[fn].apply(browser, args);
                return this;
            };
        }
    }
}

BrowserWrapper.prototype.selectUser = function (username) {
    return this
        .setValue('#search_bar > input', username)
        .click('.mmpop .scroll-content > div > div:nth-child(3) > div > div');
};

BrowserWrapper.prototype.replyForMessage = function (newMessage) {
    let replyMessage = null;

    try {
        const fn = new Function(`return ${newMessage};`);
        replyMessage = fn();
    } catch (e) {
        logger.error('Error in replyForMessage:', e)
    }

    if (replyMessage !== null) {
        logger.info('Exec replyForMessage:', `${newMessage}=${replyMessage}`);
        return this.sendMessage(replyMessage);
    }
    return this;
};

BrowserWrapper.prototype.sendMessage = function (message) {
    return this
        .setValue('#editArea', message)
        .click('#chatArea > div.box_ft.ng-scope > div.action > a');
};

BrowserWrapper.prototype.getNewMessage = function (callback) {
    return this.elements('css selector', '#chatArea .scroll-content > div.ng-scope > div.ng-scope .you pre', (result) => {
        if (result.value.length > 0) {
            this.elementIdText(result.value[result.value.length - 1].ELEMENT, function (res) {
                callback(res.value)
            })
        } else {
            callback(null)
        }
    });
};

BrowserWrapper.prototype.waitForMessageAndReply = function () {
    return this.getNewMessage((newMessage) => {
        if (newMessage && newMessage !== this.lastMessage) {
            this.lastMessage = newMessage;
            this.replyForMessage(newMessage);
        }
        this.pause(this.options.waitForMessageInterval).waitForMessageAndReply();
    });
};

module.exports = function (browser, options) {
    return new BrowserWrapper(browser, options);
};