import { recipes } from '../data/recipes.js';
import { createElement } from '../js/utils/createElement.js';

const inputMainSearch = document.getElementById('main-search');
const cardsContainer = document.querySelector('.cards__container');
export let resultList = [...recipes];
function resultMainSearch(searchValue) {
  resultList = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(searchValue) ||
      recipe.description.toLowerCase().includes(searchValue) ||
      recipe.ingredients.find((t) => t.ingredient.includes(searchValue))
    );
  });

  return resultList;
}

// Tape dans la barre de recherche
inputMainSearch.addEventListener('input', (e) => {
  let searchValue = e.target.value.toLowerCase().trim();

  if (searchValue.length > 2) {
    let result = resultMainSearch(searchValue);
    cardsContainer.innerHTML = '';
    displayRecipes(result);
  } else {
    displayRecipes(recipes);
  }
});

// Affichage des Ingrédients
const displayIngredients = (arr) => {
  return arr
    .map((ingredient) => {
      const quantity = `${
        ingredient.quantity
          ? `${ingredient.ingredient}: ${ingredient.quantity}`
          : `${ingredient.ingredient}`
      }`;

      const unit = `${ingredient.unit ? `${ingredient.unit}` : ''}`;

      return `<span> ${quantity} ${unit} </span>`;
    })
    .join('');
};

// Affichage des recettes
export const displayRecipes = (recipes) => {
  const recipesList = recipes
    .map((recipe) => {
      const { ingredients } = recipe;
      const ingrendientsList = displayIngredients(ingredients);
      const model = `
        <figure class="card__figure">
             <!-- <img src="" alt=""> -->
        </figure>
        <div class="card__content">
          <div class="card__info">
            <h2 class="card__title">${recipe.name}</h2>
            <div class="card__time"> <img src="./images/icon-time.svg" alt="icon time"> 
            <span>${recipe.time} min</span> </div>
          </div>
          <div class="card__description">
            <div class="card__ingredients">
            ${ingrendientsList}
            </div>
        <p class="card__recette">${recipe.description.substring(0, 200)}...</p>
          </div>
        </div>
                  `;

      let article = createElement('article', ['card'], model, null);
      cardsContainer.appendChild(article);
    })
    .slice(0, 10)
    .join('');

  if (recipes.length === 0) {
    let message = "Aucun critère n'a été trouvé";
    cardsContainer.innerHTML = message;
  } else {
    return recipesList;
  }
};

displayRecipes(recipes);
