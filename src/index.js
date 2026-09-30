// import './reset.css';
// import './style.css';


let MY_FORECAST = [];

async function getLocalForecast(location) {
  let local = String(location);
  try {
  const myAPI = (() => `MBQ6968N4BVUQRYBQJU9PFPYC`)();
  const foreData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${local.trim()}?key=${myAPI}`);
  const weatData = await foreData.json();
  console.log(weatData)
  return weatData;
  } catch(err) {
    console.error(err);
  }
};

const form = document.querySelector(`form`);
form.addEventListener(`submit`, (e) => {
  e.preventDefault();
  let data = document.querySelector(`#location-name`).value;
  getLocalForecast(data);
})

// localForecast(`Bukavu`);

function setWData(data) {
  MY_FORECAST = [];
  MY_FORECAST.push(data);
}

function renderData(data) {
  let wData = data;
}