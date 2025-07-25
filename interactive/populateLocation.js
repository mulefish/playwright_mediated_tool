// populateLocation.js

/**
 * Simulates selecting the first location card and clicking "Next"
 * @param {import('playwright').Page} page - The Playwright page object
 * @param {Function} log - Logging function that logs messages to in-page log area
 */
async function populateLocation(page, log) {
    try {
      const container = await page.$('div.col.scroll.q-pa-md');
      const firstCard = container && await container.$('div.location-card');
  
      if (firstCard) {
        await firstCard.click();
        await log(`First location card clicked`);
  
        // Wait briefly before attempting to click "Next"
        await page.waitForTimeout(100);
  
        const nextButton = await page.$('span.block:text("Next")');
        if (nextButton) {
          await nextButton.click();
          await log(`Clicked "Next" button`);
        } else {
          await log(`"Next" button not found`);
        }
      } else {
        await log(`No location cards found`);
      }
    } catch (err) {
      await log(`Error in populateLocation: ${err.message}`);
    }
  }
  
  module.exports = { populateLocation };
  