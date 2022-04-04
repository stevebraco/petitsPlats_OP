import { recipes } from '../data/recipes.js';
import { createElement } from './utils/createElement.js';
import { setClass } from './utils/utils.js';

const inputs = document.querySelectorAll('.input-advanced');

const containerIngredients = document.getElementById('container-ing');
const containerAppareils = document.getElementById('container-app');
const containerUstensils = document.getElementById('container-ust');
const fieldSearchAdvanced = document.querySelectorAll(
  '.advanced-search__wrapper'
);
const containerAdvancedSearchList = document.querySelector(
  '.advanced-search__selected'
);

let inputId;

const recipesFilter = (arrFilterName) => {
  let arr;
  if (arrFilterName == 'ingrédients') {
    arr = [
      ...new Set(
        recipes
          .map((t) => t.ingredients.map((i) => i.ingredient.toLowerCase()))
          .flat()
      ),
    ];
  }

  if (arrFilterName == 'appareils') {
    arr = [...new Set(recipes.map((t) => t.appliance.toLowerCase()))];
  }

  if (arrFilterName == 'ustensiles') {
    arr = [
      ...new Set(
        recipes.map((t) => t.ustensils.map((u) => u.toLocaleLowerCase())).flat()
      ),
    ];
  }
  return arr;
};

const suggestionsList = (arr) => {
  return arr
    .map((t) => `<p class='advanced-search__recipe'> ${t} </p>`)
    .join('');
};

const buttonSearchList = (arr) => {
  return arr
    .map(
      (t) =>
        `<button type='button' class='btn__selected btn__${t.inputId}'> <span>${t.value}</span> <img src='./images/icon-close.svg' />  </button>`
    )
    .join('');
};

// displaySuggestions by ingredients, appareils, ustensiles
const displaySuggestions = (arr, container) => {
  const article = createElement(
    'article',
    ['advanced-search__article'],
    null,
    container
  );

  const model = suggestionsList(arr);
  createElement('div', ['advanced-search__list'], model, article);
};

// displaySuggestions by ingredients, appareils, ustensiles
displaySuggestions(
  recipesFilter('ingrédients').slice(0, 36),
  containerIngredients
);
displaySuggestions(recipesFilter('appareils'), containerAppareils);
displaySuggestions(recipesFilter('ustensiles'), containerUstensils);

let arrFilterName = [];
// Event
for (let i = 0; i < fieldSearchAdvanced.length; i++) {
  const article = document.querySelectorAll('.advanced-search__article');
  const list = document.querySelectorAll('.advanced-search__list');

  // Click on ingredients, appareils or ustensiles
  fieldSearchAdvanced[i].addEventListener('click', function (e) {
    inputId = e.target.id;
    // input name
    let filterName = this.childNodes[1].name.toLowerCase();

    // array onClick
    arrFilterName = recipesFilter(filterName);

    // classList
    setClass(fieldSearchAdvanced, 'remove', 'active');
    setClass(article, 'remove', 'show');

    let setClasses = !this.classList.contains('active');

    // if no active
    if (setClasses) {
      this.classList.add('active');
      this.nextElementSibling.classList.add('show');
    }
  });

  inputs[i].addEventListener('keyup', function (e) {
    let keyboard = e.target.value;
    let suggestions = [...arrFilterName];

    if (keyboard) {
      suggestions = arrFilterName.filter((data) => {
        return data.toLowerCase().includes(keyboard.toLowerCase());
      });
    }

    // Refresh the list
    list[i].innerHTML = suggestionsList(suggestions.slice(0, 36));
  });
}

let searchListIng = [];
let containerRecipe = document.querySelectorAll('.advanced-search__recipe');
containerRecipe.forEach((element) => {
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

document.addEventListener('click', function (e) {
  const article = document.querySelectorAll('.advanced-search__article');

  if (e.target.className.includes('input-advanced')) {
    return;
  } else {
    setClass(fieldSearchAdvanced, 'remove', 'active');
    setClass(article, 'remove', 'show');
  }
});
