// Script to open and close "event added" modal
const eventAddedModal = document.getElementById("event-added-modal");
const closeEventAddedModal = document.getElementById("close-modal");

// When the user clicks on <span> (x), close the modal
closeEventAddedModal.addEventListener("click", function() {
    eventAddedModal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == eventAddedModal) {
        eventAddedModal.style.display = "none";
    }
});

// Array to store new events created by the user
let newEventArray = [];

// If the add event form element exists add an event listeners when submitted
if (document.getElementById('add-event-form')) {
    document.getElementById('add-event-form').addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Retrieve data from the form
        const eventCompetitionName = document.getElementById('competition-name').value;
        const eventCompetitionStage = document.getElementById('competition-stage').value;
        const eventCompetitionEventDate = document.getElementById('event-date').value;
        const eventCompetitionHomeTeamName = document.getElementById('home-team-name').value;
        const eventCompetitionHomeTeamSlug = eventCompetitionHomeTeamName.toLowerCase().replace(' ','-');
        const eventCompetitionHomeTeamGoals = parseInt(document.getElementById('home-team-goals').value) ? parseInt(document.getElementById('home-team-goals').value) : 0;
        const eventCompetitionAwayTeamName = document.getElementById('away-team-name').value;
        const eventCompetitionAwayTeamSlug = eventCompetitionAwayTeamName.toLowerCase().replace(' ','-');
        const eventCompetitionAwayTeamGoals = parseInt(document.getElementById('away-team-goals').value) ? parseInt(document.getElementById('away-team-goals').value) : 0;
        const eventCompetitionEvenStatus = document.getElementById('event-status').value;
    
        // Create new event with provided data
        const newEvent = {
            "status": eventCompetitionEvenStatus,
            "dateVenue": eventCompetitionEventDate,
            "homeTeam": {
                "name": eventCompetitionHomeTeamName,
                'slug':eventCompetitionHomeTeamSlug
            },
            "awayTeam": {
                "name": eventCompetitionAwayTeamName,
                "slug": eventCompetitionAwayTeamSlug
            },
            "result": {
                "homeGoals": eventCompetitionHomeTeamGoals,
                "awayGoals": eventCompetitionAwayTeamGoals,
                "goals": []
            },
            "stage": {
                "name": eventCompetitionStage
            },
            "originCompetitionName": eventCompetitionName
        };

        // Push the new event to the array and clear the form
        newEventArray.push(newEvent);
        document.getElementById('add-event-form').reset();

        // Save the array in local storage to be retrieved and added to the calendar
        // and show the modal to confirm the event has been added
        localStorage.setItem('newEventArray', JSON.stringify(newEventArray));
        eventAddedModal.style.display = "flex";
    });
}

