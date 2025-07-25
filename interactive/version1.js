// mainRunner.js
const { chromium } = require('playwright');
const { populateSignup } = require('./populateSignup');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await (await browser.newContext()).newPage();
  await page.goto('http://localhost:4200/app/');
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    const panel = document.createElement('div');
    panel.innerHTML = `
      <button id="run-000">Phone: 0000000000</button>
      <button id="run-111">Phone: 1111111111</button>
      <br><br>
      <textarea id="logArea" rows="10" style="width:100%;"></textarea>
    `;
    Object.assign(panel.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid black',
      padding: '10px',
      zIndex: 9999,
    });
    document.body.appendChild(panel);
  });

  const log = async (msg) => {
    await page.evaluate((msg) => {
      const logArea = document.getElementById('logArea');
      if (logArea) {
        logArea.value += msg + '\\n';
        logArea.scrollTop = logArea.scrollHeight;
      }
    }, msg);
  };

  // Hook exposed function
  await page.exposeFunction('runPopulate000', async () => {
    await populateSignup(page, log, '0000000000');
  });
  await page.exposeFunction('runPopulate111', async () => {
    await populateSignup(page, log, '1111111111');
  });

  // Hook browser-side events to exposed functions
  await page.evaluate(() => {
    document.getElementById('run-000')?.addEventListener('click', () => {
      window.runPopulate000();
    });
    document.getElementById('run-111')?.addEventListener('click', () => {
      window.runPopulate111();
    });
  });

})();
