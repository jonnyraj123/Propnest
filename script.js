(function () {
  "use strict";

  var greetings = [
    "Hello, World!",
    "নমস্কার, বিশ্ব!",
    "¡Hola, Mundo!",
    "Bonjour, le Monde !",
    "こんにちは世界",
    "Hallo, Welt!",
    "Olá, Mundo!",
    "Привет, мир!"
  ];

  var greeting = document.getElementById("greeting");
  var greetBtn = document.getElementById("greet-btn");
  var clock = document.getElementById("clock");
  var toggle = document.getElementById("theme-toggle");
  var index = 0;

  greetBtn.addEventListener("click", function () {
    index = (index + 1) % greetings.length;
    greeting.textContent = greetings[index];
  });

  function tick() {
    clock.textContent = new Date().toLocaleTimeString();
  }
  tick();
  setInterval(tick, 1000);

  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (err) {
    stored = null;
  }

  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* storage unavailable — theme still applies for this visit */
    }
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    toggle.firstElementChild.textContent = theme === "dark" ? "☼" : "☾";
  }
})();
