"use strict";

var popUp = document.querySelector(".busines-service");
var openButton = document.querySelector(".regular-service__link");
var closeButton = document.querySelector(".busines-service__close-button");

openButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  popUp.classList.add("busines-service--active");
})

closeButton.addEventListener("click", function () {
  popUp.classList.remove("busines-service--active");
})
