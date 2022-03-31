export const setClass = (els, fnName, className) => {
  for (var i = 0; i < els.length; i++) {
    els[i].classList[fnName](className);
  }
};
