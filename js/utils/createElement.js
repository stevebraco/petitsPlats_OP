export const createElement = (
  tagName,
  className,
  contentHTML,
  parentContainer
) => {
  const element = document.createElement(tagName);
  element.classList.add(...className);
  element.innerHTML = contentHTML;
  parentContainer?.appendChild(element);

  return element;
};
