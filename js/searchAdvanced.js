import { recipes } from '../data/recipes.js';
import { createElement } from './utils/createElement.js';
import { setClass } from './utils/utils.js';

const inputs = document.querySelectorAll('.input-advanced');

const containerIngredients = document.getElementById('container-ing');
const containerAppareils = document.getElementById('container-app');
const containerUstensils = document.getElementById('container-ust');
const searchIngredients = document.querySelectorAll(
  '.advanced-search__wrapper'
);

const containerAdvancedSearchList = document.querySelector(
  '.advanced-search__selected'
);

let inputId;

const recipesFilter = (filterName) => {
  let arr;
  if (filterName == 'ingrédients') {
    arr = [
      ...new Set(
        recipes
          .map((t) => t.ingredients.map((i) => i.ingredient.toLowerCase()))
          .flat()
      ),
    ];
  }

  if (filterName == 'appareils') {
    arr = [...new Set(recipes.map((t) => t.appliance.toLowerCase()))];
  }

  if (filterName == 'ustensiles') {
    arr = [
      ...new Set(
        recipes.map((t) => t.ustensils.map((u) => u.toLocaleLowerCase())).flat()
      ),
    ];
  }
  return arr;
};

const displaydata = (arr) => {
  return arr
    .map((t) => `<p class='advanced-search__recipe'> ${t} </p>`)
    .join('');
};

const displayLilSearch = (arr) => {
  return arr
    .map(
      (t) =>
        `<button type='button' class='btn__selected btn__${t.inputId}'> <span>${t.value}</span> <img src='./images/icon-close.svg' />  </button>`
    )
    .join('');
};

const displaySearchAdvanced = (arr, container) => {
  const article = createElement(
    'article',
    ['advanced-search__article'],
    null,
    container
  );

  const model = displaydata(arr);
  createElement('div', ['advanced-search__list'], model, article);
};

// Display recipes
displaySearchAdvanced(
  recipesFilter('ingrédients').slice(0, 36),
  containerIngredients
);
displaySearchAdvanced(recipesFilter('appareils'), containerAppareils);
displaySearchAdvanced(recipesFilter('ustensiles'), containerUstensils);

let filterName;
// Event
for (let i = 0; i < searchIngredients.length; i++) {
  const article = document.querySelectorAll('.advanced-search__article');
  const list = document.querySelectorAll('.advanced-search__list');

  searchIngredients[i].addEventListener('click', function (e) {
    inputId = e.target.id;

    // array onClick
    filterName = recipesFilter(this.childNodes[1].name.toLowerCase());

    // let placeholder = searchIngredients[i].childNodes[1].name;
    // e.target.placeholder = placeholder;

    // classList
    setClass(searchIngredients, 'remove', 'active');
    setClass(article, 'remove', 'show');

    let setClasses = !this.classList.contains('active');

    // if no active
    if (setClasses) {
      // searchIngredients[
      //   i
      // ].childNodes[1].placeholder = `Rechercher un ${e.target.placeholder.toLowerCase()}`;

      this.classList.add('active');
      this.nextElementSibling.classList.add('show');
    }
  });

  inputs[i].addEventListener('keyup', function (e) {
    let keyboard = e.target.value;
    let suggestions = filterName;
    if (keyboard) {
      suggestions = filterName.filter((data) => {
        return data.toLowerCase().includes(keyboard.toLowerCase());
      });
    }

    list[i].innerHTML = displaydata(suggestions.slice(0, 36));
  });
}

document.addEventListener('click', function (e) {
  const article = document.querySelectorAll('.advanced-search__article');

  if (e.target.className.includes('input-advanced')) {
    return;
  } else {
    setClass(searchIngredients, 'remove', 'active');
    setClass(article, 'remove', 'show');
  }
});

let searchListIng = [];

let containerRecipe = document.querySelectorAll('.advanced-search__recipe');
containerRecipe.forEach((element) => {
  element.addEventListener('click', () => {
    let value = element.textContent;
    searchListIng.push({ value, inputId });
    const list = displayLilSearch(searchListIng);
    containerAdvancedSearchList.innerHTML = list;

    // btnSelected.forEach((element) =>
    //   element.addEventListener('click', function () {
    //     let test = searchListIng.filter(
    //       (select) => select.value.trim() !== element.textContent.trim()
    //     );
    //     const list = displayLilSearch(test);
    //     containerAdvancedSearchList.innerHTML = list;
    //   })
    // );
  });
});
