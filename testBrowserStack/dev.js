var BrowserStack = require("browserstack");
var browserStackCredentials = {
    username: "mursa_hal9Vz",
    password: "2j5kusQDTGZfYRFW7xUm"
};


// Screenshots API
var screenshotClient = BrowserStack.createScreenshotClient(browserStackCredentials);

screenshotClient.getBrowsers(function(error, browsers) {
    console.log("The following browsers are available for screenshots");
    console.log(browsers);
});