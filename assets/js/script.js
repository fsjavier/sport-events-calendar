// Get HTML Elements
const currentMonthElement = document.getElementById('current-month');
const calendarElement = document.getElementById('calendar');
const prenexIconsElements = document.querySelectorAll(".calendar-navigation span");

// Initialize date
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

/**
 * Generates the calendar based on the year and month passed as parameters.
 * Inserts the generated calendar in the HTML calendar element.
 */
function generateCalendar(year, month) {
    // Get date of the first day of the month
    const firstDayOfMonthDate = new Date(year, month, 1);

    // Day of the week when the month starts
    const DayNumberFirstDayOfMonth = firstDayOfMonthDate.getUTCDay()

    // Get the last day of the month
    const lastDayOfMonthDate = new Date(year, month + 1, 0);

    // Day of the week when the month ends
    const DayNumberLastDayOfMonth = lastDayOfMonthDate.getUTCDay()

    // Get the last day of the previous month
    const lastDayOfPreviousMonthDate = new Date(year, month, 0).getDate();

    // Nr. of days in the month
    const daysInMonth = lastDayOfMonthDate.getDate();

    // Month to be displayed in HTML
    currentMonthElement.innerText = `${year} ${monthNames[month]}`

    // Store calendar HTML days
    let daysHtml = '';

    // Populate calendar with last days of previous months
    for (let day = DayNumberFirstDayOfMonth ; day > 0; day--) {
        daysHtml += `
            <div class='calendar-day'>
                ${lastDayOfPreviousMonthDate + 1 - day}
            </div>
        `;
    }
    console.log(DayNumberFirstDayOfMonth)

    // Populate calendar with days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const calendarDate = new Date(year, month, day);
        const isToday = calendarDate.toDateString() === date.toDateString();
        const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
        const dayFormatted = day.toString().padStart(2, '0');
        const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`
        daysHtml += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateFormatted}">
                ${day}
            </div>
        `;
    }

    // Add first days of next month
    for (let i = DayNumberLastDayOfMonth; i < 6; i++) {
        daysHtml += `
            <div class='calendar-day'>
                ${i - DayNumberLastDayOfMonth + 1}
            </div>
        `;
    }

    calendarElement.innerHTML = daysHtml;
}


generateCalendar(year, month)
