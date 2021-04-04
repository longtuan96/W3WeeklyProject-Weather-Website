// let url =
//   "http://api.openweathermap.org/data/2.5/weather?lat=10.768332&lon=106.769414&appid=e071cd59382ab1015ee7b3d8e5f13a22";

let apiKey = "e071cd59382ab1015ee7b3d8e5f13a22";
let urlIcon = "http://openweathermap.org/img/wn/10d@2x.png";
let currentLat = 38.8951; //default coordinate => Washinton DC
let currentLon = -77.0364;
let currentLang = "vi"; //default language => English
let supportedLang = {
  English: "en",
  Vietnamese: "vi",
}; //all the language that the API supported
let weatherData = {};
let countriesList = [];
let selectLanguageMenu = document.getElementById("select-language");
let mainDashBoardLocation = document.getElementById("mainDBLocation");

async function getCountries() {
  try {
    const response = await fetch("countries.json");
    const jsonData = await response.json();
    countriesList = jsonData;
    console.log(countries);
  } catch (error) {
    console.log(error);
  }
}

async function getCurrentWeather() {
  let locationLat = currentLat;
  let locationLon = currentLon;
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${locationLat}&lon=${locationLon}&appid=${apiKey}&lang=vn`;
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    weatherData = jsonData.main;
    console.log(weatherData);
  } catch (error) {
    console.log(error);
  }
}

async function getWeather() {
  console.log(document.getElementById("abc"));

  let locationLat = currentLat;
  let locationLon = currentLon;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationLat}&lon=${locationLon}&units=metric&lang=${currentLang}&exclude=&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    weatherData = jsonData;
    console.log(jsonData);
    renderMainDashBoard();
    updateMainDashBoard();
    renderAdditionalInfo();
    updateAdditionalInfo();
    renderHourlyForecast();
    updateHourlyForeCast();
    renderDailyForecast();
    updateDailyForeCast();
  } catch (error) {
    console.log(error);
  }
}

function getCurrentLocation() {
  document.getElementById("content").innerHTML = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showResult);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}
function showResult(position) {
  currentLat = position.coords.latitude;
  console.log(currentLat);
  currentLon = position.coords.longitude;
  console.log(currentLon);
  getWeather();
}

function convertUnixTime(unixTime) {
  return new Date(unixTime * 1000).toLocaleTimeString("en");
}
function convertUnixTimeHourMinute(unixTime) {
  return new Date(unixTime * 1000).toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function convertUnixTimeWeekDay(unixTime) {
  return new Date(unixTime * 1000).toLocaleDateString("en", {
    weekday: "long",
  });
}

function listLanguage() {
  Object.keys(supportedLang).forEach(
    (item, itemIndex) =>
      (selectLanguageMenu.innerHTML += `<li><a  class="dropdown-item" href="#" onclick="changeLanguage${itemIndex}()">${item}</a></li>`)
  );
}
listLanguage();
function updateMainDashBoard() {
  let time = `Time:${convertUnixTime(
    weatherData.current.dt + weatherData.timezone_offset
  )}, Sunrise: ${convertUnixTime(
    weatherData.current.sunrise
  )},Sunset: ${convertUnixTime(weatherData.current.sunset)}`;
  document.getElementById("mainDB-Location").innerHTML = weatherData.timezone;
  // console.log(time);
  document.getElementById("mainDB-Time").innerHTML = time;
  document.getElementById(
    "mainDB-CurrentFTemp"
  ).innerHTML = `${weatherData.current.feels_like}°C`;
  document.getElementById("mainDB-Cloudiness").innerHTML =
    weatherData.current.weather[0].description;
  document.getElementById(
    "mainDB-Visibility"
  ).innerHTML = `Visibility: ${weatherData.current.visibility}m`;
  document.getElementById(
    "mainDashBoard"
  ).innerHTML += `<img src="http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png" alt="suppose to be the icon" class="align-self-center justify-content-end mr-3" style="width:15%"/>`;
}

function updateAdditionalInfo() {
  document.getElementById(
    "ai-Location"
  ).innerHTML = `Weather today in ${weatherData.timezone}`;
  document.getElementById(
    "ai-FTemp"
  ).innerHTML = `${weatherData.current.feels_like}°C`;
  document.getElementById(
    "currentHumidity"
  ).innerHTML = `${weatherData.current.humidity}%`;
  document.getElementById(
    "currentPressure"
  ).innerHTML = `${weatherData.current.pressure}hPa`;
  document.getElementById(
    "currentVisibility"
  ).innerHTML = `${weatherData.current.visibility}m`;
  document.getElementById(
    "currentWind"
  ).innerHTML = `${weatherData.current.wind_speed} m/s`;
  document.getElementById(
    "currentDewPoint"
  ).innerHTML = `${weatherData.current.dew_point} Kelvin`;
  document.getElementById(
    "currentUVIndex"
  ).innerHTML = `${weatherData.current.uvi} of 10`;
}

function updateHourlyForeCast() {
  let content = document.getElementById("hourly-content");

  for (let index = 0; index < 5; index++) {
    console.log(index);
    console.log(convertUnixTimeHourMinute(weatherData.hourly[index].dt));
    content.innerHTML += `<div class="text-center">
      <h6>${convertUnixTimeHourMinute(
        weatherData.hourly[index].dt + weatherData.timezone_offset
      )}</h6>
      <h2>${weatherData.hourly[index].temp}</h2>
      <img src="http://openweathermap.org/img/wn/${
        weatherData.hourly[index].weather[0].icon
      }@2x.png" alt="" />
      <div></div>
      <i class="fas fa-cloud-rain"> ${weatherData.hourly[index].humidity}%</i>
    </div>`;
  }
}
function updateDailyForeCast() {
  let content = document.getElementById("daily-content");

  for (let index = 0; index < 5; index++) {
    console.log(index);
    console.log(weatherData.daily[index].dt + weatherData.timezone_offset);
    content.innerHTML += `<div class="text-center">
      <h6>${convertUnixTimeWeekDay(
        weatherData.daily[index].dt + weatherData.timezone_offset
      )}</h6>
      <h2>${weatherData.daily[index].temp.eve}</h2>
      <img src="http://openweathermap.org/img/wn/${
        weatherData.daily[index].weather[0].icon
      }@2x.png" alt="" />
      <div></div>
      <i class="fas fa-cloud-rain"> ${weatherData.daily[index].humidity}%</i>
    </div>`;
  }
}
function changeLanguage0() {
  console.log("change to English");
  document.getElementById("content").innerHTML = "";
  currentLang = "en";
  getWeather();
}
function changeLanguage1() {
  console.log("change to Vietnamese");
  document.getElementById("content").innerHTML = "";
  currentLang = "vi";
  getWeather();
}
function renderMainDashBoard() {
  return (document.getElementById("content").innerHTML += `<div
  class="media d-flex justify-content-around dash-board"
  id="mainDashBoard"
