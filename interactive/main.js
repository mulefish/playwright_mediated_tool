const { chromium } = require("playwright");
const { populateSignup } = require("./populateSignupOrSignIn");
const { populateLocation } = require("./populateLocation");
const { populateLegalName } = require("./populateLegalName");
const { populateBirthAndCitizenship } = require("./populateBirthAndCitizenship");
const { populateEligibility } = require("./populateEligibility");
const { populateAttributes } = require("./populateAttributes");
const { populateAddress } = require("./populateAddress");


(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--window-size=1280,800"],
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  await page.goto("http://localhost:4200/app/");
  await page.waitForLoadState("networkidle");

  // Inject UI panel
  await page.evaluate(() => {
    const panel = document.createElement("div");
    panel.innerHTML = `
      <button id="run-000">Phone: 0000000000</button><br/>
      <button id="run-111">Phone: 1111111111</button><br/>
      <button id="run-location">Pick First Location</button><br/>
      <button id="run-legalname">Next from Legal Name</button><br/>
      <button id="run-birthcitizen">Birth & Citizenship</button><br/>
      <button id="run-eligibility">Eligibility</button><br/>
      <button id="run-attributes">Attributes</button><br/>
      <button id="run-address">Address</button><br/>
      <hr/>
      <button id="clear-log">Clear Log</button><hr/>
      <textarea id="logArea" rows="10" style="width:100%;"></textarea>
    `;
    Object.assign(panel.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      background: "white",
      border: "1px solid black",
      padding: "10px",
      zIndex: 9999,
    });
    document.body.appendChild(panel);
  });

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
    bind("clear-log", () => {
      const logArea = document.getElementById("logArea");
      if (logArea) logArea.value = "";
    });
  });
})();
