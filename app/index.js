import { Weather } from './Weather.js';
import { Card } from './Card.js';
import { Storage } from './Storage.js';
import { animate, validate, createJsonWeather } from './helpers/functions.js';
import { addWeatherDB } from './localbase.js';


const card = new Card();
card.buildCard();
card.connectHtmlElements();
const storage = new Storage();
const {city, countryCode } = storage.getData();
const weather = new Weather(city, countryCode);
const btnWeather = $('#btnWeather');

document.addEventListener('DOMContentLoaded', init);

btnWeather.click((e) => {
    e.preventDefault();
    animate('card')
    const newCity = $('#city').val();
    const newCountryCode = $('#countryCode').val();
    
    const validacion = validate(newCity, newCountryCode);
    validacion.then(error => {
            if (!error) {
                weather.changeLocation(newCity, newCountryCode);
                storage.clearData();
                storage.saveData(newCity, newCountryCode);
                init();
            }  
        })
        .catch(err => console.log(err));
});

async function init() {
    let response = null;
    let jsonWeather = null;
    try {
        response = await weather.getWeather();
        if(response.cod === 200) {
            card.render(response);
            jsonWeather = createJsonWeather(response);
            addWeatherDB(jsonWeather);   
        } 
        else throw(response) 
    }catch(err) {
        console.log(err);
    }  
}
