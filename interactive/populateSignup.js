// populateSignup.js
const {
  randomFromArray,
  getRandom10Letters,
  firstNamesArray,
  middleNamesArray,
  radio_click,
  qSelect,
} = require("./function_library");

async function populateSignup(page, log, phoneOverride = null) {
  try {
    const phone =
      phoneOverride || Math.floor(Math.random() * 9000000000) + 1000000000;
    await page.fill('input[data-test-id="mobile-phone-input"]', String(phone));

    const fn = randomFromArray(firstNamesArray);
    const mn = randomFromArray(middleNamesArray);
    const ln = getRandom10Letters();

    const inputs = await page.$$("input");
    const names = [fn, mn, ln];
    for (let i = 0; i < names.length && i < inputs.length; i++) {
      await inputs[i].fill(names[i]);
    }

    const email = `${fn}.${ln}@something.com`;
    await page.fill('input[data-test-id="email-input"]', email);
    radio_click(
      page,
      'div[data-test-id="contact-preference"] div[role="radio"]'
    );
    await qSelect(page, '10', 'Month', log, 'input[role="combobox"][aria-label="Month"]');
    await qSelect(page, '10', 'Day', log, 'input[role="combobox"][aria-label="Day"]');
    await qSelect(page, '2011', 'Year', log, 'input[role="combobox"][aria-label="Year"]');
    const x = `div[data-testid="countries-dropdown-select"] input[role="combobox"]`
    await qSelect(page, 'United States of America', 'Country', log, x);
    // const y = `'#name-entry-suffix-q-select input[role="combobox"]');`
    // await selectOption('Jr', 'Suffix', y); // No longer on the page? 

    const cb = await page.$("div.q-checkbox__bg.absolute");
    if (cb) {
      const wrapper = await cb.evaluateHandle((el) =>
        el.closest(".q-checkbox")
      );
      const classList = await wrapper.evaluate((el) => [...el.classList]);
      if (!classList.includes("q-checkbox--truthy")) {
        await cb.click();
      } else {
        await log("Checkbox already checked");
      }
    } else {
      await log("Checkbox not found");
    }
  } catch (err) {
    await log("Error: " + err.message);
  }
}

module.exports = { populateSignup };
