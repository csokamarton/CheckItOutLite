const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function userManagementTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://checkitoutlite.test/admin/users');

        // Waiting for the page to load
        await driver.wait(until.elementLocated(By.css('h2')), 10000);

        const pageTitle = await driver.findElement(By.css('h2')).getText();
        if (pageTitle.includes('Felhasználók kezelése')) {
            console.log('Page loaded successfully.');
        } else {
            throw new Error('Wrong page loaded.');
        }

        // Waiting for the first row of the table to load
        await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.quit();
    }
})();
