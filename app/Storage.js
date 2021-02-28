export class Storage {

    constructor() {

        this.defaultCity = "Madrid";
        this.defaultCountry = "ES";
        this.countryCode = "";
        this.city = "";
    }

    saveData(city = '', countryCode ='') {
        
        localStorage.setItem('city', city);
        localStorage.setItem('countryCode', countryCode);
    }

    getData() {
        if(localStorage.getItem('city') === null) {
            this.city = this.defaultCity;
        } else {
            this.city = localStorage.getItem('city');
        }
        if(localStorage.getItem('countryCode') === null) {
            this.countryCode = this.defaultCountry;
        } else {
            this.countryCode = localStorage.getItem('countryCode');
        }

        return {
            city: this.city,
            countryCode: this.countryCode,
        };
    }

    clearData() {
        if(localStorage) localStorage.clear();
        else throw new Error('Existe un problema con localStorage');
    }
}