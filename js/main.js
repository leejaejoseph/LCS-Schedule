document.addEventListener('DOMContentLoaded', DOMLoaded);
function DOMLoaded() {
  getTeamsAPI();
  getStandingsAPI();
  getScheduleAPI();
}

document.querySelector('.page-teams').addEventListener('click', function () {
  data.view = 'teams';
  viewSwap('teams');
});

document.querySelector('.page-standings').addEventListener('click', function () {
  data.view = 'standings';
  viewSwap('standings');
});

document.querySelector('.page-schedule').addEventListener('click', function () {
  data.view = 'schedule';
  viewSwap('schedule');
});

function viewSwap(search) {
  var $containers = document.querySelectorAll('.container');
  for (var i = 0; i < $containers.length; i++) {
    if ($containers[i].getAttribute('data-view') === search) {
      data.view = search;
      $containers[i].classList.remove('hidden');
    } else {
      $containers[i].classList.add('hidden');
    }
  }
}

function getTeamsAPI() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pandascore.co/tournaments/8252/teams?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&sort=&page=1&per_page=50');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderTeamIcons(xhr.response);
    renderTeamRosters(xhr.response);
    viewSwap(data.view);
    updateTeamIdAndImgObj(xhr.response);
  });
  xhr.send();
}

function renderTeamIcons(teamsArray) {
  var $teams = document.querySelector('#teams');
  for (var i = 0; i < teamsArray.length; i++) {
    var $team = document.createElement('div');
    $team.setAttribute('class', 'col-sm-third col-lg-sixth');
    $teams.appendChild($team);

    var $teamWrapper = document.createElement('div');
    $teamWrapper.setAttribute('id', 'id-' + teamsArray[i].id);
    $teamWrapper.setAttribute('class', 'row team-wrapper');
    $team.appendChild($teamWrapper);

    var $teamIcon = document.createElement('a');
    $teamIcon.setAttribute('class', 'column-auto team-icon');
    $teamIcon.setAttribute('id', 'icon-' + teamsArray[i].id);
    $teamIcon.addEventListener('click', iconClicked);
    $teamWrapper.appendChild($teamIcon);

    var $teamClicker = document.createElement('div');
    $teamClicker.setAttribute('class', 'clicker');
    $teamIcon.appendChild($teamClicker);

    var $teamFrame = document.createElement('div');
    $teamFrame.setAttribute('class', 'row frame');
    $teamIcon.appendChild($teamFrame);

    var $teamFrameImage = document.createElement('img');
    $teamFrameImage.setAttribute('class', 'clicker-img');
    $teamFrameImage.setAttribute('src', teamsArray[i].image_url);
    $teamFrame.appendChild($teamFrameImage);

    var $teamFrameName = document.createElement('p');
    $teamFrameName.setAttribute('class', 'team-name');
    $teamFrameName.textContent = teamsArray[i].name;
    $teamWrapper.appendChild($teamFrameName);
  }
  if (data.selected.length > 0) {
    for (var j = 0; j < data.selected.length; j++) {
      $teams.querySelector('#id-' + data.selected[j]).querySelector('.clicker').classList.add('active');
    }
  }
}

function iconClicked(event) {
  var $DomTeamIcon = event.target.closest('.team-icon');
  clickerSwitch($DomTeamIcon);
}

function clickerSwitch(event) {
  var $specificClicker = event.querySelector('.clicker');
  if (!$specificClicker.classList.contains('active')) {
    $specificClicker.classList.add('active');
    addSelectedToData(event.closest('.team-wrapper').id);
  } else {
    $specificClicker.classList.remove('active');
    removeSelectedToData(event.closest('.team-wrapper').id);
  }
}

function addSelectedToData(teamId) {
  teamId = teamId.slice(3, teamId.length);
  data.selected.push(teamId);
}

function removeSelectedToData(teamId) {
  teamId = teamId.slice(3, teamId.length);
  for (var i = 0; i < data.selected.length; i++) {
    if (data.selected[i] === teamId) {
      data.selected.splice(i, 1);
    }
  }
}

