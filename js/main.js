const currentDataNow = document.querySelector(".aside-top");
const todayHighlights = document.getElementById("todayHighlights");
const todayHours = document.querySelector(".hours");
const daysForecast = document.querySelector(".aside-bottom");
const inputSearch = document.getElementById("inputSearch");
const locationBtn = document.getElementById("locationBtn");
const airBtn = document.querySelector(".air-btn");
const loadingIndicator = document.getElementById("loadingIndicator");
const API_KEY = "ff909213e07c4b6781a194915240501";
const API_BASE_URL = "http://api.weatherapi.com/v1/forecast.json";

window.addEventListener("scroll", function () {
  var navBar = document.querySelector(".nav-bar");
  var scrollPosition = window.scrollY;

  if (scrollPosition > 40) {
    navBar.classList.add("fixed");
  } else {
    navBar.classList.remove("fixed");
  }
});

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function getCurrentData(key, location) {
  loadingIndicator.style.display = "flex";
  let response = await fetch(
    `${API_BASE_URL}?key=${key}&q=${location}&days=7&aqi=yes&alerts=yes`
  );
  if (response.status == 200) {
    let finalResponse = await response.json();
    let currentLocation = finalResponse.location;
    let currentData = finalResponse.current;
    let astroData = finalResponse.forecast.forecastday[0].astro;
    let formattedDate = formattDate(currentData);
    todayInfo(
      currentData,
      finalResponse,
      astroData,
      currentLocation,
      formattedDate
    );
    daysHourDetails(finalResponse);
    getDaysForecast(finalResponse);
    loadingIndicator.style.display = "none";
  }
}

function formattDate(currentData) {
  let inputDate = new Date(currentData.last_updated);
  let day = days[inputDate.getDay()];
  let date = inputDate.getDate();
  let month = months[inputDate.getMonth()];
  return `${day} ${date}, ${month}`;
}

function todayInfo(
  currentData,
  finalResponse,
  astroData,
  currentLocation,
  formattedDate
) {
  currentDataNow.innerHTML = `
          <h5>Now</h5>
          <div class="d-flex align-items-center flex-shrink-0 flex-wrap">
            <div>
              <h2>${currentData.temp_c}&deg;<sup>c</sup></h2>
            </div>
            <img src="${currentData.condition.icon}" class="ms-md-4" alt="">
          </div>
          <p>${currentData.condition.text}</p>
          <hr>
          <div class="d-flex gap-2">
            <i class="fa-regular fa-calendar"></i>
            <h6>${formattedDate}</h6>
          </div>
          <div class="d-flex gap-2">
            <i class="fa-solid fa-location-dot"></i>
            <h6>${currentLocation.name}, ${currentLocation.country}</h6>
          </div>`;

  let airIndex = currentData.air_quality["gb-defra-index"];
  let airIndexText = "";
  let color = "green";
  switch (airIndex) {
    case 1:
    case 2:
    case 3:
      airIndexText = "Low";
      color = "red";
      airBtn.style.backgroundColor = "blue";
      break;
    case 4:
    case 5:
    case 6:
      airIndexText = "Moderate";
      color = "yellow";
      break;
    case 7:
    case 8:
    case 9:
      airIndexText = "High";
      color = "green";
      break;
    case 10:
      airIndexText = "Very High";
      color = "green";
      break;
    default:
      airIndexText = "Unknown";
      color = "gray";
      break;
  }

  console.log(airIndexText);
  airBtn.style.backgroundColor = "yellow";
  todayHighlights.innerHTML = `
        <div class="col-lg-6">
  <div class="air-quality my-3">
    <div class="d-flex align-items-center justify-content-between">
      <p>Air Quality Index</p>
      <p class="air-btn" style="background-color: ${color}" ;>${airIndexText}</p>
    </div>
    <div class="row align-items-center">
      <div class="col-2">
        <i class="fa-solid fa-wind"></i>
      </div>
      <div class="col-10">
        <div class="d-flex gap-2 row-gap-2 align-items-center justify-content-between flex-shrink-0 flex-wrap">
          <div class="text-center item">
            <span>PM2.5</span>
            <h4>${currentData.air_quality.pm2_5}</h4>
          </div>
          <div class="text-center item">
            <span>SO2</span>
            <h4>${currentData.air_quality.so2}</h4>
          </div>
          <div class="text-center item">
            <span>NO2</span>
            <h4>${currentData.air_quality.no2}</h4>
          </div>
          <div class="text-center item">
            <span>O3</span>
            <h4>${currentData.air_quality.o3}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="col-lg-6">
              <div class="rain-details mb-2">
                <p>Rain & Wind</p>
                <div class="d-flex align-items-start gap-5 rain-wind">
                  <div class="d-flex align-items-center gap-4">
                    <span class="material-symbols-rounded Today-icon">
                      water_drop
                    </span>
                    <div>
                      <span>Chance of Rain</span>
                      <h4>${finalResponse.forecast.forecastday[0].day.daily_chance_of_rain}<span class="text-prec">%</span></h4>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <span class="material-symbols-rounded Today-icon">
                      air
                    </span>
                    <div>
                      <span>Wind</span>
                      <h4>${currentData.wind_kph}<span class="text-prec">km/h</span></h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xxl-3 col-md-6 my-2">
              <div class="humidity">
                <p>Humidity</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="material-symbols-rounded Today-icon">
                    humidity_percentage
                  </span>
                  <h4>${currentData.humidity}<span class="text-prec">%</span></h4>
                </div>
              </div>
            </div>
            <div class="col-xxl-3 col-md-6 my-2">
              <div class="humidity">
                <p>Pressure</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="material-symbols-rounded Today-icon">
                    airwave
                  </span>
                  <h4>${currentData.pressure_in}<span class="text-prec">inHg</span></h4>
                </div>
              </div>
            </div>
            <div class="col-xxl-3 col-md-6 my-2">
              <div class="humidity">
                <p>visibility</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="material-symbols-rounded Today-icon">
                    visibility
                  </span>
                  <h4>${currentData.vis_km}<span class="text-prec">km/h</span></h4>
                </div>
              </div>
            </div>
            <div class="col-xxl-3 col-md-6 my-2">
              <div class="humidity">
                <p>Feels Like</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="material-symbols-rounded Today-icon">
                    thermostat
                  </span>
                  <h4>${currentData.feelslike_c}&deg;<sup>c</sup></h4>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="sun-details my-2">
                <p>Sunrise & Sunset</p>
                <div class="d-flex align-items-start gap-5 ">
                  <div class="d-flex align-items-center gap-4">
                    <i class="fa-regular fa-sun"></i>
                    <div>
                      <span>Sunrise</span>
                      <h4>${astroData.sunrise}</h4>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <i class="fa-solid fa-moon"></i>
                    <div>
                      <span>Sunset</span>
                      <h4>${astroData.sunset}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                <div class="col-lg-6">
              <div class="moon-details my-2">
                <p>Moonrise & Moonset</p>
                <div class="d-flex align-items-start gap-5">
                  <div class="d-flex align-items-center gap-4">
                    <i class="fa-solid fa-moon"></i>
                    <div>
                      <span>Moonrise</span>
                      <h4>${astroData.moonrise}</h4>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <i class="fa-regular fa-sun"></i>
                    <div>
                      <span>Moonset</span>
                      <h4>${astroData.moonset}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    `;
}

