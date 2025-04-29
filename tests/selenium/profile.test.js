const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Profile Page Tests', function () {
  let driver;
  this.timeout(30000);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000/profile');
  });

  after(async () => {
    await driver.quit();
  });

  it('should load profile view with name and email fields disabled', async () => {
    const nameInput = await driver.findElement(By.name('name'));
    const emailInput = await driver.findElement(By.name('email'));

    const isNameDisabled = await nameInput.getAttribute('disabled');
    const isEmailDisabled = await emailInput.getAttribute('disabled');

    expect(isNameDisabled).to.equal('true');
    expect(isEmailDisabled).to.equal('true');
  });

  it('should enable fields when clicking "Szerkesztés" (Edit)', async () => {
    const editButton = await driver.findElement(By.xpath("//button[contains(text(), 'Szerkesztés')]"));
    await editButton.click();

    const nameInput = await driver.findElement(By.name('name'));
    const emailInput = await driver.findElement(By.name('email'));

    const isNameDisabled = await nameInput.getAttribute('disabled');
    const isEmailDisabled = await emailInput.getAttribute('disabled');

    expect(isNameDisabled).to.be.null;
    expect(isEmailDisabled).to.be.null;
  });

  it('should show validation error for empty name', async () => {
    const nameInput = await driver.findElement(By.name('name'));
    await nameInput.clear();
    await nameInput.sendKeys('');

    await nameInput.sendKeys('\t');

    const helperText = await driver.findElement(By.xpath("//p[contains(text(), 'Név megadása kötelező')]"));
    expect(await helperText.getText()).to.include('Név megadása kötelező');
  });

  it('should open confirmation modal on save click', async () => {
    const saveButton = await driver.findElement(By.xpath("//button[contains(text(), 'Mentés')]"));
    await saveButton.click();

    const modalTitle = await driver.wait(until.elementLocated(By.xpath("//h1[contains(text(), 'Biztosan menti?')]")), 5000);
    expect(await modalTitle.getText()).to.equal('Biztosan menti?');
  });

  it('should submit password and show success or error alert', async () => {
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('adminpass'); 

    const confirmButton = await driver.findElement(By.xpath("//button[contains(text(), 'Rendben')]"));
    await confirmButton.click();

    const alert = await driver.wait(until.elementLocated(By.className('MuiAlert-message')), 5000);
    const alertText = await alert.getText();

    expect(alertText).to.be.oneOf(['Sikertelen módosítás', 'Sikeres módosítás']);
  });
});

