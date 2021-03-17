"use strict";

var calendar = {
  durationWrapper: document.querySelector(".step__input-area--duration"),
  prevMonthButton: document.querySelector(".calendar__button--prev"),
  nextMonthButton: document.querySelector(".calendar__button--next"),
  dateArea: document.querySelector(".calendar__date"),
  numbersContainer: document.querySelector(".calendar__numbers"),
  days: document.querySelectorAll(".calendar__link"),
  checkIn: document.querySelector("#date-check-in"),
  checkOut: document.querySelector("#date-check-out")
}

var duration = {
  duration: calendar.durationWrapper.querySelector("#duration-1"),
  minusButton: calendar.durationWrapper.querySelector(".input-area__button--minus"),
  plusButton: calendar.durationWrapper.querySelector(".input-area__button--plus")
}

var now = new Date();

var date = {
  iterYear: now.getFullYear(),
  iterMonth: now.getMonth(),
  iterDay: now.getDate()
}

var checks = {
  in: new Date(date.iterYear, date.iterMonth, (date.iterDay + 1)),
  out: new Date(date.iterYear, date.iterMonth, (date.iterDay + parseInt(duration.duration.value)))
}

var renderCalendar = function (year, month) {
  var iterDate = new Date(year, month);
  var renderedYear = iterDate.toLocaleString("ru", { year: "numeric" });
  var renderedMonth = iterDate.toLocaleString("ru", { month: "long" });

  calendar.dateArea.value = renderedMonth + " " + renderedYear;
  iterDate.setDate(iterDate.getDate() - iterDate.getDay() + 1);

  for (let i = 0; i < calendar.days.length; i++) {
    if (iterDate.getDate() === 1) {
      var monthName = iterDate.toLocaleString("ru", { month: "short" }).replace(".", "");

      calendar.days[i].innerHTML = '1<span class="calendar__first-day">' + monthName + '</span>';
    }
    else {
      calendar.days[i].textContent = iterDate.getDate();
    }

    calendar.days[i].classList.remove("calendar__link--disabled");
    calendar.days[i].classList.remove("calendar__link--active");
    calendar.days[i].classList.remove("calendar__link--check-in");
    calendar.days[i].classList.remove("calendar__link--check-out");

    if (iterDate < now) {
      calendar.days[i].classList.add("calendar__link--disabled");
    }

    if ((iterDate > checks.in) && (iterDate < checks.out)) {
      calendar.days[i].classList.add("calendar__link--active");
    }

    if (iterDate.toLocaleString("ru") == checks.in.toLocaleString("ru")) {
      calendar.days[i].classList.add("calendar__link--active");
      calendar.days[i].classList.add("calendar__link--check-in");
    }

    if (iterDate.toLocaleString("ru") == checks.out.toLocaleString("ru")) {
      calendar.days[i].classList.add("calendar__link--active");
      calendar.days[i].classList.add("calendar__link--check-out");
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }
}

var lengthOf = function () {
  return new Date(checks.out - checks.in).getTime() / 86400000 + 1;
}

var dateOf = function (element) {
  var iterDay = parseInt(element.textContent);

  if (window.utils.indexOf(calendar.numbersContainer, element.parentNode.parentNode) <= 1 && iterDay > 22) {
    if (date.iterMonth === 0) {
      return new Date((date.iterYear - 1), 11, iterDay);
    }

    return new Date(date.iterYear, (date.iterMonth - 1), iterDay);
  }

  if (window.utils.indexOf(calendar.numbersContainer, element.parentNode.parentNode) >= 4 && iterDay < 15) {
    if (date.iterMonth === 11) {
      return new Date((date.iterYear + 1), 0, iterDay);
    }

    return new Date(date.iterYear, (date.iterMonth + 1), iterDay);
  }

  return new Date(date.iterYear, date.iterMonth, iterDay);
}

var dayClickHandler = function (day) {
  if (checks.in === "") {
    checks.in = dateOf(day);
    duration.duration.value = "1";
    calendar.checkIn.value = checks.in;

    renderCalendar(date.iterYear, date.iterMonth);
  }

  else if (checks.in != "") {
    if (checks.out === "") {
      if (day.classList.contains("calendar__link--check-in")) {
        checks.in = "";
        duration.duration.value = "0";
        calendar.checkIn.value = "none";

        renderCalendar(date.iterYear, date.iterMonth);
      }

      else if (checks.in < dateOf(day)) {
        checks.out = dateOf(day);
        duration.duration.value = lengthOf();
        calendar.checkOut.value = checks.out;

        renderCalendar(date.iterYear, date.iterMonth);
      }
    }

    else if (checks.out != "") {
      if (day.classList.contains("calendar__link--check-out")) {
        checks.out = "";
        duration.duration.value = "1";
        calendar.checkOut.value = "none";

        renderCalendar(date.iterYear, date.iterMonth);
      }

      else if (checks.in < dateOf(day)) {
        checks.out = dateOf(day);
        duration.duration.value = lengthOf();
        calendar.checkOut.value = checks.out;

        renderCalendar(date.iterYear, date.iterMonth);
      }

      else if (checks.in > dateOf(day)) {
        checks.in = dateOf(day);
        duration.duration.value = lengthOf();
        calendar.checkIn.value = checks.in;

        renderCalendar(date.iterYear, date.iterMonth);
      }
    }
  }
}

var initCalendar = function () {
  calendar.checkIn.value = checks.in;
  calendar.checkOut.value = checks.out;

  renderCalendar(date.iterYear, date.iterMonth);
}

calendar.numbersContainer.addEventListener("click", function (evt) {
  evt.preventDefault();
  evt.stopPropagation();

  if (evt.target.classList.contains("calendar__link")) {
    dayClickHandler(evt.target);
  }
})

calendar.prevMonthButton.addEventListener("click", function (evt) {
  evt.preventDefault()

  if (date.iterMonth === 0) {
    date.iterYear -= 1;
    date.iterMonth = 12;
  }
  date.iterMonth -= 1;

  renderCalendar(date.iterYear, date.iterMonth);
})

calendar.nextMonthButton.addEventListener("click", function (evt) {
  evt.preventDefault()

  if (date.iterMonth === 11) {
    date.iterYear += 1;
    date.iterMonth = -1;
  }
  date.iterMonth += 1;

  renderCalendar(date.iterYear, date.iterMonth);
})

duration.minusButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  if (duration.duration.value > 2) {
    duration.duration.value = parseInt(duration.duration.value) - 1;
    checks.out.setDate(checks.out.getDate() - 1);
    calendar.checkOut.value = checks.out;
  }

  else if (duration.duration.value == 2) {
    duration.duration.value = 1;
    checks.out = "";
    calendar.checkOut.value = checks.out;
  }

  else if (duration.duration.value == 1) {
    duration.duration.value = 0;
    checks.in = "";
    calendar.checkIn.value = checks.in;
    duration.minusButton.classList.add("input-area__button--inactive");
  }

  renderCalendar(date.iterYear, date.iterMonth);
})