var $teamsPage = document.querySelector('#submit');
$teamsPage.addEventListener('click', dataStore);

function dataStore(event) {
  event.preventDefault();
  data.stored = [];
  for (var teams in data.selected) {
    data.stored.push(data.selected[teams]);
  }
  document.querySelector('[data-view="all-games"]').remove();
  document.querySelector('[data-view="selected-games"]').remove();
  toDisplay(storedGamesArray);
}

function getStandingsAPI() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pandascore.co/tournaments/8252/standings?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&page=1&per_page=50');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderStandings(xhr.response);
    viewSwap(data.view);
  });
  xhr.send();
}

function renderStandings(teamsArray) {
  var $leftStanding = document.querySelector('#left-standing-col');
  var $rightStanding = document.querySelector('#right-standing-col');
  for (var i = 0; i < teamsArray.length; i++) {
    var $standingRow = document.createElement('a');
    $standingRow.setAttribute('class', 'row standings-wrapper');
    $standingRow.setAttribute('data-reference', teamsArray[i].team.slug);
    $standingRow.addEventListener('click', viewSwapRosterID);
    if (i < teamsArray.length / 2) {
      $leftStanding.appendChild($standingRow);
    } else {
      $rightStanding.appendChild($standingRow);
    }
    $standingRow.addEventListener('click', viewSwapRosterID);

    var $numStandingDiv = document.createElement('div');
    $numStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($numStandingDiv);

    var $numStanding = document.createElement('p');
    $numStanding.setAttribute('class', 'standings-num');
    $numStanding.textContent = teamsArray[i].rank;
    if (Number($numStanding.textContent) >= 10) {
      $numStanding.setAttribute('class', 'standings-num double-digit');
    }
    $numStandingDiv.appendChild($numStanding);

    var $imgStandingDiv = document.createElement('div');
    $imgStandingDiv.setAttribute('class', 'column-auto standings-img-frame');
    $standingRow.appendChild($imgStandingDiv);

    var $imgStanding = document.createElement('img');
    $imgStanding.setAttribute('class', 'standings-img');
    $imgStanding.setAttribute('src', teamsArray[i].team.image_url);
    $imgStandingDiv.appendChild($imgStanding);

    var $nameStandingDiv = document.createElement('div');
    $nameStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($nameStandingDiv);

    var $nameStanding = document.createElement('p');
    $nameStanding.setAttribute('class', 'standings-name');
    $nameStanding.textContent = teamsArray[i].team.name;
    $nameStandingDiv.appendChild($nameStanding);

    var $wlStandingDiv = document.createElement('div');
    $wlStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($wlStandingDiv);

    var $wlStanding = document.createElement('p');
    $wlStanding.setAttribute('class', 'standings-wl');
    $wlStanding.textContent = teamsArray[i].wins + 'W—' + teamsArray[i].losses + 'L';
    $wlStandingDiv.appendChild($wlStanding);
  }
}

function organizeRoster(playersArray) {
  var returnArray = [false, false, false, false, false];
  for (var i = 0; i < playersArray.length; i++) {
    if (playersArray[i].role === 'top' && returnArray[i] === false) {
      returnArray.splice(0, 1, i);
    } else if (playersArray[i].role === 'jun' && returnArray[i] === false) {
      returnArray.splice(1, 1, i);
    } else if (playersArray[i].role === 'mid' && returnArray[i] === false) {
      returnArray.splice(2, 1, i);
    } else if (playersArray[i].role === 'adc' && returnArray[i] === false) {
      returnArray.splice(3, 1, i);
    } else if (playersArray[i].role === 'sup' && returnArray[i] === false) {
      returnArray.splice(4, 1, i);
    }
  }
  for (i = 0; i < returnArray.length; i++) {
    if (!returnArray.includes(i)) {
      returnArray.splice(returnArray.indexOf(false), 1, i);
    }
  } return returnArray;
}

