/**
 * CYBER-AUDIT PRO v3.0 | Secure Context Bridge
 * Handles isolated communication between the Auditor UI and the System Core.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 1. TRANSMIT: Send commands from UI to Python Engine
    runPython: (command) => {
        ipcRenderer.send('run-python', command);
    },

    // 2. RECEIVE: Listen for text-based messages from Python (Alerts/Logs)
    onTerminalMsg: (callback) => {
        ipcRenderer.on('terminal-msg', (event, data) => callback(data));
    },

    // 3. RECEIVE: Listen for raw network traffic data for the live stream
    onTerminalData: (callback) => {
        ipcRenderer.on('terminal-data', (event, data) => callback(data));
    },

    // 4. EXECUTE: High-priority channel for injecting Chess Module payloads
    onExecutePayload: (callback) => {
        ipcRenderer.on('execute-payload', (event, scriptContent) => callback(scriptContent));
    }
});

/**
 * SECURITY NOTE: 
 * We do not expose 'ipcRenderer.send' directly to avoid XSS risks.
 * Every function here is a mapped, controlled gateway.
 */