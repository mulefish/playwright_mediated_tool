const { chromium } = require("playwright");
const { populateSignup } = require("./populateSignupOrSignIn");
const { populateLocation } = require("./populateLocation");
const { populateLegalName } = require("./populateLegalName");
const { populateBirthAndCitizenship } = require("./populateBirthAndCitizenship");
const { populateEligibility } = require("./populateEligibility");
const { populateAttributes } = require("./populateAttributes");
const { populateAddress } = require("./populateAddress");
const { populatePhotoId } = require("./populatePhotoId");
const { injectControlPanel } = require("./controlPanel");


(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--window-size=1280,800"],
  });
  //ignoreHTTPSErrors = deal with https
  const context = await browser.newContext({ viewport: null, ignoreHTTPSErrors: true, });
  const page = await context.newPage();

  await page.goto("https://localhost:4202/app/");
  await page.waitForLoadState("networkidle");

  // The buttons
  await injectControlPanel(page);

  // Logging helpers
  const log = async (msg) => {
    await page.evaluate((msg) => {
      const logArea = document.getElementById("logArea");
      if (logArea) {
        logArea.value += msg + "\n";
        logArea.scrollTop = logArea.scrollHeight;
      }
    }, msg);
  };

  const clearLog = async () => {
    await page.evaluate(() => {
      const logArea = document.getElementById("logArea");
      if (logArea) {
        logArea.value = "";
      }
    });
  };

  // Page navigation logging
  let lastUrl = page.url();
  let lastTurnTime = Date.now();

  page.on("framenavigated", async () => {
    const newUrl = page.url();
    if (newUrl !== lastUrl) {
      const now = Date.now();
      const duration = now - lastTurnTime;
      lastTurnTime = now;
      await clearLog();
      await log(`Page changed: ${lastUrl} → ${newUrl} (${duration}ms)`);
      lastUrl = newUrl;
    }
  });

  // Expose Playwright → browser context functions
  await page.exposeFunction("runPopulate000", () => populateSignup(page, log, "0000000000"));
  await page.exposeFunction("runPopulate111", () => populateSignup(page, log, "1111111111"));
  await page.exposeFunction("runPopulateLocation", () => populateLocation(page, log));
  await page.exposeFunction("runPopulateLegalName", () => populateLegalName(page, log));
  await page.exposeFunction("runPopulateBirthAndCitizenship", () => populateBirthAndCitizenship(page, log));
  await page.exposeFunction("runPopulateEligibility", () => populateEligibility(page, log));
  await page.exposeFunction("runPopulateAttributes", () => populateAttributes(page, log));
  await page.exposeFunction("runPopulateAddress", () => populateAddress(page, log));
  await page.exposeFunction("runPopulatePhotoId", () => populatePhotoId(page, log));

  //
  // Bind buttons to exposed functions
  await page.evaluate(() => {
    const bind = (id, fn) => {
      document.getElementById(id)?.addEventListener("click", fn);
    };

    bind("run-000", () => window.runPopulate000());
    bind("run-111", () => window.runPopulate111());
    bind("run-location", () => window.runPopulateLocation());
    bind("run-legalname", () => window.runPopulateLegalName());
    bind("run-birthcitizen", () => window.runPopulateBirthAndCitizenship());
    bind("run-eligibility", () => window.runPopulateEligibility());
    bind("run-attributes", () => window.runPopulateAttributes());
    bind("run-address", () => window.runPopulateAddress());
    
    bind("run-photo", () => window.runPopulatePhotoId());
    bind("clear-log", () => {
      const logArea = document.getElementById("logArea");
      if (logArea) logArea.value = "";
    });
  });
})();
