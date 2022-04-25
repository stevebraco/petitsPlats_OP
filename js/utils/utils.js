export const setClass = (els, fnName, className) => {
  for (var i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);
  }
};

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

export const filterButtonSearchAdvanced = (array, name, value) => {
  if (name === 'appareils') {
    console.log('appareils');
    array = array.filter((result) => {
      return result.appliance.toLowerCase().includes(value.toLowerCase());
    });
  }

  if (name === 'ingredients') {
    console.log('ingredients');

    array = array.filter((recipe) =>
      recipe.ingredients.find((t) =>
        t.ingredient.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  if (name === 'ustensiles') {
    console.log('ustensiles');

    array = array
      .filter((element) =>
        element.ustensils.find((ustensil) =>
          ustensil.toLowerCase().includes(value.toLowerCase())
        )
      )
      .flat();
  }
  return array;
};

export const selectRecipesFilter = (arrFilterName, array) => {
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

export const buttonDisabled = (array, index) => {
  const article = document.querySelectorAll('.advanced-search__article');
  const btnSelectedAll = document.querySelectorAll('.btn__selected');
  let tag = document.querySelectorAll('.advanced-search__tag');

  if (article[index].classList.contains('show')) {
    console.log('show');
    if (btnSelectedAll.length > 0) {
      [...tag].some((r) => {
        if (array.includes(r.textContent)) {
          r.classList.add('btn__disabled');
        }
      });
    }
  }
};

export const refreshCardTags = (array, tags) => {
  console.log(tags.tagAppliance);
  let result = [];
  array.filter((recipe) => {
    let ingredients = tags.tagIngredient?.every((tag) =>
      recipe.ingredients.find((t) =>
        t.ingredient.toLowerCase().includes(tag.toLowerCase())
      )
    );
    let appliance = recipe.appliance.toLowerCase().includes(tags.tagAppliance);

    let ustensils = tags.tagUstensils?.every((tag) =>
      recipe.ustensils.find((t) => t.toLowerCase().includes(tag.toLowerCase()))
    );

    if (ingredients && ustensils && appliance) {
      result.push(recipe);
    }
  });
  return result;
};
