// populatePayment.js
const { qSelectNthOption, inputField } = require("./function_library");

async function populatePayment(page, log) {
  try {

    const nameSelector = 'input.q-field__native.q-placeholder[aria-label="Enter first name on card"][data-testid="card-first-name-input"]'
    await inputField(page, log, nameSelector, "finch")
    //
    const zipSelector = `input.q-field__native.q-placeholder[aria-label="Card holder's zip code"][data-testid="card-zip-code"]`
    await inputField(page, log, zipSelector, "97211")
    //
    const cardNumberSelector = `input.q-field__native.q-placeholder[aria-label="Enter card number"][data-testid="card-number-input"]`
    await inputField(page, log, cardNumberSelector, '4111111111111111')
    //
    const cvvSelector = `input.q-field__native.q-placeholder[aria-label="Enter card cvv"][data-testid="card-cvv-input"]`
    await inputField(page, log, cvvSelector, '789')
    //
    const monthExpireSelector = `div.q-field__native[data-testid="card-expiration-month-select"][aria-label="Enter card expiration month"]`
    await qSelectNthOption(page, log, monthExpireSelector, 3);
    //
    const yearExpireSelector = `div[data-testid="card-expiration-year-select"] input.q-select__focus-target`;
    await qSelectNthOption(page, log, yearExpireSelector, 3);

  } catch (err) {
    await log(`populateAddress error: ${err.message}`);
  }
}

module.exports = { populatePayment };