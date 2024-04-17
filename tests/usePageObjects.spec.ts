import { test } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to different pages', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    const randomEmail = faker.internet.email()
    const randomPassword = faker.internet.password()

    await pm.navigateTo().formLayoutsPage()
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'})
    await pm.onFormLayoutsPage().submitUsingGridFormWithCredenntialsAndSelectOption(randomEmail, randomPassword, 'Option 2')
})

test('fill inline form', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/\s+/g, '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})

test('datepicker', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(14)
})

test('datepicker with range', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(1, 7)
})