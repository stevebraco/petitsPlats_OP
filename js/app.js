import { recipes } from '../data/recipes.js';
import {
  displayRecipes,
  mainInputSearch,
  searchAdvanced,
} from './mainSearch.js';
import { onClickOutside } from './utils/utils.js';

const inputMainSearch = document.getElementById('main-search');
const fieldSearchAdvanced = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const article = document.querySelectorAll('.advanced-search__article');

// Launch App
const App = () => {
  // uUer interaction input
  inputMainSearch.addEventListener('input', mainInputSearch);

  // TAGS
  searchAdvanced();

  document.addEventListener('click', (e) =>
    onClickOutside(e, fieldSearchAdvanced, article)
  );

  // Show Recipes
  displayRecipes(recipes);
};

App();
