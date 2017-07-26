function addStepPauseForMethods(wrapper, stepPauseTime, medthods) {
    medthods.map((medthod) => {
        wrapper[medthod] = (...args) => {
            const action = wrapper.__proto__[medthod].apply(wrapper, args)
            if (stepPauseTime > 0) {
                action.pause(stepPauseTime)
            }
            return wrapper;
        }
    });
}

function agentMethods(wrapper, medthods) {
    medthods.map((medthod) => {
        wrapper[medthod] = (...args) => {
            wrapper.__proto__[medthod].apply(wrapper, args)
            return wrapper;
        }
    });
}

function replyForMessage(newMessage, wrapper) {
    let replyMessage = null;

    try {
        const fn = new Function(`return ${newMessage};`);
        replyMessage = fn();
    } catch (e) {
        console.error('Error in replyForMessage:', e)
    }

    if (replyMessage !== null) {
        console.log('Exec replyForMessage:', `${newMessage}=${replyMessage}`);
        return sendMessage(replyMessage, wrapper);
    }
    return wrapper;
}

function getNewMessage(wrapper, callback) {
    return wrapper.elements('css selector', '#chatArea .scroll-content > div.ng-scope > div.ng-scope .you pre', (result) => {
        if (result.value.length > 0) {
            wrapper.elementIdText(result.value[result.value.length - 1].ELEMENT, function (res) {
                callback(res.value)
            })
        } else {
            callback(null)
        }
    });
}

function wrapper(browser, options) {
    const _wrapper = {};
    _wrapper.__proto__ = browser;

    agentMethods(_wrapper, [
        'waitForElementVisible', 'getText', 'pause', 'elements'
    ]);

    addStepPauseForMethods(_wrapper, options.stepPauseTime, [
        'url', 'setValue', 'click'
    ]);

    let lastMessage = null;

    _wrapper.selectUser = (username) => {
        return _wrapper
            .setValue('#search_bar > input', username)
            .click('.mmpop .scroll-content > div > div:nth-child(3) > div > div');
    };

    _wrapper.waitForMessageAndReply = () => {
        let action = _wrapper;
        return getNewMessage(_wrapper, (newMessage) => {
            if (newMessage && newMessage !== lastMessage) {
                lastMessage = newMessage;
                action = replyForMessage(newMessage, _wrapper);
            }
            action.pause(options.waitForMessageInterval).waitForMessageAndReply();
        });
    };

    return _wrapper;
}

function sendMessage(message, wrapper) {
    return wrapper
        .setValue('#editArea', message)
        .click('#chatArea > div.box_ft.ng-scope > div.action > a');
}


module.exports = {
    'Demo test': function (browser) {
        wrapper(browser, {
            stepPauseTime: 0,
            waitForMessageInterval: 200
        })
            .url('https://wx.qq.com/')
            .waitForElementVisible('body > div.main > div > div.panel > div.header > div.avatar > img', 60000)
            .pause(10000)
            .waitForMessageAndReply();
    }
};