import { mainSearchValue } from './app.js';
import {
  displayButtonSelected,
  onClickSearchIngredients,
  onCloseSearchAdvanced,
  searchValue,
} from './searchAdvanced.js';

const mainSearch = document.getElementById('main-search');
const searchIngredients = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const inputs = document.querySelectorAll('.input-advanced');
let containerRecipe = document.querySelectorAll('.advanced-search__recipe');

mainSearch.addEventListener('keyup', mainSearchValue);

searchIngredients.forEach((searchIngredient, i) => {
  // click on search ingredients
  searchIngredient.addEventListener('click', onClickSearchIngredients);

  // search Value
  inputs[i].addEventListener('keyup', (e) => searchValue(e, i));
});

// Close search Advanced
document.addEventListener('click', onCloseSearchAdvanced);

// Display Button Selected
containerRecipe.forEach((element) =>
  element.addEventListener('click', () => displayButtonSelected(element))
);
