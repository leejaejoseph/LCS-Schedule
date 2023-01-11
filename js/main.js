/* document.addEventListener('DOMContentLoaded', DOMLoaded);
function DOMLoaded() {
  getTeamsAPI();
}

var $teams = document.querySelector('#teams');

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
*/
