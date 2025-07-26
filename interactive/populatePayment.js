// populatePayment.js
const { qSelect, inputField } = require("./function_library");

async function populatePayment(page, log) {
  try {

    const nameSelector = 'div.q-field__control-container input[data-testid="card-first-name-input"]';
    inputField(page, log, nameSelector, 'Kermit the Frog2' )
    //
    const zipSelector = `input[data-testid="card-first-name-input"]`
    inputField(page, log, zipSelector, '97212' )
    //
    // const visaSelector = 'input[data-testid="card-number-input"]'
    // inputField(page, log, visaSelector, '4111111111111111' )
    //



  } catch (err) {
    await log(`populateAddress error: ${err.message}`);
  }
}

module.exports = { populatePayment };
