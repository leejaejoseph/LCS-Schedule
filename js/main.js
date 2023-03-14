const apiUrls = {
  teamsApi: 'https://api.pandascore.co/tournaments/9603/teams?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&sort=&page=1&per_page=50',
  scheduleApi: 'https://api.pandascore.co/series/5408/matches/upcoming?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&sort=&page=1&per_page=50',
  standingsApi: 'https://api.pandascore.co/tournaments/9603/standings?token=gkNwPHKrVqhu7-uwgHyXiJVS1R7o5Cxst-R4Rp616xbYT0PlBMQ&page=1&per_page=50'
};

let teamsRes;
let scheduleRes;
let standingRes;
let teamIdAndImg = {};

document.addEventListener('DOMContentLoaded', () => {
  createDom(apiUrls);
  viewSwap(data.view);
});

function createDom(apiUrls) {
  const xhrTeams = new XMLHttpRequest();
  xhrTeams.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + apiUrls.teamsApi);
  xhrTeams.responseType = 'json';
  xhrTeams.addEventListener('load', function () {
    teamsRes = xhrTeams.response;
  });

  const xhrSchedule = new XMLHttpRequest();
  xhrSchedule.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + apiUrls.scheduleApi);
  xhrSchedule.responseType = 'json';
  xhrSchedule.addEventListener('load', function () {
    scheduleRes = xhrSchedule.response;
  });

  const xhrStanding = new XMLHttpRequest();
  xhrStanding.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + apiUrls.standingsApi);
  xhrStanding.responseType = 'json';
  xhrStanding.addEventListener('load', function () {
    standingRes = xhrStanding.response;
  });

  Promise.all([xhrTeams, xhrSchedule, xhrStanding].map(req => new Promise((resolve, reject) => {
    req.addEventListener('load', resolve);
    req.addEventListener('error', reject);
    req.send();
  })))
    .then(() => {
      renderDom(teamsRes, scheduleRes, standingRes);
    })
    .catch(err => {
      console.error(err);
    });
}
function renderDom(teamsArr, scheduleArr, standingArr) {
  renderTeamsPage(teamsArr);
  renderRosters(teamsArr);
  teamIdAndImg = updateTeamIdAndImgObj(teamsArr);
  renderScheduledGames(scheduleArr, teamIdAndImg);
  renderStandings(standingArr);
}

function renderTeamsPage(teamsArray) {
  const $teamClickers = document.querySelector('#teamClickers');
  for (let i = 0; i < teamsArray.length; i++) {
    const $clickerCol = document.createElement('div');
    $clickerCol.setAttribute('class', 'col-sm-third col-lg-sixth');
    $teamClickers.appendChild($clickerCol);

    const $clickerWrapper = document.createElement('div');
    $clickerWrapper.setAttribute('id', 'id-' + teamsArray[i].id);
    $clickerWrapper.setAttribute('class', 'row team-wrapper');
    $clickerCol.appendChild($clickerWrapper);

    const $clickerIcon = document.createElement('a');
    $clickerIcon.setAttribute('class', 'column-auto team-icon');
    $clickerIcon.setAttribute('id', 'icon-' + teamsArray[i].id);
    $clickerIcon.addEventListener('click', handleClick);
    $clickerWrapper.appendChild($clickerIcon);

    const $teamClicker = document.createElement('div');
    $teamClicker.setAttribute('class', 'clicker');
    $clickerIcon.appendChild($teamClicker);

    const $teamFrame = document.createElement('div');
    $teamFrame.setAttribute('class', 'row frame');
    $clickerIcon.appendChild($teamFrame);

    const $teamFrameImage = document.createElement('img');
    $teamFrameImage.setAttribute('class', 'clicker-img');
    $teamFrameImage.setAttribute('src', teamsArray[i].image_url);
    $teamFrame.appendChild($teamFrameImage);

    const $teamFrameName = document.createElement('p');
    $teamFrameName.setAttribute('class', 'team-name');
    $teamFrameName.textContent = teamsArray[i].name;
    $clickerWrapper.appendChild($teamFrameName);
  }
  if (data.selected.length > 0) {
    for (let j = 0; j < data.selected.length; j++) {
      $teamClickers.querySelector('#id-' + data.selected[j]).querySelector('.clicker').classList.add('active');
    }
  }
  const $teamsPage = document.querySelector('#submit');
  $teamsPage.addEventListener('click', dataStore);
}