duration.plusButton.addEventListener("click", function (evt) {
  evt.preventDefault();

  if (duration.duration.value > 1) {
    duration.duration.value = parseInt(duration.duration.value) + 1;
    checks.out.setDate(checks.out.getDate() + 1);
    calendar.checkOut.value = checks.out;
  }

  else if (duration.duration.value == 1) {
    duration.duration.value = 2;
    checks.out = new Date(date.iterYear, date.iterMonth, (date.iterDay + parseInt(duration.duration.value)));
    calendar.checkOut.value = checks.out;
  }

  else if (duration.duration.value == 0) {
    duration.duration.value = 1;
    checks.in = new Date(date.iterYear, date.iterMonth, (date.iterDay + 1));
    calendar.checkIn.value = checks.in;
    duration.minusButton.classList.remove("input-area__button--inactive");
  }

  renderCalendar(date.iterYear, date.iterMonth);
})

duration.duration.addEventListener("change", function (evt) {
  evt.preventDefault();

  if (duration.duration.value > 1) {
    if (checks.in === "") {
      checks.in = new Date(date.iterYear, date.iterMonth, (date.iterDay + 1));
      calendar.checkIn.value = checks.in;
    }

    checks.out = new Date(date.iterYear, date.iterMonth, (date.iterDay + parseInt(duration.duration.value)));
    checks.out.setDate(checks.out.getDate() + (parseInt(duration.duration.value) - lengthOf()));
    calendar.checkOut.value = checks.out;
    duration.minusButton.classList.remove("input-area__button--inactive");
  }

  else if (duration.duration.value == 1) {
    if (checks.in === "") {
      checks.in = new Date(date.iterYear, date.iterMonth, (date.iterDay + 1));
      calendar.checkIn.value = checks.in;
    }

    checks.out = "";
    calendar.checkOut.value = checks.out;
    duration.minusButton.classList.remove("input-area__button--inactive");
  }

  else if (duration.duration.value == 0) {
    checks.in = "";
    checks.out = "";
    calendar.checkIn.value = checks.in;
    calendar.checkOut.value = checks.out;
    duration.minusButton.classList.add("input-area__button--inactive");
  }

  renderCalendar(date.iterYear, date.iterMonth);
})

initCalendar();
