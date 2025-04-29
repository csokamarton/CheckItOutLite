const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function userManagementTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://checkitoutlite.test/admin/users');

    await driver.wait(until.elementLocated(By.css('h2')), 10000);


  } catch (err) {
    console.error('Error:', err);
  } finally {
    await driver.quit();
  }
})();
