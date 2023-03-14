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
    console.log(data);
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

function renderTeamRosters(APIArray) {
  for (var i = 0; i < APIArray.length; i++) {
    var $scheduleSection = document.querySelector('.schedule-games');
    var $rostersContainer = document.createElement('div');
    $rostersContainer.setAttribute('class', 'container mw-1500 w-90vw w-95vw hidden');
    $rostersContainer.setAttribute('data-view', APIArray[i].slug);
    $scheduleSection.appendChild($rostersContainer);

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

const teamIdAndImg = {};
function updateTeamIdAndImgObj(responseArray) {
  for (let i = 0; i < responseArray.length; i++) {
    const teamId = responseArray[i].id;
    teamIdAndImg[teamId] = {
      image_url: responseArray[i].image_url,
      name: responseArray[i].name
    };
  }
}
