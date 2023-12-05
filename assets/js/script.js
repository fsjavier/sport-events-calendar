// Get HTML Elements
const currentMonthElement = document.getElementById('current-month');
const calendarElement = document.getElementById('calendar');
const prenexElements = document.querySelectorAll('#calendar-navigation button');

// File paths
const sportDataJson = '/assets/json/sportData.json'

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
    const DayNumberFirstDayOfMonth = firstDayOfMonthDate.getUTCDay();

    // Get the last day of the month
    const lastDayOfMonthDate = new Date(year, month + 1, 0);

    // Day of the week when the month ends
    const DayNumberLastDayOfMonth = lastDayOfMonthDate.getUTCDay();

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
            <div class='calendar-day last-month-day'>
                ${lastDayOfPreviousMonthDate + 1 - day}
            </div>
        `;
    }

    // Populate calendar with days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const calendarDate = new Date(year, month, day);
        const isToday = calendarDate.toDateString() === new Date().toDateString();
        const monthFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
        const dayFormatted = day.toString().padStart(2, '0');
        const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
        daysHtml += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateFormatted}">
                ${day}
            </div>
        `;
    }

    // Add first days of next month
    for (let i = DayNumberLastDayOfMonth; i < 6; i++) {
        daysHtml += `
            <div class='calendar-day next-month-day'>
                ${i - DayNumberLastDayOfMonth + 1}
            </div>
        `;
    }

    calendarElement.innerHTML = daysHtml;
}

// Attach a click event listener to navigate month
prenexElements.forEach(preNex => {

    // When an element is clicked
    preNex.addEventListener("click", () => {

        // Check if the element is "calendar-prev"
        // or "calendar-next"
        month = preNex.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {

            // Set the date to the first day of the 
            // month with the new year
            date = new Date(year, month, 1);

            // Set the year to the new year
            year = date.getFullYear();

            // Set the month to the new month
            month = date.getMonth();
        }

        // Call the generateCalendar function
        // to update the calendar
        generateCalendar(year, month)
    });
});

async function fetchJsonData(file) {
    try {
        const response = await fetch(file);
        const jsonText = await response.text();
        // regex to remove trailing commas, source: 
        https://stackoverflow.com/questions/34344328/json-remove-trailing-comma-from-last-object
        const regex = /\,(?=\s*?[\}\]])/g;
        const fixedJsonData = jsonText.replace(regex, '');
        const jsonData = JSON.parse(fixedJsonData);
        return jsonData.data;
    }
    catch(e) {
        console.log('Error: ', e);
        return [];
    }
}

fetchJsonData(sportDataJson);


document.addEventListener('DOMContentLoaded', () => {
    generateCalendar(year, month)
})
