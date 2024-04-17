import { expect, test } from '@playwright/test'

test.beforeEach(async({page}) => {
    
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('the first test', async ({page}) => {
    await page.getByText('Forms').click()
})

test('locator syntax rules', async({page}) => {
    await page.locator('nb-radio').first().click()
    page.locator('#inputEmail1')
    page.locator('.shape-rectangle')
    page.locator('[placeholder="Email"]')
    page.locator('[class="all the classes"]')
    // combine
    page.locator('input.shape-rectangle#inputEmail1')
    // by partial text
    page.locator(':text("Using")')
    page.locator(':text-is("Using the Grid")')
})

test('user facing locator', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).last().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the Grid').click();
    await page.getByTestId('SignIn').click();
    await page.getByTitle('IoT Dashboard').click();
})

test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', { name: "sIgN iN" }).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent element', async({page}) => {
    await page.locator('nb-card', { hasText: "Radios"})
        .getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1')})
        .getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ hasText: "Check me out" })
        .getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger')})
        .getByRole('textbox', { name: "password" }).click()
    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox')})
        .filter({ hasText: "sign in" })
        .getByRole('textbox', { name: "password" }).click()
    await page.locator(':text-is("Using the Grid")').locator('..')
        .getByRole('textbox', { name: "Email" }).click()
})

test('Reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const emailInput = basicForm.getByRole('textbox', { name: "Email" })
    const checkBox = basicForm.locator('nb-checkbox')

    await emailInput.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Psw12345')
    await checkBox.click()
    await basicForm.getByRole('button', { name: "Submit" }).click()

    await expect(emailInput).toHaveValue('test@test.com')
})

test('extracting values', async({page}) => {
    // single test value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent();

    expect(buttonText).toEqual('Submit')
    expect(buttonText).not.toEqual('ssssss')

    // radio
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()

    expect(allRadioButtonsLabels).toContain("Option 1");

    // input
    const emailField = basicForm.getByRole('textbox', { name: 'Email'})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@test.com')

    // attr value
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')

    // general assertions
    const value = 5
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    // soft assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})

