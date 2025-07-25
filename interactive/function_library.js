// function_library.js

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const firstNamesArray = [
  "Able",
  "Barbara",
  "Charlie",
  "Diana",
  "Erik",
  "DeClancy",
];
const middleNamesArray = ["A", "B", "C", "D", "E"];
const lastNamesArray = [
  "Moon",
  "Ocean",
  "Dusk",
  "Shore",
  "Star",
  "Jupiter",
  "Saturn",
  "Finch",
  "Wren",
  "Swift",
];

// WHy so defensive? Defeat Quasar.
async function radioClick(page, log, node_selector) {
  const radio = await page.$(node_selector);
  if (radio) {
    await radio.scrollIntoViewIfNeeded();
    await page.waitForTimeout(50);
    try {
      await radio.click({ force: true });
    } catch (err) {
      const box = await radio.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      } else {
        log(`Could not click radio button: ${node_selector}`);
      }
    }
  } else {
    log(`radio_click: node not found: ${node_selector}`);
  }
}

// WHy so defensive? Defeat Quasar.
async function qSelect(page, value, label, log, selector = null) {
  if (!selector) {
    selector = `label:has-text("${label}") + div input`;
  }

  const input = await page.$(selector);
  if (input) {
    await input.click();
    await page.waitForTimeout(50);
    await page.keyboard.type(value);
    await page.keyboard.press("Enter");
  } else {
    await log(`qSelect: Selector not found for label "${label}"`);
  }
}
// WHy so defensive? Defeat Quasar.
async function qCheckCheckbox(page, log, selector) {
  const cb = await page.$(selector);
  if (!cb) {
    await log(`qCheckCheckbox: Not found → ${selector}`);
    return;
  }
  const wrapper = await cb.evaluateHandle((el) => el.closest(".q-checkbox"));
  const classList = await wrapper.evaluate((el) => [...el.classList]);
  if (!classList.includes("q-checkbox--truthy")) {
    // More quasar madness: Quasar adds the class q-checkbox--truthy" if it already clicked 
    await cb.click();
  } // SIlly! It is already clicked!
}

module.exports = {
  randomFromArray,
  firstNamesArray,
  middleNamesArray,
  lastNamesArray,
  radioClick,
  qSelect,
  qCheckCheckbox,
};
