(function () {
  const guide = window.TRAVEL_GUIDE;

  if (!guide || !Array.isArray(guide.slides)) {
    throw new Error("Missing window.TRAVEL_GUIDE.slides. Check guide.config.js.");
  }

  const root = document.getElementById("slides");
  const dots = document.getElementById("dots");
  const phone = document.getElementById("phone");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  const slides = guide.slides;
  const assetsBase = guide.assetsBase || "./assets/";
  const ui = guide.ui || {};
  const authorBadge = ui.authorBadge || guide.meta?.authorBadge || "旅";
  const statusTime = ui.statusTime || "9:41";
  let current = 0;

  document.title = guide.meta?.title || document.title;

  function asset(src) {
    if (!src) return "";
    if (/^(https?:|data:|file:|\/)/.test(src)) return src;
    return `${assetsBase}${src}`;
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function topbar(slide, index) {
    return `
      <header class="topbar">
        <div class="status-row" aria-hidden="true">
          <span class="time">${statusTime}</span>
          <span class="dynamic-island"></span>
          <span class="signals"><i></i><i></i><i></i><i></i><span class="battery"></span></span>
        </div>
        <div class="tool-row" aria-hidden="true">
          <span class="map-control close"></span>
          <span class="control-spacer"></span>
          <span class="map-control undo"></span>
          <span class="map-control pause"></span>
        </div>
      </header>
      <div class="route-index">
        <div class="pill">${slide.section}</div>
        <div class="page">${pad(index + 1)} / ${pad(slides.length)}</div>
      </div>
    `;
  }

  function footer(slide) {
    return `
      <footer class="footer">
        <p class="note">${slide.note || ""}</p>
        <div class="tag">${slide.tag || ""}</div>
      </footer>
    `;
  }

  function routeLayer(index) {
    const offset = (index % 4) * 4;
    return `
      <svg class="route-layer" viewBox="0 0 100 178" preserveAspectRatio="none" aria-hidden="true">
        <path d="M12 ${150 - offset} C28 ${130 - offset}, 18 ${104 - offset}, 42 ${94 - offset} S72 ${70 - offset}, 63 ${42 - offset} S78 22, 88 12" />
        <circle cx="${42 + (index % 5) * 8}" cy="${94 - offset}" r="1.45" />
      </svg>
    `;
  }

  function routeCard(index) {
    const progress = (index + 1) / slides.length;
    const cx = 8 + progress * 84;
    const leftMeters = 14 + (index % 17);
    const rightMeters = 28 - (index % 13);
    return `
      <div class="route-card" aria-hidden="true">
        <div class="meters"><span>${leftMeters}m</span><span>${rightMeters}m</span></div>
        <svg viewBox="0 0 100 34" preserveAspectRatio="none">
          <path class="area" d="M0 31 L0 13 C10 9 15 14 23 11 C35 7 40 22 52 18 C65 14 70 22 82 20 C91 18 95 23 100 20 L100 34 L0 34 Z" />
          <path class="line" d="M0 13 C10 9 15 14 23 11 C35 7 40 22 52 18 C65 14 70 22 82 20 C91 18 95 23 100 20" />
          <circle class="cursor" cx="${cx.toFixed(1)}" cy="18" r="2.2" />
        </svg>
      </div>
    `;
  }

  function renderSlide(slide, index) {
    const imageClass = slide.kind === "map" ? "map-img" : "photo-img";
    const slideClass = slide.kind === "map" ? "map-slide" : "photo-slide";
    const loading = index < 3 ? "eager" : "lazy";
    const src = asset(slide.src);

    return `
      <section class="slide ${slideClass}" data-index="${index}">
        ${topbar(slide, index)}
        <div class="media" data-bg="url('${src}')" style="${slide.position ? `--pos:${slide.position}` : ""}">
          ${routeLayer(index)}
          <img class="${imageClass}" src="${src}" alt="${slide.title}" loading="${loading}" decoding="async" />
          <div class="plate">
            <b>${slide.title}</b>
          </div>
        </div>
        ${routeCard(index)}
        <div class="route-jump" aria-hidden="true"></div>
        ${footer(slide)}
      </section>
    `;
  }

  function prepareNearbySlides(index) {
    document.querySelectorAll(".slide").forEach((slide) => {
      const slideIndex = Number(slide.dataset.index);
      const distance = Math.abs(slideIndex - index);
      const wrappedDistance = Math.min(distance, slides.length - distance);
      if (wrappedDistance <= 1) {
        const media = slide.querySelector(".media");
        media.style.setProperty("--bg", media.dataset.bg);
      }
    });
  }

  function startIndexFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("slide") || window.location.hash.replace("#", "");
    const pageNumber = Number(raw);
    if (!Number.isFinite(pageNumber)) return 0;
    return Math.min(Math.max(pageNumber - 1, 0), slides.length - 1);
  }

  function go(index) {
    current = (index + slides.length) % slides.length;
    document.querySelectorAll(".slide").forEach((slide) => {
      slide.classList.toggle("is-active", Number(slide.dataset.index) === current);
    });
    document.querySelectorAll(".dot").forEach((dot) => {
      dot.classList.toggle("is-active", Number(dot.dataset.index) === current);
    });
    prepareNearbySlides(current);
    history.replaceState(null, "", `#${current + 1}`);
  }

  function render() {
    root.innerHTML = slides.map(renderSlide).join("");
    dots.innerHTML = slides.map((_, index) => `<span class="dot" data-index="${index}"></span>`).join("");
    go(startIndexFromUrl());
  }

  window.go = go;
  next.addEventListener("click", (event) => {
    event.currentTarget.blur();
    go(current + 1);
  });
  prev.addEventListener("click", (event) => {
    event.currentTarget.blur();
    go(current - 1);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      go(current + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(current - 1);
    }
    if (event.key.toLowerCase() === "d" && new URLSearchParams(window.location.search).has("debug")) {
      phone.classList.toggle("debug");
    }
    if (/^[0-9]$/.test(event.key)) {
      const index = event.key === "0" ? 9 : Number(event.key) - 1;
      if (index < slides.length) go(index);
    }
  });

  render();
})();
