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
  // User interaction input
  inputMainSearch.addEventListener('input', mainInputSearch);

  // Tags
  searchAdvanced();

  // Close field inputs
  document.addEventListener('click', (e) =>
    onClickOutside(e, fieldSearchAdvanced, article)
  );

  // Display Recipes
  displayRecipes(recipes);
};

App();