function renderTeamRosters(APIArray) {
  for (var i = 0; i < APIArray.length; i++) {
    var $main = document.querySelector('main');
    var $rostersContainer = document.createElement('div');
    $rostersContainer.setAttribute('class', 'container mw-1500 w-90vw w-95vw hidden');
    $rostersContainer.setAttribute('data-view', APIArray[i].slug);
    $main.appendChild($rostersContainer);

    var $rosterHeader = document.createElement('div');
    $rosterHeader.setAttribute('class', 'row ai-center jc-flex-end p-m-lr-20');
    $rostersContainer.appendChild($rosterHeader);

    var $rosterTitle = document.createElement('p');
    $rosterTitle.setAttribute('class', 'column-full title');
    $rosterTitle.textContent = APIArray[i].name;
    $rosterHeader.appendChild($rosterTitle);

    var $rosterIMG = document.createElement('img');
    $rosterIMG.setAttribute('class', 'title-img');
    $rosterIMG.setAttribute('src', APIArray[i].image_url);
    $rosterHeader.appendChild($rosterIMG);

    var $rosterList = document.createElement('div');
    $rosterList.setAttribute('class', 'row roster-list');
    $rostersContainer.appendChild($rosterList);

    var $playerArrayIndex = organizeRoster(APIArray[i].players);
    for (var j = 0; j < 5; j++) {
      var $currentPAI = $playerArrayIndex[j];
      var $colFifth = document.createElement('div');
      $colFifth.setAttribute('class', 'column-fifth');
      $rosterList.appendChild($colFifth);

      var $rosterCard = document.createElement('div');
      $rosterCard.setAttribute('class', 'roster-card');
      $colFifth.appendChild($rosterCard);

      var $overlay = document.createElement('div');
      $overlay.setAttribute('class', 'overlay');
      $rosterCard.appendChild($overlay);

      var $rosterPlayerImg = document.createElement('img');
      $rosterPlayerImg.setAttribute('class', 'roster-player-img');
      $rosterPlayerImg.setAttribute('src', APIArray[i].players[$currentPAI].image_url);
      $rosterCard.appendChild($rosterPlayerImg);

      var $rosterFrame = document.createElement('div');
      $rosterFrame.setAttribute('class', 'roster-frame row');
      $rosterCard.appendChild($rosterFrame);

      var $rosterRoleDiv = document.createElement('div');
      $rosterRoleDiv.setAttribute('class', 'roster-role-div');
      $rosterFrame.appendChild($rosterRoleDiv);

      var $rosterRole = document.createElement('img');
      $rosterRole.setAttribute('class', 'roster-role');

      var currentRole = APIArray[i].players[$currentPAI].role;
      if (currentRole === 'top') {
        $rosterRole.setAttribute('src', '/images/TOP.png');
      } else if (currentRole === 'jun') {
        $rosterRole.setAttribute('src', '/images/JUNGLE.png');
      } else if (currentRole === 'mid') {
        $rosterRole.setAttribute('src', '/images/MIDDLE.png');
      } else if (currentRole === 'adc') {
        $rosterRole.setAttribute('src', '/images/ADC.png');
      } else if (currentRole === 'sup') {
        $rosterRole.setAttribute('src', '/images/SUPPORT.png');
      }
      $rosterRoleDiv.appendChild($rosterRole);

      var $rosterPlayer = document.createElement('div');
      $rosterPlayer.setAttribute('class', 'roster-player');
      $rosterFrame.appendChild($rosterPlayer);

      var $rosterPlayerName = document.createElement('p');
      $rosterPlayerName.setAttribute('class', 'roster-player-name');
      $rosterPlayerName.textContent = APIArray[i].players[$currentPAI].name;
      $rosterPlayer.appendChild($rosterPlayerName);

      var $rosterPlayerFullName = document.createElement('p');
      $rosterPlayerFullName.setAttribute('class', 'roster-player-full-name');
      $rosterPlayerFullName.textContent = APIArray[i].players[$currentPAI].first_name + ' ' + APIArray[i].players[$currentPAI].last_name;
      $rosterPlayer.appendChild($rosterPlayerFullName);

      var $rosterPlayerNationality = document.createElement('p');
      $rosterPlayerNationality.setAttribute('class', 'roster-player-nationality');
      $rosterPlayerNationality.textContent = 'Nationality: ' + APIArray[i].players[$currentPAI].nationality;
      $rosterFrame.appendChild($rosterPlayerNationality);
    }
  }
}

