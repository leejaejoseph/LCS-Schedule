var $teamIcon = document.querySelectorAll('.team');
for (var i = 0; i < $teamIcon.length; i++) {
  $teamIcon[i].classList.add('team' + i);
  var $teamIconNum = document.querySelector('.team' + i);
  $teamIconNum.addEventListener('click', lights);
}

function lights(event) {
  var $clicker = event.target.closest('.team-icon').querySelector('.clicker');
  if (!$clicker.classList.contains('active')) {
    $clicker.classList.add('active');
    addSelected(event.target.closest('.team-wrapper').id);
  } else {
    $clicker.classList.remove('active');
    removeSelected(event.target.closest('.team-wrapper').id);
  }
}

function addSelected(teamId) {
  data.selected.push(teamId);
}

function removeSelected(teamId) {
  var index;
  for (var i = 0; i < data.selected.length; i++) {
    if (data.selected[i] === teamId) {
      index = i;
    }
  }
  data.selected.splice(index, 1);
}

var $teamsPage = document.querySelector('#submit');
$teamsPage.addEventListener('click', dataStore);

function dataStore(event) {
  event.preventDefault();
  data.stored = [];
  for (var teams in data.selected) {
    data.stored.push(teams);
  }
}
