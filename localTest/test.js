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
        const [width, height, checkBothOrientations] = resolution;
        await page.setViewport({ width, height });

        if (checkBothOrientations) {
            await page.waitForTimeout(1000);

            // Вставляем стиль с красной линией в обе ориентации
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

            const portraitFilename = path.join(screenshotsPath, `${width}x${height}_portrait.png`);
            const landscapeFilename = path.join(screenshotsPath, `${height}x${width}_landscape.png`);

            await page.screenshot({ path: portraitFilename, fullPage: true });

            await page.setViewport({ width: height, height: width });
            await page.waitForTimeout(1000);
            await page.screenshot({ path: landscapeFilename, fullPage: true });

            console.log(`Screenshot taken in portrait: ${portraitFilename}`);
            console.log(`Screenshot taken in landscape: ${landscapeFilename}`);
        } else {
            await page.waitForTimeout(1000);

            // Вставляем стиль с красной линией только в портретной ориентации
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
                        z-index: 10000;
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
    }

    await browser.close();
}

const targetURL = 'https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html';
const screenResolutions = [
    [1920, 1080, false], // Портретная и альбомная ориентации
    [1280, 720, false], // Только портретная ориентация
    [375, 553, true],  // Портретная и альбомная ориентации
    [1024, 1259, true],  // Портретная и альбомная ориентации
    // Добавьте другие разрешения по вашему выбору
];

async function main() {
    await clearScreenshotsDirectory();
    createScreenshotsDirectory();
    await takeScreenshots(targetURL, screenResolutions);
    console.log('Screenshots taken');
}

main().catch(err => console.error('Error:', err));
