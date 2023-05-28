console.log("yesBoss")

const API_KEY = "4bfd44566941e7e5481404d8be114002";

function renderWeatherInformation(data) { 
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`

    document.body.appendChild(newPara);
}  //this function will upload the content in UI 

async function fetchWeatherDetails() {
    try {
        // let latitude = 15.3333;
        // let longitude = 74.0833;
        let city = "goa";

        //first it will fetch then aage kam hoga
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric`);

        //then ye json me convert ho then console me print ho
        const data = await response.json();
        console.log("Weather Data :->", data);

        renderWeatherInformation(data);
    }
    catch (err) {
        //handle the error here 
    }
}

async function getCustomWeatherDetail() {
    try {
        let latitute = 26.2389;
        let longitude = 73.0243;

        let result = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}')
        let data = await result.json();  //link se kch bhi htado for error and then check at console 

        console.log(data);
    }
    catch (err) {
        console.log("Error found", err)
    }
}