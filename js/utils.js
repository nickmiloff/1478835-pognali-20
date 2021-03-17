"use strict";

var indexOf = function (parent, child) {
  return Array.from(parent.children).indexOf(child);
}

window.utils = {
  indexOf: indexOf
}
