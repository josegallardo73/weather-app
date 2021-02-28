import { buildFront, searchFilters, nextResults, prevResults, animate } from './helpers/functions.js';
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const init = () =>  buildFront().then(() => searchFilters())
                                .catch(err => console.log('Error: ', err));

init();

nextBtn.addEventListener('click', (e) => {
    animate('table'); 
    nextResults();
});

prevBtn.addEventListener('click', (e) => {
    animate('table');
    prevResults();
})









