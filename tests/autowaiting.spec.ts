import { test, expect } from '@playwright/test'
import { config } from 'process'

test.beforeEach(async({page}, testInfo) => {
    // testInfo.setTimeout(testInfo.timeout + 2000);
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    const text = await page.locator('#content').textContent()
    console.log(text)
})

test.skip('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
    // await successButton.click()
    // const text = await successButton.textContent()
    // await successButton.waitFor({state: "visible"})

    // const text = await successButton.allTextContents()

    // expect(text).toContain('Data loaded with AJAX get request.')
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000})
})

test.skip('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    // wait for element
    // await page.waitForSelector('.bg-success');

    // wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // wait for network calls to be completed ('NOT RECOMMENDED')
    // await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeouts', async({page}) => {
    // test.slow()
    // test.setTimeout(16000)
    const successButton = page.locator('.bg-success')
    await successButton.click()
})