>
  <div class="media-body">
    <h3 id="mainDB-Location" style="font-size: 225%">
      Location blabh blbahba
    </h3>
    <p id="mainDB-Time" style="font-size: 100%">TIme dasdasdasd</p>
    <h1 id="mainDB-CurrentFTemp" style="font-size: 415%">TEMP asdasd</h1>
    <h2 id="mainDB-Cloudiness" style="font-size: 145%">
      Cloud dasdasdasdas
    </h2>
    <h4 id="mainDB-Visibility" style="font-size: 100%">visibility</h4>
  </div>
  
</div>`);
}
function renderAdditionalInfo() {
  return (document.getElementById(
    "content"
  ).innerHTML += `<div id="additional-info" class="red-border text-center dash-board">
  <div id="ai-Location">location blah blah blah</div>
  <div id="ai-FTemp">aa °C</div>
  <div class="row justify-content-between">
    <div class="col">
      <div id="ai-Humidity" class="additional-info">
        <i class="fas fa-tint"> Humidity</i>
        <div id="currentHumidity">78%</div>
      </div>
      <hr />
      <div id="ai-Pressure" class="additional-info">
        <i class="fas fa-weight"> Pressure</i>
        <div id="currentPressure">1100</div>
      </div>
      <hr />
      <div id="ai-Visibility" class="additional-info">
        <i class="fas fa-eye"> Visibility</i>
        <div id="currentVisibility">10000</div>
      </div>
      <hr />
    </div>
    <div class="col">
      <div id="ai-Wind" class="additional-info">
        <i class="fas fa-wind"> Wind</i>
        <div id="currentWind">88323</div>
      </div>
      <hr />
      <div id="ai-DewPoint" class="additional-info">
        <i class="fas fa-tint"> Dew Point</i>
        <div id="currentDewPoint">21°C</div>
      </div>
      <hr />
      <div id="ai-UVIndex" class="additional-info">
        <i class="fas fa-sun"> UV Index</i>
        <div id="currentUVIndex"></div>
      </div>
      <hr />
    </div>
  </div>
</div>`);
}

function renderHourlyForecast() {
  return (document.getElementById(
    "content"
  ).innerHTML += `<div id="hourly-forecast" class="red-border dash-board">
  <h5>Hourly Forecast</h5>
  <div id="hourly-content" class="d-flex justify-content-around"></div>
</div>`);
}
function renderDailyForecast() {
  return (document.getElementById(
    "content"
  ).innerHTML += `<div id="daily-forecast" class="red-border dash-board">
  <h5>Daily Forecast</h5>
  <div id="daily-content" class="d-flex justify-content-around"></div>
</div>`);
}

function updateCountry() {
  document.getElementById("content").innerHTML = "";
  let inputValue = document.getElementById("searchForCountry").value;
  // console.log(inputValue);
  let result = countriesList.find((item) => item.name == inputValue);
  if (result == undefined) {
    alert("there is no country with that name");
  } else {
    currentLat = result.latlng[0];
    currentLon = result.latlng[1];
  }
  getWeather();
}

getCountries();
getWeather();
