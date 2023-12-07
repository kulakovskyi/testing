const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const screenshotsPath = path.join(__dirname, 'screen');

async function createScreenshotsDirectory() {
    if (!fs.existsSync(screenshotsPath)) {
        fs.mkdirSync(screenshotsPath);
    }
}

async function clearScreenshotsDirectory() {
    if (fs.existsSync(screenshotsPath)) {
        const files = fs.readdirSync(screenshotsPath);
        files.forEach(file => {
            const filePath = path.join(screenshotsPath, file);
            fs.unlinkSync(filePath);
        });
    }
}

async function takeScreenshots(url, resolutions) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    for (const resolution of resolutions) {
        const [width, height] = resolution;
        await page.setViewport({ width, height });

        await page.waitForTimeout(1000);

        // Вставляем стиль с линией в конце видимой части страницы
        await page.evaluate(() => {
            const style = document.createElement('style');
            style.textContent = `
                body {
                    margin: 0;
                    padding: 0;
                }
                .line {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    z-index: 1000;
                    background-color: red; /* Цвет линии */
                }
            `;
            document.head.appendChild(style);
            const line = document.createElement('div');
            line.className = 'line';
            document.body.appendChild(line);
        });

        const filename = path.join(screenshotsPath, `${width}x${height}.png`);
        await page.screenshot({ path: filename, fullPage: true });

        console.log(`Screenshot taken at ${width}x${height}: ${filename}`);
    }

    await browser.close();
}

const targetURL = 'https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html';
const screenResolutions = [
    // [2560, 1364],
    // [2240, 1260],
    // [1920, 1080],
    // [1830, 920],
    // [1680, 1050],
    // [1600, 900],
    // [1536, 864],
    // [1464, 715],
    // [1440, 900],
    // [1366, 950],
    // [1366, 768],
    // [1280, 800],
    // [1280, 720],
    // [1205, 585],
    // [1194, 715],
    // [1180, 820],
    // [1133, 762],
    // [1120, 768],
    // [1112, 764],
    // Добавьте другие разрешения по вашему выбору
];

async function main() {
    await clearScreenshotsDirectory();
    createScreenshotsDirectory();
    await takeScreenshots(targetURL, screenResolutions);
    console.log('Screenshots taken');
}

main().catch(err => console.error('Error:', err));
