const stadiaApi = 'http://127.0.0.1:3000/stadia'
const usersApi = 'http://127.0.0.1:3000/users'
const visitsApi = 'http://127.0.0.1:3000/visits'

const sideNav = document.querySelector('.sidenav');
const searchBar = document.getElementById('searchbar');
const mainContainer = document.querySelector('.main-container');
const visitsModal = document.querySelector('.offcanvas offcanvas-start');
const visitsModalBody = document.querySelector('.offcanvas-body');
const newUserForm = document.getElementById('newUserForm');
const userSelect = document.getElementById('userSelect');
const stadiumSelect = document.getElementById('stadiumSelect');
const newVisitForm = document.getElementById('newVisitForm');



newUserForm.addEventListener('submit', (e) => {createNewUser(e)})
newVisitForm.addEventListener('submit', (e) => createNewVisit(e))
searchBar.addEventListener('keyup', (e) => {console.log(e)})

getUsers();
getStadia();
populateUserSelect();
populateStadiumSelect();

function getStadia() {
    fetch(stadiaApi)
      .then((res) => res.json())
      .then(displayStadia);
  };

function displayStadia(stadia) {
    stadia.forEach(displayStadium)
}

function displayStadium(stadium) {
    const stadiaList = document.getElementById('stadiadiv');
    const stadiumInstance = document.createElement('p');
    let stadiumInstanceId = stadium.id;

    stadiumInstance.innerHTML = `
        <div class="card stadium-card shadow p-3 mb-5" style="width: 18rem;">
            <img src="${stadium.image}" class="card-img-top stadium-card-image" alt="${stadium.name}">
            <div class="card-body">
                <h5 class="card-title text-center card-stadium-name">${stadium.name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item stadium-list-item"> 🛡 ${stadium.home_team}</li>
                    <li class="list-group-item stadium-list-item"> 📍 ${stadium.city}, ${stadium.country}</li>
                    <li class="list-group-item stadium-list-item"> 🎟 ${stadium.capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                </ul><br>
            </div>
        </div>
    `
    stadiaList.append(stadiumInstance);
}

function getUsers() {
    fetch(usersApi)
      .then((res) => res.json())
      .then(displayUsers);
};

function displayUsers(users) {
    users.forEach(displayUser)
}

function displayUser(user) {
    const userInstance = document.createElement('a');
    userInstance.setAttribute('data-bs-toggle', 'offcanvas');
    userInstance.setAttribute('href', '#offcanvasExample');
    userInstance.setAttribute('aria-controls', 'offcanvasExample');
    
    userInstance.innerHTML = `
        ${user.username}
        <hr>
    `
    userInstance.addEventListener('click', (e) => {
        visitsModalBody.innerHTML = "";
        displayVisitsModal(user);
    })
    
    sideNav.append(userInstance)
}

function displayVisitsModal(user) {
    mainContainer.append(visitsModal);
    populateVisitsModal(user);
}

function populateVisitsModal(user) {
    fetch(visitsApi)
      .then((res) => res.json())
      .then(data => {
          let allVisits = data;
          allVisits.forEach(visit => {
              if (visit.user_id == user.id) {
                  let visitInstance = document.createElement('div');
                  visitInstance.setAttribute('class', 'card visit-card')
                  visitInstance.innerHTML = `
                    <div class="card-header">
                    ${visit.stadium_id}
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title text-center">${visit.team_1} ${visit.team_1_score}<br>${visit.team_2} ${visit.team_2_score} </h5>
                        <p class="card-text text-center">${visit.sport.charAt(0).toUpperCase() + visit.sport.slice(1)} | ${visit.competition}</p>
                        <p class="card-text text-center">${visit.date}</p>
                        <a href="#" class="btn btn-primary id="delete-visit-${visit.id}" text-center delete-visit-button">Delete Visit</a>
                    </div>
                  `
                  visitsModalBody.append(visitInstance)
              };
          })
      });
}

function createNewUser(e) {
    e.preventDefault();

    const newUser = {
        username: e.target.username.value
    };

    fetch(usersApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => res.json())
        .then((json) => displayUser(json))
        .then(newUserForm.reset());
}

function populateUserSelect() {
    fetch(usersApi)
    .then((res) => res.json())
    .then(data => {
        let allUsers = data;
        allUsers.forEach(user => {
            let userSelectOption = document.createElement('option');
            userSelectOption.setAttribute('value', `${user.id}`);
            userSelectOption.innerHTML = `${user.username}`
            userSelect.append(userSelectOption)
        })
    })
}

function populateStadiumSelect() {
    fetch(stadiaApi)
    .then((res) => res.json())
    .then(data => {
        let allStadia = data;
        allStadia.forEach(stadium => {
            let stadiumSelectOption = document.createElement('option');
            stadiumSelectOption.setAttribute('value', `${stadium.id}`);
            stadiumSelectOption.innerHTML = `${stadium.name}`
            stadiumSelect.append(stadiumSelectOption)
        })
    })
}

function createNewVisit(e) {
    e.preventDefault();
    console.log(e.target.user_id.value)
    console.log(e.target.team_1.value)
    console.log(e.target.team_1_score.value)
    console.log(e.target.team_2.value)
    console.log(e.target.team_2_score.value)
    console.log(e.target.date.value)
    console.log(e.target.sport.value)
    console.log(e.target.competition.value)
    console.log(e.target.stadium_id.value)
    const newVisit = {
        user_id: e.target.user_id.value,
        stadium_id: e.target.stadium_id.value,
        team_1: e.target.team_1.value,
        team_2: e.target.team_2.value,
        date: e.target.date.value,
        competition: e.target.competition.value,
        team_1_score: e.target.team_1_score.value,
        team_2_score: e.target.team_2_score.value,
        sport: e.target.sport.value
    }

    fetch(visitsApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newVisit),
      })
        .then((res) => res.json())
        .then((json) => displayVisitsModal(json))
        .then(newVisitForm.reset());
}

function deleteVisit(e) {
    console.log(e)
}