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

const recipesFilter = (filterName) => {
  let arr;
  if (filterName == 'ingrédients') {
    arr = [
      ...new Set(
        recipes
          .map((t) => t.ingredients.map((i) => i.ingredient.toLowerCase()))
          .flat()
          .slice(0, 36)
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
  return arr.map((t) => `<p> ${t} </p>`).join('');
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
displaySearchAdvanced(recipesFilter('ingrédients'), containerIngredients);
displaySearchAdvanced(recipesFilter('appareils'), containerAppareils);
displaySearchAdvanced(recipesFilter('ustensiles'), containerUstensils);

let filterName;
// Event
for (let i = 0; i < searchIngredients.length; i++) {
  const article = document.querySelectorAll('.advanced-search__article');
  const list = document.querySelectorAll('.advanced-search__list');

  searchIngredients[i].addEventListener('click', function (e) {
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
    let suggestions = [];
    if (keyboard) {
      suggestions = filterName.filter((data) => {
        return data.toLowerCase().includes(keyboard.toLowerCase());
      });
    }

    if (!keyboard) {
      list[i].innerHTML = displaydata(filterName);
    } else {
      list[i].innerHTML = displaydata(suggestions);
    }
  });
}

document.addEventListener('click', function (e) {
  const article = document.querySelectorAll('.advanced-search__article');

  console.log('click');
  if (e.target.className.includes('input-advanced')) {
    return;
  } else {
    setClass(searchIngredients, 'remove', 'active');
    setClass(article, 'remove', 'show');
  }
});
