const apiKey = "VWzubvpGfyabBfBYNNFUZQDRpaq8lNIv";
const cityList = document.getElementById("city-list");
const cityFav = document.getElementById("city-fav");
const cityInput = document.getElementById("city-search");
const addCityButton = document.getElementById("search-button");
const pagination = document.getElementById("pagination");
const paginationFav = document.getElementById("pagination-fav");
const currentLocationWeather = document.getElementById(
  "current-location-weather"
);
localStorage.setItem("isCelsius", "true");

const day = document.getElementById("day");
const date = document.getElementById("date");
const city = document.getElementById("city");
const weatherCondition = document.getElementById("weatherCondition");
const temp = document.getElementById("temp");
const tempDetails = document.getElementById("tempDetails");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const convertButton = document.getElementById("switch-temp");

let cities = JSON.parse(localStorage.getItem("cities_history")) || [];
let currentPage = 1;
let currentPageFav = 1;
let itemsPerPage = 4;
let WEATHER_CONDITIONS = 0;

(async function readJason() {
  try {
    const response = await fetch("../data/weatherCondition.json");
    if (!response.ok) {
      throw new Error("Failed to fetch weatherCondition");
    }
    const json = await response.json();

    console.log(json);

    WEATHER_CONDITIONS = json;

    // Properly return the data
    return json;
  } catch (error) {
    console.error(error);
    return null; // Return null to handle errors gracefully
  }
})();

convertButton.addEventListener("click", () => {
  localStorage.getItem("isCelsius") === "true"
    ? localStorage.setItem("isCelsius", "false")
    : localStorage.setItem("isCelsius", "true");
  const tempElements = document.querySelectorAll(".temp");

  if (localStorage.getItem("isCelsius") === "false") {
    tempElements.forEach((element) => {
      // Get the Celsius value from a data attribute or parse it from the content
      const celsius = parseFloat(element.textContent);

      // Convert Celsius to Fahrenheit
      const fahrenheit = (celsius * 9) / 5 + 32;

      // Update the element's text content
      element.textContent = `${fahrenheit.toFixed(0)}°F`;
    });
    localStorage.setItem("isCelsius", "false");
  } else {
    tempElements.forEach((element) => {
      // Get the Fahrenheit value from a data attribute or parse it from the content
      const fahrenheit = parseFloat(element.textContent);

      // Convert Fahrenheit to Celsius
      const celsius = ((fahrenheit - 32) * 5) / 9;

      // Update the element's text content
      element.textContent = `${celsius.toFixed(0)}°c`;
    });
    localStorage.setItem("isCelsius", "true");
  }
});

function renderCities() {
  cityList.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const cities_history =
    JSON.parse(localStorage.getItem("cities_history")) || [];
  const visibleCities = cities_history.slice(start, end);

  visibleCities.forEach((city, index) => {
    const cityItem = document.createElement("li");
    cityItem.className = "city-item";
    cityItem.innerHTML = `
        <div class="widget" id="${city.name + "_widget"}">
            <button onclick="MarkAsFavorite(event)" class="fav-button" style="color: ${
              city.isFav ? "yellow" : "black"
            }" id="${city.name}" style="color: black" title="Add to favorite"><i
                    class="fa-regular fa-star"></i></button>
            <div class="left-panel panel">
                
                <div class="city">
                   ${city.name}
                </div>
                <div class="temp">
                   
                   ${city.temperature.toFixed(0) + "°c"}
                </div>
            </div>
            <div class="right-panel panel">
                <div class="condition">${city.weatherCondition}</div>
            </div>

        </div>
      `;
    cityList.appendChild(cityItem);

    // Add animation
    if (index === visibleCities.length - 1) {
      setTimeout(() => {
        cityItem.classList.add("visible");
      }, 50);
    }
  });

  localStorage.setItem("cities_history", JSON.stringify(cities));
  renderPagination();
}

function renderFav() {
  cityFav.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const cities_history =
    JSON.parse(localStorage.getItem("cities_history")) || [];

  const favCities =
    cities_history && cities_history.filter((city) => city.isFav);
  const visibleCities = favCities.slice(start, end);

  visibleCities.forEach((city, index) => {
    const cityFavItem = document.createElement("li");
    cityFavItem.className = "city-item";
    cityFavItem.innerHTML = `
        <div class="widget" id="${city.name + "_widget"}">
            <button onclick="MarkAsFavorite(event)" class="fav-button" style="color: ${
              city.isFav ? "yellow" : "black"
            }" id="${city.name}" style="color: black" title="Add to favorite"><i
                    class="fa-regular fa-star"></i></button>
            <div class="left-panel panel">
                
                <div class="city">
                   ${city.name}
                </div>
                <div class="temp">
                   
                   ${city.temperature.toFixed(0) + "°c"}
                </div>
            </div>
            <div class="right-panel panel">
                <div class="condition">${city.weatherCondition}</div>
            </div>

        </div>
      `;
    cityFav.appendChild(cityFavItem);

    // Add animation
    if (index === visibleCities.length - 1) {
      setTimeout(() => {
        cityFavItem.classList.add("visible");
      }, 50);
    }
  });
  renderPaginationFav();
}

