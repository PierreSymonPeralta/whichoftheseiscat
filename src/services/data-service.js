
import shuffle from './shuffle';
import data from '../data/data.json';

const saveData = (obj) => {
  localStorage.clear();
  localStorage.setItem('cats', JSON.stringify(obj));  
  return getData();
}

const getData = () => {
  const d = JSON.parse(localStorage.getItem('cats'))
  return d;
}

const getImageById = (imgId) => {
  const d = JSON.parse(localStorage.getItem('cats'))
    .filter(img => img.id === imgId);
  return d;
}

const initDB = () => {
  localStorage.clear();
  saveData(shuffle(data));
  return getData();
}

export default {
  getImageById,
  saveData,
  getData,
  initDB
}