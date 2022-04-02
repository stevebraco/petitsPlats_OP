import { recipes } from '../data/recipes.js';

const mainSearch = document.getElementById('main-search');
const cardsContainer = document.querySelector('.cards__container');

mainSearch.addEventListener('keyup', (e) => {
  const filterRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      recipe.description.toLowerCase().includes(e.target.value.toLowerCase()) ||
      recipe.ingredients.find((t) =>
        t.ingredient.includes(e.target.value.toLowerCase())
      )
      //TODO Description
    );
  });
  displayRecipes(filterRecipes);
});

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

const displayRecipes = (recipes) => {
  const model = recipes
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
        <p class="card__recette">${recipe.description.substring(0, 200)}...</p>
      </div>
    </div>
  </article>`;
    })
    .slice(0, 10)
    .join('');
  cardsContainer.innerHTML = model;
};

displayRecipes(recipes);
