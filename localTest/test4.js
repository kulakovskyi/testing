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

        for (const file of files) {
            const filePath = path.join(screenshotsPath, file);

            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                const subFiles = fs.readdirSync(filePath);
                subFiles.forEach(subFile => {
                    const subFilePath = path.join(filePath, subFile);
                    fs.unlinkSync(subFilePath);
                });
                fs.rmdirSync(filePath);
            }
        }
    }
}

async function takeScreenshots(url, resolutions) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    for (const resolution of resolutions) {
        const [width, height, checkBothOrientations, deviceType] = resolution;
        await page.setViewport({ width, height });

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
                        background-color: red;
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
                        background-color: red;
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

const targetURL = 'https://kulakovskyi.github.io/tour-cybersport-UA/build/index.html';

const screenResolutions = [
        //true для портретки и лендскейпа

    [1920, 1080, false, 'desc'],
    [1280, 720, false, 'desc'],
    [375, 553, true, 'mob'],
    [428, 746, true, 'mob'],
    [1024, 1259, true, 'tab'],
];

async function main() {
    clearScreenshotsDirectory();
    createScreenshotsDirectory();
    await takeScreenshots(targetURL, screenResolutions);
    console.log('Screenshots taken');
}

main().catch(err => console.error('Error:', err));
