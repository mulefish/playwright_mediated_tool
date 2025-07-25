const { qSelect } = require("./function_library");

async function populateAddress(page, log) {

    await qSelect(page, 'United States', 'Country', log, 'div[data-testid="web-address-entry-country-q-select"] input.q-select__focus-target');


    const input = await page.$('input[data-test-id="web-address-entry-address1-q-input"]');
if (input) {
  await input.fill('123 Main Street');
} else {
  await log('[TM] Address 1 input not found');
}

const cityInput = await page.$('input[data-test-id="web-address-entry-city-q-input"]');
if (cityInput) {
  await cityInput.fill('Urbana');
} else {
  await log('[TM] City input not found');
}

await qSelect(
    page,
    'Alabama',
    'State',
    log,
    'div[data-test-id="web-address-entry-state-q-select"] input.q-select__focus-target'
  );

  


  const nextButton = await page.$("#navigationbuttons-rightbutton-q-btn");
  if (nextButton) {
    await nextButton.click();
  } else {
    await log(`Next button not found`);
  }
}

module.exports = { populateAddress };
