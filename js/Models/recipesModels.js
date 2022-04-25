function recipesFactory(recipe) {
  const getCardRecipesDOM = () => {
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

  const getIngredientsDOM = (arr) => {
    return arr
      .map((ingredient) => {
        let unit = `${
          ingredient.unit
            ? `${ingredient.unit === 'grammes' ? 'g' : `${ingredient.unit}`}`
            : ''
        }`;
        return `${
          ingredient.quantity
            ? `<div> <span class='card__ingredient'> ${ingredient.ingredient}</span>: <span> ${ingredient.quantity}${unit}
               </span></div>`
            : ` <div> <span class='card__ingredient'>${ingredient.ingredient}</span> </div> `
        }`;
      })
      .join('');
  };

  const getTagDom = () => {
    return `<button class='advanced-search__tag'>${recipe}</button>`;
  };

  return {
    getCardRecipesDOM,
    getTagDom,
  };
}

export default recipesFactory;