function viewSwapRosterID(event) {
  var $reference = event.target.closest('.standings-wrapper').getAttribute('data-reference');
  viewSwap($reference);
}

function getScheduleAPI() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pandascore.co/series/5408/matches/upcoming?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&sort=&page=1&per_page=50');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    toDisplay(xhr.response);
  });
  xhr.send();
}

var teamIdAndImg = {};
function updateTeamIdAndImgObj(responseArray) {
  for (var i = 0; i < responseArray.length; i++) {
    var teamId = responseArray[i].id;
    teamIdAndImg[teamId] = {
      image_url: responseArray[i].image_url,
      name: responseArray[i].name
    };
  }
}

var storedGamesArray;
function toDisplay(responseGamesArray) {
  storedGamesArray = responseGamesArray;
  var allDisplay = [];
  var selectedArray = [];
  var storedIds = [];
  for (var id in data.stored) {
    storedIds.push(Number(data.stored[id]));
  }
  for (var i = 0; i < responseGamesArray.length; i++) {
    var gameObj = {};
    gameObj.date = apiToDate(responseGamesArray[i].begin_at.slice(5, 10));
    gameObj.left = {
      id: responseGamesArray[i].results[0].team_id,
      team_image: teamIdAndImg[responseGamesArray[i].results[0].team_id].image_url,
      team_name: teamIdAndImg[responseGamesArray[i].results[0].team_id].name
    };
    gameObj.right = {
      id: responseGamesArray[i].results[1].team_id,
      team_image: teamIdAndImg[responseGamesArray[i].results[1].team_id].image_url,
      team_name: teamIdAndImg[responseGamesArray[i].results[1].team_id].name
    };
    allDisplay.push(gameObj);
    if (storedIds.indexOf(responseGamesArray[i].results[0].team_id) > -1 || storedIds.indexOf(responseGamesArray[i].results[1].team_id) > -1) {
      if (storedIds.indexOf(responseGamesArray[i].results[1].team_id) > -1) {
        var temp = {};
        temp = gameObj.right;
        gameObj.right = gameObj.left;
        gameObj.left = temp;
      }
      selectedArray.push(gameObj);
    }
  }
  renderSchedule([allDisplay, selectedArray]);
}

