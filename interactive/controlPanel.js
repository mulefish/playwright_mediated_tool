// controlPanel.js

module.exports.injectControlPanel = async function (page) {
  await page.evaluate(() => {
    const panel = document.createElement("div");
    panel.innerHTML = `
        <div id="dragHandle" style="cursor: move; background: #eee; color:blue;">Drag me
          <div id="toggleButton" style="background: #eee; color: blue;">Hide me</div></div>
          <div id="panelBody">
            <button id="run-000">Phone: 000</button><br/>
            <button id="run-111">Phone: 111</button><br/>
            <button id="run-location">Location</button><br/>
            <button id="run-legalname">Legal Name</button><br/>
            <button id="run-birthcitizen">Birth & Citizenship</button><br/>
            <button id="run-eligibility">Eligibility</button><br/>
            <button id="run-attributes">Attributes</button><br/>
            <button id="run-address">Address</button><br/>
            <button id="run-photo">PhotoId</button><br/>
            <button id="run-payment">Payment</button><br/>
          <hr/>
          <button id="clear-log">Clear Log</button><hr/>
          <textarea id="logArea" rows="3" style="width:100%;"></textarea>
        </div>
      `;
    Object.assign(panel.style, {
      position: "fixed",
      top: "10px",
      right: "100px",
      background: "white",
      border: "1px solid black",
      padding: "10px",
      zIndex: 9999,
    });
    panel.id = "floatingPanel";
    document.body.appendChild(panel);

    // Make draggable
    const dragHandle = document.getElementById("dragHandle");
    const floatingPanel = document.getElementById("floatingPanel");
    const panelBody = document.getElementById("panelBody");
    const toggleButton = document.getElementById("toggleButton");

    toggleButton.addEventListener("click", () => {
      if (panelBody.style.display === "none") {
        panelBody.style.display = "block";
        toggleButton.textContent = "Hide me";
      } else {
        panelBody.style.display = "none";
        toggleButton.textContent = "Show me";
      }
    });

    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    dragHandle.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - floatingPanel.getBoundingClientRect().left;
      offsetY = e.clientY - floatingPanel.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        floatingPanel.style.left = `${e.clientX - offsetX}px`;
        floatingPanel.style.top = `${e.clientY - offsetY}px`;
        floatingPanel.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "auto";
    });
  });
};
