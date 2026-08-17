(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Paralaksa hero + tła ---
  var parallaxLayers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;

  function updateParallax() {
    ticking = false;
    if (reduceMotion) return;
    var y = window.scrollY || window.pageYOffset;
    parallaxLayers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute("data-parallax")) || 0.3;
      var maxShift = parseFloat(layer.getAttribute("data-parallax-max")) || 20;
      var shift = Math.max(-maxShift, Math.min(maxShift, y * speed));
      layer.style.transform = "translateY(" + shift.toFixed(1) + "px)";
    });
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  if (parallaxLayers.length && !reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
  }

  // --- Odsłanianie sekcji przy przewijaniu ---
  // rootMargin na dole rozciąga obszar wykrywania o 150px w dół, więc sekcja
  // zaczyna się pokazywać 150px wcześniej niż wynikałoby to z samego widoku.
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px 90px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- Podświetlanie aktywnej sekcji w menu bocznym ---
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".right-nav a[href^='#']"));
  var sections = navLinks
    .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = document.querySelector(".right-nav a[href='#" + entry.target.id + "']");
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  // --- Przycisk powrotu na górę ---
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        backToTop.classList.toggle("is-visible", window.scrollY > 560);
      },
      { passive: true }
    );
  }
})();
