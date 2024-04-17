import { expect } from '@playwright/test'
import { test } from '../test-options'

test.beforeEach(async({page}) => {
    await page.goto(process.env.UITESTINGPLAYFROUND)
    await page.getByText('Button Triggering AJAX Request').click()
    const text = await page.locator('#content').textContent()
    console.log(text)
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000})
})

test.describe('alternative waits', () => {

    test('wait for element selector', async({page}) => {
        const successButton = page.locator('.bg-success')
    
        await page.waitForSelector('.bg-success');
    
        const text = await successButton.allTextContents()
        
        expect(text).toContain('Data loaded with AJAX get request.')
    })

    test('wait for particular API response', async({page}) => {
        const successButton = page.locator('.bg-success')
        
        await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

        const text = await successButton.allTextContents()
        
        expect(text).toContain('Data loaded with AJAX get request.')
    })
    
    test('wait for ALL APIS calls to be completed', async({page}) => {
        const successButton = page.locator('.bg-success')
    
        await page.waitForLoadState('networkidle')
    
        const text = await successButton.allTextContents()
        
        expect(text).toContain('Data loaded with AJAX get request.')
    })

})

test('timeouts', async({page}) => {
    // test.slow()
    // test.setTimeout(16000)
    const successButton = page.locator('.bg-success')
    await successButton.click()
})