function renderSchedule(matches) {
  var $schedule = document.querySelector('[data-view="schedule"]');
  for (var i = 0; i < matches.length; i++) {
    var $scheduleContainer = document.createElement('div');
    if (i === 0) {
      $scheduleContainer.setAttribute('data-view', 'all-games');
    } else {
      $scheduleContainer.setAttribute('data-view', 'selected-games');
    }
    $schedule.appendChild($scheduleContainer);

    for (var j = 0; j < matches[i].length; j++) {
      var $scheduleBanners = document.createElement('div');
      $scheduleBanners.setAttribute('class', 'row schedule-banners');
      if (j === 0) {
        $scheduleBanners.setAttribute('class', 'row schedule-banners standings-col-t');
      }
      $scheduleContainer.appendChild($scheduleBanners);

      var $dateCol = document.createElement('div');
      $dateCol.setAttribute('class', 'column-auto');
      $scheduleBanners.appendChild($dateCol);

      var $scheduleDate = document.createElement('p');
      $scheduleDate.setAttribute('class', 'schedule-date');
      $scheduleDate.textContent = matches[i][j].date;
      $dateCol.appendChild($scheduleDate);

      var $matchCol = document.createElement('div');
      $matchCol.setAttribute('class', 'column-full');
      $scheduleBanners.appendChild($matchCol);

      var $matchRow = document.createElement('div');
      $matchRow.setAttribute('class', 'row match-row');
      $matchCol.appendChild($matchRow);

      var $leftSideCol = document.createElement('div');
      $leftSideCol.setAttribute('class', 'column-half p-100 ra ai-center');
      $matchRow.appendChild($leftSideCol);

      var $leftSideRow = document.createElement('div');
      $leftSideRow.setAttribute('class', 'row ra ai-center');
      $leftSideCol.appendChild($leftSideRow);

      var $leftNameCol = document.createElement('div');
      $leftNameCol.setAttribute('class', 'column-auto desktop-only');
      $leftSideRow.appendChild($leftNameCol);

      var $leftName = document.createElement('p');
      $leftName.setAttribute('class', 'left-name');
      $leftName.textContent = matches[i][j].left.team_name;
      $leftNameCol.appendChild($leftName);

      var $leftImgCol = document.createElement('div');
      $leftImgCol.setAttribute('class', 'column-auto');
      $leftSideRow.appendChild($leftImgCol);

      var $leftImg = document.createElement('img');
      $leftImg.setAttribute('src', matches[i][j].left.team_image);
      $leftImg.setAttribute('class', 'schedule-img');
      $leftImgCol.appendChild($leftImg);

      var $versus = document.createElement('p');
      $versus.setAttribute('class', 'versus');
      $versus.textContent = 'vs';
      $matchRow.appendChild($versus);

      var $rightSideCol = document.createElement('div');
      $rightSideCol.setAttribute('class', 'p-100 column-half ai-center');
      $matchRow.appendChild($rightSideCol);

      var $rightSideRow = document.createElement('div');
      $rightSideRow.setAttribute('class', 'row ai-center');
      $rightSideCol.appendChild($rightSideRow);

      var $rightImgCol = document.createElement('div');
      $rightImgCol.setAttribute('class', 'column-auto');
      $rightSideRow.appendChild($rightImgCol);

      var $rightImg = document.createElement('img');
      $rightImg.setAttribute('src', matches[i][j].right.team_image);
      $rightImg.setAttribute('class', 'schedule-img');
      $rightImgCol.appendChild($rightImg);

      var $rightNameCol = document.createElement('div');
      $rightNameCol.setAttribute('class', 'column-auto desktop-only');
      $rightSideRow.appendChild($rightNameCol);

      var $rightName = document.createElement('p');
      $rightName.setAttribute('class', 'right-name');
      $rightName.textContent = matches[i][j].right.team_name;
      $rightNameCol.appendChild($rightName);
    }
  }
  activeSchedule(event);
}

function apiToDate(date) {
  var dayArray = date.split('-');
  var returnDate = '';
  if (dayArray[0][0] === '0') {
    returnDate += dayArray[0][1];
  } else {
    returnDate += dayArray[0];
  }
  returnDate += '/' + dayArray[1];
  return returnDate;
}

document.querySelector('.all-games').addEventListener('click', activeSchedule);
document.querySelector('.liked-teams').addEventListener('click', activeSchedule);

function activeSchedule(event) {
  var currentView;
  if (event.target.id) {
    currentView = event.target.id;
  } else {
    currentView = data.inner;
  }
  var $allView = document.querySelector('#all-view');
  var $likedView = document.querySelector('#liked-view');
  var $allGames = document.querySelector('[data-view="all-games"]');
  var $likedGames = document.querySelector('[data-view="selected-games"]');
  if (currentView === 'all-view') {
    $allView.classList.add('text-active');
    $likedView.classList.remove('text-active');
    $allGames.classList.remove('hidden');
    $likedGames.classList.add('hidden');
    data.inner = 'all-view';
  } else {
    $allView.classList.remove('text-active');
    $likedView.classList.add('text-active');
    $allGames.classList.add('hidden');
    $likedGames.classList.remove('hidden');
    data.inner = 'selected-view';
  }
}
