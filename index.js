console.log('hello world')

const stadiaApi = 'http://127.0.0.1:3000/stadia'

getStadia();

function getStadia() {
    fetch(stadiaApi)
      .then((res) => res.json())
      .then(displayStadia);
  };

  function displayStadia(stadia) {
      console.log(stadia)
      stadia.forEach(displayStadium)
  }

  function displayStadium(stadium) {
    const stadiaList = document.getElementById('stadiadiv');
    const stadiumInstance = document.createElement('p');

    stadiumInstance.innerHTML = `
        <div class="card" style="width: 24rem;">
            <img src="${stadium.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title text-center">${stadium.name}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"> 🛡 ${stadium.home_team}</li>
                    <li class="list-group-item"> 📍 ${stadium.city}, ${stadium.country}</li>
                    <li class="list-group-item"> 🎟 ${stadium.capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                </ul><br>
                <a href="#" class="btn btn-primary">Add Visit</a>
            </div>
        </div>
    `

    stadiaList.append(stadiumInstance)
  }