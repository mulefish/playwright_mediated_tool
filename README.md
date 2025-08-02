# playwright_mediated_tool repo
https://github.com/mulefish/playwright_mediated_tool

# What is 'fish_for_api_keys.js'?
This script does not really fit playwright, but I did not want to make a new repo for it. Seems like overkill. 
Anyhow, what is it? It scans source files for hardcoded strings that might be API keys,tokens, or credentials 
committed to the codebase.

# WHat is a 'computer mediated tool'?
Use Playwright to move the web quickly into a reasonible state but allow the end user to also interact with the WebApp. 

# Security
This repo contains ZERO secrets. 
Further, it is targetted at an app that runs on 'localhost' AND needs a VPN to function. 

# Mobile 
cd mobile 
node device_zoo.js 

# interactive 
cd interactive   
node main_twe.js < launch 4200 twe >   
OR
npm run twe < launch 4200 twe > 

# screenshot
![Screenshot](screenshot.png)