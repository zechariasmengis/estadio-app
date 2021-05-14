const stadiaApi = 'http://127.0.0.1:3000/stadia'
const usersApi = 'http://127.0.0.1:3000/users'
const visitsApi = 'http://127.0.0.1:3000/visits'

const sideNav = document.querySelector('.sidenav');
const searchBar = document.getElementById('searchbar');
const mainContainer = document.querySelector('.main-container');
const visitsModal = document.querySelector('.offcanvas offcanvas-start');
const visitsModalBody = document.querySelector('.offcanvas-body');
const newUserForm = document.getElementById('newUserForm')
const userSelect = document.getElementById('userSelect')
const newVisitForm = document.getElementById('newVisitForm')


newUserForm.addEventListener('submit', (e) => {createNewUser(e)})
newVisitForm.addEventListener('submit', (e) => createNewVisit(e))
searchBar.addEventListener('keyup', (e) => {console.log(e)})

getUsers();
getStadia();
populateUserSelect();

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

    stadiumInstance.innerHTML = `
        <div class="card stadium-card" style="width: 18rem;">
            <img src="${stadium.image}" class="card-img-top stadium-card-image" alt="${stadium.name}">
            <div class="card-body">
                <h5 class="card-title text-center">${stadium.name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item stadium-list-item"> 🛡 ${stadium.home_team}</li>
                    <li class="list-group-item stadium-list-item"> 📍 ${stadium.city}, ${stadium.country}</li>
                    <li class="list-group-item stadium-list-item"> 🎟 ${stadium.capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                </ul><br>
                <a href="#" class="btn btn-primary" stadiumId="${stadium.id}">Add Visit</a>
            </div>
        </div>
    `
    stadiaList.append(stadiumInstance)
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
                  let visitInstance = document.createElement('p');
                  visitInstance.innerHTML = ` ${visit.team_1} ${visit.team_1_score}:${visit.team_2_score} ${visit.team_2}`
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

    console.log(e.target.username.value);
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

function createNewVisit(e) {
    e.preventDefault();
    console.log(e.target.stadium_id.value)
    const newVisit = {
        user_id: e.target.user_id.value,
        stadium_id: e.target.stadium_id.value,
        team_1: e.target.team_1.value,
        team_1_score: e.target.team_1_score.value,
        team_2: e.target.team_2.value,
        team_2_score: e.target.team_2_score.value,
        date: e.target.date.value,
        sport: e.target.sport.value,
        competition: e.target.competition.value
    }
}
