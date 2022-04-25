import { recipes } from '../data/recipes.js';
import recipesFactory from './factory/recipesFactory.js';
import { createElement } from './utils/createElement.js';
import {
  buttonDisabled,
  selectRecipesFilter,
  showHide,
} from './utils/utils.js';

const cardsContainer = document.querySelector('.cards__container');
const inputs = document.querySelectorAll('.input-advanced');
const advancedSearchList = document.querySelectorAll('.advanced-search__list');
const article = document.querySelectorAll('.advanced-search__article');
const fieldSearchAdvanced = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const containerAdvancedSearchList = document.querySelector(
  '.advanced-search__selected'
);

let arrFilterName = [];
let searchResult = [...recipes];
let dataFilter = [...recipes];
let inputSearchValue;
let buttonSelected = [];
let isWritten = false;
let tags = {
  ingredient: [],
  appliance: [],
  ustensils: [],
};

function resultMainSearch(array, inputSearchValue) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let ingredients = array[i].ingredients;
    if (array[i].name.toLowerCase().includes(inputSearchValue)) {
      result.push(array[i]);
      continue;
    }

    if (array[i].description.toLowerCase().includes(inputSearchValue)) {
      result.push(array[i]);
      continue;
    }

    for (let j = 0; j < ingredients.length; j++) {
      if (ingredients[j].ingredient.toLowerCase().includes(inputSearchValue)) {
        result.push(array[i]);
        break;
      }
    }
  }
  return result;
}

// function resultMainSearch(array, inputSearchValue) {
//   let result = [];
//   // on parcours la tableau
//   for (let i = 0; i < array.length; i++) {
//     let isName = array[i].name.toLowerCase().includes(inputSearchValue);
//     let isDescription = array[i].description
//       .toLowerCase()
//       .includes(inputSearchValue);
//     let isIngredients = false;
//     let ingredients = array[i].ingredients;

//     for (let j = 0; j < ingredients.length; j++) {
//       if (ingredients[j].ingredient.toLowerCase().includes(inputSearchValue)) {
//         isIngredients = true;
//       }
//     }

//     if (isName || isDescription || isIngredients) {
//       result.push(array[i]);
//     }
//   }

//   return result;
// }

// function resultMainSearch(array, searchValue) {
//   let result = array.filter((recipe) => {
//     return (
//       recipe.name.toLowerCase().includes(searchValue) ||
//       recipe.description.toLowerCase().includes(searchValue) ||
//       recipe.ingredients.some((ingredient) =>
//         ingredient.ingredient.toLowerCase().includes(searchValue)
//       )
//     );
//   });

//   return result;
// }

export function mainInputSearch(e) {
  inputSearchValue = e.target.value.toLowerCase();

  if (inputSearchValue.length > 2) {
    const t0 = performance.now();

    const btnSelectedAll = document.querySelectorAll('.btn__selected');

    cardsContainer.innerHTML = '';

    // Value and Button
    if (inputSearchValue && btnSelectedAll.length > 0) {
      searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];

      refreshCard(searchResult);
    }

    // Value and no button
    if (inputSearchValue && !btnSelectedAll.length) {
      if (!isWritten) {
        searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];

        refreshCard(searchResult);
      } else {
        dataFilter = [...recipes];
        searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];
        refreshCard(searchResult);

        console.log(
          'jai une valeur avec des boutons qui ont été supprimé written est true'
        );
      }
    }

    // Scénario alternatif A1
    if (!searchResult.length) {
      displayMessageNoResult(
        'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »'
      );
    }
    const t1 = performance.now();
    console.log(
      `Call to doSomething took ${(t1 - t0).toFixed(2)} milliseconds.`
    );
  } else {
    refreshCard(dataFilter);
  }
}

const displayMessageNoResult = (message) =>
  (cardsContainer.innerHTML = message);

const refreshCard = (array) => {
  cardsContainer.innerHTML = '';
  displayRecipes(array);
};

// Affichage des cards recettes
export const displayRecipes = (recipes) => {
  const searchResult = [...recipes];
  searchResult.slice(0, 10).map((recipe) => {
    const recipesModel = recipesFactory(recipe);
    const getCardRecipes = recipesModel.getCardRecipesDOM();
    let article = createElement('article', ['card'], getCardRecipes, null);
    cardsContainer.appendChild(article);
  });
};

const displayRecipesAdvanced = (ingredient, container) => {
  const model = ingredient
    .map((recipe) => {
      const recipesModel = recipesFactory(recipe);
      return recipesModel.getTagDom();
    })
    .join('');
  container.innerHTML = model;
};

