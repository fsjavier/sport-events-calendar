const eventDetailsContainerElement = document.getElementById('event-details-container')
const eventDetailsLocalDateElement = document.getElementById('event-details-local-date')
const eventDetailsCompetitionElement = document.getElementById('event-details-competition')
const eventDetailsGameStatusElement = document.getElementById('event-details-game-status')
const eventDetailsHomeTeamElement = document.getElementById('event-details-home-team')
const eventDetailsAwayTeamElement = document.getElementById('event-details-away-team')
const eventDetailsGoalsSectionElement = document.getElementById('event-details-goals-section')
const eventDetailsGoalsElement = document.getElementById('event-details-goals')
const eventDetailsGoalScorersElement = document.getElementById('event-details-goal-scorers')

const sportEventsFromLocalStorage = localStorage.getItem('sportsEventsStorage');
const sportsEvents = sportEventsFromLocalStorage ? JSON.parse(sportEventsFromLocalStorage) : [];

let eventToDisplay;

let eventDate;
let eventHomeTeamSlug;
let eventAwayTeamSlug;

function getEventDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const eventID = urlParams.get('eventId')
    eventDate = eventID.split('_')[0]
    eventHomeTeamSlug = eventID.split('_')[1]
    eventAwayTeamSlug = eventID.split('_')[2]
}

function filterEvent (eventDate, eventHomeTeamSlug, eventAwayTeamSlug) {
    eventToDisplay = sportsEvents.filter(sportEvent => (
        sportEvent.dateVenue === eventDate &&
        sportEvent.homeTeam.slug === eventHomeTeamSlug &&
        sportEvent.awayTeam.slug === eventAwayTeamSlug
    ))[0]
}

function diplayEventInformation() {
    filterEvent(eventDate, eventHomeTeamSlug, eventAwayTeamSlug);
    const localDateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const localDateString = new Date(eventToDisplay.dateVenue).toLocaleString('en-AT', localDateOptions)
    const gameStatus = eventToDisplay.status === 'played' ? 'Game finished' : ' Game not started'
    const competitionName = eventToDisplay.originCompetitionName
    const competitionStage = eventToDisplay.stage.name.toLowerCase()
    const homeTeamName = eventToDisplay.homeTeam.name
    const homeTeamGoals = eventToDisplay.result.homeGoals
    const awayTeamName = eventToDisplay.awayTeam.name
    const awayTeamGoals = eventToDisplay.result.awayGoals
    const goals = eventToDisplay.result.goals

    let goalScorers = document.createElement('ul')
    for (let i = 0; i < goals.length; i++) {
        let goal = document.createElement('li');
        goal.innerHTML = goals[i];
        goalScorers.appendChild(goal)
    }

    eventDetailsLocalDateElement.innerText = localDateString
    eventDetailsGameStatusElement.innerText = gameStatus
    eventDetailsCompetitionElement.innerHTML = `${competitionName} - <span id="event-details-competition-stage">${competitionStage}</span>`
    eventDetailsHomeTeamElement.innerText = `${homeTeamName} ${homeTeamGoals} `
    eventDetailsAwayTeamElement.innerText = ` ${awayTeamGoals} ${awayTeamName}`
    if (goals.length === 0) {
        eventDetailsGoalsSectionElement.classList.add('hide')
    }
    eventDetailsGoalsElement.innerText = goals.length > 0 ? 'Goals' : ''
    eventDetailsGoalScorersElement.appendChild(goalScorers);
}

function init() {
    getEventDataFromUrl()
    diplayEventInformation()
}

init()