function handleClick(event) {
  const icon = event.target.closest('.team-icon');
  const $specificClicker = icon.querySelector('.clicker');
  let teamId = icon.closest('.team-wrapper').id;
  if (!$specificClicker.classList.contains('active')) {
    $specificClicker.classList.add('active');
    teamId = teamId.slice(3, teamId.length);
    data.selected.push(teamId);
  } else {
    $specificClicker.classList.remove('active');
    teamId = teamId.slice(3, teamId.length);
    for (let i = 0; i < data.selected.length; i++) {
      if (data.selected[i] === teamId) {
        data.selected.splice(i, 1);
      }
    }
  }
}

function dataStore(event) {
  event.preventDefault();
  const dataStorage = [];
  data.stored = [];
  for (const teams in data.selected) {
    dataStorage.push(data.selected[teams]);
  }
  data.stored = dataStorage;
  updateTeamIdAndImgObj(teamsRes);
  renderScheduledGames(scheduleRes);
}

function renderRosters(APIArray) {
  for (let i = 0; i < APIArray.length; i++) {
    const $scheduleSection = document.querySelector('.schedule-games');
    const $rostersContainer = document.createElement('div');
    $rostersContainer.setAttribute('class', 'container mw-1500 w-90vw w-95vw hidden');
    $rostersContainer.setAttribute('data-view', APIArray[i].slug);
    $scheduleSection.appendChild($rostersContainer);

    const $rosterHeader = document.createElement('div');
    $rosterHeader.setAttribute('class', 'row ai-center jc-flex-end p-m-lr-20');
    $rostersContainer.appendChild($rosterHeader);

    const $rosterTitle = document.createElement('p');
    $rosterTitle.setAttribute('class', 'column-full title');
    $rosterTitle.textContent = APIArray[i].name;
    $rosterHeader.appendChild($rosterTitle);

    const $rosterIMG = document.createElement('img');
    $rosterIMG.setAttribute('class', 'title-img');
    $rosterIMG.setAttribute('src', APIArray[i].image_url);
    $rosterHeader.appendChild($rosterIMG);

    const $rosterList = document.createElement('div');
    $rosterList.setAttribute('class', 'row roster-list');
    $rostersContainer.appendChild($rosterList);

    const $playerArrayIndex = organizeRoster(APIArray[i].players);
    for (let j = 0; j < 5; j++) {
      const $currentPAI = $playerArrayIndex[j];
      const $colFifth = document.createElement('div');
      $colFifth.setAttribute('class', 'column-fifth');
      $rosterList.appendChild($colFifth);

      const $rosterCard = document.createElement('div');
      $rosterCard.setAttribute('class', 'roster-card');
      $colFifth.appendChild($rosterCard);

      const $overlay = document.createElement('div');
      $overlay.setAttribute('class', 'overlay');
      $rosterCard.appendChild($overlay);

      const $rosterPlayerImg = document.createElement('img');
      $rosterPlayerImg.setAttribute('class', 'roster-player-img');
      $rosterPlayerImg.setAttribute('src', APIArray[i].players[$currentPAI].image_url);
      $rosterCard.appendChild($rosterPlayerImg);

      const $rosterFrame = document.createElement('div');
      $rosterFrame.setAttribute('class', 'roster-frame row');
      $rosterCard.appendChild($rosterFrame);

      const $rosterRoleDiv = document.createElement('div');
      $rosterRoleDiv.setAttribute('class', 'roster-role-div');
      $rosterFrame.appendChild($rosterRoleDiv);

      const $rosterRole = document.createElement('img');
      $rosterRole.setAttribute('class', 'roster-role');

      const currentRole = APIArray[i].players[$currentPAI].role;
      if (currentRole === 'top') {
        $rosterRole.setAttribute('src', '../images/TOP.png');
      } else if (currentRole === 'jun') {
        $rosterRole.setAttribute('src', '../images/JUNGLE.png');
      } else if (currentRole === 'mid') {
        $rosterRole.setAttribute('src', '../images/MIDDLE.png');
      } else if (currentRole === 'adc') {
        $rosterRole.setAttribute('src', '../images/ADC.png');
      } else if (currentRole === 'sup') {
        $rosterRole.setAttribute('src', '../images/SUPPORT.png');
      }
      $rosterRoleDiv.appendChild($rosterRole);

      const $rosterPlayer = document.createElement('div');
      $rosterPlayer.setAttribute('class', 'roster-player');
      $rosterFrame.appendChild($rosterPlayer);

      const $rosterPlayerName = document.createElement('p');
      $rosterPlayerName.setAttribute('class', 'roster-player-name');
      $rosterPlayerName.textContent = APIArray[i].players[$currentPAI].name;
      $rosterPlayer.appendChild($rosterPlayerName);

      const $rosterPlayerFullName = document.createElement('p');
      $rosterPlayerFullName.setAttribute('class', 'roster-player-full-name');
      $rosterPlayerFullName.textContent = APIArray[i].players[$currentPAI].first_name + ' ' + APIArray[i].players[$currentPAI].last_name;
      $rosterPlayer.appendChild($rosterPlayerFullName);

      const $rosterPlayerNationality = document.createElement('p');
      $rosterPlayerNationality.setAttribute('class', 'roster-player-nationality');
      $rosterPlayerNationality.textContent = 'Nationality: ' + APIArray[i].players[$currentPAI].nationality;
      $rosterFrame.appendChild($rosterPlayerNationality);
    }
  }
}
function organizeRoster(playersArray) {
  const returnArray = [false, false, false, false, false];
  for (let i = 0; i < playersArray.length; i++) {
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
  for (let i = 0; i < returnArray.length; i++) {
    if (!returnArray.includes(i)) {
      returnArray.splice(returnArray.indexOf(false), 1, i);
    }
  } return returnArray;
}

function updateTeamIdAndImgObj(teamsArr) {
  const teamNameImg = {};
  for (let i = 0; i < teamsArr.length; i++) {
    const team = teamsArr[i];
    teamNameImg[team.id] = {
      image_url: team.image_url,
      name: team.name
    };
  }
  return teamNameImg;
}

function renderScheduledGames(scheduleArr) {
  const allSelectedArray = scheduleArrays(scheduleArr, teamIdAndImg);
  renderSchedule(allSelectedArray);
}
function scheduleArrays(responseGamesArray, teamIdAndImg) {
  const allDisplay = [];
  const selectedArray = [];
  const storedIds = [];
  for (const id in data.stored) {
    storedIds.push(Number(data.stored[id]));
  }
  for (let i = 0; i < responseGamesArray.length; i++) {
    const gameObj = {};
    gameObj.date = apiToDate(responseGamesArray[i].begin_at.slice(5, 10));
    gameObj.gameId = responseGamesArray[i].id;
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
        let temp = {};
        temp = gameObj.right;
        gameObj.right = gameObj.left;
        gameObj.left = temp;
      }
      selectedArray.push(gameObj);
    }
  }
  return [allDisplay, selectedArray];
}
function apiToDate(date) {
  const dayArray = date.split('-');
  let returnDate = '';
  if (dayArray[0][0] === '0') {
    returnDate += dayArray[0][1];
  } else {
    returnDate += dayArray[0];
  }
  returnDate += '/' + dayArray[1];
  return returnDate;
}
function renderSchedule(allSelectedArray) {
  const matches = allSelectedArray;
  const $schedule = document.querySelector('[data-view="page-schedule"]');
  const $scheduleGames = $schedule.querySelectorAll('div#games-schedule');
  for (let i = 0; i < $scheduleGames.length; i++) {
    $scheduleGames[i].parentNode.removeChild($scheduleGames[i]);
  }
  for (let i = 0; i < matches.length; i++) {
    const $scheduleContainer = document.createElement('div');
    $scheduleContainer.setAttribute('id', 'games-schedule');
    if (i === 0) {
      $scheduleContainer.setAttribute('data-view', 'all-games');
      if (data.inner !== 'all-view') {
        $scheduleContainer.setAttribute('class', 'hidden');
      }
    } else {
      $scheduleContainer.setAttribute('data-view', 'selected-games');
      if (data.inner !== 'selected-view') {
        $scheduleContainer.setAttribute('class', 'hidden');
      }
    }
    $schedule.appendChild($scheduleContainer);
    for (let j = 0; j < matches[i].length; j++) {
      const $scheduleBanners = document.createElement('div');
      $scheduleBanners.setAttribute('class', 'row schedule-banners');
      if (j === 0) {
        $scheduleBanners.setAttribute('class', 'row schedule-banners standings-col-t');
      }
      $scheduleContainer.appendChild($scheduleBanners);

      const $dateCol = document.createElement('div');
      $dateCol.setAttribute('class', 'column-auto');
      $scheduleBanners.appendChild($dateCol);

      const $scheduleDate = document.createElement('p');
      $scheduleDate.setAttribute('class', 'schedule-date');
      $scheduleDate.textContent = matches[i][j].date;
      $dateCol.appendChild($scheduleDate);

      const $matchCol = document.createElement('div');
      $matchCol.setAttribute('class', 'column-full');
      $scheduleBanners.appendChild($matchCol);

      const $matchRow = document.createElement('div');
      $matchRow.setAttribute('class', 'row match-row');
      $matchCol.appendChild($matchRow);

      const $leftSideCol = document.createElement('div');
      $leftSideCol.setAttribute('class', 'column-half p-100 ra ai-center');
      $matchRow.appendChild($leftSideCol);

      const $leftSideRow = document.createElement('div');
      $leftSideRow.setAttribute('class', 'row ra ai-center');
      $leftSideCol.appendChild($leftSideRow);

      const $leftNameCol = document.createElement('div');
      $leftNameCol.setAttribute('class', 'column-auto desktop-only');
      $leftSideRow.appendChild($leftNameCol);

      const $leftName = document.createElement('p');
      $leftName.setAttribute('class', 'left-name');
      $leftName.textContent = matches[i][j].left.team_name;
      $leftNameCol.appendChild($leftName);

      const $leftImgCol = document.createElement('div');
      $leftImgCol.setAttribute('class', 'column-auto');
      $leftSideRow.appendChild($leftImgCol);

      const $leftImg = document.createElement('img');
      $leftImg.setAttribute('src', matches[i][j].left.team_image);
      $leftImg.setAttribute('class', 'schedule-img');
      $leftImgCol.appendChild($leftImg);

      const $versus = document.createElement('p');
      $versus.setAttribute('class', 'versus');
      $versus.textContent = 'vs';
      $matchRow.appendChild($versus);

      const $rightSideCol = document.createElement('div');
      $rightSideCol.setAttribute('class', 'p-100 column-half ai-center');
      $matchRow.appendChild($rightSideCol);

      const $rightSideRow = document.createElement('div');
      $rightSideRow.setAttribute('class', 'row ai-center');
      $rightSideCol.appendChild($rightSideRow);

      const $rightImgCol = document.createElement('div');
      $rightImgCol.setAttribute('class', 'column-auto');
      $rightSideRow.appendChild($rightImgCol);

      const $rightImg = document.createElement('img');
      $rightImg.setAttribute('src', matches[i][j].right.team_image);
      $rightImg.setAttribute('class', 'schedule-img');
      $rightImgCol.appendChild($rightImg);

      const $rightNameCol = document.createElement('div');
      $rightNameCol.setAttribute('class', 'column-auto desktop-only');
      $rightSideRow.appendChild($rightNameCol);

      const $rightName = document.createElement('p');
      $rightName.setAttribute('class', 'right-name');
      $rightName.textContent = matches[i][j].right.team_name;
      $rightNameCol.appendChild($rightName);
    }
  }
}
function renderStandings(teamsArray) {
  const $leftStanding = document.querySelector('#left-standing-col');
  const $rightStanding = document.querySelector('#right-standing-col');
  for (let i = 0; i < teamsArray.length; i++) {
    const $standingRow = document.createElement('a');
    $standingRow.setAttribute('class', 'row standings-wrapper');
    $standingRow.setAttribute('data-reference', teamsArray[i].team.slug);
    $standingRow.addEventListener('click', viewSwapRosterID);
    if (i < teamsArray.length / 2) {
      $leftStanding.appendChild($standingRow);
    } else {
      $rightStanding.appendChild($standingRow);
    }
    $standingRow.addEventListener('click', viewSwapRosterID);

    const $numStandingDiv = document.createElement('div');
    $numStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($numStandingDiv);

    const $numStanding = document.createElement('p');
    $numStanding.setAttribute('class', 'standings-num');
    $numStanding.textContent = teamsArray[i].rank;
    if (Number($numStanding.textContent) >= 10) {
      $numStanding.setAttribute('class', 'standings-num double-digit');
    }
    $numStandingDiv.appendChild($numStanding);

    const $imgStandingDiv = document.createElement('div');
    $imgStandingDiv.setAttribute('class', 'column-auto standings-img-frame');
    $standingRow.appendChild($imgStandingDiv);

    const $imgStanding = document.createElement('img');
    $imgStanding.setAttribute('class', 'standings-img');
    $imgStanding.setAttribute('src', teamsArray[i].team.image_url);
    $imgStandingDiv.appendChild($imgStanding);

    const $nameStandingDiv = document.createElement('div');
    $nameStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($nameStandingDiv);

    const $nameStanding = document.createElement('p');
    $nameStanding.setAttribute('class', 'standings-name');
    $nameStanding.textContent = teamsArray[i].team.name;
    $nameStandingDiv.appendChild($nameStanding);

    const $wlStandingDiv = document.createElement('div');
    $wlStandingDiv.setAttribute('class', 'column-auto');
    $standingRow.appendChild($wlStandingDiv);

    const $wlStanding = document.createElement('p');
    $wlStanding.setAttribute('class', 'standings-wl');
    $wlStanding.textContent = teamsArray[i].wins + 'W—' + teamsArray[i].losses + 'L';
    $wlStandingDiv.appendChild($wlStanding);
  }
}
function viewSwap(search) {
  const $containers = document.querySelectorAll('.container');
  for (let i = 0; i < $containers.length; i++) {
    if ($containers[i].getAttribute('data-view') === search) {
      data.view = search;
      $containers[i].classList.remove('hidden');
    } else {
      $containers[i].classList.add('hidden');
    }
  }
  const $allView = document.querySelector('#all-view');
  const $likedView = document.querySelector('#liked-view');
  switch (data.inner) {
    case ('all-view'):
      $allView.classList.add('text-active');
      $likedView.classList.remove('text-active');
      break;
    case ('selected-view'):
      $allView.classList.remove('text-active');
      $likedView.classList.add('text-active');
      break;

  }
}

