import asyncio
from playwright.async_api import async_playwright

async def auto_login_test():
    async with async_playwright() as p:
        
        browser = await p.chromium.launch(headless=False) 
        page = await browser.new_page()
        
        print("[SYSTEM] Accessing Facebook Login Page...")
        await page.goto('https://www.facebook.com')
        
        
        print("[SYSTEM] Injecting Credentials...")
        await page.fill('input[name="email"]', 'test_user_gemini')
        await page.fill('input[name="pass"]', 'security_pass_123')
        
        
        await asyncio.sleep(5) 
        await browser.close()
        print("[SYSTEM] Test Finished Successfully.")

if __name__ == "__main__":
    asyncio.run(auto_login_test())