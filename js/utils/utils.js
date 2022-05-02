/**
 * Represents a classlist
 */
export const setClass = (els, fnName, className) => {
  for (var i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);
  }
};

/**
 * Show and Hide suggestions
 */
export function showHide(fieldSearchAdvanced, article, element) {
  setClass(fieldSearchAdvanced, 'remove', 'active');
  setClass(article, 'remove', 'show');
  let setClasses = !element.classList.contains('active');

  // if no active
  if (setClasses) {
    element.classList.add('active');
    element.nextElementSibling.classList.add('show');
  }
}

/**
 * close and update fileds inputs
 */
export function onClickOutside(e, fieldSearchAdvanced, article) {
  if (e.target.className.includes('input-advanced')) {
    fieldSearchAdvanced.forEach((element) => {
      if (element.classList.contains('active')) {
        element.firstElementChild.placeholder = `Rechercher un ${element.firstElementChild.dataset.name}`;
      } else {
        element.firstElementChild.placeholder = element.firstElementChild.name;
      }
    });
    return;
  } else {
    setClass(fieldSearchAdvanced, 'remove', 'active');
    setClass(article, 'remove', 'show');
    fieldSearchAdvanced.forEach((element) => {
      element.firstElementChild.placeholder = element.firstElementChild.name;
    });
  }
}

/**
 * map ingredient, appareils, ustensils
 */
export const selectRecipesFilter = (filterName, array) => {
  let arr = [];

  if (filterName === 'ingredients') {
    arr = array
      ?.map((element) =>
        element.ingredients.map((i) => i.ingredient.toLowerCase())
      )
      .flat();
  }

  if (filterName === 'appareils') {
    arr = array?.map((element) => element.appliance.toLowerCase());
  }

  if (filterName === 'ustensiles') {
    arr = array
      ?.map((element) =>
        element.ustensils.map((ustensil) => ustensil.toLowerCase())
      )
      .flat();
  }
  return [...new Set(arr)];
};

/**
 *  disbaled tag in suggestions
 */
export const buttonDisabled = (array, index) => {
  const article = document.querySelectorAll('.advanced-search__article');
  const btnSelectedAll = document.querySelectorAll('.btn__selected');
  let tag = document.querySelectorAll('.advanced-search__tag');

  if (article[index].classList.contains('show')) {
    if (btnSelectedAll.length > 0) {
      [...tag].some((r) => {
        if (array.includes(r.textContent)) {
          r.classList.add('btn__disabled');
        }
      });
    }
  }
};

/**
 *  updateCard with tags
 */
export function updateCardByTags(array, tags) {
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
 * Remove a tag
 */
export const tagsToRemove = (elementToRemove, tags, type) =>
  (tags[type] = tags[type].filter((tag) => tag !== elementToRemove));

/**
 * Add tags
 */
export const tagsToAdd = (element, tags, type) => tags[type].push(element);
