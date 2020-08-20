"use strict";

var main = document.querySelector(".main");
var logo = document.querySelector(".logo__img");
var logoSource = document.querySelectorAll(".logo__source");
var toggle = document.querySelector(".header__toggle");
var header = document.querySelector(".header__wrapper");
var headerClass = "";
var menu = document.querySelector(".main-nav");

var currentDevice = null;

var getCurrentDevice = function () {
  if (window.matchMedia("(max-width: 1439px)").matches) {
    return "tablet";
  }
  else {
    return "desktop";
  }
}

var checkHeader = function () {
  var mainHeader = document.querySelector(".header");
  var secondaryHeader = document.querySelector(".header__wrapper");

  mainHeader.classList.remove("header--active");
  secondaryHeader.classList.remove("header__wrapper--active");
  menu.classList.remove("main-nav--active");
  toggle.classList.remove("header__toggle--close");

  if (logo.srcset.includes("blue")) {
    logo.srcset = logo.srcset.replace(/blue/g, "white");
    logo.src = logo.src.replace("blue", "white");
    logoSource.forEach(function (current) {
      current.srcset = current.srcset.replace(/blue/g, "white");
    })
  }

  if (currentDevice === "tablet") {
    header = document.querySelector(".header__wrapper");
    return "header__wrapper--active";
  }
  else {
    header = document.querySelector(".header");
    return "header--active";
  }
}

var logoChange = function () {
  if (logo.srcset.includes("blue")) {
    logo.srcset = logo.srcset.replace(/blue/g, "white");
    logo.src = logo.src.replace("blue", "white");
    logoSource.forEach(function (current) {
      current.srcset = current.srcset.replace(/blue/g, "white");
    })
  }
  else {
    logo.srcset = logo.srcset.replace(/white/g, "blue");
    logo.src = logo.src.replace("white", "blue");
    logoSource.forEach(function (current) {
      current.srcset = current.srcset.replace(/white/g, "blue");
    })
  }
}

var setDefault = function () {
  if (logo.srcset.includes("blue")) {
    logo.srcset = logo.srcset.replace(/blue/g, "white");
    logo.src = logo.src.replace("blue", "white");
    logoSource.forEach(function (current) {
      current.srcset = current.srcset.replace(/blue/g, "white");
    })
  }
  document.querySelector(".header__wrapper").classList.remove("header__wrapper--active");
  document.querySelector(".header").classList.remove("header--active")
}

var initMenu = function () {
  logoChange();
  toggle.classList.add("header__toggle--active");
  header.classList.remove("header__wrapper--active");
  header.classList.remove("header__wrapper--no-js")
  menu.classList.remove("main-nav--active");
  menu.classList.remove("main-nav--no-js");

  currentDevice = getCurrentDevice();

  headerClass = checkHeader ();
}

var closeMenu = function () {
  if (!header.classList.contains(headerClass) && !toggle.classList.contains("header__toggle--scroll")) {
    logoChange();
    header.classList.remove(headerClass);
    main.classList.remove("main--active");
  }

  menu.classList.remove("main-nav--active");
  toggle.classList.remove("header__toggle--close");

  if (window.pageYOffset === 0) {
    unScrollMenu();
  }
}

var opneMenu = function () {
  if (!header.classList.contains(headerClass)) {
    logoChange();
    header.classList.add(headerClass);
  }
  main.classList.add("main--active");
  toggle.classList.add("header__toggle--close");
  menu.classList.add("main-nav--active");
}

var scrollMenu = function () {
  if (!header.classList.contains(headerClass)) {
    logoChange();
    header.classList.add(headerClass);
  }
  toggle.classList.add("header__toggle--scroll");
  main.classList.add("main--active");
}

var unScrollMenu = function () {
  if (!menu.classList.contains("main-nav--active")) {
    logoChange();
    header.classList.remove(headerClass);
    toggle.classList.remove("header__toggle--scroll");
  }
  main.classList.remove("main--active");
}

toggle.addEventListener("click", function () {
  if (toggle.classList.contains("header__toggle--close")) {
    closeMenu()
  }
  else {
    opneMenu();
  }
})

window.addEventListener("scroll", function () {
  if (window.pageYOffset === 0 && !menu.classList.contains("main-nav--active")) {
    unScrollMenu();
  }
  else {
    scrollMenu();
  }
})

window.addEventListener("resize", function () {
  if (currentDevice !== getCurrentDevice()) {
    currentDevice = getCurrentDevice();
    headerClass = checkHeader ();
  }
  if (pageYOffset > 1) {
    scrollMenu();
  }
})

initMenu();
