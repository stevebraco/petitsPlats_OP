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
 * Represents the result of the research
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
 * Represents the recipe cards displayed
 * user interaction with the keyboard
 */
export function mainInputSearch(e) {
  inputSearchValue = e.target.value.toLowerCase();

  if (inputSearchValue.length > 2) {
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
        console.log('la');
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
  } else {
    refreshCard(dataFilter);
  }
}

/**
 * Reprensents a message to display if the recipe array is empty
 */
const displayMessageNoResult = (message) =>
  (cardsContainer.innerHTML = message);

/**
 * Represents the cards refresh
 * @param  {} array - recipes
 */
const refreshCard = (array) => {
  cardsContainer.innerHTML = '';
  displayRecipes(array);
};

/**
 * Represents recipes display
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
 * Represents Display Tags
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
 * reprensents value user
 * represents a index
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

/**
 * Represents input tags
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

/**
 * Add a tag
 */
const addTag = (e) => {
  let value = e.target.textContent;
  let colorClass = e.target.parentElement.id;

  buttonSelected.push(value);

  const model = `<button class="btn__selected btn__${colorClass}"><span class='btn__value'>${value}</span><img class='icon-close' src='./images/icon-close.svg'/> </button>`;
  const element = createElement(
    'div',
    ['advanced-search__wrapper-tag'],
    model,
    null
  );

  const btnValue = element.querySelector('.btn__value');
  const btnClose = element.querySelector('.icon-close');
  containerAdvancedSearchList.appendChild(element);

  tagsToAdd(btnValue.textContent, colorClass);

  dataFilter = updateCardByTags(dataFilter);
  searchResult = [...dataFilter];

  if (inputSearchValue) {
    searchResult = [...resultMainSearch(dataFilter, inputSearchValue)];
    refreshCard(searchResult);
  } else {
    refreshCard(dataFilter);
  }

  btnClose.addEventListener('click', (e) => {
    deleteFilterButton(e);
    const btnSelectedAll = document.querySelectorAll('.btn__selected');
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
  });
};

/**
 * Remove a tag
 */
const tagsToRemove = (elementToRemove, type) =>
  (tags[type] = tags[type].filter((tag) => tag !== elementToRemove));

/**
 * Add tags
 */
const tagsToAdd = (element, type) => tags[type].push(element);

/**
 * Update card
 */
function updateCardByTags(array) {
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

/**
 * Delete a filter button
 */
const deleteFilterButton = (e) => {
  const element = e.currentTarget.parentElement.parentElement;

  containerAdvancedSearchList.removeChild(element);
  let typeToRemove = element.children[0].classList[1].split('__')[1];

  buttonSelected = buttonSelected.filter(
    (t) => t !== element.textContent.trim()
  );

  tagsToRemove(e.target.previousSibling.textContent, typeToRemove);

  dataFilter = updateCardByTags(recipes);
  searchResult = [...dataFilter];
};
