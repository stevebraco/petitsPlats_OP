import { recipes } from '../data/recipes.js';
import { createElement } from './utils/createElement.js';
import { onClickOutside, setClass, showHide } from './utils/utils.js';
import { resultList } from './mainSearchBis.js';

const inputs = document.querySelectorAll('.input-advanced');
const advancedSearchList = document.querySelectorAll('.advanced-search__list');
const article = document.querySelectorAll('.advanced-search__article');
const fieldSearchAdvanced = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const containerAdvancedSearchList = document.querySelector(
  '.advanced-search__selected'
);

let inputId;
let arrFilterName = [];
let searchListIng = [];

const selectRecipesFilter = (arrFilterName, array = recipes) => {
  let arr = [];

  if (arrFilterName === 'ingrédients') {
    arr = array
      ?.map((element) =>
        element.ingredients.map((i) => i.ingredient.toLowerCase())
      )
      .flat()
      .slice(0, 36);
  }

  if (arrFilterName === 'appareils') {
    arr = array?.map((element) => element.appliance.toLowerCase());
  }

  if (arrFilterName === 'ustensiles') {
    arr = array
      ?.map((element) =>
        element.ustensils.map((ustensil) => ustensil.toLowerCase())
      )
      .flat();
  }

  return [...new Set(arr)];
};

const displayRecipesAdvanced = (ingredient, container) => {
  const model = ingredient
    .map((element) => `<p class='advanced-search__recipe'>${element}</p>`)
    .join('');

  container.innerHTML = model;
};

const buttonSearchList = (arr) => {
  return arr
    .map(
      (t) =>
        `<button type='button' class='btn__selected btn__${t.inputId}'> <span>${t.value}</span> <img src='./images/icon-close.svg' />  </button>`
    )
    .join('');
};

// Event
for (let i = 0; i < fieldSearchAdvanced.length; i++) {
  // Click on ingredients, appareils or ustensiles
  fieldSearchAdvanced[i].addEventListener('click', function (e) {
    advancedSearchList[i].innerHTML = '';

    let filterName = this.childNodes[1].name.toLowerCase();

    let arrayRecipesFilter = selectRecipesFilter(filterName, resultList);

    displayRecipesAdvanced(arrayRecipesFilter, advancedSearchList[i]);

    arrFilterName = [...arrayRecipesFilter];
    inputId = e.target.id;

    showHide(fieldSearchAdvanced, article, this);

    let containerRecipe = document.querySelectorAll('.advanced-search__recipe');
    containerRecipe?.forEach((element) => {
      element.addEventListener('click', () => {
        let value = element.textContent;
        searchListIng.push({ value, inputId });
        console.log(searchListIng);
        const list = buttonSearchList(searchListIng);
        containerAdvancedSearchList.innerHTML = list;

        // const btnSelected = document.querySelectorAll('.btn__selected');
        // btnSelected.forEach((element) =>
        //   element.addEventListener('click', function () {
        //     let remove = searchListIng.filter(
        //       (select) => select.value.trim() !== element.textContent.trim()
        //     );
        //     searchListIng = [...remove];
        //     console.log(searchListIng);
        //     let list = buttonSearchList(searchListIng);
        //     containerAdvancedSearchList.innerHTML = '';
        //     containerAdvancedSearchList.innerHTML = list;

        //   })
        // );
      });
    });
  });

  inputs[i].addEventListener('keyup', function (e) {
    let keyboard = e.target.value;
    let suggestions = [...arrFilterName];

    if (keyboard) {
      suggestions = arrFilterName.filter((data) => {
        return data.toLowerCase().includes(keyboard.toLowerCase());
      });
      console.log(suggestions);
    }

    displayRecipesAdvanced(suggestions, advancedSearchList[i]);

    let containerRecipe = document.querySelectorAll('.advanced-search__recipe');
    containerRecipe?.forEach((element) => {
      element.addEventListener('click', () => {
        let value = element.textContent;
        searchListIng.push({ value, inputId });
        const list = buttonSearchList(searchListIng);
        containerAdvancedSearchList.innerHTML = list;

        // const btnSelected = document.querySelectorAll('.btn__selected');
        // btnSelected.forEach((element) =>
        //   element.addEventListener('click', function () {
        //     console.log(element);
        //     let test = searchListIng.filter(
        //       (select) => select.value.trim() !== element.textContent.trim()
        //     );
        //     const list = buttonSearchList(test);
        //     containerAdvancedSearchList.innerHTML = list;
        //   })
        // );
      });
    });
  });
}

document.addEventListener('click', (e) =>
  onClickOutside(e, fieldSearchAdvanced, article)
);
