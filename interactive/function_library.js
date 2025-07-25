// function_library.js

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandom10Letters() {
  return Array.from({ length: 10 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("");
}

const firstNamesArray = ["Alice", "Bob", "Charlie", "Diana"];
const middleNamesArray = ["Ray", "Lee", "Marie", "John"];

// WHy so defensive? Defeat Quasar.
async function radio_click(page, node_selector) {
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
          console.warn(`Could not click radio button: ${node_selector}`);
        }
      }
    } else {
      console.warn(`radio_click: node not found: ${node_selector}`);
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
      await page.keyboard.press('Enter');
      await log(`Selected "${value}" for ${label}`);
    } else {
      await log(`qSelect: Selector not found for label "${label}"`);
    }
  }

module.exports = {
  randomFromArray,
  getRandom10Letters,
  firstNamesArray,
  middleNamesArray,
  radio_click,
  qSelect
};
