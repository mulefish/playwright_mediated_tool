// function_library.js

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// TODO: Names MIGHT collide - maybe just a UUID would be safer 
const firstNamesArray = [
  "Alpha",
  "Bravo",
  "Charlie",
  "Delta",
  "Echo",
  "Foxtrot",
  "Golf",
  "Hotel",
  "India",
  "Juliet",
  "Kilo",
  "Lima",
  "Mike",
  "November",
  "Oscar",
  "Papa",
  "Quebec",
  "Sierra",
  "Tango",
  "Uniform",
  "Whiskey",
  "Victor",
  "XRay",
  "Yankee",
  "Zulu"
];
const middleNamesArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P","Q","R", "S", "T", "U", "V","W", "X", "Y", "Z"];
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
  "Shabone", 
  "Maggy",
  "Eeboo",
  "MRC",
  "Frank"
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
  log("this is qCheckCheckbox")
  const cb = await page.$(selector);
  if (!cb) {
    await log(`qCheckCheckbox: Not found → ${selector}`);
    return;
  }
  const wrapper = await cb.evaluateHandle((el) => el.closest(".q-checkbox"));
  const classList = await wrapper.evaluate((el) => [...el.classList]);
  if (!classList.includes("q-checkbox--truthy")) {
    log('qCheckCheckbox checked')
    // More quasar madness: Quasar adds the class q-checkbox--truthy" if it already clicked 
    await cb.click();
  } else { 
    log('qCheckCheckbox already checked')
  }
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
