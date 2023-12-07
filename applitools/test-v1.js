const { Eyes, Target, ConsoleLogHandler, Configuration, BatchInfo } = require('@applitools/eyes-images');
const puppeteer = require('puppeteer'); // Вы можете использовать другую библиотеку для работы с браузером

// Инициализация Applitools с вашим API ключом
const eyes = new Eyes();
eyes.setApiKey('n98m100yUByeQo6YwPd98U100uhSHKuLu4C4AyCHtI103Fgwq1I110');

// Создание экземпляра Puppeteer
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Установка конфигурации для Applitools
    const config = new Configuration();
    config.setBatch(new BatchInfo('Название вашей партии'));

    // Открытие глаз для просмотра (указание тестового окна)
    await eyes.open(page, 'Ваше название теста', 'Имя тестируемого окна', { width: 800, height: 600 });

    // Список устройств для тестирования
    const devices = [
        { width: 375, height: 667, name: 'iPhone 6/7/8' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1920, height: 1080, name: 'Desktop' },
    ];

    // Ссылка на вашу страницу
    const url = 'https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html';

    for (const device of devices) {
        await page.setViewport({ width: device.width, height: device.height });
        await page.goto(url);
        await eyes.check('Скриншот на ' + device.name, Target.window().fully());
    }

    // Завершение теста и отправка результатов в Applitools
    await eyes.close();

    // Закрытие браузера
    await browser.close();
})();