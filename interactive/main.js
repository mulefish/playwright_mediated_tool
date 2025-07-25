const { chromium } = require("playwright");
const { populateSignup } = require("./populateSignupOrSignIn");
const { populateLocation } = require("./populateLocation");
const { populateLegalName } = require("./populateLegalName"); // ✅ new import

(async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--window-size=1280,800"],
  });

  const context = await browser.newContext({
    viewport: null,
  });

  const page = await context.newPage();
  await page.goto("http://localhost:4200/app/");
  await page.waitForLoadState("networkidle");

  // Inject UI panel with buttons and log area
  await page.evaluate(() => {
    const panel = document.createElement("div");
    panel.innerHTML = `
      <button id="run-000">Phone: 0000000000</button><br/>
      <button id="run-111">Phone: 1111111111</button><br/>
      <button id="run-location">Pick First Location</button><br/>
      <button id="run-legalname">Next from Legal Name</button><br/>
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

  // Logging helper
  const log = async (msg) => {
    await page.evaluate((msg) => {
      const logArea = document.getElementById("logArea");
      if (logArea) {
        logArea.value += msg + "\n";
        logArea.scrollTop = logArea.scrollHeight;
      }
    }, msg);
  };

  // Clear log helper
  const clearLog = async () => {
    await page.evaluate(() => {
      const logArea = document.getElementById("logArea");
      if (logArea) {
        logArea.value = "";
      }
    });
  };

  // Track page turns (by URL changes)
  let lastUrl = page.url();
  let lastTurnTime = Date.now();

  page.on("framenavigated", async () => {
    const newUrl = page.url();
    if (newUrl !== lastUrl) {
      const now = Date.now();
      const duration = now - lastTurnTime;
      lastTurnTime = now;
      await clearLog(); // clear previous logs
      await log(`Page changed: ${lastUrl} → ${newUrl} (${duration}ms)`);
      lastUrl = newUrl;
    }
  });

  // Expose population functions to the browser context
  await page.exposeFunction("runPopulate000", async () => {
    await populateSignup(page, log, "0000000000");
  });

  await page.exposeFunction("runPopulate111", async () => {
    await populateSignup(page, log, "1111111111");
  });

  await page.exposeFunction("runPopulateLocation", async () => {
    await populateLocation(page, log);
  });

  await page.exposeFunction("runPopulateLegalName", async () => {
    await populateLegalName(page, log);
  });

  // Hook browser-side buttons to exposed functions
  await page.evaluate(() => {
    document.getElementById("run-000")?.addEventListener("click", () => {
      window.runPopulate000();
    });

    document.getElementById("run-111")?.addEventListener("click", () => {
      window.runPopulate111();
    });

    document.getElementById("run-location")?.addEventListener("click", () => {
      window.runPopulateLocation();
    });

    document.getElementById("run-legalname")?.addEventListener("click", () => {
      window.runPopulateLegalName();
    });

    document.getElementById("clear-log")?.addEventListener("click", () => {
      const logArea = document.getElementById("logArea");
      if (logArea) logArea.value = "";
    });
  });
})();
