import { recipes } from '../data/recipes.js';
import recipesFactory from './Models/recipesModels.js';
import { createElement } from './utils/createElement.js';
import {
  buttonDisabled,
  selectRecipesFilter,
  showHide,
  tagsToAdd,
  tagsToRemove,
  updateCardByTags,
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
let tagsSelected = {
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
    cardsContainer.innerHTML = '';

    searchResult = resultMainSearch(dataFilter, inputSearchValue);
    refreshCard(searchResult);

    // Scénario alternatif A1
    if (!searchResult.length) {
      displayMessageNoResult(
        'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »'
      );
    }
  } else {
    searchResult = [...recipes];
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
 */
const refreshCard = (array) => {
  cardsContainer.innerHTML = '';
  displayRecipes(array);
};

/**
 * Represents recipes display
 */
export const displayRecipes = (array) => {
  array.slice(0, 12).map((recipe) => {
    const recipesModel = recipesFactory(recipe);
    const getCardRecipes = recipesModel.getCardRecipesDOM();
    return createElement('article', ['card'], getCardRecipes, cardsContainer);
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
  let userValue = e.target.value;
  let suggestions = [...arrFilterName];

  if (userValue) {
    suggestions = arrFilterName.filter((data) => {
      return data.toLowerCase().includes(userValue.toLowerCase());
    });
  }

  displayTags(suggestions.slice(0, 36), advancedSearchList[i]);

  if (!suggestions.length) {
    advancedSearchList[i].innerHTML =
      '<p>Aucun tag ne correspond à votre critère.</p>';
  }

  let containerRecipe = document.querySelectorAll('.advanced-search__tag');
  containerRecipe.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      handleTag(e);
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

      fieldAdvancedSearch(this, i);

      buttonDisabled(buttonSelected, i);

      let containerRecipe = document.querySelectorAll('.advanced-search__tag');

      containerRecipe.forEach((t) => t.addEventListener('click', handleTag));
    });

    inputs[i].addEventListener('keyup', (e) => searchByTypeTags(e, i));
  }
};

/**
 * Represents fields search
 */
function fieldAdvancedSearch(element, i) {
  // nom du champ
  let filterName = element.childNodes[1].name.toLowerCase();
  let allTagsByType = selectRecipesFilter(filterName, searchResult);

  if (dataFilter.length === 1) {
    advancedSearchList[i].innerHTML = '';
  } else {
    displayTags(allTagsByType.slice(0, 36), advancedSearchList[i]);
  }
  arrFilterName = [...allTagsByType];
}

/**
 * Add and remove a tag
 */
const handleTag = (e) => {
  let value = e.target.textContent;
  let colorClass = e.target.parentElement.id;

  const model = `<button class="btn__selected btn__${colorClass}"><span class='btn__value'>${value}</span><img class='icon-close' src='./images/icon-close.svg'/> </button>`;
  const element = createElement(
    'div',
    ['advanced-search__wrapper-tag'],
    model,
    containerAdvancedSearchList
  );

  const btnValue = element.querySelector('.btn__value');
  const btnClose = element.querySelector('.icon-close');

  tagsToAdd(btnValue.textContent, tagsSelected, colorClass);

  dataFilter = updateCardByTags(dataFilter, tagsSelected);
  searchResult = [...dataFilter];

  buttonSelected = [
    ...tagsSelected.ingredient,
    ...tagsSelected.appliance,
    ...tagsSelected.ustensils,
  ];

  if (inputSearchValue) {
    searchResult = resultMainSearch(dataFilter, inputSearchValue);
    refreshCard(searchResult);
  } else {
    refreshCard(dataFilter);
  }

  btnClose.addEventListener('click', (e) => {
    deleteFilterButton(e);
    const btnSelectedAll = document.querySelectorAll('.btn__selected');
    // no value
    if (!inputSearchValue) refreshCard(dataFilter);

    if (inputSearchValue && !btnSelectedAll.length) {
      dataFilter = [...recipes];
      searchResult = resultMainSearch(dataFilter, inputSearchValue);
      refreshCard(searchResult);
    }

    if (btnSelectedAll.length > 0 && inputSearchValue) {
      dataFilter = [...recipes];
      searchResult = resultMainSearch(dataFilter, inputSearchValue);
      refreshCard(searchResult);
    }
  });
};

/**
 * Delete a filter button
 */
const deleteFilterButton = (e) => {
  const element = e.currentTarget.parentElement.parentElement;

  containerAdvancedSearchList.removeChild(element);
  let typeToRemove = element.children[0].classList[1].split('__')[1];

  tagsToRemove(
    e.target.previousSibling.textContent,
    tagsSelected,
    typeToRemove
  );

  dataFilter = updateCardByTags(recipes, tagsSelected);
  searchResult = [...dataFilter];

  buttonSelected = [
    ...tagsSelected.ingredient,
    ...tagsSelected.appliance,
    ...tagsSelected.ustensils,
  ];
};
