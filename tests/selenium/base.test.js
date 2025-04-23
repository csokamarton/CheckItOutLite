const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const proxy = require('selenium-webdriver/proxy');
const opts = new chrome.Options();

(async function testFrontend() {
    
    opts.setProxy(proxy.manual({http: 'vm1.test:80'}))


    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(opts)  // Apply proxy bypass
        .build();

    try {
        // Navigate to frontend
        await driver.get('http://frontend.vm1.test');

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.tagName('body')), 5000);

        // Get page title
        let title = await driver.getTitle();
        console.log(`✅ Page Loaded - Title: ${title}`);

        if (!title.trim()) {
            throw new Error('❌ Title is empty, the page might not have loaded correctly.');
        }
    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await driver.quit();
    }
})();
