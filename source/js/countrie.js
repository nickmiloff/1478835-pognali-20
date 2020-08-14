"use strict";

var countries = document.querySelector(".step__countries-container");
var countriesElements = {
  template: countries.querySelector(".input-countrie--empty").cloneNode(true),
  dropdownButtons: countries.querySelectorAll(".input-countrie__dropdown-button")
}

var addButton = document.querySelector(".new-countrie__add-button");

var textareas = document.querySelector(".step__plans-container");
var textareasElements = {
  template: textareas.querySelector(".step__countrie-plan").cloneNode(true),
  all: function () {
    return textareas.querySelectorAll(".step__countrie-plan");
  }
}

var dropdown = document.querySelector(".countrie-dropdown");
var dropdownElements = {
  closeButton: dropdown.querySelector(".countrie-dropdown__close-button"),
  countriesList: dropdown.querySelector(".countrie-dropdown__list"),
  alphabet: dropdown.querySelector(".countrie-dropdown__alphabet")
}

var currentInput = {
  parent: null,
  input: null,
  flag: null,
  closeButton: null
};

var isLonely = function () {
  if (countries.children.length === 0) {
    addButton.parentNode.classList.add("new-countrie--lonely");
  }
  else {
    addButton.parentNode.classList.remove("new-countrie--lonely");
  }
}

var openDropdown = function (element) {
  dropdown.style.left = element.parentNode.parentNode.offsetLeft + element.offsetLeft + "px";
  dropdown.style.top = element.parentNode.parentNode.offsetTop + element.offsetTop + "px";
  dropdown.classList.add("countrie-dropdown--active");

  currentInput.parent = element;
  currentInput.input = element.querySelector(".input-countrie__input");
  currentInput.flag = element.querySelector(".input-countrie__flag");
  currentInput.closeButton = element.querySelector(".input-countrie__delete-button");
}

var closeDropdown = function () {
  dropdown.classList.remove("countrie-dropdown--active");

  currentInput.parent = null;
  currentInput.input = null;
  currentInput.flag = null;
  currentInput.closeButton = null;
}

var addNewCountrie = function () {
  var element = countriesElements.template.cloneNode(true);

  element.querySelector(".input-countrie__delete-button").addEventListener("click", function (evt) {
    evt.preventDefault();

    element.remove();
    isLonely();
  })

  element.querySelector(".input-countrie__dropdown-button").addEventListener("click", function (evt) {
    evt.preventDefault();

    openDropdown(element);
  })

  countries.appendChild(element);
}

var addNewTextarea = function (countrie, index, flag) {
  var element = textareasElements.template.cloneNode(true);

  var label = element.querySelector("label");

  label.setAttribute("for", "countrie-plan-" + index);
  label.textContent = countrie;
  label.classList.add("countrie-plan__countrie--" + flag);

  element.addEventListener("input", function () {
    window.validation.isValidTextarea(element);
  })

  if (index === textareas.children.length) {
    textareas.appendChild(element);
  }
  else {
    textareas.insertBefore(element, textareas.children[index]);
  }

  return element;
}

var initCountrie = function () {
  countries.innerHTML = "";
  textareas.innerHTML = "";
  addButton.parentNode.classList.add("new-countrie--lonely");
}

dropdownElements.alphabet.addEventListener("click", function (evt) {
  evt.preventDefault()
  evt.stopPropagation();

  if (evt.target.classList.contains("countrie-dropdown__letter")) {
    dropdownElements.alphabet.querySelector(".countrie-dropdown__letter--active").classList.remove("countrie-dropdown__letter--active");
    evt.target.classList.add("countrie-dropdown__letter--active");

    dropdownElements.countriesList.querySelector(".countrie-dropdown__item--active").classList.remove("countrie-dropdown__item--active");
    dropdownElements.countriesList.children[window.utils.indexOf(evt.target.parentNode.parentNode, evt.target.parentNode)].classList.add("countrie-dropdown__item--active");
  }
})

countriesElements.dropdownButtons.forEach(function (button) {
  button.addEventListener("click", function (evt) {
    evt.preventDefault();

    openDropdown(button.parentNode);
  })
})

dropdownElements.closeButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  closeDropdown();
})

addButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  addNewCountrie();
  isLonely();
})

dropdownElements.countriesList.addEventListener("click",  function (evt) {
  evt.preventDefault();
  evt.stopPropagation();

  if (evt.target.classList.contains("countrie-dropdown__city")) {
    var countrie = evt.target.innerText;
    var flag = evt.target.getAttribute("data-code");
    var index = window.utils.indexOf(currentInput.parent.parentNode, currentInput.parent);

    if (currentInput.flag.classList.length > 1) {
      currentInput.flag.classList.remove(currentInput.flag.classList[1]);
    }

    currentInput.input.value = countrie;
    currentInput.flag.classList.add("input-countrie__flag--" + flag);

    if (!currentInput.parent.classList.contains("input-countrie--empty")) {
      textareasElements.all()[index].remove();
    }
    else {
      currentInput.parent.classList.remove("input-countrie--empty");
    }

    var textarea = addNewTextarea(countrie, index, flag);

    dropdown.classList.remove("countrie-dropdown--active");

    currentInput.closeButton.addEventListener("click", function (evt) {
      evt.preventDefault();

      textarea.remove();
    })
  }
})

initCountrie();
