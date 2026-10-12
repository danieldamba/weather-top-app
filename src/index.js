import './reset.css';
import './style.css';
let MY_FORECAST = [];

async function getLocalForecast(location) {
  let local = String(location);
  try {
    const myAPI = (() => `MBQ6968N4BVUQRYBQJU9PFPYC`)();
    const foreData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${local.trim()}?key=${myAPI}`);
    const weatData = foreData.json();
    return weatData;
  } catch (err) {
    console.error(err);
  }
};

const form = document.querySelector(`form`);
form.addEventListener(`submit`, async (e) => {
  e.preventDefault();
  let data = document.querySelector(`#location-name`).value;
  let dataW = await getLocalForecast(data);

  renderData([dataW]);
});

function setData(data) {
  MY_FORECAST = data;
}
function renderData(data = []) {
  // Accept both a single forecast object and an array of forecast objects.
  const myData = Array.isArray(data) ? data : [data];
  const mainContainer = document.querySelector(`#main-container`);
  mainContainer.innerHTML = ``;

  console.log(`Rendering data:`, myData);
  if (!myData[0] || myData.length === 0) {
    const noDataElement = document.createElement(`p`);
    noDataElement.textContent = `No forecast data available.`;
    mainContainer.appendChild(noDataElement);
    return;
  }

  myData.forEach((forecast) => {
    // =-----------=----------MAIN FORECAST CONTAINER-----------=-------------------
    const mainForecastElement = document.createElement(`div`);
    mainForecastElement.classList.add(`forecast-container`);

    // =-----------=----------LOCATION-----------=-------------------
    const locationElement = document.createElement(`div`);
    locationElement.classList.add(`location-container`);

    const locationName1 = document.createElement(`h2`);
    locationName1.classList.add(`loc-name-1`);
    locationName1.textContent = forecast.address;
    locationElement.appendChild(locationName1);

    const locationName2 = document.createElement(`p`);
    locationName2.classList.add(`loc-name-2`);
    locationName2.textContent = forecast.timezone;
    locationElement.appendChild(locationName2);

    // =-----------=----------HOUR-----------=-------------------
    const hourContainer = document.createElement(`div`);
    hourContainer.classList.add(`hour-container`);

    const requestHour = document.createElement(`p`);
    requestHour.classList.add(`request-hour`);
    requestHour.textContent = `${forecast.currentConditions.datetime} (local time)`;
    hourContainer.appendChild(requestHour);

    // =-----------=---HOUR DATA-------=----------------------

    const hourDataElement = document.createElement(`div`);
    hourDataElement.classList.add(`hour-data`);

    const hourIcon = document.createElement(`img`);
    hourIcon.classList.add(`icon-one`);
    import(`./assets/icons/${forecast.currentConditions.icon}.svg`).then((module) => {
      hourIcon.src = module.default;
    }).catch((err) => {
      console.error(`Error loading icon:`, err);
      hourIcon.src = ``; // Fallback to empty or default icon
    });
    hourIcon.alt = `${forecast.currentConditions.conditions}`;
    hourDataElement.appendChild(hourIcon);

    const hourTemp = document.createElement(`p`);
    hourTemp.classList.add(`hour-temp-main`);
    hourTemp.textContent = `${Math.round(forecast.currentConditions.temp)}°F`;
    hourDataElement.appendChild(hourTemp);

    const hourCond = document.createElement(`p`);
    hourCond.classList.add(`hour-cond-main`);
    hourCond.textContent = `${forecast.currentConditions.conditions}`;
    hourDataElement.appendChild(hourCond);

    mainForecastElement.appendChild(hourDataElement);



    mainForecastElement.appendChild(locationElement);
    mainForecastElement.appendChild(hourContainer);
    mainContainer.appendChild(mainForecastElement);


    const sideBContainer = document.createElement(`div`);
    sideBContainer.classList.add(`sideB-container`);
    mainContainer.appendChild(sideBContainer);

    // =-----------=----------HOURLY FORECAST (up to last ours of de day)-----------=----------------
    let currentDayData = forecast.days[0].hours;
    let locationDateCurrent = new Date(forecast.currentConditions.datetime.split('-').join('/'));
    let startPoint = new Date().getUTCHours() + forecast.tzoffset;
    const hourlyContainer = document.createElement(`div`);
    hourlyContainer.classList.add(`hourly-container`);

    const hTitleContainer = document.createElement(`div`);
    hTitleContainer.classList.add(`hourly-title-container`);
    hourlyContainer.appendChild(hTitleContainer);
    const hourlyTitle = document.createElement(`h3`);
    hourlyTitle.classList.add(`hourly-title`);
    hourlyTitle.textContent = `Hourly Forecast`;
    hTitleContainer.appendChild(hourlyTitle);

    const nextHours = document.createElement(`div`);
    nextHours.classList.add(`next-hours`);
    hourlyContainer.appendChild(nextHours);

    currentDayData.slice(startPoint - 1, startPoint + 5).forEach((hour) => {
      const hourForecastElement = document.createElement(`div`);
      hourForecastElement.classList.add(`hour-forecast`);

      const hourIcon = document.createElement(`img`);
      hourIcon.classList.add(`hourly-icon`);
      import(`./assets/icons/${hour.icon}.svg`).then((module) => {
        hourIcon.src = module.default;
      }).catch((err) => {
        console.error(`Error loading icon:`, err);
        hourIcon.src = ``; // Fallback to empty or default icon
      });
      hourIcon.alt = `${hour.conditions}`;
      hourForecastElement.appendChild(hourIcon);

      const hourTime = document.createElement(`p`);
      hourTime.classList.add(`hour-time`);
      hourTime.textContent = `${hour.datetime}`;
      hourForecastElement.appendChild(hourTime);

      const hourTemp = document.createElement(`p`);
      hourTemp.classList.add(`hour-temp`);
      hourTemp.textContent = `${Math.round(hour.temp)}°F`;
      hourForecastElement.appendChild(hourTemp);

      const hourCond = document.createElement(`p`);
      hourCond.classList.add(`hour-cond`);
      hourCond.textContent = `${hour.conditions}`;
      hourForecastElement.appendChild(hourCond);


      nextHours.appendChild(hourForecastElement);
    });
    sideBContainer.appendChild(hourlyContainer);


    // =-----------=----------DAILY FORECAST (up to last day of the week)-----------=----------------
    let dailyData = forecast.days.slice(0, 3); // Limit to the first 7 days of the forecast
    const dailyContainer = document.createElement(`div`);
    dailyContainer.classList.add(`daily-container`);

    const dTitleContainer = document.createElement(`div`);
    dTitleContainer.classList.add(`daily-title-container`);
    dailyContainer.appendChild(dTitleContainer);
    const dailyTitle = document.createElement(`h3`);
    dailyTitle.classList.add(`daily-title`);
    dailyTitle.textContent = `Daily Forecast`;
    dTitleContainer.appendChild(dailyTitle);

    const dailyForecasts = document.createElement(`div`);
    dailyForecasts.classList.add(`daily-forecasts`);
    dailyContainer.appendChild(dailyForecasts);

    dailyData.forEach((day) => {
      const dayForecastElement = document.createElement(`div`);
      dayForecastElement.classList.add(`day-forecast`);

      const dayIcon = document.createElement(`img`);
      dayIcon.classList.add(`day-icon`);
      import(`./assets/icons/${day.icon}.svg`).then((module) => {
        dayIcon.src = module.default;
      }).catch((err) => {
        console.error(`Error loading icon:`, err);
        dayIcon.src = ``; // Fallback to empty or default icon
      });
      dayIcon.alt = `${day.conditions}`;
      dayForecastElement.appendChild(dayIcon);


      const dayDate = document.createElement(`p`);
      dayDate.classList.add(`day-date`);
      dayDate.textContent = `${day.datetime}`;
      dayForecastElement.appendChild(dayDate);

      const dayTemp = document.createElement(`p`);
      dayTemp.classList.add(`day-temp`);
      dayTemp.textContent = `${Math.round(day.temp)}°F`;
      dayForecastElement.appendChild(dayTemp);

      const dayCond = document.createElement(`p`);
      dayCond.classList.add(`day-cond`);
      dayCond.textContent = `${day.conditions}`;
      dayForecastElement.appendChild(dayCond);


      dailyForecasts.appendChild(dayForecastElement);
    });
    sideBContainer.appendChild(dailyContainer);
  })

  document.querySelector(`.seek`).classList.remove(`seek`);
}

function refreshData(locationOnDisplay) {

}

const ctoFBtn = document.querySelector(`#ctoF-btn`);
ctoFBtn.classList.add(`ctoF-btn`);

const tempUnit = { value: `F` };
const convertTempToC = (temp) => Math.round((temp - 32) * (5 / 9));
const convertTempToF = (temp) => Math.round((temp * (9 / 5)) + 32);

const updateTempDisplay = () => {
  const temp = document.querySelectorAll(`.hour-temp, .day-temp, .hour-temp-main`);
  if (!temp) return
  tempUnit.value = tempUnit.value === `F` ? `C` : `F`;

  temp.forEach((t) => {
    t.textContent = tempUnit.value === `F`
      ? `${convertTempToF(parseInt(t.textContent))}°F`
      : `${convertTempToC(parseInt(t.textContent))}°C`;
  });
  ctoFBtn.textContent = tempUnit.value === `F` ? `to C` : `to F`;
};

ctoFBtn.addEventListener(`click`, () => {
  updateTempDisplay();
});

