export class Weather {

    constructor(city = 'Madrid', countryCode = 'ES') {
        this.apikey = '3a5b6ce07a2cec4a2b7cf3793c9baee9';
        this.city = city;
        this.countryCode = countryCode;
    }

    async getWeather() {
        
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.countryCode}&appid=${this.apikey}&units=metric`
        try{ 
            const data = await fetch(URL);
            const dataJson = await data.json();
            if(!data.ok) throw {status: data.status, statusText: data.statusText}
            else return dataJson;
        }catch(err) {
            const message = `${err.status}:${err.statusText}` || "Ocurrió un error";
            //console.log(message)
            return message;
        }
    }

    changeLocation(newCity = '', countryCode = '') {
        
        this.city = newCity;
        this.countryCode = countryCode;
    }
}