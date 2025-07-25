const { qSelect } = require("./function_library");

async function populateAttributes(page, log) {
  await qSelect(
    page,
    "5",
    "Feet",
    log,
    'div[aria-label="Feet"] input.q-select__focus-target'
  );
  await qSelect(
    page,
    "6",
    "Inches",
    log,
    'div[aria-label="Inches"] input.q-select__focus-target'
  );
  await qSelect(
    page,
    "Pink",
    "Hair Color",
    log,
    "#attributes-hair-color-select input.q-select__focus-target"
  );
  await qSelect(
    page,
    "Blue",
    "Eye Color",
    log,
    "#attributes-eye-color-select input.q-select__focus-target"
  );

  const weightInput = await page.$('input[data-test-id="weight-input"]');
  if (weightInput) {
    await weightInput.fill("100");
  } else {
    await log(`[TM] Weight input not found`);
  }

  const nextButton = await page.$("#navigationbuttons-rightbutton-q-btn");
  if (nextButton) {
    await nextButton.click();
  } else {
    await log(`Next button not found`);
  }
}

module.exports = { populateAttributes };
