import { Locator, Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatepickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInput = this.page.getByPlaceholder('Form Picker')
        await calendarInput.click()
        const dateToAccert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
    
        await expect(calendarInput).toHaveValue(dateToAccert)
    }

    async selectDatepickerWithRangeFromToday(startDatFromToday: number, endDayFromToday: number) {
        const calendarInput = this.page.getByPlaceholder('Range Picker')
        await calendarInput.click()

        const startDateToAccert = await this.selectDateInTheCalendar(startDatFromToday)
        const endDateToAccert = await this.selectDateInTheCalendar(endDayFromToday)
    
        await expect(calendarInput).toHaveValue(`${startDateToAccert} - ${endDateToAccert}`)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()

        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short'} )
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long'} )
        const expectedYear = date.getFullYear()
        const dateToAccert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator(':not(.bounding-month).day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click()
        return dateToAccert
    }
}