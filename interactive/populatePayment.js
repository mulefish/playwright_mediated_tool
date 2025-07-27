// populatePayment.js
const { qSelectNthOption } = require("./function_library");

async function populatePayment(page, log) {
  try {

    const nameSelector = 'input.q-field__native.q-placeholder[aria-label="Enter first name on card"][data-testid="card-first-name-input"]'
    const nameInput = await page.$(nameSelector);
    if (nameInput) {
      await nameInput.fill('Kermitt the Frog');
    } else {
      await log(`Name input not found: ` + nameSelector);
    }
    //
    const zipSelector = `input.q-field__native.q-placeholder[aria-label="Card holder's zip code"][data-testid="card-zip-code"]`
    const zipInput = await page.$(zipSelector);
    if (zipInput) {
      await zipInput.fill('97211');
    } else {
      await log(`Name input not found: ` + zipSelector);
    }
    //    
    const cardNumberSelector = `input.q-field__native.q-placeholder[aria-label="Enter card number"][data-testid="card-number-input"]`
    const cardInput = await page.$(cardNumberSelector);
    if (cardInput) {
      await cardInput.fill('4111111111111111');
    } else {
      await log(`Card input not found: ` + cardNumberSelector);
    }
    // 
    const cvvSelector = `input.q-field__native.q-placeholder[aria-label="Enter card cvv"][data-testid="card-cvv-input"]`
    const cvvInput = await page.$(cvvSelector);
    if (cardInput) {
      await cvvInput.fill('123');
    } else {
      await log(`CVV input not found: ` + cvvSelector);
    }
    // 
    const monthExpireSelector = `div.q-field__native[data-testid="card-expiration-month-select"][aria-label="Enter card expiration month"]`
    await qSelectNthOption(page, log, monthExpireSelector, 3);
    //
    const yearExpireSelector = `div[data-testid="card-expiration-year-select"] input.q-select__focus-target`;
    await qSelectNthOption(page, log, yearExpireSelector, 3);

    log("DOne!")

  } catch (err) {
    await log(`populateAddress error: ${err.message}`);
  }
}

module.exports = { populatePayment };