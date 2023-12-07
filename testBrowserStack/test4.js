const webdriver = require('selenium-webdriver');
const { Builder } = require('selenium-webdriver');

async function main() {
    const USERNAME = 'mursa_hal9Vz';
    const ACCESS_KEY = '2j5kusQDTGZfYRFW7xUm';

    const capabilities = {
        browserName: 'chrome',
        browserVersion: 'latest',
        os: 'OS X',
        os_version: 'Big Sur',
        device: 'iPhone 12',
        real_mobile: 'true',
        name: 'Mobile Screenshot Test'
    };

    const driver = await new Builder()
        .usingServer(`http://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(capabilities)
        .build();

    try {
        await driver.get('https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html');

        // Устанавливаем размер окна браузера для симулированного устройства
        await driver.manage().window().setRect({ width: 390, height: 844 }); // Разрешение iPhone 12

        // Добавляем задержку в 2 секунды (может потребоваться больше или меньше в зависимости от вашего сайта)
        await driver.sleep(2000);

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
