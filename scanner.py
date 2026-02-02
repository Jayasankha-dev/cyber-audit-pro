import asyncio
from playwright.async_api import async_playwright

async def scan():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('https://www.google.com')
        
        inputs = await page.query_selector_all('input')
        with open('scan_results.txt', 'w') as f:
            f.write('Google Scan Results:\n')
            for i in inputs:
                name = await i.get_attribute("name")
                f.write(f'Field: {name}\n')
        
        await browser.close()
        print('SUCCESS: Data saved to scan_results.txt')

if __name__ == "__main__":
    asyncio.run(scan())