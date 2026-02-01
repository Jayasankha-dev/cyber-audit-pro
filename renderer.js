/**
 * CYBER-AUDIT PRO v3.0 | Renderer Logic
 * Handles UI interactions, terminal logging, and communication with the Main process.
 */

const api = window.electronAPI;
const wv = document.getElementById('target-view');
const terminal = document.getElementById('terminal-output');
const cmdInput = document.getElementById('cmd-input');
const urlInput = document.getElementById('url-input');
const navBtn = document.getElementById('btn-navigate');
const threatCounter = document.getElementById('threat-count');

// --- NEW: NAVIGATION BUTTON ELEMENTS ---
const backBtn = document.getElementById('btn-back');
const fwdBtn = document.getElementById('btn-forward');
const reloadBtn = document.getElementById('btn-reload');
const homeBtn = document.getElementById('btn-home');

let alertsFound = 0;

// --- 1. NAVIGATION CONTROL ---

// Execute Scan / Navigate function
navBtn.onclick = () => {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    addLog(`[SYSTEM] Initiating scan on: ${url}`, 'system');
    wv.src = url;
};

// Back Button Logic
backBtn.onclick = () => {
    if (wv.canGoBack()) {
        wv.goBack();
    }
};

// Forward Button Logic
fwdBtn.onclick = () => {
    if (wv.canGoForward()) {
        wv.goForward();
    }
};

// Reload Button Logic
reloadBtn.onclick = () => {
    wv.reload();
    addLog("[SYSTEM] Reloading session...", "info");
};

// Home Button Logic
homeBtn.onclick = () => {
    urlInput.value = "https://www.google.com";
    navBtn.click();
};

// Automatically update URL bar when clicking links inside the webview
wv.addEventListener('did-navigate', (event) => {
    urlInput.value = event.url;
    // Navigation buttons color feedback
    backBtn.style.color = wv.canGoBack() ? 'var(--accent-primary)' : 'var(--text-dim)';
    fwdBtn.style.color = wv.canGoForward() ? 'var(--accent-primary)' : 'var(--text-dim)';
});

// Handle 'Enter' key on URL input field
urlInput.onkeydown = (e) => { if (e.key === 'Enter') navBtn.click(); };


// --- 2. TERMINAL LOGGING SYSTEM ---
function addLog(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log ${type}`;
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    entry.innerText = `[${timeStr}] ${message}`;
    terminal.appendChild(entry);
    
    setTimeout(() => {
        terminal.scrollTop = terminal.scrollHeight;
    }, 10);
}


// --- 3. INTER-PROCESS COMMUNICATION (IPC) MESSAGES ---
api.onTerminalMsg((msg) => {
    if (msg.includes('!!! VULNERABILITY DETECTED !!!') || msg.includes('ALERT')) {
        addLog(msg, 'threat');
        alertsFound++;
        threatCounter.innerText = `THREATS: ${alertsFound}`;
    } else if (msg.includes('SUCCESS') || msg.includes('ACTIVE')) {
        addLog(msg, 'success');
    } else {
        addLog(msg, 'info');
    }
});

api.onTerminalData((data) => {
    addLog(`[TRAFFIC] ${data.method} | ${data.url}`, 'info');
});


// --- 4. INJECTION HANDSHAKE ---
api.onExecutePayload((payload) => {
    const inject = () => {
        wv.executeJavaScript(payload)
            .then(() => addLog("[INJECT] Module successfully deployed.", "success"))
            .catch(err => addLog(`[ERROR] Injection failed: ${err.message}`, "threat"));
    };

    if (wv.isLoading()) {
        wv.addEventListener('dom-ready', inject, { once: true });
    } else {
        inject();
    }
});


// --- 5. COMMAND LINE INTERFACE (CLI) HANDLER ---
cmdInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
        const cmd = cmdInput.value.trim();
        if (!cmd) return;

        if (cmd.startsWith('py:')) {
            api.runPython(cmd.replace('py:', ''));
        } 
        else if (cmd.startsWith('inject:')) {
            api.runPython(cmd);
        }
        else if (cmd.startsWith('js:')) {
            wv.executeJavaScript(cmd.replace('js:', ''));
            addLog("[MANUAL] Executing JS payload...", "system");
        } else if (cmd === 'clear') {
            terminal.innerHTML = '';
        }

        cmdInput.value = '';
    }
};