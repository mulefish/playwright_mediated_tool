// populateLegalName.js

async function populateLegalName(page, log) {
    try {
      await page.waitForTimeout(100);
  
      const nextButton = await page.$('span.block:text("Next")');
      if (nextButton) {
        await nextButton.click();
        await log(`Clicked "Next" from Legal Name page`);
      } else {
        await log(`"Next" button not found on Legal Name page`);
      }
    } catch (err) {
      await log(`populateLegalName error: ${err.message}`);
    }
  }
  
  module.exports = { populateLegalName };
  