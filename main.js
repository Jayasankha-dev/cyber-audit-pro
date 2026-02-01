/**
 * CYBER-AUDIT PRO v3.0 | Main Controller
 * Professional Grade Traffic Interceptor & Module Injector
 * FIXED: Build Path for Portable EXE
 */

const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const { PythonShell } = require('python-shell');
const fs = require('fs');

let win;
let pythonBridge;

// Disable security warnings in console for a cleaner look
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
    win = new BrowserWindow({
        width: 1500,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        title: "CYBER-AUDIT PRO | Engine Active",
        webPreferences: {
            nodeIntegration: false,    
            contextIsolation: true,     
            webviewTag: true,           
            preload: path.join(__dirname, 'preload.js'),
            plugins: true,
            webSecurity: true, 
            autoplayPolicy: 'no-user-gesture-required'
        }
    });

    // --- FIX 1: Grant Permissions for Media/Video ---
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ['media', 'fullscreen', 'notifications'];
        if (allowedPermissions.includes(permission)) {
            callback(true);
        } else {
            callback(false);
        }
    });

    // Set a modern User-Agent to avoid being blocked by video platforms
    win.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    // --- FIX 2: CSP BYPASS WITH MEDIA SUPPORT ---
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        let responseHeaders = { ...details.responseHeaders };
        
        responseHeaders['Content-Security-Policy'] = [
            "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
            "script-src * 'unsafe-inline' 'unsafe-eval'; " +
            "media-src * data: blob:; " + 
            "connect-src * 'unsafe-inline';"
        ];

        callback({
            responseHeaders: responseHeaders
        });
    });

    // --- FIX 3: DYNAMIC PATH FOR PYTHON ENGINE ---
   
    const scriptFolder = app.isPackaged 
        ? process.resourcesPath 
        : __dirname;

    const options = {
        mode: 'text',
        pythonOptions: ['-u'], 
        scriptPath: scriptFolder, 
        pythonPath: 'python' 
    };

    pythonBridge = new PythonShell('bridge.py', options);

    pythonBridge.on('message', (message) => {
        if (win) {
            win.webContents.send('terminal-msg', message);
            
            if (message.includes("CMD:INJECT:")) {
                const parts = message.split(":");
                const moduleName = parts[parts.length - 1].trim();
                executeModuleInjection(moduleName);
            }
        }
    });

    pythonBridge.on('stderr', (err) => { 
        console.error("PY_ERR:", err); 
    });

    // 2. GLOBAL TRAFFIC INTERCEPTOR
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        const isMediaStream = details.url.includes('.m3u8') || details.url.includes('.ts') || details.url.includes('.mp4');
        
        if (win && !isMediaStream && (details.resourceType === 'main_frame' || details.resourceType === 'xhr' || details.resourceType === 'fetch')) {
            win.webContents.send('terminal-data', {
                method: details.method,
                url: details.url
            });

            const auditData = JSON.stringify({
                method: details.method,
                url: details.url,
                headers: details.requestHeaders
            });
            
            if (pythonBridge) {
                pythonBridge.send(auditData + "\n");
            }
        }
        callback({ cancel: false });
    });

    win.loadFile('index.html');

    win.on('closed', () => {
        if (pythonBridge) pythonBridge.childProcess.kill();
        win = null;
    });
}

// 3. SECURE MODULE LOADER (FIXED PATH FOR MODULES)
function executeModuleInjection(type) {
    const fileMap = {
        'knight': 'knight-defender.js',
        'bishop': 'bishop-sniper.js',
        'queen': 'queen-intel.js',
        'god': 'god-king-ultimate.js',
        'rook': 'rook-bot.js',
        'guard': 'guard-bot.js'
    };

    const targetFile = fileMap[type];
    if (!targetFile) return;

    
    const scriptFolder = app.isPackaged 
        ? process.resourcesPath 
        : __dirname;

    const filePath = path.join(scriptFolder, 'modules', targetFile);
    
    if (fs.existsSync(filePath)) {
        try {
            const scriptContent = fs.readFileSync(filePath, 'utf8');
            win.webContents.send('execute-payload', scriptContent);
        } catch (err) {
            win.webContents.send('terminal-msg', `🚨 [ERROR] Failed to read module: ${targetFile}`);
        }
    } else {
        win.webContents.send('terminal-msg', `🚨 [MISSING] Module file not found: ${targetFile}`);
    }
}

ipcMain.on('run-python', (event, code) => {
    if (pythonBridge) {
        pythonBridge.send(code + "\n");
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});