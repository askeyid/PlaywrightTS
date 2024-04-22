import { test } from '../test-options'
import { faker } from '@faker-js/faker'

test('parametrized methods', async({pageManager, formLayoutsPage}) => {
    const randomEmail = faker.internet.email()
    const randomPassword = faker.internet.password()

    await pageManager.onFormLayoutsPage().submitUsingGridFormWithCredenntialsAndSelectOption(randomEmail, randomPassword, 'Option 2')
})