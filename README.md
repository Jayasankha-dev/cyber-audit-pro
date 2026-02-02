# cyber-audit-pro
Professional Security Audit &amp; Traffic Interception Browser

---

# 🛡️ CYBER-AUDIT PRO v3.0
*Download Latest Version*
https://github.com/Jayasankha-dev/cyber-audit-pro/releases/tag/v3.0

**Professional Grade Traffic Interceptor & Security Intelligence Engine**

### 📝 Project Description

**CYBER-AUDIT PRO** is a cutting-edge tool designed for web security auditing and real-time network analysis.
 It combines a high-performance **Electron-based UI** with a powerful **Python Intelligence Bridge**. 
While you browse any website, the engine works in the background to intercept traffic and automatically detect hidden vulnerabilities, data leaks,
and security threats.

**Core Features:**

* **Real-time Traffic Sniffer:** Monitors every HTTP/HTTPS request, capturing headers, cookies, and methods (GET/POST/XHR/Fetch).
* **Security Intelligence Engine:** Automatically scans for over 5 critical threats including SQL Injection, XSS, Email leaks, and exposed API Keys.
* **Stealth Module Injection:** A proprietary system to inject JavaScript payloads (Knight, Queen, God modules) directly into the target's DOM.
* **Python Command Bridge:** Execute advanced automation scripts (like Playwright testers) directly from the integrated terminal.

---

## 🚀 Setup & Installation Guide

To ensure the engine functions correctly, follow these steps:

### 1. System Prerequisites

* **Python Installed:** Download from [python.org](https://python.org). **Crucial:** Check "Add Python to PATH" during installation.
* **Required Libraries:** Open your terminal and run:
```bash
pip install playwright python-shell
playwright install chromium

```



### 2. Running the Application

* **Development Mode:** Run `npm start` in your project folder.
* **Production:** Run the generated `.exe` file. If Windows Defender flags it, click "More Info" -> "Run Anyway" (as this is a custom security tool).

---

## 💻 Terminal Command List

The integrated terminal allows you to interact with the Python core and the browser's JavaScript engine.

| Command Category | Input Example | Result / Description |
| --- | --- | --- |
| **Engine Status** | `py: ping` | Returns "PONG" if the Python Bridge is active. |
| **Payload Injection** | `inject:god` | Deploys the high-level 'God-King' module to the site. |
| **JS Execution** | `js: document.title` | Executes raw JavaScript in the webview context. |
| **Automation** | `py: import auto_tester; ...` | Triggers the automated Playwright login tester. |
| **Threat Intelligence** | (Automatic) | Displays `!!! ALERT !!!` when leaks or SQLi are found. |
| **System Clean** | `clear` | Wipes the terminal history for a new audit session. |

---

## 🛡️ Security Audit Workflow

1. **Reconnaissance:** Enter the target URL and click **EXECUTE_SCAN**.
2. **Monitoring:** Watch the **LIVE INTELLIGENCE STREAM** for traffic headers and automated alerts.
3. **Exploitation/Testing:** Use the `inject:` commands to test if the site is vulnerable to script injection.
4. **Reporting:** All critical findings are automatically saved to `security_audit.log` for your final report.

---

## ⚠️ Legal Disclaimer

This tool is intended for **Ethical Hacking** and **Educational Purposes** only. 
Unauthorized scanning or testing of websites without explicit permission is illegal. 
The developer is not responsible for any misuse of this software.

---

### Pro-Tip for Builders:

If you are sharing this as an `.exe`, remember that the recipient still needs Python installed on their system for the Intelligence Bridge to start. 
Your `bridge.py` and `modules/` folder must remain in the same directory as the executable.
