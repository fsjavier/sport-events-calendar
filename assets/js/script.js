// Get HTML Elements
const currentMonthElement = document.getElementById('current-month');
const calendarElement = document.getElementById('calendar');
const prenexElements = document.querySelectorAll('#calendar-navigation button');
const activeDayElement = document.getElementById('active-day');
const dayEventsElement = document.getElementById('day-events');

// File paths
const sportDataJson = '/assets/json/sportData.json';

// Initialize date
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const sportsDateDisplayOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
};
let activeDay = date.toLocaleDateString('en-AT', sportsDateDisplayOptions);

// Variable to store Sports data from JSON
let sportsEvents;


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
    currentMonthElement.innerText = `${year} ${monthNames[month]}`;

    // Store calendar HTML days
    let daysHtml = '';

    // Populate calendar with last days of previous months
    for (let day = DayNumberFirstDayOfMonth ; day > 0; day--) {
        const monthFormatted = month.toString().padStart(2, '0');
        const dayFormatted = (lastDayOfPreviousMonthDate + 1 - day).toString().padStart(2, '0');
        const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
        daysHtml += `
            <div class="calendar-day last-month-day" data-date="${dateFormatted}">
                ${lastDayOfPreviousMonthDate + 1 - day}
            </div>
        `;
    }

    // Populate calendar with days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const calendarDate = new Date(year, month, day);
        const isToday = calendarDate.toDateString() === new Date().toDateString();
        const monthFormatted = (month + 1).toString().padStart(2, '0');
        const dayFormatted = day.toString().padStart(2, '0');
        const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
        daysHtml += `
            <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateFormatted}">
                ${day}
            </div>
        `;
    }

    // Add first days of next month
    for (let day = DayNumberLastDayOfMonth; day < 6; day++) {
        const monthFormatted = (month + 2).toString().padStart(2, '0');
        const dayFormatted = (day - DayNumberLastDayOfMonth + 1).toString().padStart(2, '0');
        const dateFormatted = `${year}-${monthFormatted}-${dayFormatted}`;
        daysHtml += `
            <div class="calendar-day next-month-day" data-date="${dateFormatted}">
                ${day - DayNumberLastDayOfMonth + 1}
            </div>
        `;
    }

    // Populate calendar
    calendarElement.innerHTML = daysHtml;

    // Attach a click event listener to each calendar day
    const calendarDaysElements = document.querySelectorAll('.calendar-day');
    calendarDaysElements.forEach(day => {
        day.addEventListener("click", () => {
            const date = new Date(day.getAttribute('data-date'));
            activeDay = date.toLocaleDateString('en-AT', sportsDateDisplayOptions);
            activeDayElement.innerHTML = activeDay;
            displaySportsEventsSummary(sportsEvents, date);
        });
    });
}

// Attach a click event listener to navigate months
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
        generateCalendar(year, month);
    });
});

/**
 * Fetches a JSON file, cleans up trailing commas from objects
 * and returnsa the cleaned data
 */
async function fetchJsonData(file) {
    try {
        const response = await fetch(file);
        const jsonText = await response.text();
        // regex to remove trailing commas, source: 
        // https://stackoverflow.com/questions/34344328/json-remove-trailing-comma-from-last-object
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


/**
 * Filter the events for a given date and inserts in the HTML
 * file a summary of the event.
 * Each event has a link to a details page built with the 
 * date, home team slug and away team slug.
*/
function displaySportsEventsSummary(sportsEvents, date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate()).toString().padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;
    const dayEvents = sportsEvents.filter(sportsEvent => sportsEvent.dateVenue === dateFormatted);
    let eventsHTML = '';
    if (dayEvents.length > 0) {
        dayEvents.forEach(dayEvent => {
            if (
                dayEvent.dateVenue && dayEvent.dateVenue !== null && dayEvent.dateVenue !== undefined &&
                dayEvent.homeTeam && dayEvent.homeTeam.slug !== null && dayEvent.homeTeam.slug !== undefined &&
                dayEvent.awayTeam && dayEvent.awayTeam.slug !== null && dayEvent.awayTeam.slug !== undefined
            ){
                const slug = `${dayEvent.dateVenue}_${dayEvent.homeTeam.slug}_${dayEvent.awayTeam.slug}`;
                eventsHTML += `
                    <a href='event_details.html?eventId=${slug}'>
                        <div class="summary-event">
                            <div>
                                ${dayEvent.originCompetitionName}
                            </div>
                            <div>
                                ${dayEvent.homeTeam.name} ${dayEvent.status === 'played' ? dayEvent.result.homeGoals : ''} - ${dayEvent.status === 'played' ? dayEvent.result.awayGoals : ''} ${dayEvent.awayTeam.name} ${dayEvent.status === 'played' ? '' : "Not started"}
                            </div>
                        </div>
                    </a>
                `;
            } else {
                eventsHTML += 'There are no events';
            }
        });
        dayEventsElement.innerHTML = eventsHTML;
    } else {
        dayEventsElement.innerHTML = 'There are no events';
    }
}

async function init() {
    sportsEvents = await fetchJsonData(sportDataJson);
    generateCalendar(year, month);
    activeDayElement.innerText = activeDay;
    displaySportsEventsSummary(sportsEvents, date);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
