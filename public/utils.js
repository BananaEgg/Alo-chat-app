const addElementHtml = (
  parentId,
  elementTag,
  elementId,
  html,
  styleClass = ""
) => {
  let element = document.getElementById(elementId);
  if (!element) {
    let p = document.getElementById(parentId);
    let newElement = document.createElement(elementTag);
    newElement.setAttribute("id", elementId);
    if (styleClass) {
      newElement.classList.add(styleClass);
    }
    newElement.innerHTML = html;
    p.appendChild(newElement);
  } else {
    element.innerHTML = html;
  }
};

const removeElementHtml = (elementId) => {
  try {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
  } catch (err) {
    console.log(err);
  }
};

const clearElementHtml = (elementId) => {
  document.getElementById(elementId).innerHTML = "";
};

const addFirstChild = (parentId, elementTag, childId, childHtml) => {
  let newElement = document.createElement(elementTag);
  newElement.setAttribute("id", childId);
  newElement.innerHTML = childHtml;
  let parent = document.getElementById(parentId);
  parent.insertBefore(newElement, parent.firstChild);
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export { addElementHtml, removeElementHtml, addFirstChild, getRandomColor, clearElementHtml };
