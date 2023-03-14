# Esports-Viewer: North American League of Legends Viewer Web Application

Welcome to the Esports-Viewer! This is an Ajax project designed for League of Legends viewers who want to view and track their favorite team's rosters, schedule, games, and standings.

## Getting Started

To get started, simply follow the link on the right sidebar under the About section.

You can also download the repository and load the project by opening the `index.html` file in your web browser.


## Features

- View team rosters: Users can view the rosters of their favorite North American League of Legends teams.

- Track team schedules: Users can view the upcoming matches for each of their selected teams.

- Monitor team standings: Users can view the current standings of all the teams in the North American League of Legends.

- Select favorite teams: Users can select their favorite teams and save them for quick access to the team rosters, schedules, and standings.

- Mobile-responsive design: The application is designed to be mobile-responsive, making it easy to navigate and use on smartphones and tablets.

- AJAX implementation: The application uses AJAX to dynamically update the content without requiring the user to refresh the page.

## Usage

1. Home [Teams-Page]

When you first open the application, you will be taken to the Home Page where you can select your favorite North American League of Legends teams. Participating teams will be represented by their respective icons. Select a team by clicking on its icon. Upon selection, the icon will be marked with a blue indicator. Once you have selected your desired team, press the "Selected Teams" button to store your favorites in local storage. 

To navigate to the Teams Page, click on the "Teams" tab in the navigation bar (for Desktop) or select "Teams" after opening the hamburger menu icon (for Mobile).

2. [Standings-Page]

The Standings Page displays the current standings for the North American League of Legends. You can see the total number of wins and losses for each team, as well as their rank in the overall standings. 

To navigate to the Standings Page, click on the "Standings" tab in the navigation bar (for Desktop) or select "Standings" after opening the hamburger menu icon (for Mobile).

You can also click on the individual "standings" cells to open up the rosters-page for that specific team.

3. [Rosters-Page]

The Rosters Page displays the current roster for the selected team from the standings page. You can view the team's roster which includes the player's role, name, username, Nationality, and image.

4. [Schedule-Page]

On the Schedule Page, you can view the upcoming matches for each of your selected teams or view the remaining matches in the series. You can click on the tabs under the "Schedule" header to swap between the selected teams from the "Teams-Page" or view the entire series by clicking "Liked Teams" or "All Games" respectively. You can switch the teams viewed in the "Liked Teams" tab by going back to the "Teams-Page" and re-selecting the desired icons.

To navigate to the Schedule Page, click on the "Schedule" tab in the navigation bar (for Desktop) or select "Schedule" after opening the hamburger menu icon (for Mobile)

##T echnologies Used

This application was built using the following technologies:
- HTML and CSS for structuring and styling the web pages.
- JavaScript for the dynamic functionality of the application.
- XMLHttpRequests for AJAX implementation of JavaScript code.
- PandaScore API for retrieving the data on North American League of Legends teams, including rosters, schedules, and standings.
- LFZ-CORS to proxy the back-end API for retrieving data from the PandaScore API.

## Conclusion

As my first AJAX project, this web application allowed me to scale from a Figma design to dealing with a real-time API, demonstrating the power of client-server interactions. While the project did not focus on modularity, it provided me with a solid foundation for accessing back-end data, displaying it on the front-end, and manipulating it using JavaScript.

Through this project, I learned how to work with the PandaScore API to retrieve data on not only North American League of Legends teams, but also other games, regional data, and obtain RDBMS data. I also gained experience in structuring and styling web pages using HTML and CSS and implementing Javascript to DOM Query and create different elements.

Overall, this project served as an excellent introduction to AJAX and client-server communication, and has provided me with valuable skills that I can use in future web development projects.
