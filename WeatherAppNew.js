const userTab= document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need 

let oldTab = userTab;
const API_KEY = "4bfd44566941e7e5481404d8be114002";
oldTab.classList.add("current-tab");
getfromSessionStorage();  //agr pehle se location store hogi to btayega ni to ni btayega 

function switchTab(newTab) { 
    if (newTab != oldTab){
        oldTab.classList.remove("current-tab"); //removing bgcolor
        oldTab = newTab //telling now current tab is clicked tab
        oldTab.classList.add("current-tab"); //adding bgcolor to the other clicked tab

        if(!searchForm.classList.contains("active")){ 
            //kya search wala invisible tha ? yes to make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //search tab se weather tab visit kiya 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //after visiting data bhi load krna pdega so check local storage for storing data
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //passed clicked tab as input parameter 
    switchTab(userTab); //jis bhi tab par click kiya h use pass kr rhe h
})

searchTab.addEventListener("click", () => {
    //passed clicked tab as input user 
    switchTab(searchTab);
})


//check if co-ordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        //if local coordinates present ni h 
        grantAccessContainer.classList.add("active");
    }
    else{
       const coordinates = JSON.parse(localCoordinates); 
       fetchUserWeatherInfo(coordinates)
    }
}

 async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    //make grant container invisible 
    grantAccessContainer.classList.remove("active");
    //make loading screen visible
    loadingScreen.classList.add("active");

    // API CALL 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);  //ye values show krega UI pe 
    } catch (err) {
        loadingScreen.classList.remove("active")
    }
}

function renderWeatherInfo(weatherInfo) {
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch values from weathyer info objects and put in UI elements means data bhar diya in elements me
    cityName.innerText = weatherInfo?.name;
    // countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description ;
    // weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText= weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        // hw show an alert of no geological support available
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates)) //setItem usercordinate ki value apne me store kregi
    fetchUserWeatherInfo(userCoordinates); //Uploading on UI 
}


 
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click' ,getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();
    let cityName = searchInput.value;


    if(searchInput.value === "") 
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

        const data =  response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    
    catch (err) {
        
    }
}