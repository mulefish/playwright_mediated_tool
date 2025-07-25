// populateBirthAndCitizenship.js
const { qSelect } = require('./function_library');

async function populateBirthAndCitizenship(page, log) {
  try {
    const x = '[aria-testid="countrycitystateselector-state-q-select"] input[role="combobox"]'
    await qSelect(page,'Alabama','State',log,x);

    const citySelector = 'input[aria-testid="webcountrycitystateselector-city-q-input"]'
    const cityInput = await page.$(citySelector);
    if (cityInput) {
      await cityInput.fill('Urbana');
    } else {
      await log(`City input not found`);
    }

    const nextButton = await page.$('#navigationbuttons-rightbutton-q-btn');
    if (nextButton) {
      await nextButton.click();
    } else {
      await log(`Next button not found`);
    }
  } catch (err) {
    await log(`populateBirthAndCitizenship error: ${err.message}`);
  }
}

module.exports = { populateBirthAndCitizenship };
