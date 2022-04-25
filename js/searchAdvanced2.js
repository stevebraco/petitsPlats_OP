import {
  filterButtonSearchAdvanced,
  onClickOutside,
  showHide,
} from './utils/utils.js';
import { displayRecipes, resultList } from './mainSearchBis.js';

const save = document.getElementById('save');

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

save.addEventListener('click', () => {
  console.log(resultList);
});

const selectRecipesFilter = (arrFilterName, array = resultList) => {
  let arr = [];

  if (arrFilterName === 'ingredients') {
    arr = array
      ?.map((element) =>
        element.ingredients.map((i) => i.ingredient.toLowerCase())
      )
      .flat();
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
// Event
let filterName;
for (let i = 0; i < fieldSearchAdvanced.length; i++) {
  // Click on ingredients, appareils or ustensiles
  fieldSearchAdvanced[i].addEventListener('click', function () {
    filterName = this.childNodes[1].name.toLowerCase();

    let arrayRecipesFilter = selectRecipesFilter(filterName);

    displayRecipesAdvanced(arrayRecipesFilter, advancedSearchList[i]);
    arrFilterName = [...arrayRecipesFilter];

    showHide(fieldSearchAdvanced, article, this);

    let containerRecipe = document.querySelectorAll('.advanced-search__recipe');

    containerRecipe?.forEach((t) => {
      t.addEventListener('click', (e) => {
        onClickElement(e);

        // filter button
        const btnSelectedAll = document.querySelectorAll('.btn__selected');
        btnSelectedAll.forEach((element) => {
          let arraytodisplay = filterButtonSearchAdvanced(
            resultList,
            filterName,
            element.textContent
          );
          const cardsContainer = document.querySelector('.cards__container');

          cardsContainer.innerHTML = '';
          displayRecipes(arraytodisplay);
          let arrayRecipesFilter = selectRecipesFilter(filterName);
          displayRecipesAdvanced(arrayRecipesFilter, t.parentElement);
        });
      });
    });
  });

  inputs[i].addEventListener('keyup', function (e) {
    let keyboard = e.target.value;
    let suggestions = [...arrFilterName];
    console.log(suggestions);

    if (keyboard) {
      suggestions = arrFilterName.filter((data) => {
        return data.toLowerCase().includes(keyboard.toLowerCase());
      });
    }

    displayRecipesAdvanced(suggestions, advancedSearchList[i]);
    let containerRecipe = document.querySelectorAll('.advanced-search__recipe');
    containerRecipe?.forEach((t) => {
      t.addEventListener('click', (e) => {
        onClickElement(e);
        // filter button
        const btnSelectedAll = document.querySelectorAll('.btn__selected');
        btnSelectedAll.forEach((element) => {
          let test = filterButtonSearchAdvanced(
            resultList,
            filterName,
            element.textContent
          );
          const cardsContainer = document.querySelector('.cards__container');

          cardsContainer.innerHTML = '';
          displayRecipes(test);
        });
      });
    });
  });
}

function onClickElement(e) {
  let value = e.target.textContent;
  let colorClass = e.target.parentElement.id;

  const element = document.createElement('div');
  element.classList.add('grocery-item');
  element.innerHTML = `<button class="btn__selected btn__${colorClass} ">${value}</button>`;

  const btnSelected = element.querySelector('.btn__selected');
  // const cardsContainer = document.querySelector('.cards__container');

  // const btnSelectedAll = element.querySelectorAll('.btn__selected');
  // console.log(btnSelectedAll);

  btnSelected.addEventListener('click', deleteFilterButton);

  containerAdvancedSearchList.appendChild(element);
}

function deleteFilterButton(e) {
  const element = e.currentTarget.parentElement;
  containerAdvancedSearchList.removeChild(element);
}

document.addEventListener('click', (e) =>
  onClickOutside(e, fieldSearchAdvanced, article)
);
