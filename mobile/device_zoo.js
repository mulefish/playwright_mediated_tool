/* Dear Future: Long live Firefox! But I am ignoring that one for now */
const { webkit, chromium } = require("playwright");

const phones = [
  { device: "iPhone SE", width: 375, height: 667, engine: "webkit", verdict: "bad" },
  // { device: "iPhone SE", width: 1000, height: 1000, engine: "webkit", verdict: "bad" },
  { device: "iPad", width: 810, height: 1080, engine: "chromium", verdict: "bad" },
  { device: "BlackBerry Z30", width: 360, height: 640, engine: "chromium", verdict: "good" },
  { device: "Galaxy S5", width: 360, height: 640, engine: "chromium", verdict: "good" },
  { device: "Galaxy S9+", width: 320, height: 658, engine: "chromium", verdict: "OK, but horizontally channeled" },
  { device: "Galaxy Tab S4", width: 712, height: 1138, engine: "chromium", verdict: "OK but unable to scroll down" },
  { device: "iPad Mini", width: 768, height: 1024, engine: "webkit" },
  { device: "iPhone 6 Plus", width: 414, height: 736, engine: "webkit" },
  { device: "iPhone 8", width: 375, height: 667, engine: "webkit" },
  { device: "iPhone XR", width: 414, height: 896, engine: "webkit" },
  { device: "iPhone 11 Pro", width: 375, height: 635, engine: "webkit" },
  { device: "iPhone 12 Mini", width: 375, height: 629, engine: "webkit" },
  { device: "iPhone 13", width: 390, height: 664, engine: "webkit" },
  { device: "iPhone 14 Pro", width: 393, height: 660, engine: "webkit" },
  { device: "Kindle Fire HDX", width: 800, height: 1280, engine: "chromium" },
  { device: "LG Optimus L70", width: 384, height: 640, engine: "chromium" },
  { device: "Nexus 5X", width: 412, height: 732, engine: "chromium" },
  { device: "Nexus 6P", width: 412, height: 732, engine: "chromium" },
  { device: "Pixel 2 XL", width: 411, height: 823, engine: "chromium" },
  { device: "Pixel 4a (5G)", width: 412, height: 765, engine: "chromium" },
  { device: "Pixel 7", width: 412, height: 839, engine: "chromium" },
  { device: "Moto G4", width: 360, height: 640, engine: "chromium" },
];

const getOneDevice = (deviceList, d1) => {
  return deviceList.filter((p) => p.device === d1);
};
const getTwoDevices = (deviceList, d1, d2) => {
  return deviceList.filter((p) => p.device === d1 || p.device === d2);
};
const getThreeDevices = (deviceList, d1, d2, d3) => {
  return deviceList.filter((p) => p.device === d1 || p.device === d2 || p.device === d3);
};
const getFourDevices = (deviceList, d1, d2, d3, d4) => {
  return deviceList.filter((p) => p.device === d1 || p.device === d2  || p.device === d3 || p.device === d4);
};

let openPages = 0;

const selected = getFourDevices(
  phones,
  "iPhone SE",
  "iPad",
  "iPhone 13",
  "Pixel 7"
);

(async () => {
  await Promise.all(
    selected.map(async ({ device, engine, width, height }) => {
      const browserType = { chromium, webkit }[engine];

      const windowWidth = width + 16;
      const windowHeight = height + 85;

      console.log(`Launching [${engine}] with device: "${device}" (${width}x${height})`);

      const browser = await browserType.launch({
        headless: false,
        args: [`--window-size=${windowWidth},${windowHeight}`],
      });

      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        permissions: ["geolocation"],
        userAgent:
          engine === "webkit"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
            : undefined,
      });

      const page = await context.newPage();
      openPages++;

      page.once("close", async () => {
        console.log(`Page closed for: "${device}"`);
        await browser.close();
        openPages--;
        if (openPages === 0) {
          console.log("All pages closed. Exiting.");
          process.exit(0);
        }
      });

      // Optional: force horizontal scrollbars to show
      await page.addStyleTag({ content: 'html, body { overflow-x: scroll !important; }' });

      const url = `http://localhost:4201/?device=${encodeURIComponent(
        device
      )}&engine=${engine}`;
      await page.goto(url, { timeout: 0, waitUntil: "load" });
    })
  );
})();
