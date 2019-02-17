
import '@webcomponents/webcomponentsjs'; // polyfill, just in case
import './style.scss';

// Elements
import './components';
// Service
import dataService from './services/data-service';

// Initialize Local DB
const data = dataService.getData('cats');
data || dataService.initDB();

const whichOfTheseIsCat = document.createElement('which-of-these-is-cat');
whichOfTheseIsCat.setData(data);

document.body.appendChild(whichOfTheseIsCat);


