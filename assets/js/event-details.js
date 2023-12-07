// Get HTML Elements
const eventDetailsLocalDateElement = document.getElementById('event-details-local-date');
const eventDetailsCompetitionElement = document.getElementById('event-details-competition');
const eventDetailsGameStatusElement = document.getElementById('event-details-game-status');
const eventDetailsHomeTeamElement = document.getElementById('event-details-home-team');
const eventDetailsAwayTeamElement = document.getElementById('event-details-away-team');
const eventDetailsGoalsSectionElement = document.getElementById('event-details-goals-section');
const eventDetailsGoalsElement = document.getElementById('event-details-goals');
const eventDetailsGoalScorersElement = document.getElementById('event-details-goal-scorers');

// Get sport events data
const sportEventsFromLocalStorage = localStorage.getItem('sportsEventsStorage');
const sportsEvents = sportEventsFromLocalStorage ? JSON.parse(sportEventsFromLocalStorage) : [];

// Create variables for event data
let eventDate;
let eventHomeTeamSlug;
let eventAwayTeamSlug;

/**
 * Get date and teams slugs from url
 */
function getEventDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventID = urlParams.get('eventId');
    eventDate = eventID.split('_')[0];
    eventHomeTeamSlug = eventID.split('_')[1];
    eventAwayTeamSlug = eventID.split('_')[2];
}

/**
 * Get date and teams slugs from url
 */
function filterEvent (eventDate, eventHomeTeamSlug, eventAwayTeamSlug) {
    const eventToDisplay = sportsEvents.filter(sportEvent => (
        sportEvent.dateVenue === eventDate &&
        sportEvent.homeTeam.slug === eventHomeTeamSlug &&
        sportEvent.awayTeam.slug === eventAwayTeamSlug
    ))[0];
    return eventToDisplay;
}

/**
 * Get the event for a given data and teams
 * and populates HTML with the event data
 */
function displayEventInformation() {
    const eventToDisplay = filterEvent(eventDate, eventHomeTeamSlug, eventAwayTeamSlug);
    const localDateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const localDateString = new Date(eventToDisplay.dateVenue).toLocaleString('en-AT', localDateOptions);
    const gameStatus = eventToDisplay.status === 'played' ? 'Game finished' : ' Game not started';
    const competitionName = eventToDisplay.originCompetitionName;
    const competitionStage = eventToDisplay.stage.name.toLowerCase();
    const homeTeamName = eventToDisplay.homeTeam.name;
    const homeTeamGoals = eventToDisplay.result.homeGoals;
    const awayTeamName = eventToDisplay.awayTeam.name;
    const awayTeamGoals = eventToDisplay.result.awayGoals;
    const goals = eventToDisplay.result.goals;

    const goalScorers = document.createElement('ul');
    for (let i = 0; i < goals.length; i++) {
        let goal = document.createElement('li');
        goal.innerHTML = goals[i];
        goalScorers.appendChild(goal);
    }

    eventDetailsLocalDateElement.innerText = localDateString;
    eventDetailsGameStatusElement.innerText = gameStatus;
    eventDetailsCompetitionElement.innerHTML = `${competitionName} - <span id="event-details-competition-stage">${competitionStage}</span>`;
    eventDetailsHomeTeamElement.innerText = `${homeTeamName} ${homeTeamGoals} `;
    eventDetailsAwayTeamElement.innerText = ` ${awayTeamGoals} ${awayTeamName}`;
    if (goals.length === 0) {
        eventDetailsGoalsSectionElement.classList.add('hide');
    }
    eventDetailsGoalsElement.innerText = goals.length > 0 ? 'Goals' : '';
    eventDetailsGoalScorersElement.appendChild(goalScorers);
}

/**
 * Call the functions to get url data and
 * display the event information
 */
function init() {
    getEventDataFromUrl();
    displayEventInformation();
}

init();