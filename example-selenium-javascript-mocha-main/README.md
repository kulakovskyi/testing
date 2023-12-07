# Applitools Example: Selenium in JavaScript with Mocha

This is the example project for the [Selenium JavaScript Mocha tutorial](https://applitools.com/tutorials/quickstart/web/selenium/javascript/mocha).
It shows how to start automating visual tests with the [Applitools Eyes](https://applitools.com/platform/eyes/)
and [Selenium WebDriver](https://www.selenium.dev/) in JavaScript.

It uses:

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) as the programming language
* [Selenium WebDriver](https://www.selenium.dev/) for browser automation
* [Google Chrome](https://www.google.com/chrome/downloads/) as the local browser for testing
* [npm](https://www.npmjs.com/) for dependency management
* [Mocha](https://mochajs.org/) as the core test framework
* [Applitools Eyes](https://applitools.com/platform/eyes/) for visual testing

It can also run tests with:

* [Applitools Ultrafast Grid](https://applitools.com/platform/ultrafast-grid/) for cross-browser execution
* [Applitools Execution Cloud](https://applitools.com/platform/execution-cloud/) for self-healing remote WebDriver sessions

To run this example project, you'll need:

1. A free [Applitools account](https://auth.applitools.com/users/register).
2. [Node.js](https://nodejs.org/en/) version 12 or higher.
3. A good JavaScript editor, such as [Visual Studio Code](https://code.visualstudio.com/docs/languages/javascript).
4. An up-to-date version of [Google Chrome](https://www.google.com/chrome/downloads/).
5. A corresponding version of [ChromeDriver](https://chromedriver.chromium.org/downloads).

To install project dependencies, run:

```
npm install
```

The main test case is [`acme-bank.test.js`](test/acme-bank.test.js).
By default, the project will run tests with Ultrafast Grid but not Execution Cloud.
You can change these settings in the test file.

To execute tests, set the `APPLITOOLS_API_KEY` environment variable
to your [account's API key](https://applitools.com/tutorials/guides/getting-started/registering-an-account),
and then run:

```
npm test
```

**For full instructions on running this project, take our
[Selenium JavaScript Mocha tutorial](https://applitools.com/tutorials/quickstart/web/selenium/javascript/mocha)!**
