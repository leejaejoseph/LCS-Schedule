document.addEventListener('DOMContentLoaded', DOMLoaded);
function DOMLoaded() {
  getTeamsAPI();
  getStandingsAPI();
  viewSwap(data.view);
}

document.querySelector('.page-teams').addEventListener('click', function () {
  data.view = 'teams';
  viewSwap('teams');
});

document.querySelector('.page-standings').addEventListener('click', function () {
  data.view = 'standings';
  viewSwap('standings');
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
  xhr.open('GET', 'https://api.pandascore.co/lol/series/5408/teams?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&sort=&page=1&per_page=50');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderTeamIcons(xhr.response);
  });
  xhr.send();
}

function renderTeamIcons(teamsArray) {
  var $teams = document.querySelector('#teams'); // break point
  for (var i = 0; i < teamsArray.length; i++) {
    var $team = document.createElement('div');
    $team.setAttribute('class', 'col-sm-third col-lg-sixth');
    $teams.appendChild($team);

    var $teamWrapper = document.createElement('div');
    $teamWrapper.setAttribute('id', 'lcs-' + teamsArray[i].slug);
    $teamWrapper.setAttribute('class', 'row team-wrapper ai-center jc-center flex-wrap');
    $team.appendChild($teamWrapper);

    var $teamIcon = document.createElement('a');
    $teamIcon.setAttribute('class', 'column-auto team-icon team');
    $teamIcon.setAttribute('id', 'icon-' + teamsArray[i].slug);
    $teamIcon.addEventListener('click', iconClicked);
    $teamWrapper.appendChild($teamIcon);

    var $teamClicker = document.createElement('div');
    $teamClicker.setAttribute('class', 'clicker');
    $teamIcon.appendChild($teamClicker);

    var $teamFrame = document.createElement('div');
    $teamFrame.setAttribute('class', 'row frame ai-center jc-center');
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
      $teams.querySelector('#' + data.selected[j]).querySelector('.clicker').classList.add('active');
    }
  }
  return $teams;
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
  data.selected.push(teamId);
}

function removeSelectedToData(teamId) {
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
}

function getStandingsAPI() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pandascore.co/tournaments/8252/standings?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&page=1&per_page=50');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    renderStandings(xhr.response);
  });
  xhr.send();
}

function renderStandings(teamsArray) {
  var $leftStanding = document.querySelector('#left-standing-col');
  var $rightStanding = document.querySelector('#right-standing-col');
  for (var i = 0; i < teamsArray.length; i++) {
    var $standingRow = document.createElement('div');
    $standingRow.setAttribute('class', 'row ai-center standings-wrapper p-5-lg-70');
    if (i < teamsArray.length / 2) {
      $leftStanding.appendChild($standingRow);
    } else {
      $rightStanding.appendChild($standingRow);
    }

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
