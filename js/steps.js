"use strict";

var title =document.querySelector(".add-plan__title");
var form = document.querySelector(".add-plan__form");
var steps = form.querySelectorAll(".add-plan__step");
var companions = form.querySelector(".step__input-area--companions");

var companionsElements = {
  minusButton: companions.querySelector(".input-area__button--minus"),
  plusButton: companions.querySelector(".input-area__button--plus"),
  input: companions.querySelector(".input-area__value")
}

var isValidInput = function (input) {
  var inputInvalidClass = input.classList[0] + "--invalid";
  var parentInvalidClass = input.parentNode.classList[0] + "--invalid";

  if (input.checkValidity() === false) {
    input.classList.add(inputInvalidClass);
    input.parentNode.classList.add(parentInvalidClass);

    return false;
  }
  else {
    input.classList.remove(inputInvalidClass);
    input.parentNode.classList.remove(parentInvalidClass);

    return true;
  }
}

var isValidTextarea = function (textarea) {
  var textareaInvalidClass = textarea.classList[0] + "--invalid";
  var parentInvalidClass = textarea.parentNode.classList[1] + "--invalid";

    if (textarea.checkValidity() === false) {
      textarea.classList.add(textareaInvalidClass);
      textarea.parentNode.classList.add(parentInvalidClass);

      return false;
    }
    else {
      textarea.classList.remove(textareaInvalidClass);
      textarea.parentNode.classList.remove(parentInvalidClass);

      return true
    }
}

var isValidFieldset = function (fieldset) {
  var flag = true;

  fieldset.querySelectorAll("input").forEach(function (input) {
    if (isValidInput(input) === false) {
      flag = false;
    }
  })

  fieldset.querySelectorAll("textarea").forEach(function (textarea) {
    if (isValidTextarea(textarea) === false) {
      flag = false;
    }
  })

  if (fieldset.querySelector(".step__countries-container")) {
    if ((fieldset.querySelectorAll(".step__input-countrie").length === fieldset.querySelectorAll(".input-countrie--empty").length) || fieldset.querySelectorAll(".step__input-countrie").length === 0) {
      flag = false;
    }
  }

  return flag;
}

var nextStep = function (i) {
  if (isValidFieldset(steps[i])) {
    var oldTitle = "add-plan__title--" + (i + 1);
    var newTitle = "add-plan__title--" + (i + 2);

    title.classList.remove(oldTitle);
    title.classList.add(newTitle);

    steps[i].classList.remove("step--active");
    steps[i + 1].classList.add("step--active");
  }
}

var prevStep = function (i) {
  var oldTitle = "add-plan__title--" + (i + 1);
  var newTitle = "add-plan__title--" + (i);

  title.classList.remove(oldTitle);
  title.classList.add(newTitle);

  steps[i].classList.remove("step--active");
  steps[i - 1].classList.add("step--active");
}

var initForm = function () {
  for (let i = 1; i < steps.length; i++) {
    steps[i].classList.remove("step--active");
  }
}

form.querySelectorAll("a.step__next-button").forEach(function (button, i) {
  button.addEventListener("click", function (evt) {
    evt.preventDefault();
    nextStep(i);
  })
})

form.querySelectorAll(".step__prev-button").forEach(function (button, i) {
  button.addEventListener("click", function (evt) {
    evt.preventDefault();
    prevStep(i + 1);
  })
})

form.querySelector("button.step__next-button").addEventListener("click", function (evt) {
  if (isValidFieldset(steps[steps.length - 1]) === false) {
    evt.preventDefault();
    return;
  }
})

form.querySelectorAll("input").forEach(function (input) {
  input.addEventListener("input", function () {
    isValidInput(input);
  })
})

companionsElements.plusButton.addEventListener("click",  function (evt) {
  evt.preventDefault();

  if (companionsElements.input.value == 0) {
    companionsElements.minusButton.classList.remove("input-area__button--inactive");
  }

  companionsElements.input.value = parseInt(companionsElements.input.value) + 1;
})

companionsElements.minusButton.addEventListener("click",  function (evt) {
  evt.preventDefault();

  if (companionsElements.input.value > 0) {
    companionsElements.input.value = parseInt(companionsElements.input.value) - 1;
  }

  if (companionsElements.input.value == 0) {
    companionsElements.minusButton.classList.add("input-area__button--inactive");
  }
})

initForm();


window.validation = {
  isValidTextarea: isValidFieldset,
}
