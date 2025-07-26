const { qSelect } = require("./function_library");

async function populatePhotoId(page, log) {
  log("hello2");
  await qSelect(
    page,
    "Unexpired U.S. Passport Book",
    "Document Type",
    log,
    'div[data-test-id="photo-id-document-select"] input.q-select__focus-target'
  );
  const nextButton = await page.$('span.block:text("Next")');
  if (nextButton) {
    await nextButton.click();
    await log(`Clicked "Next" button`);
  } else {
    await log(`"Next" button not found`);
  }
}

module.exports = { populatePhotoId };
