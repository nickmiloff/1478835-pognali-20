"use strict";

var ESC_KEYCODE = 27,
    ENTER_KEYCODE = 13;

var indexOf = function (parent, child) {
  return Array.from(parent.children).indexOf(child);
}

var isEscEvent = function (evt) {
  return evt.keyCode === ESC_KEYCODE;
}

var isEnterEvent = function (evt) {
  return evt.keyCode === ENTER_KEYCODE;
}

window.utils = {
  indexOf: indexOf,
  isEsc: isEscEvent,
  isEnter: isEnterEvent
}
