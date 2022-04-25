import { recipes } from '../data/recipes.js';
import recipesFactory from './Models/recipesModels.js';
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

/**
 * @param  {} array
 * @param  {} inputSearchValue, user interaction with the keyboard
 * Return a array
 */
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
/**
 * @param  {} e, interaction with the keyboard
 * user interaction with the keyboard
 * Display the recipes
 */
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
/**
 * @param  {} message
 * return a message
 */
const displayMessageNoResult = (message) =>
  (cardsContainer.innerHTML = message);
/**
 * @param  {} array
 * Refresh Cards
 */
const refreshCard = (array) => {
  cardsContainer.innerHTML = '';
  displayRecipes(array);
};
/**
 * @param  {} recipes, array
 * Display Recipes
 */
export const displayRecipes = (recipes) => {
  const searchResult = [...recipes];
  searchResult.slice(0, 10).map((recipe) => {
    const recipesModel = recipesFactory(recipe);
    const getCardRecipes = recipesModel.getCardRecipesDOM();
    let article = createElement('article', ['card'], getCardRecipes, null);
    cardsContainer.appendChild(article);
  });
};
/**
 * @param  {} array
 * @param  {} container
 * Display Tags
 */
const displayTags = (array, container) => {
  const model = array
    .map((recipe) => {
      const recipesModel = recipesFactory(recipe);
      return recipesModel.getTagDom();
    })
    .join('');
  container.innerHTML = '';
  container.innerHTML = model;
};
/**
 * @param  {} e, reprensents value user
 * @param  {} i, represents a index
 */
const searchByTypeTags = (e, i) => {
  let keyboard = e.target.value;
  let suggestions = [...arrFilterName];

  if (keyboard) {
    suggestions = arrFilterName.filter((data) => {
      return data.toLowerCase().includes(keyboard.toLowerCase());
    });
  }

  displayTags(suggestions, advancedSearchList[i]);

  let containerRecipe = document.querySelectorAll('.advanced-search__tag');
  containerRecipe.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      addTag(e);
      inputs[i].value = '';
    });
  });
};

// Event
/**
 */
export const searchAdvanced = () => {
  for (let i = 0; i < fieldSearchAdvanced.length; i++) {
    // Click on ingredients, appareils or ustensiles
    fieldSearchAdvanced[i].addEventListener('click', function () {
      showHide(fieldSearchAdvanced, article, this);

      // nom du filtre
      let filterName = this.childNodes[1].name.toLowerCase();

      advancedSearchList[i].innerHTML = '';

      let allTagsByType = selectRecipesFilter(filterName, searchResult);

      if (dataFilter.length === 1 || searchResult.length === 1) {
        advancedSearchList[i].innerHTML = '';
      } else {
        displayTags(allTagsByType.slice(0, 36), advancedSearchList[i]);
      }
      arrFilterName = [...allTagsByType.slice(0, 36)];

      buttonDisabled(buttonSelected, i);

      let containerRecipe = document.querySelectorAll('.advanced-search__tag');

      containerRecipe.forEach((t) => {
        t.addEventListener('click', addTag);
      });
    });

    inputs[i].addEventListener('keyup', (e) => searchByTypeTags(e, i));
  }
};

const addTag = (e) => {
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

  // no value
  if (!inputSearchValue) refreshCard(dataFilter);

  if (!inputSearchValue && !btnSelectedAll.length) {
    dataFilter = [...recipes];
    refreshCard(dataFilter);
  }

  if (!btnSelectedAll.length && inputSearchValue) {
    isWritten = true;
    dataFilter = [...recipes];
    searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];
    refreshCard(searchResult);
  }
};
