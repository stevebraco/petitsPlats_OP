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
    return;
  } else {
    setClass(fieldSearchAdvanced, 'remove', 'active');
    setClass(article, 'remove', 'show');
  }
}
