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


        // Clicking on the first user's edit button
        const firstEditButton = await driver.findElement(By.css('table tbody tr:first-child button svg[data-testid="EditIcon"]'));
        await firstEditButton.findElement(By.xpath('..')).click();

        await driver.sleep(500);


        // Overwrite the "Name" field
        const nameField = await driver.findElement(By.css('table tbody tr:first-child input[name="name"]'));
        await nameField.clear();
        await nameField.sendKeys('Teszt Felhasználó');


        // Rewrite the "Email" field
        const emailField = await driver.findElement(By.css('table tbody tr:first-child input[name="email"]'));
        await emailField.clear();
        await emailField.sendKeys('teszt@example.com');

        // Select a role (e.g. admin)
        const roleSelect = await driver.findElement(By.css('table tbody tr:first-child [name="role"]'));
        await roleSelect.click();
        await driver.sleep(500); 
        const adminOption = await driver.findElement(By.css('li[data-value="admin"]'));
        await adminOption.click();


    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.quit();
    }
})();
