/* MANTISVEX — shared site behavior */
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

  // Track-art hue from data attribute
  document.querySelectorAll("[data-hue]").forEach(function (el) {
    el.style.setProperty("--h", el.getAttribute("data-hue"));
  });

  // Track preview buttons — short Web Audio blip so the UI feels alive
  var audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }
  function blip(freq) {
    var ac = ctx();
    if (!ac) return;
    var o = ac.createOscillator();
    var g = ac.createGain();
    var f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 1200;
    o.type = "sawtooth";
    o.frequency.value = freq;
    o.connect(f); f.connect(g); g.connect(ac.destination);
    var t = ac.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.start(t); o.stop(t + 0.95);
  }

  document.querySelectorAll(".track-card__play").forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      blip([110, 146.83, 98][i % 3]);
      btn.classList.add("is-playing");
      var label = btn.textContent;
      btn.textContent = "▮ SIGNAL";
      setTimeout(function () {
        btn.classList.remove("is-playing");
        btn.textContent = label;
      }, 950);
    });
  });

  // VST filter bar
  var filterBtns = document.querySelectorAll(".filterbar__btn");
  var plugins = document.querySelectorAll(".plugin");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      plugins.forEach(function (p) {
        var show = f === "all" || p.getAttribute("data-cat") === f;
        p.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Shrink nav on scroll
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      nav.style.padding = window.scrollY > 30 ? "10px clamp(16px,4vw,48px)" : "";
    }, { passive: true });
  }
})();