const onKeyboard = (e, i) => {
  let keyboard = e.target.value;
  let suggestions = [...arrFilterName];

  if (keyboard) {
    suggestions = arrFilterName.filter((data) => {
      return data.toLowerCase().includes(keyboard.toLowerCase());
    });
  }

  displayRecipesAdvanced(suggestions, advancedSearchList[i]);

  let containerRecipe = document.querySelectorAll('.advanced-search__tag');
  containerRecipe.forEach((t) => {
    t.addEventListener('click', (e) => {
      onClickElement(e);
      inputs[i].value = '';
    });
  });
};

// Event
export const searchAdvanced = () => {
  for (let i = 0; i < fieldSearchAdvanced.length; i++) {
    // Click on ingredients, appareils or ustensiles
    fieldSearchAdvanced[i].addEventListener('click', function () {
      showHide(fieldSearchAdvanced, article, this);

      // nom du filtre
      let filterName = this.childNodes[1].name.toLowerCase();
      console.log(filterName);

      advancedSearchList[i].innerHTML = '';

      let allTagsByType = selectRecipesFilter(filterName, searchResult);

      if (dataFilter.length === 1 || searchResult.length === 1) {
        advancedSearchList[i].innerHTML = '';
      } else {
        displayRecipesAdvanced(
          allTagsByType.slice(0, 36),
          advancedSearchList[i]
        );
      }

      arrFilterName = [...allTagsByType];

      buttonDisabled(buttonSelected, i);

      let containerRecipe = document.querySelectorAll('.advanced-search__tag');

      containerRecipe.forEach((t) => {
        t.addEventListener('click', onClickElement);
      });
    });

    inputs[i].addEventListener('keyup', (e) => onKeyboard(e, i));
  }
};

const onClickElement = (e) => {
  let value = e.target.textContent;
  let colorClass = e.target.parentElement.id;

  buttonSelected.push(value);

  const model = `<button class="btn__selected btn__${colorClass}">${value}</button>`;
  const element = createElement(
    'div',
    ['advanced-search__wrapper-tag'],
    model,
    null
  );

  const btnSelected = element.querySelector('.btn__selected');
  containerAdvancedSearchList.appendChild(element);

  tagsToAdd(btnSelected.textContent, colorClass);

  dataFilter = UpdateCardByTags(dataFilter);
  searchResult = [...dataFilter];

  if (inputSearchValue) {
    console.log('jai cliqué sur un bouton et jai une valeur');
    searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];
    refreshCard(searchResult);
  } else {
    refreshCard(dataFilter);
  }

  btnSelected.addEventListener('click', deleteFilterButton);
};

const tagsToRemove = (elementToRemove, type) =>
  (tags[type] = tags[type].filter((tag) => tag !== elementToRemove));

const tagsToAdd = (element, type) => tags[type].push(element);

function UpdateCardByTags(array) {
  let result = [];
  array.filter((recipe) => {
    let ingredients = tags['ingredient'].every((tag) =>
      recipe.ingredients.find((t) =>
        t.ingredient.toLowerCase().includes(tag.toLowerCase())
      )
    );
    let appliance = recipe.appliance.toLowerCase().includes(tags['appliance']);

    let ustensils = tags['ustensils'].every((tag) =>
      recipe.ustensils.find((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );

    if (ingredients && ustensils && appliance) {
      result.push(recipe);
    }
  });
  return result;
}

const deleteFilterButton = (e) => {
  const btnSelectedAll = document.querySelectorAll('.btn__selected');
  const element = e.currentTarget.parentElement;

  containerAdvancedSearchList.removeChild(element);
  let typeToRemove = element.children[0].classList[1].split('__')[1];

  buttonSelected = buttonSelected.filter((t) => t !== element.textContent);
  tagsToRemove(e.target.textContent, typeToRemove);

  dataFilter = UpdateCardByTags(recipes);
  searchResult = [...dataFilter];

  // GERE les buttons retirer sans aucune valeur OK !
  // no value
  if (!inputSearchValue) refreshCard(dataFilter);

  // Gere lorsqu'il n'y a plus de bouton et pas de valeur OK!
  if (!inputSearchValue && !btnSelectedAll.length) {
    dataFilter = [...recipes];
    refreshCard(dataFilter);
  }

  if (!btnSelectedAll.length && inputSearchValue) {
    isWritten = true;
    dataFilter = [...recipes];
    searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];
    refreshCard(searchResult);
    console.log('jai une valeur mais plus de boutons written est true');
  }
};
