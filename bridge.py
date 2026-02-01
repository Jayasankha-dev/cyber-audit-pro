import sys
import json
import re
from datetime import datetime

# 1. PROFESSIONAL SECURITY SIGNATURES
SCAN_PATTERNS = {
    "Email_Leak": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "API_Key_Auth": r"(?i)(?:api_key|apikey|auth_token|secret|access_token|bearer)[:=]\s*['\"]?([a-zA-Z0-9-_]{16,})['\"]?",
    "Potential_SQLi": r"(?i)(UNION\s+SELECT|INSERT\s+INTO|DROP\s+TABLE|--|#|OR\s+1=1)",
    "Reflected_XSS": r"(?i)(<script.*?>|javascript:|onerror=|onload=)",
    "Sensitive_File": r"(\.env|\.git|\.config|etc/passwd)",
}

def log_event(message):
    """Saves critical alerts to a local audit log."""
    with open("security_audit.log", "a") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")

def analyze_intelligence(line):
    """Primary analysis engine for incoming data streams."""
    line = line.strip()
    
    # A. Handle Terminal Commands (Direct Input)
    # Check for direct commands before trying to parse as JSON traffic
    if line.startswith("inject:"):
        module = line.split(":")[1].strip()
        return f"CMD:INJECT:{module}"

    if line.lower() == "ping":
        return "PONG: Intelligence Engine is Online."

    # B. Handle Traffic Data (JSON Payload)
    try:
        payload = json.loads(line)
        url = payload.get("url", "")
        method = payload.get("method", "GET")
        headers = str(payload.get("headers", ""))

        found_threats = []
        search_space = f"{url} {headers}"

        # Run Scan Patterns to identify vulnerabilities
        for label, pattern in SCAN_PATTERNS.items():
            if re.search(pattern, search_space):
                found_threats.append(label)

        if found_threats:
            alert = f"!!! ALERT !!! | TYPE: {', '.join(found_threats)} | TARGET: {url[:60]}"
            log_event(alert)
            return alert
        
        return None # Silence for clean traffic
        
    except json.JSONDecodeError:
        # If it's not JSON and not a known command, treat it as a raw message
        return f"[PY_ENGINE]: {line}"

# INITIALIZATION SIGNAL
# Using sys.stdout.flush() to ensure Electron UI receives the signal immediately
print("INTELLIGENCE BRIDGE v3.0 ACTIVE | LISTENING FOR PAYLOADS...")
sys.stdout.flush()

# MAIN LOOP
# Reads from sys.stdin which is connected to Electron's pythonBridge.send()
for line in sys.stdin:
    if not line.strip():
        continue
        
    result = analyze_intelligence(line)
    if result:
        print(result)
        sys.stdout.flush()
