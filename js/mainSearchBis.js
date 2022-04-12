/* eslint-disable indent */
import { recipes } from '../data/recipes.js';
import { createElement } from './utils/createElement.js';

const inputMainSearch = document.getElementById('main-search');
const cardsContainer = document.querySelector('.cards__container');
export let resultList = [...recipes];

function resultMainSearch(searchValue) {
  let result = [];
  for (let i = 0; i < recipes.length; i++) {
    let ingredients = recipes[i].ingredients;
    if (recipes[i].name.toLowerCase().includes(searchValue)) {
      result.push(recipes[i]);
      break;
    }

    if (recipes[i].description.toLowerCase().includes(searchValue)) {
      result.push(recipes[i]);
      break;
    }

    for (let j = 0; j < ingredients.length; j++) {
      if (ingredients[j].ingredient.toLowerCase().includes(searchValue)) {
        result.push(recipes[i]);
        break;
      }
    }
  }
  return result;
}

// Tape dans la barre de recherche
inputMainSearch.addEventListener('input', (e) => {
  let searchValue = e.target.value.toLowerCase();

  if (searchValue.length > 2) {
    resultList = [...resultMainSearch(searchValue)];
    cardsContainer.innerHTML = '';
    displayRecipes(resultList);

    if (!resultList.length) {
      let message = "Aucun critère n'a été trouvé";
      cardsContainer.innerHTML = message;
    }
  } else {
    cardsContainer.innerHTML = '';
    resultList = [...recipes];
    displayRecipes(resultList);
  }
});

// Affichage des Ingrédients
const getIngredientsDOM = (arr) => {
  return arr
    .map((ingredient) => {
      let unit = `${
        ingredient.unit
          ? `${ingredient.unit === 'grammes' ? 'g' : `${ingredient.unit}`}`
          : ''
      }`;
      const quantity = `${
        ingredient.quantity
          ? `<div class=''> <span class='card__ingredient'> ${ingredient.ingredient}</span>: <span> ${ingredient.quantity} ${unit}
             </span></div>`
          : `${ingredient.ingredient}`
      }`;

      return `<div> ${quantity} </div>`;
    })
    .join('');
};

// Affichage des recettes
const displayRecipes = (recipes) => {
  const resultList = [...recipes];
  resultList.slice(0, 10).map((recipe) => {
    let cardRecipesDOM = getCardRecipesDOM(recipe);
    let article = createElement('article', ['card'], cardRecipesDOM, null);
    cardsContainer.appendChild(article);
  });
};

const getCardRecipesDOM = (recipe) => {
  const { ingredients } = recipe;
  const ingrendientsList = getIngredientsDOM(ingredients);
  return `
  <div class="card__figure">
  </div>
  <div class="card__content">
    <div class="card__info">
      <h2 class="card__title">${recipe.name}</h2>
      <div class="card__time"> <img src="./images/icon-time.svg" alt="icon time"> 
        <span class='card__min'>${recipe.time} min</span> 
      </div>
    </div>
    <div class="card__description">
      <div class="card__ingredients">
        ${ingrendientsList}
      </div>
      <p class="card__recette">${recipe.description.substring(0, 183)}...</p>
    </div>
  </div>
  `;
};

displayRecipes(recipes);