document.querySelector('.page-teams').addEventListener('click', putDataCallSwap);
document.querySelector('.page-standings').addEventListener('click', putDataCallSwap);
document.querySelector('.page-schedule').addEventListener('click', putDataCallSwap);
function putDataCallSwap(event) {
  viewSwap(event.target.className);
}
const $menuPage = document.querySelector('.menu-page');
$menuPage.querySelector('.page-teams').addEventListener('click', handleMenuNav);
$menuPage.querySelector('.page-standings').addEventListener('click', handleMenuNav);
$menuPage.querySelector('.page-schedule').addEventListener('click', handleMenuNav);

document.querySelector('.navbar-toggle').addEventListener('click', handleMenuClick);

function handleMenuNav(event) {
  document.querySelector('.menu-page').classList.add('hidden');
  viewSwap(event.target.className);
}

function handleMenuClick() {
  if ($menuPage.className === 'menu-page') {
    document.querySelector('.menu-page').classList.add('hidden');
  } else {
    document.querySelector('.menu-page').classList.remove('hidden');
  }
}

function viewSwapRosterID(event) {
  const $reference = event.target.closest('.standings-wrapper').getAttribute('data-reference');
  viewSwap($reference);
}

document.querySelector('.all-games').addEventListener('click', activeSchedule);
document.querySelector('.liked-teams').addEventListener('click', activeSchedule);

function activeSchedule(event) {
  const $allView = document.querySelector('#all-view');
  const $likedView = document.querySelector('#liked-view');
  const $allGames = document.querySelector('[data-view="all-games"]');
  const $likedGames = document.querySelector('[data-view="selected-games"]');
  if (event.target.id === 'all-view') {
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
