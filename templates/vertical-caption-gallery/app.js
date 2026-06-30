(function () {
  const guide = window.TRAVEL_GUIDE;

  if (!guide || !Array.isArray(guide.slides)) {
    throw new Error("Missing window.TRAVEL_GUIDE.slides. Check guide.config.js.");
  }

  const root = document.getElementById("slides");
  const dots = document.getElementById("dots");
  const canvas = document.getElementById("canvas");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  const slides = guide.slides;
  const assetsBase = guide.assetsBase || "./assets/";
  let current = 0;

  document.title = `${guide.meta?.title || document.title} · 竖屏录制版`;

  function asset(src) {
    if (!src) return "";
    if (/^(https?:|data:|file:|\/)/.test(src)) return src;
    return `${assetsBase}${src}`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pad(number) {
    return String(number).padStart(2, "0");
  }

  function routeOverlay(index) {
    const offset = (index % 5) * 4;
    return `
      <svg class="route-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="road road-a" d="M-8 ${28 + offset} C14 ${18 + offset}, 28 ${36 - offset}, 48 ${28 + offset} S78 ${20 + offset}, 110 ${35 - offset}" />
        <path class="road road-b" d="M12 110 C20 82, 34 ${72 - offset}, 54 ${66 + offset} S72 ${38 + offset}, 92 -8" />
        <path class="route-line" d="M8 ${82 - offset} C22 ${70 - offset}, 30 ${56 + offset}, 44 ${52 - offset} S67 ${36 + offset}, 84 ${18 + offset}" />
      </svg>
    `;
  }

  function pageMeta(slide, index) {
    return `
      <header class="page-meta" aria-label="页码">
        <span>${escapeHtml(slide.section)}</span>
        <b>${pad(index + 1)} / ${pad(slides.length)}</b>
      </header>
    `;
  }

  function notePanel(slide) {
    const title = escapeHtml(slide.caption || slide.title);
    const note = escapeHtml(slide.note || slide.text || "");
    const tag = escapeHtml(slide.tag || guide.meta?.city || "");

    return `
      <footer class="note-panel">
        <p class="note-tag">${tag}</p>
        <p class="note-title">${title}</p>
        <p class="speaker-note">${note}</p>
      </footer>
    `;
  }

  function renderSlide(slide, index) {
    const src = asset(slide.src);
    const loading = index < 3 ? "eager" : "lazy";
    const kind = slide.kind === "map" ? "map-slide" : "photo-slide";
    const style = `--bg:url('${src}'); ${slide.position ? `--pos:${slide.position};` : ""}`;
    const title = escapeHtml(slide.title);

    return `
      <section class="slide ${kind}" data-index="${index}">
        ${pageMeta(slide, index)}
        <main class="visual-sheet">
          ${routeOverlay(index)}
          <figure class="media-shell" style="${style}">
            <img src="${src}" alt="${title}" loading="${loading}" decoding="async" />
          </figure>
        </main>
        ${notePanel(slide)}
      </section>
    `;
  }

  function markOrientation(img) {
    const frame = img.closest(".media-shell");
    if (!frame || !img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    frame.classList.toggle("is-landscape", ratio > 1.24);
    frame.classList.toggle("is-portrait", ratio < 0.82);
    frame.classList.toggle("is-square", ratio >= 0.82 && ratio <= 1.24);
  }

  function prepareImages() {
    root.querySelectorAll("img").forEach((img) => {
      if (img.complete) {
        markOrientation(img);
      } else {
        img.addEventListener("load", () => markOrientation(img), { once: true });
      }
    });
  }

  function prepareNearbySlides(index) {
    document.querySelectorAll(".slide").forEach((slide) => {
      const slideIndex = Number(slide.dataset.index);
      const distance = Math.abs(slideIndex - index);
      const wrappedDistance = Math.min(distance, slides.length - distance);
      slide.classList.toggle("is-nearby", wrappedDistance <= 1);
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
    prepareImages();
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
      canvas.classList.toggle("debug");
    }
    if (/^[0-9]$/.test(event.key)) {
      const index = event.key === "0" ? 9 : Number(event.key) - 1;
      if (index < slides.length) go(index);
    }
  });

  render();
})();
