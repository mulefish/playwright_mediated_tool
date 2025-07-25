// populateAddress.js
const { qSelect } = require("./function_library");

async function populateAddress(page, log) {
  try {
    const countrySelector = 'div[data-testid="web-address-entry-country-q-select"] input.q-select__focus-target';
    await qSelect(page, "United States", "Country", log, countrySelector);

    const address1Selector = 'input[data-test-id="web-address-entry-address1-q-input"]';
    const addressInput = await page.$(address1Selector);
    if (addressInput) {
      await addressInput.fill("123 Main Street");
    } else {
      await log("Address 1 input not found");
    }

    const citySelector = 'input[data-test-id="web-address-entry-city-q-input"]';
    const cityInput = await page.$(citySelector);
    if (cityInput) {
      await cityInput.fill("Urbana");
    } else {
      await log("City input not found");
    }

    const stateSelector = 'div[data-test-id="web-address-entry-state-q-select"] input.q-select__focus-target';
    await qSelect(page, "Alabama", "State", log, stateSelector);


    const zipInput = await page.$('input[data-test-id="web-address-entry-zip-q-input"]');
    if (zipInput) {
      await zipInput.fill('61801');
    } else {
      await log('ZIP code input not found');
    }

    const nextButton = await page.$("#navigationbuttons-rightbutton-q-btn");
    if (nextButton) {
      await nextButton.click();
    } else {
      await log("Next button not found");
    }
  } catch (err) {
    await log(`populateAddress error: ${err.message}`);
  }
}

module.exports = { populateAddress };
