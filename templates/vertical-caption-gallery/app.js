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
    return new URL(`${assetsBase}${src}`, window.location.href).href;
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

  function cleanToken(value, fallback) {
    const token = String(value || fallback || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    return token || fallback;
  }

  function safeColor(value, fallback) {
    const color = String(value || "").trim();
    return /^#[0-9a-f]{6}$/i.test(color) || /^#[0-9a-f]{3}$/i.test(color) ? color : fallback;
  }

  function textForSticker(slide) {
    return `${slide.section || ""} ${slide.title || ""} ${slide.text || ""} ${slide.tag || ""}`;
  }

  function stickerPropFromSlide(slide) {
    const text = textForSticker(slide);
    const rules = [
      [/铁塔|傍晚|蓝色时刻/, "tower"],
      [/塞纳|水边|河边/, "river"],
      [/咖啡|早午餐|街角/, "cafe"],
      [/灯|夜色/, "lamp"],
      [/建筑|路上/, "facade"],
      [/店|小店|店面/, "shop"],
      [/字体|字/, "letters"],
      [/荣军院|穹顶/, "dome"],
      [/拿破仑|墓/, "tomb"],
      [/宣传画|近现代|历史|国家叙事/, "poster"],
      [/展厅|馆内|雕塑|审美/, "gallery"],
      [/人和展品|现场/, "people"],
      [/蒙马特|清晨|雨里/, "rain"],
      [/祷告/, "candle"],
      [/住处|沙发|窗边/, "home"],
      [/花/, "flower"],
      [/画|街头/, "spray"],
      [/面包/, "bread"],
      [/超市|货架|买菜/, "market"],
      [/自煮|做一点/, "pan"],
      [/甜点/, "dessert"],
      [/正餐|法国菜|牛排|外食/, "plate"],
      [/外带|带走/, "bag"],
      [/攀岩/, "climb"],
      [/训练|拳|boxing/, "boxing"],
      [/地铁|交通|换乘/, "metro"],
      [/收束|节奏/, "route"]
    ];

    return rules.find(([pattern]) => pattern.test(text))?.[1] || "pin";
  }

  function stickerDefaults(slide, index) {
    const positions = [
      { x: 78, y: 73, size: 18, rotate: -8 },
      { x: 22, y: 72, size: 17, rotate: 7 },
      { x: 80, y: 31, size: 16, rotate: 5 },
      { x: 20, y: 35, size: 16, rotate: -6 },
      { x: 72, y: 55, size: 18, rotate: 9 },
      { x: 28, y: 57, size: 17, rotate: -10 },
      { x: 83, y: 84, size: 15, rotate: -4 },
      { x: 17, y: 85, size: 15, rotate: 6 }
    ];
    const accents = ["#f1b447", "#df6247", "#4c9f70", "#2f7ed8", "#d54b61", "#8b73d9"];
    const moods = ["smile", "wonder", "focus", "calm", "tired", "spark"];
    const poses = ["hold", "point", "walk", "lean", "look", "wave"];
    const pick = positions[index % positions.length];

    return {
      prop: stickerPropFromSlide(slide),
      mood: moods[index % moods.length],
      pose: poses[index % poses.length],
      accent: accents[index % accents.length],
      blue: "#1f74d8",
      ...pick
    };
  }

  function faceSvg(mood) {
    switch (mood) {
      case "wonder":
        return `
          <path d="M62 58 Q66 54 70 58" />
          <path d="M91 58 Q95 54 99 58" />
          <ellipse cx="80" cy="72" rx="5" ry="6" fill="#211f1b" stroke="none" />
        `;
      case "focus":
        return `
          <path d="M62 59 L70 57" />
          <path d="M91 57 L99 59" />
          <path d="M72 73 H90" />
        `;
      case "tired":
        return `
          <path d="M62 60 Q66 62 70 60" />
          <path d="M91 60 Q95 62 99 60" />
          <path d="M72 73 Q80 70 88 73" />
        `;
      case "spark":
        return `
          <path d="M62 58 Q66 55 70 58" />
          <path d="M91 58 Q95 55 99 58" />
          <path d="M70 72 Q80 82 91 72" />
          <path d="M114 43 l3 -7 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3z" fill="#f1b447" />
        `;
      case "calm":
        return `
          <path d="M62 59 Q66 58 70 59" />
          <path d="M91 59 Q95 58 99 59" />
          <path d="M73 73 Q80 77 88 73" />
        `;
      default:
        return `
          <path d="M62 58 Q66 56 70 58" />
          <path d="M91 58 Q95 56 99 58" />
          <path d="M70 72 Q80 79 91 72" />
        `;
    }
  }

  function armsSvg(pose, blue) {
    switch (pose) {
      case "point":
        return `
          <path d="M54 101 C34 87, 24 76, 19 60" fill="none" stroke="${blue}" stroke-width="11" />
          <circle cx="18" cy="58" r="6" fill="#ffd6b3" />
          <path d="M106 102 C122 98, 130 90, 136 78" fill="none" stroke="${blue}" stroke-width="11" />
          <circle cx="137" cy="77" r="6" fill="#ffd6b3" />
        `;
      case "walk":
        return `
          <path d="M55 103 C39 109, 30 118, 24 131" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="23" cy="132" r="6" fill="#ffd6b3" />
          <path d="M106 103 C121 94, 127 83, 129 70" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="130" cy="69" r="6" fill="#ffd6b3" />
        `;
      case "lean":
        return `
          <path d="M55 101 C42 94, 35 88, 29 76" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="28" cy="75" r="6" fill="#ffd6b3" />
          <path d="M105 102 C115 113, 123 125, 132 135" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="133" cy="136" r="6" fill="#ffd6b3" />
        `;
      case "wave":
        return `
          <path d="M55 102 C42 91, 37 78, 43 64" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="43" cy="63" r="6" fill="#ffd6b3" />
          <path d="M106 103 C122 110, 130 120, 134 133" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="135" cy="134" r="6" fill="#ffd6b3" />
        `;
      case "look":
        return `
          <path d="M55 102 C42 103, 32 99, 23 90" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="22" cy="89" r="6" fill="#ffd6b3" />
          <path d="M106 102 C119 101, 129 97, 137 89" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="138" cy="88" r="6" fill="#ffd6b3" />
        `;
      default:
        return `
          <path d="M55 102 C42 105, 34 112, 29 124" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="28" cy="125" r="6" fill="#ffd6b3" />
          <path d="M106 102 C118 105, 126 112, 131 124" fill="none" stroke="${blue}" stroke-width="10" />
          <circle cx="132" cy="125" r="6" fill="#ffd6b3" />
        `;
    }
  }

  function propSvg(prop, accent) {
    const blue = "#2f7ed8";
    const green = "#68a96f";

    switch (prop) {
      case "tower":
        return `<g transform="translate(111 78) rotate(6)" fill="none" stroke="${accent}" stroke-width="5"><path d="M13 1 L2 54 H24 Z" /><path d="M8 22 H18" /><path d="M5 39 H21" /><path d="M13 1 V54" /></g>`;
      case "river":
        return `<g transform="translate(104 104)" fill="none" stroke="${blue}" stroke-width="5"><path d="M0 9 C10 0, 18 18, 30 8 S48 10, 58 2" /><path d="M5 24 C15 15, 25 31, 37 22 S52 23, 62 15" /></g>`;
      case "cafe":
        return `<g transform="translate(105 95)" stroke="#211f1b" stroke-width="4"><path d="M7 15 H39 V33 Q39 43 28 43 H18 Q7 43 7 33 Z" fill="#fff7e8" /><path d="M39 21 H48 Q56 25 48 34 H39" fill="none" /><path d="M13 6 C10 0 21 0 18 -8" fill="none" stroke="${accent}" /><path d="M28 6 C24 0 36 0 32 -8" fill="none" stroke="${accent}" /></g>`;
      case "lamp":
        return `<g transform="translate(105 63)" stroke="#211f1b" stroke-width="4"><path d="M18 76 V20" /><path d="M6 20 H30 L25 38 H11 Z" fill="${accent}" /><path d="M2 76 H34" /></g>`;
      case "facade":
        return `<g transform="translate(105 78)" stroke="#211f1b" stroke-width="4"><rect x="2" y="8" width="45" height="58" rx="6" fill="#fff7e8" /><path d="M13 20 H23 V34 H13 ZM29 20 H39 V34 H29 ZM13 43 H23 V58 H13 ZM29 43 H39 V58 H29 Z" fill="${accent}" opacity=".72" /></g>`;
      case "shop":
        return `<g transform="translate(103 84)" stroke="#211f1b" stroke-width="4"><path d="M4 18 H54 L48 34 H10 Z" fill="${accent}" /><path d="M10 34 H48 V62 H10 Z" fill="#fff7e8" /><path d="M18 62 V44 H40 V62" fill="none" /></g>`;
      case "letters":
        return `<g transform="translate(101 88)" stroke="#211f1b" stroke-width="4"><rect x="6" y="7" width="50" height="42" rx="6" fill="#fff7e8" /><path d="M16 20 H44M16 31 H37M16 42 H48" stroke="${accent}" /></g>`;
      case "dome":
        return `<g transform="translate(102 76)" stroke="#211f1b" stroke-width="4"><path d="M8 64 H56 V37 Q52 15 32 15 Q12 15 8 37 Z" fill="#fff7e8" /><path d="M18 37 Q32 7 46 37" fill="${accent}" /><path d="M32 15 V2" /></g>`;
      case "tomb":
        return `<g transform="translate(103 92)" stroke="#211f1b" stroke-width="4"><path d="M5 50 H58 L51 17 H13 Z" fill="#d4c2a6" /><path d="M17 17 Q31 2 45 17" fill="${accent}" opacity=".75" /><path d="M18 31 H45" /></g>`;
      case "poster":
        return `<g transform="translate(104 81) rotate(-5)" stroke="#211f1b" stroke-width="4"><rect x="6" y="6" width="46" height="63" rx="4" fill="#fff7e8" /><circle cx="29" cy="27" r="11" fill="${accent}" /><path d="M15 48 H44M15 58 H38" /></g>`;
      case "gallery":
        return `<g transform="translate(102 82)" stroke="#211f1b" stroke-width="4"><rect x="5" y="8" width="56" height="47" rx="5" fill="#fff7e8" /><path d="M14 44 L27 29 L36 38 L45 25 L55 44 Z" fill="${accent}" opacity=".78" /></g>`;
      case "people":
        return `<g transform="translate(101 93)" stroke="#211f1b" stroke-width="4"><circle cx="17" cy="16" r="9" fill="#ffd6b3" /><circle cx="39" cy="15" r="9" fill="#ffd6b3" /><path d="M4 49 Q17 29 30 49M27 49 Q39 29 54 49" fill="${accent}" opacity=".75" /></g>`;
      case "rain":
        return `<g transform="translate(101 83)" stroke="#211f1b" stroke-width="4"><path d="M6 35 Q30 5 58 35 Z" fill="${accent}" /><path d="M32 35 V66 Q33 75 43 66" fill="none" /><path d="M7 54 l-5 9M22 59 l-5 9M55 56 l-5 9" stroke="${blue}" /></g>`;
      case "candle":
        return `<g transform="translate(111 91)" stroke="#211f1b" stroke-width="4"><rect x="10" y="28" width="22" height="42" rx="4" fill="#fff7e8" /><path d="M21 28 C11 16, 25 12, 21 2 C34 15, 31 24, 21 28 Z" fill="${accent}" /></g>`;
      case "home":
        return `<g transform="translate(102 92)" stroke="#211f1b" stroke-width="4"><path d="M7 33 Q12 17 30 17 H44 Q57 17 59 33 V51 H7 Z" fill="${accent}" opacity=".82" /><path d="M15 51 V66 H51 V51" fill="#fff7e8" /><path d="M18 28 H49" /></g>`;
      case "flower":
        return `<g transform="translate(104 84)" stroke="#211f1b" stroke-width="3.5"><path d="M30 66 C30 43 32 29 42 13" fill="none" stroke="${green}" /><circle cx="42" cy="13" r="9" fill="${accent}" /><circle cx="32" cy="13" r="9" fill="${accent}" /><circle cx="38" cy="23" r="9" fill="${accent}" /><circle cx="48" cy="23" r="9" fill="${accent}" /><circle cx="40" cy="18" r="6" fill="#f7d46f" /></g>`;
      case "spray":
        return `<g transform="translate(107 89)" stroke="#211f1b" stroke-width="4"><rect x="10" y="22" width="25" height="44" rx="6" fill="${accent}" /><path d="M14 22 V11 H31 V22" fill="#fff7e8" /><path d="M39 18 C50 11 54 21 44 26M42 35 C57 31 61 45 47 49" fill="none" stroke="${blue}" /></g>`;
      case "bread":
        return `<g transform="translate(105 90) rotate(-18)" stroke="#211f1b" stroke-width="4"><path d="M9 52 Q2 17 28 7 Q56 0 58 31 Q58 56 31 62 Q15 65 9 52 Z" fill="#d99b45" /><path d="M22 16 q8 6 2 15M39 13 q8 6 2 15M21 39 q10 5 2 14" fill="none" stroke="#fff0cb" /></g>`;
      case "market":
        return `<g transform="translate(104 92)" stroke="#211f1b" stroke-width="4"><path d="M11 24 H53 L47 66 H17 Z" fill="#fff7e8" /><path d="M20 24 Q24 7 32 7 Q41 7 44 24" fill="none" /><circle cx="25" cy="43" r="7" fill="${accent}" /><path d="M37 38 l13 -10M40 45 l13 -10" stroke="${green}" /></g>`;
      case "pan":
        return `<g transform="translate(99 98)" stroke="#211f1b" stroke-width="4"><ellipse cx="30" cy="29" rx="25" ry="14" fill="#2b2b2b" /><path d="M53 27 L76 18" /><circle cx="27" cy="25" r="7" fill="${accent}" /><path d="M22 6 C18 0 29 0 25 -8M39 8 C35 1 46 1 42 -7" fill="none" stroke="${accent}" /></g>`;
      case "dessert":
        return `<g transform="translate(104 95)" stroke="#211f1b" stroke-width="4"><path d="M10 48 H56 L48 66 H18 Z" fill="#fff7e8" /><path d="M18 47 Q31 18 48 47 Z" fill="${accent}" /><circle cx="36" cy="31" r="5" fill="#f7d46f" /></g>`;
      case "plate":
        return `<g transform="translate(101 99)" stroke="#211f1b" stroke-width="4"><ellipse cx="34" cy="33" rx="29" ry="18" fill="#fff7e8" /><ellipse cx="34" cy="33" rx="17" ry="9" fill="${accent}" opacity=".78" /><path d="M66 17 V52M72 17 V52M66 35 H75" /><path d="M4 18 C13 26 13 43 4 52" fill="none" /></g>`;
      case "bag":
        return `<g transform="translate(105 88)" stroke="#211f1b" stroke-width="4"><path d="M9 22 H54 L49 69 H14 Z" fill="${accent}" opacity=".86" /><path d="M23 22 Q24 8 32 8 Q41 8 42 22" fill="none" /><path d="M22 40 H42" /></g>`;
      case "climb":
        return `<g transform="translate(103 82)" stroke="#211f1b" stroke-width="4"><path d="M8 71 C24 46 41 29 58 4" fill="none" stroke="${blue}" /><circle cx="17" cy="56" r="6" fill="${accent}" /><circle cx="33" cy="39" r="6" fill="${accent}" /><circle cx="49" cy="21" r="6" fill="${accent}" /><path d="M17 56 L34 39 L49 21" fill="none" /></g>`;
      case "boxing":
        return `<g transform="translate(102 93)" stroke="#211f1b" stroke-width="4"><path d="M12 22 Q17 7 34 12 Q45 16 39 35 Q35 49 19 46 Q8 42 12 22 Z" fill="${accent}" /><path d="M40 23 Q48 10 60 19 Q69 29 58 42 Q47 54 38 43" fill="${blue}" /><path d="M28 46 V62M49 45 V62" /></g>`;
      case "metro":
        return `<g transform="translate(104 91)" stroke="#211f1b" stroke-width="4"><rect x="8" y="14" width="52" height="48" rx="9" fill="${accent}" opacity=".85" /><path d="M19 29 H49M19 42 H40" stroke="#fff7e8" /><circle cx="21" cy="56" r="4" /><circle cx="48" cy="56" r="4" /></g>`;
      case "route":
        return `<g transform="translate(101 88)" stroke="#211f1b" stroke-width="4"><path d="M10 62 C23 47 17 30 32 21 S51 16 55 4" fill="none" stroke="${blue}" stroke-dasharray="6 5" /><circle cx="10" cy="62" r="8" fill="${accent}" /><circle cx="55" cy="4" r="8" fill="${accent}" /><path d="M20 12 H51M10 32 H42" stroke="#211f1b" /></g>`;
      default:
        return `<g transform="translate(111 88)" stroke="#211f1b" stroke-width="4"><path d="M22 4 C5 4 0 21 10 33 L22 50 L34 33 C44 21 39 4 22 4 Z" fill="${accent}" /><circle cx="22" cy="21" r="6" fill="#fff7e8" /></g>`;
    }
  }

  function tangStickerSvg(sticker) {
    const accent = safeColor(sticker.accent, "#f1b447");
    const blue = safeColor(sticker.blue, "#1f74d8");
    const mood = cleanToken(sticker.mood, "smile");
    const pose = cleanToken(sticker.pose, "hold");
    const prop = cleanToken(sticker.prop, "pin");

    return `
      <svg class="tang-sticker-art mood-${mood} pose-${pose}" viewBox="0 0 170 190" aria-hidden="true">
        <path class="sticker-cutout" d="M82 7 C112 6 138 25 143 54 C161 60 168 80 160 99 C174 122 157 147 132 147 C121 174 91 187 60 174 C32 184 8 163 18 136 C-1 118 2 88 25 77 C20 38 43 11 82 7 Z" />
        <g class="tang-lines" stroke="#211f1b" stroke-linecap="round" stroke-linejoin="round">
          <path d="M55 96 Q80 84 106 96 L115 150 Q80 166 45 150 Z" fill="${blue}" stroke-width="5" />
          <path d="M61 112 Q80 121 100 112" fill="none" stroke="#75b4ff" stroke-width="4" opacity=".7" />
          ${armsSvg(pose, blue)}
          ${propSvg(prop, accent)}
          <path d="M61 150 C56 163 54 172 49 181" fill="none" stroke="#211f1b" stroke-width="8" />
          <path d="M99 150 C104 164 108 172 115 181" fill="none" stroke="#211f1b" stroke-width="8" />
          <path d="M47 181 H65M101 181 H120" fill="none" stroke="#211f1b" stroke-width="7" />
          <ellipse cx="80" cy="60" rx="34" ry="38" fill="#ffd6b3" stroke-width="5" />
          <path d="M48 52 C48 27 63 17 82 18 C103 19 115 31 113 55 C100 45 89 41 74 42 C62 42 55 47 48 52 Z" fill="#1f1b18" stroke-width="5" />
          <path d="M55 44 C64 31 89 28 107 42" fill="none" stroke="#1f1b18" stroke-width="7" />
          <rect x="55" y="56" width="24" height="15" rx="5" fill="none" stroke-width="5" />
          <rect x="84" y="56" width="24" height="15" rx="5" fill="none" stroke-width="5" />
          <path d="M79 63 H84" fill="none" stroke-width="5" />
          ${faceSvg(mood)}
          <path d="M54 96 Q80 110 108 96" fill="none" stroke="#f7f1e7" stroke-width="7" />
          <path d="M49 99 L66 116" stroke="#0d4f9f" stroke-width="4" />
          <path d="M111 99 L95 116" stroke="#0d4f9f" stroke-width="4" />
        </g>
      </svg>
    `;
  }

  function stickerLayer(slide, index) {
    if (slide.kind === "map" || slide.sticker === false) return "";

    const sticker = {
      ...stickerDefaults(slide, index),
      ...(slide.sticker || {})
    };
    const x = Number.isFinite(Number(sticker.x)) ? Number(sticker.x) : 78;
    const y = Number.isFinite(Number(sticker.y)) ? Number(sticker.y) : 72;
    const size = Number.isFinite(Number(sticker.size)) ? Number(sticker.size) : 17;
    const rotate = Number.isFinite(Number(sticker.rotate)) ? Number(sticker.rotate) : -6;
    const style = `--sticker-x:${x}%; --sticker-y:${y}%; --sticker-size:${size}cqw; --sticker-rotate:${rotate}deg;`;

    if (sticker.src) {
      const label = escapeHtml(`${slide.title || "唐小蓝"}贴纸`);
      return `
        <img class="tang-sticker tang-sticker-image" src="${asset(sticker.src)}" alt="${label}" style="${style}" loading="lazy" decoding="async" />
      `;
    }

    return `
      <div class="tang-sticker" style="${style}">
        ${tangStickerSvg(sticker)}
      </div>
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
          ${stickerLayer(slide, index)}
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
