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
        const [width, height, checkBothOrientations, deviceType] = resolution;
        await page.setViewport({ width, height });

        //await page.waitForTimeout(1000);

        if (checkBothOrientations) {
            await page.waitForTimeout(1000);
            const orientations = ['portrait', 'landscape'];

            for (const orientation of orientations) {
                await page.setViewport({ width: orientation === 'portrait' ? width : height, height: orientation === 'portrait' ? height : width });
                await page.waitForTimeout(1000);

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

                const folderName = deviceType ? `${deviceType}_${orientation}` : orientation;
                const folderPath = path.join(screenshotsPath, folderName);

                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }

                const filename = path.join(folderPath, `${width}x${height}_${orientation}.png`);
                await page.screenshot({ path: filename, fullPage: true });

                console.log(`Screenshot taken in ${orientation} for ${deviceType ? deviceType : 'default'}: ${filename}`);
            }
        } else {
            await page.waitForTimeout(1000);
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

            const folderName = deviceType ? `${deviceType}_portrait` : 'portrait';
            const folderPath = path.join(screenshotsPath, folderName);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            const filename = path.join(folderPath, `${width}x${height}.png`);
            await page.screenshot({ path: filename, fullPage: true });

            console.log(`Screenshot taken at ${width}x${height} for ${deviceType ? deviceType : 'default'}: ${filename}`);
        }
    }

    await browser.close();
}

const targetURL = 'https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html';

const screenResolutions = [
    [1920, 1080, false, 'desc'], // Портретная и альбомная ориентации, тип устройства: desc
    [1280, 720, false, 'desc'],  // Только портретная ориентация, тип устройства: mob
    [375, 553, true, 'mob'],
    [428, 746, true, 'mob'],
    [1024, 1259, true, 'tab'],
    // Добавьте другие разрешения по вашему выбору
];

async function main() {
    await clearScreenshotsDirectory();
    createScreenshotsDirectory();
    await takeScreenshots(targetURL, screenResolutions);
    console.log('Screenshots taken');
}

main().catch(err => console.error('Error:', err));
