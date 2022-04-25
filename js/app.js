import { recipes } from '../data/recipes.js';
import {
  displayRecipes,
  mainInputSearch,
  searchAdvanced,
} from './mainSearchBis.js';
import { onClickOutside } from './utils/utils.js';

const inputMainSearch = document.getElementById('main-search');
const fieldSearchAdvanced = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const article = document.querySelectorAll('.advanced-search__article');

// Launch App
const App = () => {
  // Tape dans la barre de recherche

  inputMainSearch.addEventListener('input', mainInputSearch);

  searchAdvanced();

  document.addEventListener('click', (e) =>
    onClickOutside(e, fieldSearchAdvanced, article)
  );

  displayRecipes(recipes);
};

App();
