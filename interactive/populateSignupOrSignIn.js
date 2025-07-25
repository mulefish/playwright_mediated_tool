// populateSignup.js
const {
  randomFromArray,
  firstNamesArray,
  middleNamesArray,
  lastNamesArray,
  radioClick,
  qSelect,
  qCheckCheckbox
} = require("./function_library");

async function populateSignup(page, log, phoneOverride = null) {
  try {
    const phone =
      phoneOverride || Math.floor(Math.random() * 9000000000) + 1000000000;
    await page.fill('input[data-test-id="mobile-phone-input"]', String(phone));

    const fn = randomFromArray(firstNamesArray);
    const mn = randomFromArray(middleNamesArray);
    const ln = randomFromArray(lastNamesArray);

    const inputs = await page.$$("input");
    const names = [fn, mn, ln];
    for (let i = 0; i < names.length && i < inputs.length; i++) {
      await inputs[i].fill(names[i]);
    }

    const email = `${fn}.${ln}@something.com`;
    await page.fill('input[data-test-id="email-input"]', email);
    await qSelect(page, '10', 'Month', log, 'input[role="combobox"][aria-label="Month"]');
    await qSelect(page, '10', 'Day', log, 'input[role="combobox"][aria-label="Day"]');
    await qSelect(page, '2011', 'Year', log, 'input[role="combobox"][aria-label="Year"]');
    const x = `div[data-testid="countries-dropdown-select"] input[role="combobox"]`
    await qSelect(page, 'United States of America', 'Country', log, x);
    await qCheckCheckbox(page, log, 'div.q-checkbox__bg.absolute');

    // THis is on which page? 
    const y = 'div#name-entry-suffix-q-select input[role="combobox"]'
    await qSelect(page, 'II', 'suffix', log, y);

    const z = 'div[data-test-id="contact-preference"] div[role="radio"]'
    radioClick(page,log, z);

    // Intentionally NOT clicking the Next button 

  } catch (err) {
    await log("Error: " + err.message);
  }
}

module.exports = { populateSignup };
