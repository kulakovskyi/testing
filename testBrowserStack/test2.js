const webdriver = require('selenium-webdriver');
const { Builder, Capabilities } = require('selenium-webdriver');

async function main() {
    const USERNAME = 'mursa_hal9Vz';
    const ACCESS_KEY = '2j5kusQDTGZfYRFW7xUm';

    const mobileCapabilities = new Capabilities({
        'base' : 'BrowserStack',
        'os_version' : '14.0',
        'device' : 'iPhone 11',
        'browser' : 'firefox',

        //'real_mobile': 'true',
        'browserName': 'firefox',
        'name': 'Mobile Screenshot Test'
    });

    const driver = await new Builder()
        .usingServer(`http://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(mobileCapabilities)
        .build();

    try {
        await driver.get('https://tinypng.com/'); // Замените на URL вашего сайта

        // Ждем, пока элемент с определенным селектором станет видимым
        const webdriver = require('selenium-webdriver');
        const elementToWaitFor = await driver.findElement(webdriver.By.css('.target')); // Замените на селектор элемента, который будет виден после полной загрузки

        // Проверяем видимость элемента
        await driver.wait(webdriver.until.elementIsVisible(elementToWaitFor), 10000); // Максимальное время ожидания 10 секунд

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
