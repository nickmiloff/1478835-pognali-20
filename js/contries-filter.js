"use strict";

var filter = document.querySelector(".countries-filter");
var filterElements = {
  toggle: filter.querySelector(".countries-filter__toggle"),
  parts: filter.querySelector(".countries-filter__list"),
  partsList: filter.querySelectorAll(".countries-filter__link"),
  alphabet: filter.querySelector(".countries-filter__alphabet"),
  letters: filter.querySelector(".countries-filter__letter"),
  rollUpButton: filter.querySelector(".countries-filter__button")
}

var getDevice = function () {
  if (window.matchMedia("(max-width: 767px)").matches) {
    return "mobile";
  }
  else if (window.matchMedia("(min-width: 1440px)").matches) {
    return "desktop";
  }
  return "tablet";
}

var openFilter = function () {
  filterElements.toggle.classList.add("countries-filter__toggle--active");
  filterElements.toggle.textContent = "Свернуть";
  filterElements.parts.classList.add("countries-filter__list--active");
  filterElements.alphabet.classList.add("countries-filter__alphabet--active");
  filterElements.rollUpButton.classList.add("countries-filter__button--active");
}

var closeFilter = function () {
  filterElements.toggle.classList.remove("countries-filter__toggle--active");
  filterElements.toggle.textContent = "Показать все";
  filterElements.parts.classList.remove("countries-filter__list--active");
  filterElements.alphabet.classList.remove("countries-filter__alphabet--active");
  filterElements.rollUpButton.classList.remove("countries-filter__button--active");
}

var initFilter = function () {
  filter.classList.remove("countries-filter--no-js");
  document.querySelector(".main__catalog-wrapper").classList.remove("main__catalog-wrapper--no-js");
  filterElements.toggle.classList.remove("countries-filter__toggle--no-js");

  closeFilter();
}

filterElements.toggle.addEventListener("click", function (evt) {
  evt.preventDefault();

  if (filterElements.toggle.classList.contains("countries-filter__toggle--active")) {
    closeFilter();
  }
  else {
    openFilter();
  }
})

filterElements.rollUpButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  closeFilter();
})

filterElements.partsList.forEach(function (part) {
  part.addEventListener("click", function (evt) {
    evt.preventDefault();

    filterElements.parts.querySelector(".countries-filter__link--active").classList.remove("countries-filter__link--active");
    part.classList.add("countries-filter__link--active");
  })
});

filterElements.alphabet.addEventListener("click", function (evt) {
  evt.preventDefault()
  evt.stopPropagation();

  if (evt.target.classList.contains("countries-filter__letter")) {
    var oldLetter = filterElements.alphabet.querySelector(".countries-filter__letter--active");
    var oldCities = oldLetter.nextElementSibling;
    var newLetter = evt.target;
    var newCities = newLetter.nextElementSibling;

    oldLetter.classList.remove("countries-filter__letter--active");
    oldCities.classList.remove("countries-filter__cities--scroll");
    oldCities.classList.remove("countries-filter__cities--active");
    newLetter.classList.add("countries-filter__letter--active");
    if (newCities.children.length > 11) {
      newCities.classList.add("countries-filter__cities--scroll");
    }
    newCities.classList.add("countries-filter__cities--active");
  }
})

initFilter();
