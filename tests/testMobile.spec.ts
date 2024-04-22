import test, { expect } from "@playwright/test"

test.beforeEach(async({page}, testInfo) => {
    await page.goto('/')
    const sideBar = page.locator('nb-sidebar');

    if (testInfo.project.name == 'mobile' && (await sideBar.getAttribute('class')).includes('collapsed')) {
        await page.locator('.sidebar-toggle').click()
    }

    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

    if (testInfo.project.name == 'mobile' && (await sideBar.getAttribute('class')).includes('expanded')) {
        await page.locator('.sidebar-toggle').click()
    }
})

test('input fields', async({page}) => {
    const usingGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email'})
    await usingGridEmailInput.fill('test@test.com')
    await expect(usingGridEmailInput).toHaveValue('test@test.com')
})