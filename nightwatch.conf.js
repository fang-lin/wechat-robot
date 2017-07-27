module.exports = {
    'src_folders': ['scripts'],
    'output_folder': false,
    'custom_commands_path': '',
    'custom_assertions_path': '',
    'page_objects_path': '',
    'globals_path': '',

    'selenium': {
        'start_process': false,
        'server_path': 'node_modules/selenium-standalone/.selenium/selenium-server/3.4.0-server.jar',
        'log_path': '',
        'port': 4444,
        'cli_args': {
            'webdriver.chrome.driver': 'node_modules/selenium-standalone/.selenium/chromedriver/2.30-x64-chromedriver',
            'webdriver.gecko.driver': 'node_modules/selenium-standalone/.selenium/geckodriver/0.16.1-x64-geckodriver'
        }
    },

    'test_settings': {
        'default': {
            'launch_url': 'http://localhost',
            'selenium_port': 4444,
            'selenium_host': 'localhost',
            'silent': true,
            'screenshots': {
                'enabled': false,
                'path': ''
            },
            'desiredCapabilities': {
                'browserName': 'chrome',
                'marionette': true
            }
        },

        'firefox': {
            'desiredCapabilities': {
                'browserName': 'firefox'
            }
        }
    }
};