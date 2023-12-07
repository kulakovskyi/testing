'use strict'

const { Builder, By } = require('selenium-webdriver');
const { Eyes,
    ClassicRunner,
    VisualGridRunner,
    RunnerOptions,
    Target,
    RectangleSize,
    Configuration,
    BatchInfo,
    BrowserType,
    ScreenOrientation,
    DeviceName } = require('@applitools/eyes-selenium');
const path = require("path");
const fs = require("fs");

describe('ACME Bank', () => {

    const USE_ULTRAFAST_GRID = true;
    const USE_EXECUTION_CLOUD = false;

    // Test control inputs to read once and share for all tests
    var applitoolsApiKey = 'n98m100yUByeQo6YwPd98U100uhSHKuLu4C4AyCHtI103Fgwq1I110';
    var headless;

    // Applitools objects to share for all tests
    let batch;
    let config;
    let runner;

    // Test-specific objects
    let driver;
    let eyes;

    before(async () => {
        applitoolsApiKey = "n98m100yUByeQo6YwPd98U100uhSHKuLu4C4AyCHtI103Fgwq1I110";

        headless = process.env.HEADLESS? ['headless'] : []

        if (USE_ULTRAFAST_GRID) {
            runner = new VisualGridRunner(new RunnerOptions().testConcurrency(5));
        }
        else {
            runner = new ClassicRunner();
        }

        const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
        batch = new BatchInfo(`Example: Selenium JavaScript Mocha with the ${runnerName}`);

        config = new Configuration();
        config.setApiKey(applitoolsApiKey);

        // Set the batch for the config.
        config.setBatch(batch);

        if (USE_ULTRAFAST_GRID) {

            // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
            // Other browsers are also available, like Edge and IE.
            config.addBrowser(800, 600, BrowserType.CHROME);
            config.addBrowser(1600, 1200, BrowserType.FIREFOX);
            config.addBrowser(1024, 768, BrowserType.SAFARI);

            // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
            // Other mobile devices are available, including iOS.
            config.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
            config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
        }
    });

    beforeEach(async function() {
        //This method sets up each test with its own ChromeDriver and Applitools Eyes objects.

        // Open the browser with the ChromeDriver instance.
        // Even though this test will run visual checkpoints on different browsers in the Ultrafast Grid,
        // it still needs to run the test one time locally to capture snapshots.
        var capabilities = {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: headless,
            },
        };

        if (USE_EXECUTION_CLOUD) {
            // Open the browser remotely in the Execution Cloud.
            let url = await Eyes.getExecutionCloudUrl();
            driver = new Builder().usingServer(url).withCapabilities(capabilities).build();
        }
        else {
            // Create a local WebDriver.
            driver = new Builder().withCapabilities(capabilities).build();
        }



        await driver.manage().setTimeouts( { implicit: 10000 } );

        eyes = new Eyes(runner);
        eyes.setConfiguration(config);


        await eyes.open(



            driver,

            'ACME Bank',

            this.currentTest.fullTitle(),

            new RectangleSize(500, 600)
        );
    })

    it('should log into a bank account', async () => {

        // Load the login page.
        await driver.get("https://kulakovskyi.github.io/land-newb-shakhter-UA/build/index.html");
        const screenshot = await driver.takeScreenshot();
        const fs = require('fs');
        const path = require('path');
        const timestamp = new Date().getTime(); // Получаем уникальное время

        const screenshotPath = path.join(__dirname, 'screen', `mobile_screenshot_${timestamp}.png`);
        fs.writeFileSync(screenshotPath, screenshot, 'base64');

        console.log(`Mobile screenshot saved as mobile_screenshot_${timestamp}.png.`);

    });

    afterEach(async function() {

        await driver.quit();


    });

    after(async () => {

        const allTestResults = await runner.getAllTestResults();
        console.log(allTestResults);
    });
})
