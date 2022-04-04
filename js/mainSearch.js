/* eslint-disable indent */
import { recipes } from '../data/recipes.js';

const mainSearch = document.getElementById('main-search');
const cardsContainer = document.querySelector('.cards__container');

// Tape dans la barre de recherche
mainSearch.addEventListener('keyup', (e) => {
  let searchValue = e.target.value.toLowerCase();
  const filterRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(searchValue) ||
      recipe.description.toLowerCase().includes(searchValue) ||
      recipe.ingredients.find((t) => t.ingredient.includes(searchValue))
    );
  });
  if (searchValue.length === 3) {
    // Affichage des recettes Filtrer
    displayRecipes(filterRecipes);
  } else {
    // Affiche toutes les recettes
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

      const init = `${ingredient.unit ? `${ingredient.unit}` : ''}`;

      return `<span> ${quantity} ${init} </span>`;
    })
    .join('');
};

// Affichage des recettes
const displayRecipes = (recipes) => {
  const model =
    recipes.length === 0
      ? '<p>Aucune recette ne correspond à votre critère…</p>'
      : recipes
          .map((recipe) => {
            const { ingredients } = recipe;
            const ingrendientsList = displayIngredients(ingredients);
            return `<article class='card'>
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
                          <p class="card__recette">${recipe.description.substring(
                            0,
                            200
                          )}...</p>
                        </div>
                      </div>
                  </article>`;
          })
          .slice(0, 10)
          .join('');

  cardsContainer.innerHTML = model;
};

displayRecipes(recipes);
