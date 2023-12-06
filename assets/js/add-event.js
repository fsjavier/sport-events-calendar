let newEventArray = []

if (document.getElementById('add-event-form')) {
    document.getElementById('add-event-form').addEventListener('submit', (e) => {
        e.preventDefault();
    
        // Retrieve data from the form
        const eventCompetitionName = document.getElementById('competition-name').value;
        const eventCompetitionStage = document.getElementById('competition-stage').value;
        const eventCompetitionEventDate = document.getElementById('event-date').value;
        const eventCompetitionHomeTeamName = document.getElementById('home-team-name').value;
        const eventCompetitionHomeTeamSlug = eventCompetitionHomeTeamName.toLowerCase().replace(' ','-')
        const eventCompetitionHomeTeamGoals = parseInt(document.getElementById('home-team-goals').value);
        const eventCompetitionAwayTeamName = document.getElementById('away-team-name').value;
        const eventCompetitionAwayTeamSlug = eventCompetitionAwayTeamName.toLowerCase().replace(' ','-')
        const eventCompetitionAwayTeamGoals = parseInt(document.getElementById('away-team-goals').value);
        const eventCompetitionEvenStatus = document.getElementById('event-status').value;
    
        // Create event with provided data
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

        newEventArray.push(newEvent)
        document.getElementById('add-event-form').reset()

        localStorage.setItem('newEventArray', JSON.stringify(newEventArray));
    });
}

