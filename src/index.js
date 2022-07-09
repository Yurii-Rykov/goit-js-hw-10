import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from "./fetchCountries";

const DEBOUNCE_DELAY = 300;
const countryListEL = document.querySelector('.country-list')
const inputEl = document.querySelector('#search-box');
const divEl = document.querySelector('.country-info');

const inputValue = evt => {
    let { value } = evt.target;
    value = value.trim().toLowerCase();
    if (value) {
        countryListEL.innerHTML = '';
        divEl.innerHTML = '';

        fetchCountries(value).then(quantityСheck).catch((error) => {
            console.log('error', error) 
            Notify.failure('Oops, there is no country with that name');
        });
    }
     if (value === '') {
        divEl.innerHTML = '';
        countryListEL.innerHTML = '';
    }
}

function quantityСheck(data) {
    if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return
    }
    if (data.length > 1) {
        renderCountryList(data)
    } else {
        renderContryInfo(data)
    }
   
}


const debounceInput = debounce(inputValue, DEBOUNCE_DELAY)
inputEl.addEventListener('input', debounceInput);


function renderContryInfo(countries) {
    const langs = Object.values(countries[0].languages) 
    const markup = countries
        .map((country) => {
            return `<ul><li class='list-style'>
            <p><img src="${country.flags.svg}" width = "20">  ${country.name.official}</p>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Languages: ${langs.join(', ')}</p>
            </li></ul>`
        }).join('');
    divEl.innerHTML = markup;
}

function renderCountryList(countries) {
    const markup = countries
        .map((country) => {
            return `<li class='list-style'><p><img src="${country.flags.svg}" width = "20">  ${country.name.common}</p></li>`
        }).join('');
    countryListEL.innerHTML = markup;
}