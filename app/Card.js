export class Card {

    constructor() {
        
        this.cardProperties = {
            location:'',
            description: '',
            temperature: '',
            temperature_min: '',
            temperature_max: '',
            feels_like: '',
            humidity: '',
            wind: '',
            date: '',
        }
        this.card = $('#card');
        this.cardBody = $('#card-body');
        this.template = $('#template');
    }

    buildCard() {
        this.cardBody.append(this.template.contents().clone(true));
        this.card.append(this.cardBody);
    }

    connectHtmlElements() {
        for(let property in this.cardProperties) {
            this.cardProperties[property] = $(`#${property}`);
        }
    } 

    clearData() {
       for(let property in this.cardProperties) {
           this.cardProperties[property].html("");
       }
    }

    render(weather = weather || {}) {
        this.clearData();
        const cardProperties = Object.values(this.cardProperties);
        const htmlCardOutputs = [`${weather.name} / ${weather.sys.country}`, `${weather.weather[0]["description"]}`, `${weather.main.temp} ºC`, `${weather.main.temp_min} ºC`, `${weather.main.temp_max} ºC`, `${weather.main.feels_like} ºC`, `Humidity: ${weather.main.humidity} %`, `Wind: ${weather.wind.speed} M/s`, `${moment().format('DD/MM/YYYY HH:mm')}`];
        cardProperties.forEach((property, index) => property.append(htmlCardOutputs[index])); 
    }
}