async function getWeather(city) {
  const url = `https://api.tomorrow.io/v4/weather/forecast?location=${city}&timesteps=hourly&units=metric&apikey=${apiKey}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "accept-encoding": "deflate, gzip, br",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const json = await response.json();

    // Extract relevant weather data
    const temperature = json.timelines.hourly[0].values.temperature;
    const weatherCondition = json.timelines.hourly[0].values.weatherCode;
    const humidity = json.timelines.hourly[0].values.humidity;
    const windSpeed = json.timelines.hourly[0].values.windSpeed;
    const pressure = json.timelines.hourly[0].values.pressureSurfaceLevel;

    // Properly return the data
    return {
      city: city || "Current Location",
      temperature,
      weatherCondition,
      humidity,
      windSpeed,
      pressure,
    };
  } catch (error) {
    console.error(error);
    return null; // Return null to handle errors gracefully
  }
}

function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(cities.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = i === currentPage;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderCities();
    });
    pagination.appendChild(pageButton);
  }

  handleAddWidget();
}

function renderPaginationFav() {
  paginationFav.innerHTML = "";
  const FavCities = cities.filter((city) => city.isFav);
  const totalPages = Math.ceil(FavCities.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = i === currentPageFav;
    pageButton.addEventListener("click", () => {
      currentPageFav = i;
      renderFav();
    });
    paginationFav.appendChild(pageButton);
  }

  handleAddWidget();
}

addCityButton.addEventListener("click", async () => {
  const cityName = cityInput.value.trim().toUpperCase();
  if (!cityName) {
    alert("Please enter a city name");
    return;
  }
  const isExist = cities.find((city) => city.name === cityName);

  if (isExist) {
    alert("City already exists");
    cityInput.value = "";
    return;
  }
  const { temperature, weatherCondition, humidity, windSpeed, pressure } =
    await getWeather(cityName);

  cities.push({
    name: cityName,
    temperature: temperature,
    weatherCondition: WEATHER_CONDITIONS.weatherCode[weatherCondition],
    humidity: humidity,
    windSpeed: windSpeed,
    pressure: pressure,
    isFav: false,
  });
  localStorage.setItem("cities_history", JSON.stringify(cities));
  updateWeatherDispalay({
    city: cityName,
    temperature,
    weatherCondition,
    humidity,
    windSpeed,
    pressure,
  });
  cityInput.value = "";
  renderCities();
});

document.addEventListener("DOMContentLoaded", () => {
  renderCities();
  renderFav();
  displayCurrentLocationWeather();
});

function handleAddWidget() {
  const widgets = document.querySelectorAll(".widget");
  widgets.forEach((widget) => {
    widget.addEventListener("click", (event) => {
      const widgetId = event.currentTarget.id; // Get the id of the clicked widget
      handleWidgetClick(widgetId);
    });
  });
}

function MarkAsFavorite(event) {
  const starButton = document.getElementById(event.srcElement.offsetParent.id);
  cities = JSON.parse(localStorage.getItem("cities_history")) || [];
  const city = cities.find(
    (city) => city.name.trim() === event.srcElement.offsetParent.id
  );
  if (city.isFav) {
    city.isFav = false;
    starButton.style.color = "black";
    starButton.classList.add("fa-regular");
    starButton.classList.remove("fa-solid");
  } else {
    city.isFav = true;
    starButton.style.color = "yellow";
    starButton.classList.remove("fa-regular");
  }

  localStorage.setItem("cities_history", JSON.stringify(cities));
  renderCities();
  renderFav();
}

async function handleWidgetClick(widgetId) {
  const weatherData = await getWeather(widgetId.split("_")[0]);
  console.log(`Widget with ID ${widgetId} clicked`);
  updateWeatherDispalay(weatherData);
}

function getTodayDateFormatted() {
  const today = new Date();

  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return { formattedDate, dayName };
}

async function updateWeatherDispalay(weatherData) {
  const { formattedDate, dayName } = getTodayDateFormatted();
  console.log(weatherData);
  day.textContent = dayName;
  date.textContent = formattedDate;
  city.textContent = weatherData.city;
  weatherCondition.textContent =
    WEATHER_CONDITIONS.weatherCode[weatherData.weatherCondition];
  temp.textContent = weatherData.temperature.toFixed(0) + "°c";
  tempDetails.textContent = weatherData.temperature.toFixed(0) + "°c";
  pressure.textContent = weatherData.pressure + "hPa";
  humidity.textContent = weatherData.humidity + "%";
  windSpeed.textContent = weatherData.windSpeed + "m/s";
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      return `${lat}, ${lon}`;
    });
  } else {
    alert("Can't get Geolocation.");
  }
}

currentLocationWeather.addEventListener("click", async () => {
  await displayCurrentLocationWeather();
});

async function displayCurrentLocationWeather() {
  const currentLocationCoordinates = getCurrentLocation();
  const weatherData = await getWeather(currentLocationCoordinates);
  console.log(weatherData);
  updateWeatherDispalay(weatherData);
}
