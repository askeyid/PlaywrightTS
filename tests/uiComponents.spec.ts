import { expect, test } from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('/')

})

test.describe('Form Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email'})

        await usingGridEmailInput.fill('test@test.com')
        await usingGridEmailInput.clear()
        await usingGridEmailInput.pressSequentially('test2@test.com', { delay: 250})

        // generic assertion
        const inputValue = await usingGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        // locator assertion
        await expect(usingGridEmailInput).toHaveValue('test2@test.com')
    })

    test('radio buttons', async({page}) => {
        const usingGridForm = page.locator('nb-card', { hasText: 'Using the Grid' })
        //const option1 = usingGridForm.getByLabel('Option 1')
        const option1 = usingGridForm.getByRole('radio', { name: 'Option 1'})
        const option2 = usingGridForm.getByRole('radio', { name: 'Option 2'})

        await option1.check({ force: true })

        const option1Status = await option1.isChecked()
        // generic assertion
        expect(option1Status).toBeTruthy()
        // locator assertion
        await expect(option1).toBeChecked()

        await option2.check({ force: true} )
        // locator assertions
        expect(await option1.isChecked()).toBeFalsy()
        expect(await option2.isChecked()).toBeTruthy()
    })

})

test.describe('Toastr page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    })

    test('checkboxes', async({page}) => {
        const box1 = page.getByLabel('Hide on click')
        const box2 = page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' })
        const box3 = page.getByLabel('Show toast with icon')

        expect(await box1.isChecked()).toBeTruthy()
        expect(await box2.isChecked()).toBeFalsy()
        expect(await box3.isChecked()).toBeTruthy()

        await box1.click({force: true})
        await box2.click({force: true})
        await box3.click({force: true})

        expect(await box1.isChecked()).toBeFalsy()
        expect(await box2.isChecked()).toBeTruthy()
        expect(await box3.isChecked()).toBeFalsy()

        await box1.check({force: true})
        expect(await box1.isChecked()).toBeTruthy()
        await box1.uncheck({force: true})
        expect(await box1.isChecked()).toBeFalsy()
    })

    test('checkboxes loop', async({page}) => {
        const labels = page.getByRole('checkbox')

        for(const box of await labels.all()) {
            await box.check({force: true})
            expect(await box.isChecked()).toBeTruthy()
        }

        for(const box of await labels.all()) {
            await box.uncheck({force: true})
            expect(await box.isChecked()).toBeFalsy()
        }
    })

})

test('lists and dropdowns', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    //await dropdownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    //await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    //await optionList.filter({hasText: 'Cosmic'}).click()
    const header = page.locator('nb-layout-header')
    //await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        'Light': 'rgb(255, 255, 255)',
        'Dark': 'rgb(34, 43, 69)',
        'Cosmic': 'rgb(50, 50, 89)',
        'Corporate': 'rgb(255, 255, 255)',
    }

    for(const color in colors) {
        await dropdownMenu.click()
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
    }
})

test.describe('Tooltips', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()
    })

    test('tooltip', async({page}) => {
        const tooltipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
        
        await tooltipCard.getByRole('button', { name: 'Top' }).hover()

        //const tooltip = page.getByRole('tooltip') // works only for element with role='tooltip'
        const topTooltip = page.locator('nb-tooltip')

        const text = await topTooltip.textContent()
        expect(text).toEqual('This is a tooltip')

        await expect(topTooltip).toHaveText('This is a tooltip')
    })
})

test('Dialogs', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // create a listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept();
    })

    const rowText = await page.locator('tbody tr').first().allTextContents()
    await expect(page.locator('tbody tr').first()).toContainText('mdo@gmail.com')

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()

    await expect(page.locator('tbody tr').first()).not.toContainText('mdo@gmail.com')

})

test('Tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1. get the row by any text in this row
    // const row = page.getByRole('row', { name: 'twitter@outlook.com'})
    // await row.locator('.nb-edit').click()
    // await page.locator('input-editor').getByPlaceholder('Age').clear()
    // await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    // await page.locator('.nb-checkmark').click()

    // // 2. get the row based on the value in the specific column
    // await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    // //const targetRowById = page.getByRole('row', { name: '11'}).filter({ has: page.locator('td').nth(1).getByText('11') })
    // const targetRowById = page.getByRole('row').filter( { has: page.locator('td').nth(1).getByText('11')})
    // await targetRowById.locator('.nb-edit').click()
    // await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    // await page.locator('input-editor').getByPlaceholder('E-mail').fill('hello@test.com')
    // await page.locator('.nb-checkmark').click()

    // 3. text filter of the table

    const ages = ['20', '30', '40', '200']

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)

        const pageRows = page.locator('tbody tr')

        for (let row of await pageRows.all()) {
            if (age === '200') {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                const cellValue = await row.locator('td').last().textContent()
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('Datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    let date = new Date()
    date.setDate(date.getDate() + 14)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short'} )
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long'} )
    const expectedYear = date.getFullYear()
    const dateToAccert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `

    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('nb-calendar-day-cell:not(.bounding-month)').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInput).toHaveValue(dateToAccert)
})

test('Sliders', async({page}) => {
    // update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.6309')
        node.setAttribute('cy', '232.6309')
    })

    await tempGauge.click()

    // mouse movement

    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
})