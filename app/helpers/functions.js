import { getWeathers } from '../localbase.js';

let cont = 5;

export const animate = (selector) => {
    $(`#${selector}`).fadeOut(100).fadeIn(2000);
}

const showError = (error=null) => {

    let err = true;
    const errorCity = $('#error-city');
    const errorCountryCode = $('#error-countryCode');
    
    if(error.city) {
        $('#city').css('border', '2px solid red');
        errorCity.append('Introduce una ciudad válida');
    }
    if(error.countryCode) {
        $('#countryCode').css('border', '2px solid red');
        errorCountryCode.append('Introduce el código de país');
    } else if(error.invalidCode) {
        $('#countryCode').css('border', '2px solid red');
        errorCountryCode.append('Código de país inválido');
        }
    if(!error.city && !error.countryCode && !error.invalidCode) err = false;
    
    return err;
}

const validateCountryCode = async (countryCode) => {
    
    let error = true;
    try{
        const countries = await $.ajax({
            url: '/app/data/countries.json',
            success: function(response) {
                console.log(response);
            },
            error: function() {
                console.log('No se ha podido obtener la información');
            }
        });
    
        countries.forEach(country => {
            if(country.code.toLowerCase() === countryCode.toLowerCase()) error = false;
            })
    }catch(err) {
        console.log(err);
    }
    return error;
}

const resetFieldsValues = () => {
    $('#countryCode').css('border', '');
    $('#city').css('border', '');
    $('#error-city').html('');
    $('#error-countryCode').html('');
}

export const validate = async (city='', countryCode='') => {
    const error = {
        city: false,
        countryCode: false,
        invalidCode: false,
    }
    resetFieldsValues();
    const isInvalidCountryCode = await validateCountryCode(countryCode);
    if(isInvalidCountryCode) error.invalidCode = true;
    if(city.length < 3 ) error.city = true;
    if(countryCode.length === 0 ) error.countryCode = true;
    return showError(error);
}

export const createJsonWeather = (weather) => {

    return {
       id: new Date().getTime(),
       city: weather.name,
       countryCode: weather.sys.country,
       description: weather.weather[0]['description'],
       temperature: `${weather.main.temp} ºC`,
       date: moment().format('DD/MM/YYYY HH:mm')
    };
}

const paintTemperature = (temperature, td) => {
    const temp = parseInt(temperature);
    if((temp) < 10) td.classList.add('cold');
    else if(temp < 20) td.classList.add('warm');
    else td.classList.add('hot');
}

export const buildROW = (weather) => {

        const tr = document.createElement('tr');
        tr.classList.add('tr');

            for(let prop in weather) {

                let td = document.createElement('td');
                td.classList.add('td');
                (prop === 'id')
                ? createDeleteButton(td, tr, 'X', weather[prop])
                : td.append(weather[prop]);

                if(prop === 'temperature') paintTemperature(weather[prop], td);
                tr.appendChild(td);
            }
        return tr;
    }

    const deleteRow = (button, tr) => {
        button.addEventListener('click', (e) => {
            tr.classList.add('remove'); 
         });
         return;
    }

    const createDeleteButton = (td, tr, text, id) => {
        
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-danger');
        button.setAttribute('id', id);
        button.append(text);
        deleteRow(button, tr)
        td.appendChild(button);
        
        return td;
    }
                          
    const buildEmptyMessage = () => {
        const jumbotron = `<div class='jumbotron jumbotron-fluid'>
                                <div class='container'>
                                <h1 class="display-4">Sorry</h1>
                                <p class="lead">There are not wheather's results to show.</p>
                                </div>
                           </div>`;
        return jumbotron;
    }
    
    const buildHead = (headers = []) => {
        const containerHeader = document.getElementById('headers');
        containerHeader.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const tr = document.createElement('tr');
        headers.forEach(head => {
            const th = document.createElement('th');
            th.classList.add('th');
            th.append(head)
            tr.appendChild(th);
            fragment.appendChild(tr);
        })
        containerHeader.appendChild(fragment);
    }

    export const nextResults = () => {
        
            const cantResults = 5;
                if(cantResults) {
                    (cont != 0)
                        ? buildFront(cont, cont+cantResults)
                        : buildFront(0, cantResults);
                        cont+=cantResults;
                } else {
                    buildFront(cont, cont+5)
                    cont+= 5;
                }  
        }
    

    export const prevResults = () => {
        
        const cantResults = 5;
        if(cantResults) {
            (cont != 0)
                ? buildFront(cont-(cantResults*2), cont-cantResults)
                : buidFront(cantResults, 0);
                cont-=cantResults;
        } else {
            buildFront(cont-5, cont);
            cont-= 5;
        }
    }
      
    const paginateWeathers = (weathers, from=0, to=5) => {

        const fragment = document.createDocumentFragment();
        showTotalResults(from, to, weathers.length);
        document.getElementById('weatherResults').innerHTML = '';
        if (to > from) {
            for(let i = from; i < to; i++) {
                const tr = buildROW(weathers[i])
                fragment.appendChild(tr);
            }
        } 

        return fragment;
    }

    const handlerPaginateButtons = (to, from, totalResults) => {

        if(to >= totalResults) document.getElementById('nextBtn').disabled=true;
        else  document.getElementById('nextBtn').disabled=false; 
        if(from <=0 ) document.getElementById('prevBtn').disabled=true;
        else document.getElementById('prevBtn').disabled = false;
    }

    const showTotalResults = (from, to, totalResults) => {

        const showTotal = document.getElementById('showTotal');
        showTotal.innerHTML = '';
        
        if(from <= 0 ) showTotal.innerHTML = `Showing 1 to ${cont} from ${totalResults} results`;
        else if(from > 0) showTotal.innerHTML = `Showing ${from + 1} to ${to} from ${totalResults} results`

        handlerPaginateButtons(to, from, totalResults)
    }   
 
    export const buildFront = async (from=0, to=5) => {
        
        const headers = [
                            'delete',
                            'city',
                            'country code',
                            'description',
                            'temperature',
                            'datetime'
                        ];

        const tableHeaders = document.getElementById('headers')
        const weatherResults = document.getElementById('weatherResults')               
        try {
            const weathers = await getWeathers();

            if(weathers.length > 0 ) buildHead(headers);
            else tableHeaders.innerHTML = buildEmptyMessage();

            const fragment = paginateWeathers(weathers, from, to);
            weatherResults.appendChild(fragment);
           
        }catch(err) {
            console.log('Error: ', err);
        }
    }

    export const searchFilters = () => {
        document.addEventListener('keyup', (e) => {
            if(e.target.matches('.search-filter')) {
                
                if(e.key === 'Escape') e.target.value='';
                
                document.querySelectorAll('.tr').forEach(element => {
                    element.textContent.toLowerCase().includes(e.target.value)
                    ? element.classList.remove('filter')
                    : element.classList.add('filter');
                })
            }
        })
    }
    