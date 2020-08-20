"use strict";

var depth = document.querySelector(".value-level__depth");
var line = document.querySelector(".value-level__line");

var firstPin = {
  pin: document.querySelector(".value-level__pin--first"),
  value: document.querySelector(".value-level__value--first"),
  label: document.querySelector(".value-level__label--first"),
  getX: function (x) {
          if (x < MIN) {
            x = MIN;
          }
          if (x > MAX) {
            x = MAX;
          }
          if (x > secondPin.pin.offsetLeft) {
            x = secondPin.pin.offsetLeft;
          }
          this.pin.style.left = x + "px";
          depth.style.left = x + "px";
          return x; }
}

var secondPin = {
  pin: document.querySelector(".value-level__pin--second"),
  value: document.querySelector(".value-level__value--second"),
  label: document.querySelector(".value-level__label--second"),
  getX: function (x, mx = 0) {
          if (x < MIN) {
            x = MIN;
          }
          if (x > MAX) {
            x = MAX;
          }
          if (x < firstPin.pin.offsetLeft) {
            x = firstPin.pin.offsetLeft;
          }
          if (firstPin.pin.offsetLeft === secondPin.pin.offsetLeft && (secondPin.pin.offsetLeft - x) > -1 && mx != 0) {
            x = firstPin.pin.offsetLeft + mx;
            x = firstPin.getX(x);
            firstPin.value.value = Math.floor(x / MAX * maxValue);
          }
          this.pin.style.left = x + "px";
          depth.style.right = (MAX - x) + "px";
          return x; }
}

var MIN = 0;
var MAX = line.offsetWidth - firstPin.pin.offsetWidth;
var maxValue = firstPin.value.getAttribute("data-max");

var toValue = function (pin) {
  if (pin.classList.contains('value-level__pin--first')) {
    return firstPin.value;
  }
  else {
    return secondPin.value;
  }
}

var sliderHandler = function (evt) {
  evt.preventDefault();

  var mouseMoveHandler = function (em) {
    em.preventDefault();

    if (evt.target.classList.contains('value-level__pin--first')) {
      var x = firstPin.pin.offsetLeft + em.movementX;
      x = firstPin.getX(x);
      firstPin.value.value = Math.floor(x / MAX * maxValue);
    }
    else {
      var x = secondPin.pin.offsetLeft + em.movementX;
      x = secondPin.getX(x, em.movementX);
      secondPin.value.value = Math.floor(x / MAX * maxValue);
    }
  }

  var mouseUpHandler = function (eu) {
    eu.preventDefault();
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
}

var mobileSliderHandler = function (evt) {
  evt.preventDefault();

  var touchStart = evt.changedTouches[0].pageX;

  var touchMoveHandler = function (tm) {
    var touchCurrent = tm.changedTouches[0].pageX - touchStart;
    if (evt.target.classList.contains('value-level__pin--first')) {
      var x = firstPin.pin.offsetLeft + touchCurrent;
      x = firstPin.getX(x);
      firstPin.value.value = Math.floor(x / MAX * maxValue);
    }
    else {
      var x = secondPin.pin.offsetLeft + touchCurrent;
      x = secondPin.getX(x, touchCurrent);
      secondPin.value.value = Math.floor(x / MAX * maxValue);
    }

    touchStart = tm.changedTouches[0].pageX;
  }

  var touchEndHandler = function (te) {
    te.preventDefault();

    document.removeEventListener("touchmove", touchMoveHandler);
    document.removeEventListener("touchend", touchEndHandler);
  }

  document.addEventListener("touchmove", touchMoveHandler);
  document.addEventListener("touchend", touchEndHandler);
}

var numberChange = function (index) {
  if (index === 0) {
    var x = firstPin.value.value * MAX / maxValue;
    x = firstPin.getX(x);
    if (x < (firstPin.value.value * MAX / maxValue)) {
      firstPin.value.value = secondPin.value.value;
    }
  }
  else {
    var x = secondPin.value.value * MAX / maxValue;
    x = secondPin.getX(x);
    if (x > (secondPin.value.value * MAX / maxValue)) {
      secondPin.value.value = firstPin.value.value;
    }
  }
};

document.querySelectorAll(".value-level__value").forEach(function (value, index) {
  value.addEventListener("change", function () { numberChange(index); })
})

document.querySelectorAll(".value-level__pin").forEach(function (pin, index) {
  pin.addEventListener("mousedown", function (evt) { sliderHandler(evt); });
  pin.addEventListener("touchstart", function (evt) { mobileSliderHandler(evt);})
  pin.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 39 && toValue(pin).value < parseInt(maxValue)) {
      toValue(pin).value = parseInt(toValue(pin).value) + 1;
      numberChange(index);
    }
    if (evt.keyCode === 37 && toValue(pin).value > MIN) {
      toValue(pin).value = parseInt(toValue(pin).value) - 1;
      numberChange(index);
    }
  })
})
