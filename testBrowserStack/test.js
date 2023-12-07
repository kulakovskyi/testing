const webdriver = require('selenium-webdriver');
const { Builder, Capabilities } = require('selenium-webdriver');

async function main() {
    const USERNAME = 'mursa_hal9Vz';
    const ACCESS_KEY = '2j5kusQDTGZfYRFW7xUm';

    const capabilities = new Capabilities({
        "browserstack.debug" : "true",
        'browserName' : 'Chrome',
        'browser_version' : '88.0',
        'os' : 'Windows',
        'os_version' : '10',
        'name': 'BStack-[NodeJS] Sample Test', // test name
        'build': 'BStack Build Number 1' // CI/CD job or build name
    });

    const driver = await new Builder()
        .usingServer(`http://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(capabilities)
        .build();

    try {
        await driver.get('https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html');

        // Устанавливаем размер окна браузера для симулированного устройства
        //await driver.manage().window().setRect({ width: 390, height: 844 }); // Разрешение iPhone 12

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
