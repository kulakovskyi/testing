const { Builder, Capabilities } = require('selenium-webdriver');
const axios = require('axios');

async function getDeviceResolution(deviceName) {
    const response = await axios.get(`https://www.browserstack.com/screenshots/v3/browsers?devices=${deviceName}`);
    const deviceInfo = response.data[deviceName];
    return { width: deviceInfo.width, height: deviceInfo.height };
}

async function main() {
    const USERNAME = 'mursa_hal9Vz';
    const ACCESS_KEY = '2j5kusQDTGZfYRFW7xUm';
    const DEVICE_NAME = 'iPhone 14'; // Имя выбранного устройства

    const capabilities = new Capabilities({
        'browserName': 'Safari',
        'browserVersion': 'latest',
        'os': 'OS X',
        'os_version': 'Big Sur',
        'device': DEVICE_NAME,
        'real_mobile': 'true',
        'name': 'Mobile Screenshot Test'
    });

    const driver = await new Builder()
        .usingServer(`http://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(capabilities)
        .build();

    try {
        await driver.get('https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html');

        // Получаем размеры разрешения устройства из API BrowserStack
        const resolution = await getDeviceResolution(DEVICE_NAME);

        // Устанавливаем размер окна браузера на основе полученных размеров разрешения
        await driver.manage().window().setRect(resolution);

        // Создаем скриншот устройства
        const screenshot = await driver.takeScreenshot();

        // Сохраняем скриншот в файл
        const fs = require('fs');
        fs.writeFileSync('mobile_screenshot.png', screenshot, 'base64');

        console.log('Mobile screenshot saved.');

    } finally {
        await driver.quit();
    }
}

main();
