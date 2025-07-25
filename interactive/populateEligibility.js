// populateEligibility.js
const { qCheckCheckbox } = require('./function_library');
async function populateEligibility(page, log) {
  try {
    await qCheckCheckbox(page, log, '[data-testid="agreement-checkbox"] .q-checkbox__bg');

    const nextButton = await page.$('span.block:text("Next")');
    if (nextButton) {
      await nextButton.click();
    } else {
      await log(`Next button not found on eligibility page`);
    }
  } catch (err) {
    await log(`Eligibility error: ${err.message}`);
  }
}

module.exports = { populateEligibility };
