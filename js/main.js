/* MANTIS VEX — shared site behavior */
(function () {
  "use strict";

  // Year in footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Shrink nav padding on scroll
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.style.padding = window.scrollY > 30 ? "10px clamp(16px,4vw,48px)" : "";
    }, { passive: true });
  }
})();
