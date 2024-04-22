import { expect, test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to different pages', { tag: ['@smoke', '@single']}, async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

type CustomOptions = {
    onFormLayoutPage: FormLayoutsPage,
    onDatepickerPage: DatepickerPage,
    say: string
}

const tunedTest = test.extend<CustomOptions>({

    onFormLayoutPage: async ({ page }, use) => {
        const pm = new PageManager(page)
        await pm.navigateTo().formLayoutsPage()
        await use(pm.onFormLayoutsPage())
    },

    onDatepickerPage: async ({ page }, use) => {
        const pm = new PageManager(page)
        await pm.navigateTo().datepickerPage()
        await use(pm.onDatepickerPage())
    }

})

tunedTest('parametrized methods', { tag: '@smoke' }, async({onFormLayoutPage}) => {
    const randomEmail = faker.internet.email()
    const randomPassword = faker.internet.password()

    await onFormLayoutPage.page.screenshot({path: 'screenshots/formLayoutsPage.png'})
    await onFormLayoutPage.submitUsingGridFormWithCredenntialsAndSelectOption(randomEmail, randomPassword, 'Option 2')
})

tunedTest('fill inline form', async({onFormLayoutPage}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com`

    await onFormLayoutPage.submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})

tunedTest('datepicker', async({onDatepickerPage}) => {
    await onDatepickerPage.selectCommonDatePickerDateFromToday(14)
})

tunedTest('datepicker with range', async({onDatepickerPage}) => {
    await onDatepickerPage.selectDatepickerWithRangeFromToday(1, 7)
})