function daysHourDetails(finalResponse) {
  let forecasthours = finalResponse.forecast.forecastday[0].hour;
  let todayCartona = "";
  const specificHours = [3, 6, 9, 12, 15, 18, 21, 0];
  for (let i = 0; i < forecasthours.length; i++) {
    let inputDate = new Date(forecasthours[i].time);
    let hours = inputDate.getHours();
    if (specificHours.includes(hours)) {
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      let finalHour = `${hours}:${inputDate.getMinutes()} ${ampm}`;
      todayCartona += `
        <div class="card-item-hour">
            <p>${finalHour}</p>
            <img src="${forecasthours[i].condition.icon}" class="" alt="">
            <p>${forecasthours[i].temp_c}&deg;</p>
          </div>
        `;
    }
  }
  todayHours.innerHTML = todayCartona;
}

function getDaysForecast(finalResponse) {
  let dayscartona = ``;
  let forecastdays = finalResponse.forecast.forecastday;
  for (let i = 1; i < forecastdays.length; i++) {
    let dayData = new Date(forecastdays[i].date);
    let dayName = days[dayData.getDay()];
    dayscartona += `
          <div class="row align-items-center g-0 text-center">
            <div class="col-3">
              <p>${dayName}</p>
            </div>
            <div class="col-4">
              <img src="${forecastdays[i].day.condition.icon}" alt="">
            </div>
            <div class="col-5">
              <p>${forecastdays[i].day.maxtemp_c}&deg; / ${forecastdays[i].day.mintemp_c}&deg;</p>  
            </div>
          </div>
      `;
    daysForecast.innerHTML = dayscartona;
  }
}

function success(pos) {
  const crd = pos.coords;
  let location = `${crd.latitude},${crd.longitude}`;
  getCurrentData(API_KEY, location);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

inputSearch.addEventListener("keyup", function (event) {
  if (this.value.length >= 3) {
    getCurrentData(API_KEY, this.value);
    if (event.key === "Enter") {
      this.value = "";
    }
  }
});

locationBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(success, error, options);
});
