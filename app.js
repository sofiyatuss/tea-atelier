// ===== THE TEA ATELIER · APP =====
const KEY = "tea-atelier-v1", BKEY = "tea-atelier-backup", SCHEMA = 1;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-5);
const today = (o = 0) => { const d = new Date(Date.now() - o * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const fmtDate = s => { if (!s) return ""; const d = new Date(s + "T12:00:00"); return isNaN(d) ? s : d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }); };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const G_PER_OZ = 28.3495;

// ---------- icons ----------
const ICP = {
  leaf: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l8-8",
  book: "M3 5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H3zM21 5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H21z",
  pen: "M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3",
  jar: "M8 3h8v3H8zM7 6h10l1 3v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9zM9 13h6",
  pot: "M6 10h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM17 12l3-2v3l-3 3M6 12H4.5a2 2 0 0 0 0 4H6M9.5 7h4M11.5 5v2",
  map: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  basket: "M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7zM8 10l3-6M16 10l-3-6M9 14v3M15 14v3M12 14v3",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  back: "M15 5l-7 7 7 7", plus: "M12 5v14M5 12h14", check: "M5 12l5 5 9-10", x: "M6 6l12 12M18 6L6 18",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13", archive: "M3 5h18v4H3zM5 9v10h14V9M10 13h4",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  scroll: "M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8M6 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2zM10 9h6M10 13h6",
  play: "M7 5l12 7-12 7z", pause: "M8 5v14M16 5v14", reset: "M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5",
  thermo: "M12 3a2 2 0 0 0-2 2v9.5a4 4 0 1 0 4 0V5a2 2 0 0 0-2-2zM12 10v7",
  scale: "M12 4v16M5 20h14M6 8l-3 6h6zM18 8l-3 6h6zM6 8h12",
  drop: "M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z",
  swap: "M7 7h13l-3-3M17 17H4l3 3", sound: "M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6",
  copy: "M8 8h11v11H8zM5 16V5h11"
};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICP[n]}"/></svg>`;
const ROOMS = [
  { id: "library", n: "The Library", ic: "book", d: "An illustrated encyclopedia of teas, tea science and tea cultures." },
  { id: "journal", n: "The Journal", ic: "pen", d: "Every cup you taste, with notes, ratings and your flavour profile." },
  { id: "cabinet", n: "The Cabinet", ic: "jar", d: "Your shelves of tins, jars and pouches, with stock that updates as you brew." },
  { id: "brew", n: "The Brewing Table", ic: "pot", d: "Recipes, a real countdown timer and multiple infusions." },
  { id: "atlas", n: "The Atlas", ic: "map", d: "Tea-growing regions and tea cultures, with a passport to stamp." },
  { id: "market", n: "The Market", ic: "basket", d: "A wishlist of teas to try, ready to move onto your shelves." },
  { id: "academy", n: "The Tea Academy", ic: "cap", d: "Quizzes and mystery teas that earn ranks and atelier decorations." }
];

// ---------- state ----------
function sampleState() {
  const inv = [
    { id: "smp-c1", teaId: "sencha", teaName: "Sencha", cat: "green", brand: "Sample Tea House", producer: "Shizuoka cooperative", harvest: "2026 spring", qty: 72, initQty: 100, unit: "g", container: "tin", purchased: today(40), price: 18, currency: "EUR", bestBefore: "", location: "Cabinet, top shelf", notes: "Bright first-flush; keep airtight.", fav: true, archived: false, sample: true },
    { id: "smp-c2", teaId: "tieguanyin", teaName: "Tieguanyin", cat: "oolong", brand: "Sample Tea House", producer: "Anxi", harvest: "2026 spring", qty: 45, initQty: 50, unit: "g", container: "pouch", purchased: today(25), price: 14, currency: "EUR", bestBefore: "", location: "Cabinet", notes: "", fav: false, archived: false, sample: true },
    { id: "smp-c3", teaId: "assam", teaName: "Assam", cat: "black", brand: "Sample Tea House", producer: "", harvest: "", qty: 180, initQty: 250, unit: "g", container: "jar", purchased: today(70), price: 9, currency: "EUR", bestBefore: "", location: "Kitchen shelf", notes: "Morning tea with milk.", fav: false, archived: false, sample: true },
    { id: "smp-c4", teaId: "chamomile", teaName: "Chamomile", cat: "herbal", brand: "Sample Herb Garden", producer: "", harvest: "", qty: 12, initQty: 40, unit: "g", container: "tin", purchased: today(90), price: 6, currency: "EUR", bestBefore: "", location: "Cabinet", notes: "Running low.", fav: false, archived: false, sample: true }
  ];
  const j = [
    { id: "smp-j1", teaId: "sencha", teaName: "Sencha", cat: "green", date: today(0), time: "08:10", method: "japanese", inf: 1, temp: 75, g: 4, ml: 200, sec: 60, aroma: "Fresh grass and sea air", flavour: "Mild sweetness, marine umami", mouthfeel: "Light, clean", finish: "Slightly astringent, refreshing", tags: ["grassy", "seaweed", "honey"], r: { aroma: 4, sweet: 3, bitter: 2, astr: 3, body: 3 }, overall: 4.5, notes: "Fresh grass, mild sweetness, marine umami and a clean, slightly astringent finish.", invId: "smp-c1", deducted: 4, sample: true },
    { id: "smp-j2", teaId: "sencha", teaName: "Sencha", cat: "green", date: today(3), time: "16:30", method: "western", inf: 1, temp: 85, g: 4, ml: 250, sec: 120, aroma: "Cooked greens", flavour: "Brisk, more bitter", mouthfeel: "Drying", finish: "Short", tags: ["spinach", "grassy"], r: { aroma: 3, sweet: 2, bitter: 4, astr: 4, body: 3 }, overall: 3, notes: "Too hot and too long: noticeably more bitter. Next time 75 °C.", invId: "smp-c1", deducted: 0, sample: true },
    { id: "smp-j3", teaId: "tieguanyin", teaName: "Tieguanyin", cat: "oolong", date: today(5), time: "", method: "gongfu", inf: 3, temp: 95, g: 7, ml: 100, sec: 35, aroma: "Orchid and lilac", flavour: "Buttery, floral, sweet", mouthfeel: "Silky", finish: "Long, sweet return", tags: ["orchid", "lilac", "honey"], r: { aroma: 5, sweet: 4, bitter: 1, astr: 2, body: 4 }, overall: 5, notes: "Third infusion was the best: the florals opened right up.", invId: "smp-c2", deducted: 0, sample: true }
  ];
  const w = [
    { id: "smp-w1", teaId: "orientalbeauty", teaName: "Oriental Beauty", cat: "oolong", vendor: "A Taiwanese tea shop", url: "", price: 22, currency: "EUR", priority: 3, notes: "Want to compare with second-flush Darjeeling.", status: "wanted", sample: true },
    { id: "smp-w2", teaId: "shou", teaName: "Shou Pu-erh", cat: "dark", vendor: "", url: "", price: 0, currency: "EUR", priority: 2, notes: "A small cake to start.", status: "wanted", sample: true }
  ];
  return { inv, j, w };
}
function defaults() {
  const s = sampleState();
  return { v: SCHEMA, xp: 0, read: {}, lessons: {}, cultures: {}, quiz: {}, atlasQ: {}, stamps: {}, favs: {}, journal: s.j, cabinet: s.inv, wish: s.w,
    brew: { src: "tea:sencha", style: "western", inf: 1 }, timer: { state: "idle" }, settings: { sound: true }, created: Date.now() };
}
function migrate(o) {
  if (!o || typeof o !== "object") return null;
  const d = defaults();
  for (const k of ["xp", "read", "lessons", "cultures", "quiz", "atlasQ", "stamps", "favs", "brew", "timer", "settings"]) if (o[k] === undefined) o[k] = d[k];
  for (const k of ["journal", "cabinet", "wish"]) if (!Array.isArray(o[k])) o[k] = [];
  o.v = SCHEMA; return o;
}
let storageOK = true;
function load() { try { const r = localStorage.getItem(KEY); return r ? migrate(JSON.parse(r)) : null; } catch (e) { storageOK = false; return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); storageOK = true; } catch (e) { storageOK = false; } }
let S = load() || defaults();
const UI = { lib: { tab: "teas", q: "", cat: "all", open: null, lesson: null, culture: null }, j: { tea: "all", sort: "new", cmp: [] }, cab: { show: "all" }, at: { sel: null }, ac: { round: null }, mk: { show: "open" } };

// ---------- helpers ----------
const recName = r => (r.teaId && TEA[r.teaId] ? TEA[r.teaId].n : (r.teaName || "Unnamed tea"));
const recCat = r => (r.teaId && TEA[r.teaId] ? TEA[r.teaId].cat : (r.cat || "herbal"));
const liquor = (teaId, cat) => (TEA[teaId] && TEA[teaId].lq) || (CATS[cat] || CATS.green).lq;
const rankIdx = (xp = S.xp) => RANKS.reduce((a, r, i) => xp >= r.xp ? i : a, 0);
function toast(msg) { const t = $("#toast"); const d = document.createElement("div"); d.textContent = msg; t.appendChild(d); setTimeout(() => d.remove(), 3200); }
function addXP(n, why) {
  const before = rankIdx(); S.xp += n; save(); toast(`+${n} XP · ${why}`);
  const after = rankIdx();
  if (after > before) setTimeout(() => toast(`New rank: ${RANKS[after].n}. Something new appeared in the atelier.`), 900);
  paintBar();
}
function teaSelect(id, sel, custom = true) {
  let h = `<select id="${id}">`;
  for (const c in CATS) h += `<optgroup label="${CATS[c].n}">` + TEAS.filter(t => t.cat === c).map(t => `<option value="${t.id}"${t.id === sel ? " selected" : ""}>${esc(t.n)}</option>`).join("") + `</optgroup>`;
  if (custom) h += `<option value="__custom"${sel === "__custom" ? " selected" : ""}>Another tea (type its name)</option>`;
  return h + "</select>";
}
function catSelect(id, sel) { return `<select id="${id}">` + Object.keys(CATS).map(c => `<option value="${c}"${c === sel ? " selected" : ""}>${CATS[c].n}</option>`).join("") + "</select>"; }
function leafSVG(cat, cls = "leaf") {
  const c = CATS[cat] || CATS.green;
  if (cat === "herbal") return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><g transform="translate(24 24)">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse rx="5.5" ry="11" cy="-10" transform="rotate(${a})" fill="${c.sw}" opacity=".85"/>`).join("")}<circle r="6" fill="#d9a83a"/></g></svg>`;
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40C8 20 20 8 41 7c0 21-12 33-33 33z" fill="${c.sw}"/><path d="M8 40L32 16M17 31l-1-8M23 25l-1-8M17 31l8 1M23 25l8 1" stroke="rgba(255,255,255,.55)" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
}
function fmtTime(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
const fmtSec = s => s >= 3600 ? `${(s / 3600).toFixed(s % 3600 ? 1 : 0)} h` : s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min` : `${s} s`;
const STYLE_N = { western: "Western", gongfu: "Gongfu", japanese: "Japanese", cold: "Cold brew" };
function styles(t) {
  const b = t.b, out = [];
  if (b.w) out.push("western"); if (b.g) out.push("gongfu"); if (b.j) out.push("japanese");
  if (b.cold) out.push("cold"); return out;
}
function recipe(t, style) {
  const b = t.b;
  if (style === "gongfu" && b.g) return { t: b.t, g: b.g[0], ml: b.g[1], s: b.g[2], add: b.g[3], n: b.g[4] };
  if (style === "japanese" && b.j) return { t: b.t, g: b.j[0], ml: b.j[1], s: b.j[2], add: 0, n: t.id === "matcha" ? 1 : 3 };
  if (style === "cold") return { t: 5, g: 10, ml: 1000, s: 6 * 3600, add: 0, n: 1 };
  const w = b.w || b.j; return { t: b.t, g: w[0], ml: w[1], s: w[2], add: 30, n: 2 };
}

// ---------- modal ----------
function openModal(html, narrow = false) {
  const m = $("#modal"); m.innerHTML = `<div class="sheet${narrow ? " narrow" : ""}" role="dialog" aria-modal="true">${html}</div>`; m.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => { const f = m.querySelector("input,select,textarea,button:not(.close)"); f && f.focus({ preventScroll: true }); }, 30);
}
function closeModal() { const m = $("#modal"); m.hidden = true; m.innerHTML = ""; document.body.style.overflow = ""; }
const sheetHead = t => `<div class="sheet-h"><h2>${t}</h2><button class="iconbtn close" data-act="close" aria-label="Close">${ic("x")}</button></div>`;
function confirmBox(title, msg, okLabel, onOk, danger = true) {
  openModal(`${sheetHead(esc(title))}<p>${msg}</p><div class="row" style="margin-top:18px;justify-content:flex-end"><button class="btn" data-act="close">Cancel</button><button class="btn ${danger ? "pri" : "honey"}" id="cfOk">${esc(okLabel)}</button></div>`, true);
  $("#cfOk").onclick = () => { closeModal(); onOk(); };
}

// ---------- bar ----------
function paintBar() {
  const r = rankIdx();
  $("#xpchip").innerHTML = `<span class="seal">${r + 1}</span><b>${RANKS[r].n}</b><span class="num small muted">${S.xp} XP</span>`;
  $$(".rooms a").forEach(a => a.setAttribute("aria-current", a.dataset.r === view ? "page" : "false"));
}

// ================= HUB =================
function skyFor(h) {
  if (h < 6 || h >= 21) return { a: "#1d2742", b: "#3e4d6e", orb: "#f3ead2", moon: true, g: "Good evening. The lamps are lit and the kettle is still warm." };
  if (h < 10) return { a: "#f3cf9c", b: "#bcd6dc", orb: "#f7c66b", g: "Good morning. The light is perfect for a first cup." };
  if (h < 17) return { a: "#a9cfdc", b: "#e8efe2", orb: "#fbe3a1", g: "Good afternoon. Time to explore something new?" };
  return { a: "#e9a77c", b: "#73709a", orb: "#f2b36b", g: "Good evening. A gentle cup before the day ends?" };
}
function hubSVG() {
  const r = rankIdx(), sky = skyFor(new Date().getHours());
  const bookC = ["f-sage", "f-honey", "f-rose", "f-tea", "f-ink2", "f-sage-d", "f-wood3"];
  let books = "", seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  [190, 290, 390, 490].forEach((y, row) => {
    let x = 62;
    while (x < 232) {
      const w = 10 + Math.floor(rnd() * 10), h = 52 + Math.floor(rnd() * 30);
      if (x + w > 238) break;
      if (row === 2 && x > 170 && x < 200) { books += `<rect class="${bookC[Math.floor(rnd() * 7)]}" x="${x + 6}" y="${y - h + 4}" width="${w}" height="${h}" transform="rotate(14 ${x + 6} ${y})"/>`; x += w + 20; continue; }
      books += `<rect class="${bookC[Math.floor(rnd() * 7)]}" x="${x}" y="${y - h}" width="${w}" height="${h}" rx="1.5"/><rect class="f-paper" x="${x + 2}" y="${y - h + 8}" width="${w - 4}" height="3" opacity=".6"/>`;
      x += w + 1.5;
    }
  });
  let tins = "";
  const tinC = ["#7f9460", "#c38a34", "#be867e", "#8d4a2b", "#d6cbb0", "#5a3524", "#b9853f"];
  [230, 330, 430].forEach((y, row) => { for (let i = 0; i < 4; i++) { const x = 958 + i * 46, h = 40 + ((i + row) % 3) * 10, c = tinC[(i * 3 + row * 2) % 7];
    tins += `<rect x="${x}" y="${y - h}" width="34" height="${h}" rx="4" fill="${c}"/><rect x="${x - 2}" y="${y - h - 6}" width="38" height="8" rx="3" fill="${c}" opacity=".8"/><rect x="${x + 6}" y="${y - h + 12}" width="22" height="14" rx="2" fill="#f8efdc" opacity=".9"/>`; } });
  const deco = [];
  if (r >= 1) deco.push(`<g class="lantern"><path class="s-ink2" d="M905 0v70" stroke-width="2"/><path class="f-tea" d="M885 70h40l-6 30h-28z"/>${[-14, -7, 0, 7, 14].map((a, i) => `<path class="${i % 2 ? "f-sage" : "f-sage-d"}" d="M905 72q${a} 40 ${a * 1.5} 70q${-a * .3} -30 0 -70z" opacity=".9"/>`).join("")}</g>`);
  if (r >= 2) deco.push(`<path d="M0 26 Q300 70 600 30 T1200 30" class="s-ink2" stroke-width="1.5"/>${[80, 220, 360, 480, 760, 880, 1020, 1140].map((x, i) => `<g class="lantern" style="animation-delay:${i * .4}s"><circle class="glowp" cx="${x}" cy="${44 + (i % 3) * 6}" r="26" fill="url(#glow)"/><ellipse cx="${x}" cy="${44 + (i % 3) * 6}" rx="11" ry="14" class="${i % 2 ? "f-rose" : "f-honey"}"/><rect class="f-ink2" x="${x - 4}" y="${28 + (i % 3) * 6}" width="8" height="4"/></g>`).join("")}`);
  if (r >= 3) deco.push(`<g><path class="f-rose" d="M293 520h58l-6-46h-46z"/><rect class="f-tea" x="291" y="470" width="62" height="8" rx="2"/><g>${[[322, 420, 34], [300, 440, 24], [345, 438, 24], [322, 392, 22]].map(([x, y, s]) => `<ellipse class="f-sage-d" cx="${x}" cy="${y}" rx="${s}" ry="${s * .8}"/>`).join("")}${[[310, 410], [336, 402], [300, 446], [345, 436], [324, 380], [328, 432]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#f3d6d0"/><circle cx="${x}" cy="${y}" r="2.2" fill="#d6a531"/>`).join("")}</g></g>`);
  if (r >= 4) deco.push(`<g><ellipse cx="1045" cy="104" rx="30" ry="6" fill="#9a6b26"/><path d="M1022 104c-6-30 0-48 23-50 23 2 29 20 23 50z" fill="#c9952e"/><rect x="1038" y="40" width="14" height="12" rx="3" fill="#9a6b26"/><circle cx="1045" cy="36" r="5" fill="#c9952e"/><path d="M1064 88h16v6h-16" fill="#9a6b26"/><path d="M1030 70h30" stroke="#f3dca0" stroke-width="2"/></g>`);
  const plate = (x, y, w, t) => `<g class="plate"><rect x="${x - w / 2}" y="${y}" width="${w}" height="32" rx="16"/><text x="${x}" y="${y + 22}">${t}</text></g>`;
  return `<svg class="scene" viewBox="0 0 1200 700" role="img" aria-label="The tea atelier: a cosy room with a bookcase, a wall map, a chalkboard, a glass-fronted tea cabinet, a brewing table with a steaming teapot, a writing desk, crates of tea and a sleeping cat.">
  <defs>
    <pattern id="wp" width="64" height="64" patternUnits="userSpaceOnUse"><path class="f-wall2" d="M32 14c5 7 5 14 0 20c-5-6-5-13 0-20zM32 34v10"/><path class="f-wall2" d="M32 40c4-3 8-3 10 0c-3 3-7 3-10 0z"/><circle class="f-wall2" cx="0" cy="54" r="2.4"/><circle class="f-wall2" cx="64" cy="54" r="2.4"/></pattern>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.a}"/><stop offset="1" stop-color="${sky.b}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#ffd58a" stop-opacity=".6"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>
    <clipPath id="winclip"><path d="M525 280V140a75 75 0 0 1 150 0V280z"/></clipPath>
  </defs>
  <rect class="f-wall" width="1200" height="520"/><rect fill="url(#wp)" width="1200" height="430"/>
  <rect class="f-wall2" y="432" width="1200" height="84"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${20 + i * 150}" y="446" width="120" height="56" rx="4" class="s-line" stroke-width="2"/>`).join("")}
  <rect class="f-wood2" y="426" width="1200" height="8"/>
  <rect class="f-floor" y="516" width="1200" height="184"/>
  ${[560, 612, 668].map((y, i) => `<path class="s-floor2" stroke-width="2" d="M0 ${y}H1200"/>${[0, 1, 2, 3, 4, 5].map(k => `<path class="s-floor2" stroke-width="2" d="M${(k * 230 + i * 90) % 1200} ${y - (i ? 52 : 44)}v${i ? 52 : 44}"/>`).join("")}`).join("")}
  <rect class="f-wood2" y="510" width="1200" height="10"/>
  <!-- window -->
  <path class="f-wood" d="M508 292V140a92 92 0 0 1 184 0V292z"/>
  <path d="M525 280V140a75 75 0 0 1 150 0V280z" fill="url(#sky)"/>
  <g clip-path="url(#winclip)">
    <circle cx="${sky.moon ? 640 : 560}" cy="${sky.moon ? 118 : 130}" r="16" fill="${sky.orb}"/>${sky.moon ? `<circle cx="647" cy="113" r="14" fill="${sky.a}"/><circle cx="560" cy="110" r="1.5" fill="#fff"/><circle cx="590" cy="150" r="1.2" fill="#fff"/><circle cx="660" cy="170" r="1.2" fill="#fff"/>` : ""}
    <path class="f-sage" d="M520 225q40-30 80-10t80-12V290H520z" opacity=".75"/>
    <path class="f-sage-d" d="M520 250q50-28 100-8t60-6V290H520z"/>
    ${[234, 244, 254, 264, 274].map((y, i) => `<path d="M${525 + i * 6} ${y + 6}q75 -14 150 -2" stroke="rgba(255,255,255,.28)" stroke-width="2" fill="none"/>`).join("")}
  </g>
  <rect class="f-wood" x="598" y="66" width="5" height="216"/><rect class="f-wood" x="525" y="196" width="150" height="5"/>
  <rect class="f-wood2" x="494" y="286" width="212" height="14" rx="3"/>
  <path class="f-rose curtain" d="M498 70q-8 120 4 220h22q-14-110 6-212z" opacity=".92"/><path class="f-rose curtain" d="M702 70q8 120-4 220h-22q14-110-6-212z" opacity=".92"/>
  <rect class="f-wood2" x="486" y="62" width="228" height="10" rx="5"/>
  <g><path class="f-rose" d="M630 286h26l-3-18h-20z"/><path class="f-sage-d" d="M643 268c-10-12-14-24-8-30 6 6 8 18 8 30zM643 268c8-14 16-20 22-18-2 8-10 16-22 18z"/></g>

  <!-- LIBRARY: bookcase -->
  <g class="hot" data-go="library" tabindex="0" role="link" aria-label="Open the Library">
    <rect class="f-wood" x="40" y="96" width="220" height="424" rx="4"/><rect class="f-wood2" x="54" y="112" width="192" height="396"/>
    ${books}
    ${[190, 290, 390, 490].map(y => `<rect class="f-wood" x="54" y="${y}" width="192" height="9"/>`).join("")}
    <rect class="f-wood3" x="32" y="88" width="236" height="12" rx="3"/>
    <g><rect class="f-paper" x="196" y="60" width="12" height="28" rx="2"/><path class="flame" d="M202 44c5 7 5 12 0 15-5-3-5-8 0-15z" fill="#f2b84b"/><circle class="glowp" cx="202" cy="52" r="34" fill="url(#glow)"/></g>
    <g><path class="f-sage" d="M70 88c0-16 6-24 12-24s12 8 12 24z"/><rect class="f-honey" x="66" y="80" width="32" height="8" rx="2"/></g>
    ${plate(150, 30, 120, "Library")}
  </g>

  <!-- ATLAS: wall map -->
  <g class="hot" data-go="atlas" tabindex="0" role="link" aria-label="Open the Atlas">
    <rect class="f-wood" x="292" y="92" width="184" height="138" rx="4"/><rect class="f-paper" x="302" y="102" width="164" height="118"/>
    <path class="s-ink2" stroke-width="1.5" d="M318 136q10-12 26-8t20 12q10 4 6 14t-16 8q-12 8-22 2t-14-28zM384 128q16-8 34-2t28 18q4 12-8 18t-26-4q-18-4-24-14t-4-16zM400 180q10-6 22 0t8 16q-12 6-22 0z"/>
    <path class="s-rose" stroke-width="2" stroke-dasharray="4 5" d="M340 150q40 30 66 10t30 22"/>
    ${[[340, 150], [406, 160], [436, 184]].map(([x, y]) => `<circle class="f-honey" cx="${x}" cy="${y}" r="4"/>`).join("")}
    <g transform="translate(446 120)"><path class="f-ink2" d="M0-12l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></g>
    ${plate(384, 236, 110, "Atlas")}
  </g>

  <!-- ACADEMY: chalkboard -->
  <g class="hot" data-go="academy" tabindex="0" role="link" aria-label="Open the Tea Academy">
    <rect class="f-wood" x="722" y="86" width="176" height="140" rx="5"/><rect class="f-slate" x="732" y="96" width="156" height="120" rx="2"/>
    <text x="746" y="128" class="f-chalk" style="font-family:var(--f-display);font-style:italic;font-size:19px">Oolong = ?</text>
    <path class="s-chalk" stroke-width="2" d="M748 146h60M748 160h88M748 174h40"/>
    <path class="s-chalk" stroke-width="2" d="M846 184c0-14 10-24 26-24 0 16-10 24-26 24zM846 184l14-14"/>
    <path class="s-chalk" stroke-width="2.5" d="M844 116q4-10 12-4t-4 12v6M852 140v1"/>
    <rect class="f-wood2" x="740" y="222" width="140" height="8" rx="2"/><rect class="f-chalk" x="760" y="217" width="18" height="5" rx="2"/>
    ${plate(810, 236, 130, "Academy")}
  </g>

  <!-- CABINET -->
  <g class="hot" data-go="cabinet" tabindex="0" role="link" aria-label="Open the Cabinet">
    <path class="f-wood3" d="M932 120h236l-12-22H944z"/><rect class="f-wood" x="936" y="118" width="228" height="402" rx="3"/>
    <rect class="f-wood2" x="950" y="132" width="200" height="314"/>
    ${tins}
    ${[230, 330, 430].map(y => `<rect class="f-wood3" x="950" y="${y}" width="200" height="7"/>`).join("")}
    <rect class="f-glass" x="950" y="132" width="98" height="314"/><rect class="f-glass" x="1052" y="132" width="98" height="314"/>
    <path d="M962 150l30 60M1066 150l30 60" stroke="rgba(255,255,255,.35)" stroke-width="5"/>
    <rect class="f-wood" x="1047" y="132" width="6" height="314"/>
    <rect class="f-wood3" x="950" y="456" width="200" height="54" rx="3"/><circle class="f-honey" cx="1050" cy="483" r="5"/>
    <circle class="f-honey" cx="1038" cy="290" r="4"/><circle class="f-honey" cx="1062" cy="290" r="4"/>
    ${plate(1050, 464, 116, "Cabinet")}
  </g>

  <!-- rug -->
  <ellipse class="f-rug" cx="640" cy="640" rx="270" ry="42"/><ellipse class="s-rose" cx="640" cy="640" rx="248" ry="33" stroke-width="3" stroke-dasharray="10 8"/>

  <!-- BREWING TABLE -->
  <g class="hot" data-go="brew" tabindex="0" role="link" aria-label="Open the Brewing Table">
    <rect class="f-wood2" x="492" y="482" width="14" height="150" rx="3"/><rect class="f-wood2" x="764" y="482" width="14" height="150" rx="3"/>
    <rect class="f-wood" x="470" y="466" width="330" height="22" rx="6"/><path class="f-rose-l" d="M560 466h150v34l-12-6-12 6-12-6-12 6-12-6-12 6-12-6-12 6-12-6-12 6-12-6-12 6z"/>
    <g class="steam"><path d="M620 380q-10-14 0-28t0-28"/><path d="M636 384q-10-14 0-28t0-28"/><path d="M652 380q-10-14 0-28t0-28"/></g>
    <path class="f-sage" d="M590 466c-10-40 0-70 46-72 46 2 56 32 46 72z"/>
    <path class="f-sage-d" d="M600 430c20 6 52 6 72 0" stroke-width="0"/><path d="M598 432q38 10 76 0" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/>
    <path class="f-sage" d="M682 430q30-6 34-30l8 2q-4 34-38 44z"/><path class="s-ink2" stroke-width="7" d="M594 418q-28 0-24 22t24 16" stroke-linecap="round" style="stroke:var(--sage-d)"/>
    <ellipse class="f-sage-d" cx="636" cy="396" rx="26" ry="6"/><circle class="f-honey" cx="636" cy="388" r="6"/>
    <path class="f-paper" d="M716 452h34l-3 14h-28z"/><ellipse class="f-paper" cx="733" cy="466" rx="24" ry="4"/><ellipse cx="733" cy="452" rx="17" ry="3" fill="${CATS.oolong.lq}"/>
    <path class="f-paper" d="M520 452h34l-3 14h-28z"/><ellipse class="f-paper" cx="537" cy="466" rx="24" ry="4"/><ellipse cx="537" cy="452" rx="17" ry="3" fill="${CATS.green.lq}"/>
    <g><path class="f-ink3" d="M760 420h18l-4 12 4 12h-18l4-12z"/><path class="f-honey" d="M764 432h10l-5 8z"/></g>
    ${plate(636, 336, 170, "Brewing Table")}
  </g>

  <!-- MARKET: crates and sacks -->
  <g class="hot" data-go="market" tabindex="0" role="link" aria-label="Open the Market">
    <rect class="f-wood3" x="40" y="600" width="210" height="86" rx="4"/>${[612, 640, 668].map(y => `<path class="s-wood2" stroke-width="3" d="M40 ${y}H250"/>`).join("")}
    <path class="f-paper2" d="M54 604c-6-30 4-58 34-62 30 4 40 32 34 62z" stroke="var(--ink3)" stroke-width="1.5"/>
    <path class="f-paper2" d="M128 604c-6-36 6-70 42-74 36 4 46 38 40 74z" stroke="var(--ink3)" stroke-width="1.5"/>
    <ellipse class="f-sage-d" cx="88" cy="546" rx="26" ry="8"/><ellipse class="f-tea" cx="170" cy="534" rx="30" ry="9"/>
    <path class="s-ink2" stroke-width="2" d="M150 570h40M152 580h36"/>
    <g transform="rotate(-8 230 560)"><rect class="f-rose" x="214" y="548" width="44" height="28" rx="4"/><circle class="f-paper" cx="221" cy="562" r="3"/><path class="s-ink2" d="M200 520q10 20 14 42" stroke-width="1.5"/></g>
    ${plate(145, 694 - 40, 104, "Market")}
  </g>

  <!-- JOURNAL: writing desk -->
  <g class="hot" data-go="journal" tabindex="0" role="link" aria-label="Open the Journal">
    <rect class="f-wood2" x="866" y="600" width="12" height="90" rx="2"/><rect class="f-wood2" x="1086" y="600" width="12" height="90" rx="2"/>
    <rect class="f-wood" x="850" y="584" width="264" height="22" rx="5"/>
    <path class="f-paper" d="M900 588l80-6 80 6-6-40-74 6-74-6z"/><path class="s-line" stroke-width="2" d="M980 552v30"/>
    ${[560, 568, 576].map(y => `<path class="s-ink2" stroke-width="1" d="M914 ${y}l56 3M992 ${y + 3}l56-3" opacity=".6"/>`).join("")}
    <path class="f-rose" d="M1050 548l2 40-6-4-6 4-2-40z" opacity=".9"/>
    <rect class="f-ink" x="1072" y="566" width="20" height="18" rx="4"/><path d="M1084 566q10-40 34-56q-10 26-28 56" class="f-paper2" stroke="var(--ink3)"/>
    ${plate(982, 512, 112, "Journal")}
  </g>

  <!-- the atelier cat -->
  <g data-act="cat" style="cursor:pointer" aria-label="The atelier cat" role="button" tabindex="0">
    <path class="f-ink2 tail" d="M392 640q-40 12-46-10q-2-10 8-8q4 12 30 4z"/>
    <ellipse class="f-ink2 cat-breathe" cx="420" cy="628" rx="46" ry="22"/>
    <circle class="f-ink2" cx="458" cy="618" r="16"/><path class="f-ink2" d="M448 606l3-14 9 9zM462 604l8-12 3 14z"/>
    <path d="M452 620q4 3 8 0M462 620q4 3 8 0" stroke="var(--paper)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  ${deco.join("")}
  </svg>`;
}
function V_hub() {
  const sky = skyFor(new Date().getHours());
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  const pick = TEAS[day % TEAS.length];
  const discovered = Object.keys(S.read).filter(k => TEA[k]).length;
  return `<section class="hub">
  <div class="scene-wrap">${hubSVG()}</div>
  <div class="hub-grid">
    <div>
      <p class="greet">${sky.g}</p>
      <p class="muted" style="margin-bottom:14px">Tap anything in the atelier, or choose a room below.</p>
      <div class="room-list">${ROOMS.map(r => `<a class="room-tile" href="#${r.id}">${ic(r.ic)}<div><h3>${r.n}</h3><p>${r.d}</p></div></a>`).join("")}</div>
    </div>
    <aside class="stack">
      <div class="card">
        <p class="eyebrow">Tea of the day</p>
        <div class="row" style="margin-top:8px;flex-wrap:nowrap;align-items:flex-start">${leafSVG(pick.cat, "big")}<div style="min-width:0"><h2>${esc(pick.n)}</h2><p class="muted small">${CATS[pick.cat].n} · ${esc(pick.origin.split("—")[0])}</p></div></div>
        <p style="margin-top:8px">${esc(pick.taste.split(". ")[0])}.</p>
        <div class="row" style="margin-top:12px"><button class="btn sm pri" data-act="openTea" data-id="${pick.id}">Read the entry</button><button class="btn sm" data-act="brewTea" data-id="${pick.id}">${ic("pot")} Brew it</button></div>
      </div>
      <div class="card">
        <p class="eyebrow">Your atelier so far</p>
        <div class="tally num">
          <div><b>${discovered}<small class="muted" style="font-size:.9rem"> / ${TEAS.length}</small></b><span>teas discovered</span></div>
          <div><b>${S.journal.length}</b><span>tastings logged</span></div>
          <div><b>${S.cabinet.filter(c => !c.archived).length}</b><span>teas on the shelves</span></div>
          <div><b>${Object.keys(S.stamps).length}<small class="muted" style="font-size:.9rem"> / ${REGIONS.length}</small></b><span>passport stamps</span></div>
        </div>
        ${PWA.standalone && S.journal.length + S.cabinet.length > 0 && (!S.settings.lastBackup || Date.now() - S.settings.lastBackup > 30 * 864e5) ? `<p class="note small" style="margin-top:12px">Your data lives only on this device. <button class="btn sm" style="margin-top:6px" data-act="settings">Save a backup</button></p>` : ""}
        ${!storageOK ? `<p class="note bad small" style="margin-top:12px">This browser is blocking storage, so changes will be lost when you close the page. Use Settings → Export to keep a copy.</p>` : ""}
      </div>
      ${!PWA.standalone && !S.settings.hideInstall ? `<div class="card"><p class="eyebrow">Keep it on your home screen</p><p class="small" style="margin-top:6px">${PWA.ios ? "In Safari, tap the Share button, then <b>Add to Home Screen</b>. The atelier then opens like an app and works without internet." : "Install the atelier to open it like an app and use it without internet."}</p><div class="row" style="margin-top:10px">${PWA.prompt ? `<button class="btn sm pri" data-act="sInstall">Install</button>` : ""}<button class="btn sm ghost" data-act="hideInstall">Hide this</button></div></div>` : ""}
    </aside>
  </div></section>`;
}

// ================= LIBRARY =================
function roomHead(icn, eyebrow, title, sub, right = "") {
  return `<div class="room-head"><div class="emb">${ic(icn)}</div><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="sub">${sub}</p></div><div class="row">${right}</div></div>`;
}
function V_library() {
  const L = UI.lib;
  if (L.open && TEA[L.open]) return teaEntry(TEA[L.open]);
  if (L.lesson) return lessonView(LESSONS.find(l => l.id === L.lesson));
  if (L.culture) return cultureView(CULTURES.find(c => c.id === L.culture));
  const tabs = [["teas", "Teas"], ["science", "Tea science"], ["cultures", "Tea cultures"]];
  let body = "";
  if (L.tab === "teas") {
    body = `<div class="searchbar"><label class="search">${ic("leaf")}<input id="libq" type="text" placeholder="Search by name, origin or flavour" value="${esc(L.q)}" aria-label="Search teas"></label></div>
    <div class="chips" style="margin-bottom:16px">${[["all", "All"], ...Object.entries(CATS).map(([k, v]) => [k, v.n]), ["fav", "Favourites"], ["new", "Undiscovered"]].map(([k, n]) => `<button class="chip" data-act="libcat" data-c="${k}" aria-pressed="${L.cat === k}">${CATS[k] ? `<span class="dot" style="background:${CATS[k].sw}"></span>` : ""}${n}</button>`).join("")}</div>
    <div id="libList">${libList()}</div>`;
  } else if (L.tab === "science") {
    body = `<div class="grid g2">${LESSONS.map(l => `<button class="spec" style="--c:var(--sage)" data-act="lesson" data-id="${l.id}"><span style="color:var(--sage)">${ic("flask")}</span><div><h3>${l.n}</h3><p class="o">${esc(l.body[0].slice(0, 110))}…</p>${S.lessons[l.id] ? `<span class="tag" style="margin-top:6px">${ic("check")} Completed</span>` : `<span class="tag" style="margin-top:6px">+15 XP</span>`}</div></button>`).join("")}</div>`;
  } else {
    body = `<p class="muted" style="margin-bottom:14px;max-width:70ch">Each culture separates what is historically documented from more recent adaptations, so you know which parts are old tradition and which are modern habit.</p><div class="grid g2">${CULTURES.map(c => `<button class="spec" style="--c:var(--rose)" data-act="culture" data-id="${c.id}"><span style="color:var(--rose)">${ic("globe")}</span><div><h3>${c.n}</h3><p class="o">${esc(c.place)}</p>${S.cultures[c.id] ? `<span class="tag" style="margin-top:6px">${ic("check")} Read</span>` : `<span class="tag" style="margin-top:6px">+5 XP</span>`}</div></button>`).join("")}</div>`;
  }
  return roomHead("book", "Encyclopedia", "The Library", `${TEAS.length} teas and infusions, ${LESSONS.length} illustrated science lessons and ${CULTURES.length} tea cultures. Opening a tea for the first time adds it to your discoveries.`) +
    `<div class="tabs" role="tablist">${tabs.map(([k, n]) => `<button role="tab" aria-selected="${L.tab === k}" data-act="libtab" data-t="${k}">${n}</button>`).join("")}</div>${body}`;
}
function libList() {
  const L = UI.lib, q = L.q.trim().toLowerCase();
  const list = TEAS.filter(t => {
    if (L.cat === "fav" && !S.favs[t.id]) return false;
    if (L.cat === "new" && S.read[t.id]) return false;
    if (CATS[L.cat] && t.cat !== L.cat) return false;
    if (q && !(t.n + " " + t.alt + " " + t.origin + " " + t.taste + " " + CATS[t.cat].n).toLowerCase().includes(q)) return false;
    return true;
  });
  if (!list.length) return `<div class="empty"><h3>No teas match</h3><p>Try a different word, or clear the filters.</p></div>`;
  return `<div class="specimens">${list.map(t => `<button class="spec" style="--c:${CATS[t.cat].sw}" data-act="openTea" data-id="${t.id}">${leafSVG(t.cat)}<div style="min-width:0"><h3>${esc(t.n)}</h3><p class="alt">${esc(t.alt)}</p><p class="o">${CATS[t.cat].n} · ${esc(t.origin.split("—")[0].trim())}</p></div>${S.favs[t.id] ? `<span class="fav">${ic("heart")}</span>` : !S.read[t.id] ? `<span class="new">New</span>` : ""}</button>`).join("")}</div>`;
}
function teaEntry(t) {
  if (!S.read[t.id]) { S.read[t.id] = Date.now(); save(); setTimeout(() => addXP(5, `Discovered ${t.n}`), 50); }
  const c = CATS[t.cat];
  const sessions = S.journal.filter(j => j.teaId === t.id).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const stock = S.cabinet.filter(x => x.teaId === t.id && !x.archived);
  const wish = S.wish.filter(w => w.teaId === t.id && w.status !== "bought");
  const st = styles(t);
  const brewRows = st.map(s => { const r = recipe(t, s); return `<tr><td><b>${STYLE_N[s]}</b></td><td class="num">${s === "cold" ? "fridge" : r.t + " °C"}</td><td class="num">${r.g} g / ${r.ml} ml</td><td class="num">${fmtSec(r.s)}${s === "gongfu" ? ` +${r.add}s each` : ""}</td><td class="num">${r.n}${s === "gongfu" ? "+" : ""}</td></tr>`; }).join("");
  const cafN = { none: "None — caffeine-free", low: "Usually low", moderate: "Moderate", high: "Usually higher than most teas" }[t.caf];
  const refs = [...new Set(t.refs.flatMap(k => REFS[k] || []))];
  return `<div class="row" style="margin-bottom:14px"><button class="btn sm ghost" data-act="libback">${ic("back")} All teas</button></div>
  <header class="entry-head">${leafSVG(t.cat, "big")}<div style="min-width:0">
    <p class="eyebrow">${c.n}${t.cat === "herbal" ? " infusion" : " tea"} · ${esc(t.origin.split("—")[0].trim())}</p>
    <h1>${esc(t.n)}</h1><p class="alt">${esc(t.alt)}</p>
    <div class="row" style="margin-top:14px">
      <button class="btn sm pri" data-act="brewTea" data-id="${t.id}">${ic("pot")} Brew</button>
      <button class="btn sm" data-act="logTea" data-id="${t.id}">${ic("pen")} Log a tasting</button>
      <button class="btn sm" data-act="cabAdd" data-id="${t.id}">${ic("jar")} Add to cabinet</button>
      <button class="btn sm" data-act="wishAdd" data-id="${t.id}">${ic("basket")} Wishlist</button>
      <button class="btn sm ${S.favs[t.id] ? "on" : ""}" data-act="fav" data-id="${t.id}" aria-pressed="${!!S.favs[t.id]}">${ic("heart")} ${S.favs[t.id] ? "Favourite" : "Favourite"}</button>
    </div></div></header>
  <div class="split" style="margin-top:8px">
    <div>
      <section class="sec"><h3>${ic("globe")} Identity &amp; geography</h3><dl class="facts"><dt>Category</dt><dd>${c.n}${t.cat === "herbal" ? " (not Camellia sinensis)" : ""}</dd><dt>Plant</dt><dd>${t.cat === "herbal" ? esc(t.alt.split("·")[0]) : "Camellia sinensis" + (t.id === "assam" || t.id === "dianhong" || t.id === "sheng" || t.id === "shou" ? " var. assamica" : "")}</dd><dt>Origin</dt><dd>${esc(t.origin)}</dd><dt>Caffeine</dt><dd>${cafN}</dd></dl></section>
      <section class="sec"><h3>${ic("leaf")} Production</h3><p>${esc(t.proc)}</p></section>
      <section class="sec"><h3>${ic("drop")} Sensory profile</h3><p>${esc(t.taste)}</p></section>
      <section class="sec"><h3>${ic("pot")} Brewing</h3>
        <div class="tblwrap"><table class="t"><thead><tr><th>Style</th><th>Water</th><th>Leaf</th><th>Time</th><th>Infusions</th></tr></thead><tbody>${brewRows}</tbody></table></div>
        ${t.brewNote ? `<p style="margin-top:10px">${esc(t.brewNote)}</p>` : ""}
        <p class="why" style="margin-top:10px">${esc(c.note)}</p></section>
      <section class="sec"><h3>${ic("flask")} Chemistry</h3><p>${esc(t.chem)}</p></section>
      <section class="sec"><h3>${ic("scroll")} History</h3><p>${esc(t.hist)}</p></section>
      <section class="sec"><h3>${ic("swap")} Compared with</h3><div class="stack" style="gap:8px">${t.cmp.map(([id, txt]) => `<p><button class="btn sm" data-act="openTea" data-id="${id}">${esc(TEA[id] ? TEA[id].n : id)}</button> <span class="muted">${esc(txt)}</span></p>`).join("")}</div></section>
      <section class="sec" style="border:0"><h3>${ic("book")} References &amp; further reading</h3><ul class="small muted" style="margin:0;padding-left:18px">${refs.map(r => `<li>${esc(r)}</li>`).join("")}</ul></section>
    </div>
    <aside class="stack">
      <div class="card"><p class="eyebrow">Your records</p>
        <h3 style="margin:8px 0 6px">On your shelves</h3>
        ${stock.length ? stock.map(x => `<p class="small">${esc(x.brand || "Unbranded")}: <b class="num">${+x.qty.toFixed(1)} ${x.unit}</b></p>`).join("") : `<p class="small muted">Not in your cabinet.</p>`}
        <h3 style="margin:14px 0 6px">Tastings (${sessions.length})</h3>
        ${sessions.length ? `<div class="tblwrap"><table class="t"><thead><tr><th>Date</th><th>°C</th><th>Time</th><th>Rating</th></tr></thead><tbody>${sessions.slice(0, 8).map(s => `<tr><td>${esc(s.date)}</td><td>${s.temp ?? ""}</td><td>${s.sec ? fmtSec(s.sec) : ""}</td><td><b>${s.overall ?? "–"}</b></td></tr>`).join("")}</tbody></table></div>
          <button class="btn sm" style="margin-top:10px" data-act="journalFor" data-id="${t.id}">See all in the Journal</button>` : `<p class="small muted">No tastings yet.</p>`}
        ${wish.length ? `<h3 style="margin:14px 0 6px">Wishlist</h3><p class="small">On your wishlist (${esc(wish[0].status)}).</p>` : ""}
      </div>
    </aside>
  </div>`;
}
function lessonView(l) {
  const done = S.lessons[l.id];
  return `<div class="row" style="margin-bottom:14px"><button class="btn sm ghost" data-act="libback">${ic("back")} Tea science</button></div>
  <article class="paper" style="padding:clamp(18px,4vw,36px)"><p class="eyebrow">Tea science lesson</p><h1 style="margin:6px 0 18px">${esc(l.n)}</h1>
  <div class="lesson-body">${l.body.map(p => `<p>${esc(p)}</p>`).join("")}</div>
  <div class="check"><p class="eyebrow">Check your understanding</p><p style="font-family:var(--f-display);font-size:1.2rem;margin:6px 0 12px">${esc(l.q.q)}</p>
  <div class="opts" id="lq">${shuffleIdx(l.q.o.length, l.id).map(i => `<button class="opt" data-act="lessonAns" data-id="${l.id}" data-i="${i}" ${done ? "disabled" : ""}>${esc(l.q.o[i])}</button>`).join("")}</div>
  ${done ? `<p class="explain">${ic("check")} Completed. ${esc(l.q.x)}</p>` : ""}</div></article>`;
}
function cultureView(c) {
  if (!S.cultures[c.id]) { S.cultures[c.id] = Date.now(); save(); setTimeout(() => addXP(5, `Read about ${c.place}`), 50); }
  return `<div class="row" style="margin-bottom:14px"><button class="btn sm ghost" data-act="libback">${ic("back")} Tea cultures</button></div>
  <article class="paper" style="padding:clamp(18px,4vw,36px)"><p class="eyebrow">Tea culture · ${esc(c.place)}</p><h1 style="margin:6px 0 18px">${esc(c.n)}</h1><div class="lesson-body">${c.body.map(p => `<p>${esc(p)}</p>`).join("")}</div></article>`;
}
function shuffleIdx(n, seedStr) { let s = [...seedStr].reduce((a, ch) => a + ch.charCodeAt(0), 0); const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ================= JOURNAL =================
function V_journal() {
  const J = UI.j;
  let list = S.journal.slice();
  if (J.tea !== "all") list = list.filter(j => (j.teaId || "__c:" + j.teaName) === J.tea);
  list.sort((a, b) => J.sort === "rating" ? (b.overall || 0) - (a.overall || 0) : J.sort === "old" ? ((a.date || "") + (a.time || "")).localeCompare((b.date || "") + (b.time || "")) : ((b.date || "") + (b.time || "")).localeCompare((a.date || "") + (a.time || "")));
  const teasLogged = [...new Map(S.journal.map(j => [j.teaId || "__c:" + j.teaName, recName(j)])).entries()];
  const hasSample = S.journal.some(j => j.sample);
  return roomHead("pen", "Tasting journal", "The Journal", "Each cup is its own record, so you can brew the same tea five ways and compare without losing your first impressions.", `<button class="btn pri" data-act="jNew">${ic("plus")} New tasting</button>`) +
  `${hasSample ? `<p class="note small" style="margin-bottom:14px">Entries marked <span class="tag sample">Sample</span> are examples. You can remove them all in Settings.</p>` : ""}
  <div class="split"><div>
    <div class="row" style="margin-bottom:14px">
      <div class="field" style="min-width:180px"><label for="jf">Tea</label><select id="jf"><option value="all">All teas</option>${teasLogged.map(([k, n]) => `<option value="${esc(k)}"${J.tea === k ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></div>
      <div class="field" style="min-width:160px"><label for="js">Sort</label><select id="js"><option value="new"${J.sort === "new" ? " selected" : ""}>Newest first</option><option value="old"${J.sort === "old" ? " selected" : ""}>Oldest first</option><option value="rating"${J.sort === "rating" ? " selected" : ""}>Highest rated</option></select></div>
      ${J.cmp.length ? `<div style="align-self:end"><button class="btn honey" data-act="jCompare" ${J.cmp.length < 2 ? "disabled" : ""}>${ic("swap")} Compare (${J.cmp.length}/2)</button></div>` : ""}
    </div>
    <div class="stack">${list.length ? list.map(jCard).join("") : `<div class="empty"><h3>No tastings yet</h3><p>Brew something at the Brewing Table, or log a cup you've already had.</p><button class="btn pri" style="margin-top:12px" data-act="jNew">${ic("plus")} Log your first tasting</button></div>`}</div>
  </div>
  <aside class="stack">${jStats()}</aside></div>`;
}
function jCard(j) {
  const cat = recCat(j), lq = liquor(j.teaId, cat);
  return `<article class="paper jentry"><div class="jhead"><div style="min-width:0"><p class="eyebrow">${fmtDate(j.date)}${j.time ? " · " + esc(j.time) : ""}${j.inf ? ` · Infusion ${j.inf}` : ""}</p>
    <h3><span class="dot" style="background:${lq};width:14px;height:14px;vertical-align:-1px"></span> ${esc(recName(j))}${j.method ? ` <span class="muted" style="font-weight:400;font-size:1rem">· ${STYLE_N[j.method] || esc(j.method)}</span>` : ""}</h3>
    ${j.sample ? `<span class="tag sample">Sample</span>` : ""}</div>
    <div class="rating"><b class="num">${j.overall ?? "–"}</b><span class="muted">/ 5</span></div></div>
    <div class="params">${j.temp != null && j.temp !== "" ? `<div><span>Water</span><b>${j.temp} °C</b></div>` : ""}${j.sec ? `<div><span>Steep</span><b>${fmtSec(+j.sec)}</b></div>` : ""}${j.g ? `<div><span>Leaf</span><b>${j.g} g / ${j.ml || "?"} ml</b></div>` : ""}</div>
    ${j.notes ? `<p class="notes">${esc(j.notes)}</p>` : ""}
    ${(j.aroma || j.flavour || j.mouthfeel || j.finish) ? `<dl class="facts small">${j.aroma ? `<dt>Aroma</dt><dd>${esc(j.aroma)}</dd>` : ""}${j.flavour ? `<dt>Flavour</dt><dd>${esc(j.flavour)}</dd>` : ""}${j.mouthfeel ? `<dt>Mouthfeel</dt><dd>${esc(j.mouthfeel)}</dd>` : ""}${j.finish ? `<dt>Finish</dt><dd>${esc(j.finish)}</dd>` : ""}</dl>` : ""}
    ${j.tags && j.tags.length ? `<div class="chips">${j.tags.map(t => `<span class="tag" style="background:color-mix(in srgb,${flavColor(t)} 22%,var(--card))">${esc(t)}</span>`).join("")}</div>` : ""}
    ${j.photo ? `<img class="jphoto" src="${j.photo}" alt="Photo of this cup">` : ""}
    <div class="row" style="justify-content:space-between"><label class="cb small"><input type="checkbox" data-act="jCmp" data-id="${j.id}" ${UI.j.cmp.includes(j.id) ? "checked" : ""}> Compare</label>
    <div class="row"><button class="btn sm" data-act="jEdit" data-id="${j.id}">${ic("pen")} Edit</button><button class="btn sm ghost danger" data-act="jDel" data-id="${j.id}">${ic("trash")} Delete</button></div></div>
  </article>`;
}
function flavColor(t) { for (const g in FLAV) if (FLAV[g].includes(t)) return FLAVC[g]; return "#8c7a62"; }
function jStats() {
  const J = S.journal;
  if (!J.length) return `<div class="card"><p class="eyebrow">Your flavour profile</p><p class="muted small" style="margin-top:6px">Your profile appears here after your first tasting.</p></div>`;
  const avg = (J.reduce((a, j) => a + (+j.overall || 0), 0) / J.length).toFixed(1);
  const tagC = {}; J.forEach(j => (j.tags || []).forEach(t => tagC[t] = (tagC[t] || 0) + 1));
  const top = Object.entries(tagC).sort((a, b) => b[1] - a[1]).slice(0, 6), mx = top[0] ? top[0][1] : 1;
  const sens = ["aroma", "sweet", "bitter", "astr", "body"], sn = { aroma: "Aroma", sweet: "Sweetness", bitter: "Bitterness", astr: "Astringency", body: "Body" };
  const sAvg = sens.map(k => { const v = J.filter(j => j.r && j.r[k]); return [k, v.length ? v.reduce((a, j) => a + +j.r[k], 0) / v.length : 0]; });
  const catR = {}; J.forEach(j => { const c = recCat(j); (catR[c] = catR[c] || []).push(+j.overall || 0); });
  const favCat = Object.entries(catR).map(([c, a]) => [c, a.reduce((x, y) => x + y, 0) / a.length]).sort((a, b) => b[1] - a[1])[0];
  // group wheel
  const grp = {}; Object.keys(FLAV).forEach(g => grp[g] = 0); J.forEach(j => (j.tags || []).forEach(t => { for (const g in FLAV) if (FLAV[g].includes(t)) grp[g]++; }));
  const tot = Object.values(grp).reduce((a, b) => a + b, 0);
  let wheel = "";
  if (tot) { let a0 = -Math.PI / 2; for (const g in grp) { if (!grp[g]) continue; const a1 = a0 + grp[g] / tot * Math.PI * 2; const lg = a1 - a0 > Math.PI ? 1 : 0; const p = (a, r) => `${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)}`;
    wheel += grp[g] === tot ? `<circle cx="100" cy="100" r="90" fill="${FLAVC[g]}"/>` : `<path d="M${p(a0, 90)}A90 90 0 ${lg} 1 ${p(a1, 90)}L${p(a1, 46)}A46 46 0 ${lg} 0 ${p(a0, 46)}z" fill="${FLAVC[g]}" stroke="var(--card)" stroke-width="2"><title>${g}: ${grp[g]}</title></path>`; a0 = a1; } }
  return `<div class="card"><p class="eyebrow">Your flavour profile</p>
    <div class="tally num"><div><b>${J.length}</b><span>tastings</span></div><div><b>${avg}</b><span>average rating</span></div></div>
    ${favCat ? `<p class="small" style="margin-top:10px">You rate <b>${CATS[favCat[0]].n.toLowerCase()}</b> teas highest so far (${favCat[1].toFixed(1)} on average).</p>` : ""}
    ${tot ? `<svg class="wheel" viewBox="0 0 200 200" role="img" aria-label="Flavour families you notice most">${wheel}<circle cx="100" cy="100" r="44" fill="var(--card)"/><text x="100" y="96" text-anchor="middle" style="font-family:var(--f-display);font-size:22px;fill:var(--ink)">${tot}</text><text x="100" y="116" text-anchor="middle" style="font-size:11px;fill:var(--ink3)">descriptors</text></svg>
      <div class="chips" style="justify-content:center;margin-top:6px">${Object.keys(grp).filter(g => grp[g]).map(g => `<span class="tag"><span class="dot" style="background:${FLAVC[g]}"></span>${g}</span>`).join("")}</div>` : ""}
    <h3 style="margin:16px 0 8px">Most-noticed notes</h3>
    <div class="bars">${top.map(([t, n]) => `<div class="b"><span>${esc(t)}</span><div class="track"><div class="fill" style="width:${n / mx * 100}%;background:${flavColor(t)}"></div></div><span class="num muted">${n}</span></div>`).join("") || `<p class="small muted">Tag flavours to see them here.</p>`}</div>
    <h3 style="margin:16px 0 8px">Average sensations</h3>
    <div class="bars">${sAvg.map(([k, v]) => `<div class="b"><span>${sn[k]}</span><div class="track"><div class="fill" style="width:${v / 5 * 100}%"></div></div><span class="num muted">${v ? v.toFixed(1) : "–"}</span></div>`).join("")}</div>
  </div>`;
}
function jForm(rec, pre = {}) {
  const e = rec || Object.assign({ teaId: "sencha", date: today(), time: new Date().toTimeString().slice(0, 5), method: "western", inf: 1, temp: "", g: "", ml: "", sec: "", tags: [], r: { aroma: 3, sweet: 3, bitter: 2, astr: 2, body: 3 }, overall: 4, notes: "", aroma: "", flavour: "", mouthfeel: "", finish: "", invId: "", deducted: 0 }, pre);
  const sel = e.teaId && TEA[e.teaId] ? e.teaId : "__custom";
  const invs = S.cabinet.filter(c => !c.archived);
  const R = (k, n) => `<div class="field"><label for="r_${k}">${n}</label><div class="rng"><input type="range" id="r_${k}" min="1" max="5" step="1" value="${(e.r && e.r[k]) || 3}"><output>${(e.r && e.r[k]) || 3}</output></div></div>`;
  openModal(`${sheetHead(rec ? "Edit tasting" : "New tasting")}
  <form class="form" id="jform" autocomplete="off">
    <div class="fgrid"><div class="field" style="grid-column:1/-1"><label for="f_tea">Tea</label>${teaSelect("f_tea", sel)}</div>
      <div class="field" id="customRow" ${sel === "__custom" ? "" : "hidden"}><label for="f_cname">Tea name</label><input type="text" id="f_cname" value="${esc(sel === "__custom" ? e.teaName || "" : "")}" placeholder="e.g. Grandma's garden mint"></div>
      <div class="field" id="customCat" ${sel === "__custom" ? "" : "hidden"}><label for="f_ccat">Category</label>${catSelect("f_ccat", e.cat || "herbal")}</div></div>
    <div class="fgrid">
      <div class="field"><label for="f_date">Date</label><input type="date" id="f_date" value="${esc(e.date)}" required></div>
      <div class="field"><label for="f_time">Time (optional)</label><input type="time" id="f_time" value="${esc(e.time || "")}"></div>
      <div class="field"><label for="f_method">Method</label><select id="f_method">${Object.entries(STYLE_N).map(([k, n]) => `<option value="${k}"${e.method === k ? " selected" : ""}>${n}</option>`).join("")}</select></div>
      <div class="field"><label for="f_inf">Infusion no.</label><input type="number" id="f_inf" min="1" max="30" value="${esc(e.inf || 1)}"></div>
    </div>
    <div class="fgrid">
      <div class="field"><label for="f_temp">Water °C</label><input type="number" id="f_temp" min="0" max="100" value="${esc(e.temp)}"></div>
      <div class="field"><label for="f_g">Leaf (g)</label><input type="number" id="f_g" min="0" step="0.1" value="${esc(e.g)}"></div>
      <div class="field"><label for="f_ml">Water (ml)</label><input type="number" id="f_ml" min="0" value="${esc(e.ml)}"></div>
      <div class="field"><label for="f_sec">Steep (seconds)</label><input type="number" id="f_sec" min="0" value="${esc(e.sec)}"></div>
    </div>
    <fieldset><legend>Impressions</legend><div class="fgrid">
      <div class="field"><label for="f_aroma">Aroma</label><input type="text" id="f_aroma" value="${esc(e.aroma)}"></div>
      <div class="field"><label for="f_flav">Flavour</label><input type="text" id="f_flav" value="${esc(e.flavour)}"></div>
      <div class="field"><label for="f_mouth">Mouthfeel</label><input type="text" id="f_mouth" value="${esc(e.mouthfeel)}"></div>
      <div class="field"><label for="f_fin">Finish</label><input type="text" id="f_fin" value="${esc(e.finish)}"></div></div></fieldset>
    <fieldset><legend>Flavour wheel</legend>
      ${Object.entries(FLAV).map(([g, arr]) => `<div class="flavgrp"><h4>${g}</h4><div class="chips">${arr.map(t => `<button type="button" class="flavchip" style="--c:${FLAVC[g]}" data-act="ftag" data-t="${t}" aria-pressed="${(e.tags || []).includes(t)}">${t}</button>`).join("")}</div></div>`).join("")}
      <div class="field"><label for="f_own">Your own words (comma-separated)</label><input type="text" id="f_own" value="${esc((e.tags || []).filter(t => !Object.values(FLAV).flat().includes(t)).join(", "))}" placeholder="e.g. warm bread, petrichor"></div>
    </fieldset>
    <fieldset><legend>Ratings</legend><div class="fgrid">${R("aroma", "Aroma")}${R("sweet", "Sweetness")}${R("bitter", "Bitterness")}${R("astr", "Astringency")}${R("body", "Body")}
      <div class="field"><label for="f_over">Overall enjoyment</label><div class="rng"><input type="range" id="f_over" min="0.5" max="5" step="0.5" value="${e.overall || 4}"><output>${e.overall || 4}</output></div></div></div></fieldset>
    <div class="field"><label for="f_notes">Tasting notes</label><textarea id="f_notes" placeholder="What did you notice? What would you change next time?">${esc(e.notes)}</textarea></div>
    <div class="field"><label for="f_photo">Photo (optional, stored on this device)</label><input type="file" id="f_photo" accept="image/*">${e.photo ? `<div class="row"><img src="${e.photo}" class="jphoto" alt="" style="max-width:120px"><label class="cb small"><input type="checkbox" id="f_rmphoto"> Remove photo</label></div>` : ""}</div>
    <fieldset><legend>Cabinet</legend>
      <div class="field"><label for="f_inv">Brewed from</label><select id="f_inv"><option value="">Not linked to a tin</option>${invs.map(c => `<option value="${c.id}"${e.invId === c.id ? " selected" : ""}>${esc(recName(c))}${c.brand ? " · " + esc(c.brand) : ""} (${+(+c.qty).toFixed(1)} ${c.unit} left)</option>`).join("")}</select></div>
      ${e.deducted ? `<p class="small muted" style="margin-top:8px">${e.deducted} g was already subtracted when this tasting was saved.</p>` : `<label class="cb" style="margin-top:10px"><input type="checkbox" id="f_deduct" ${pre.suggestDeduct ? "checked" : ""}> Subtract the leaf I used from this tin</label>`}
      <p id="deductWarn" class="note bad small" hidden style="margin-top:8px"></p>
    </fieldset>
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Cancel</button><button type="submit" class="btn pri" id="jsave">${ic("check")} Save tasting</button></div>
  </form>`);
  const f = $("#jform"); let photo = e.photo || ""; let ackShort = false;
  $$("input[type=range]", f).forEach(r => r.oninput = () => r.nextElementSibling.textContent = r.value);
  $("#f_tea").onchange = ev => { const c = ev.target.value === "__custom"; $("#customRow").hidden = !c; $("#customCat").hidden = !c; };
  $("#f_photo").onchange = ev => { const file = ev.target.files[0]; if (!file) return; const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => { const sc = Math.min(1, 520 / Math.max(img.width, img.height)); const cv = document.createElement("canvas"); cv.width = img.width * sc; cv.height = img.height * sc; cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height); photo = cv.toDataURL("image/jpeg", .72); URL.revokeObjectURL(url); toast("Photo ready"); };
    img.onerror = () => toast("That image couldn't be read. Try a JPEG or PNG."); img.src = url; };
  f.onsubmit = ev => {
    ev.preventDefault();
    const tv = $("#f_tea").value, custom = tv === "__custom";
    if (custom && !$("#f_cname").value.trim()) { $("#f_cname").focus(); toast("Give your tea a name"); return; }
    const own = $("#f_own").value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const tags = [...$$(".flavchip[aria-pressed=true]", f).map(b => b.dataset.t), ...own];
    const num = id => { const v = $(id).value; return v === "" ? "" : +v; };
    const rec2 = Object.assign(rec || { id: uid(), deducted: 0 }, {
      teaId: custom ? null : tv, teaName: custom ? $("#f_cname").value.trim() : TEA[tv].n, cat: custom ? $("#f_ccat").value : TEA[tv].cat,
      date: $("#f_date").value || today(), time: $("#f_time").value, method: $("#f_method").value, inf: +$("#f_inf").value || 1,
      temp: num("#f_temp"), g: num("#f_g"), ml: num("#f_ml"), sec: num("#f_sec"),
      aroma: $("#f_aroma").value.trim(), flavour: $("#f_flav").value.trim(), mouthfeel: $("#f_mouth").value.trim(), finish: $("#f_fin").value.trim(),
      tags: [...new Set(tags)], r: { aroma: +$("#r_aroma").value, sweet: +$("#r_sweet").value, bitter: +$("#r_bitter").value, astr: +$("#r_astr").value, body: +$("#r_body").value },
      overall: +$("#f_over").value, notes: $("#f_notes").value.trim(), photo: ($("#f_rmphoto") && $("#f_rmphoto").checked) ? "" : photo, invId: $("#f_inv").value
    });
    const dChk = $("#f_deduct");
    if (dChk && dChk.checked) {
      const inv = S.cabinet.find(c => c.id === rec2.invId);
      if (!inv) { const w = $("#deductWarn"); w.hidden = false; w.textContent = "Choose which tin you brewed from first."; return; }
      if (!(rec2.g > 0)) { const w = $("#deductWarn"); w.hidden = false; w.textContent = "Enter how many grams of leaf you used."; return; }
      const use = inv.unit === "oz" ? rec2.g / G_PER_OZ : rec2.g;
      if (use > inv.qty + 1e-9 && !ackShort) { ackShort = true; const w = $("#deductWarn"); w.hidden = false; w.textContent = `This tin only has ${+(+inv.qty).toFixed(2)} ${inv.unit} left, less than the ${rec2.g} g you used. Save again to set it to 0, or untick the box.`; $("#jsave").innerHTML = ic("check") + " Save and empty the tin"; return; }
      inv.qty = Math.max(0, +(inv.qty - use).toFixed(3)); rec2.deducted = rec2.g;
      toast(`Subtracted ${rec2.g} g from ${recName(inv)}`);
      if (inv.qty === 0) setTimeout(() => toast(`${recName(inv)} is empty. You can archive it in the Cabinet.`), 800);
    }
    if (!rec) S.journal.push(rec2);
    save(); closeModal(); toast(rec ? "Tasting updated" : "Tasting saved to your journal"); if (view === "journal") render(); else if (pre.goJournal) go("journal");
  };
}

// ================= CABINET =================
function tinSVG(type, color, pct, cat) {
  const lv = clamp(pct, 0, 1);
  if (type === "jar") return `<svg viewBox="0 0 80 104"><rect x="14" y="4" width="52" height="12" rx="3" fill="#8a6a3a"/><path d="M10 20h60v74a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6z" fill="rgba(230,240,236,.55)" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/><path d="M12 ${96 - lv * 74}h56V94a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="${color}" opacity=".9"/><rect x="18" y="46" width="44" height="30" rx="3" fill="#f8efdc"/><path d="M16 26v60" stroke="rgba(255,255,255,.7)" stroke-width="3"/></svg>`;
  if (type === "pouch") return `<svg viewBox="0 0 80 104"><path d="M12 8h56l-2 10 4 76a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6l4-76z" fill="${color}"/><path d="M12 8h56v8H12z" fill="rgba(0,0,0,.18)"/><path d="M12 16q28 6 56 0" stroke="rgba(255,255,255,.35)" fill="none"/><rect x="18" y="46" width="44" height="30" rx="3" fill="#f8efdc"/><rect x="14" y="${96 - lv * 6}" width="0" height="0"/><path d="M22 90h${36 * lv}" stroke="rgba(255,255,255,.7)" stroke-width="3" stroke-linecap="round"/></svg>`;
  return `<svg viewBox="0 0 80 104"><rect x="8" y="6" width="64" height="16" rx="4" fill="${color}"/><rect x="8" y="16" width="64" height="4" fill="rgba(0,0,0,.18)"/><rect x="11" y="20" width="58" height="80" rx="4" fill="${color}"/><rect x="11" y="20" width="10" height="80" fill="rgba(255,255,255,.18)"/><rect x="18" y="46" width="44" height="30" rx="3" fill="#f8efdc"/><path d="M22 90h${36 * lv}" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function V_cabinet() {
  const active = S.cabinet.filter(c => !c.archived), arch = S.cabinet.filter(c => c.archived);
  let shown = active;
  if (UI.cab.show === "fav") shown = active.filter(c => c.fav); if (UI.cab.show === "low") shown = active.filter(c => c.initQty && c.qty / c.initQty <= .25);
  const byCat = {}; shown.forEach(c => (byCat[recCat(c)] = byCat[recCat(c)] || []).push(c));
  const shelves = Object.keys(CATS).filter(k => byCat[k]);
  const tin = c => { const cat = recCat(c), pct = c.initQty ? c.qty / c.initQty : 1; return `<button class="tin" data-act="cabOpen" data-id="${c.id}" aria-label="${esc(recName(c))}, ${+(+c.qty).toFixed(1)} ${c.unit} left">${tinSVG(c.container, CATS[cat].sw, pct, cat)}<span class="lbl">${esc(recName(c))}</span>${c.fav ? `<svg class="heart" viewBox="0 0 24 24"><path d="${ICP.heart}"/></svg>` : ""}<span class="qty">${+(+c.qty).toFixed(1)} ${c.unit}</span></button>`; };
  return roomHead("jar", "Collection", "The Cabinet", "Each tea you own sits on these shelves. Tap a tin to brew it, log a cup, edit it or archive it once it's finished.", `<button class="btn pri" data-act="cabAdd">${ic("plus")} Add a tea</button>`) +
  `<div class="chips" style="margin-bottom:16px">${[["all", "All on the shelves"], ["fav", "Favourites"], ["low", "Running low"]].map(([k, n]) => `<button class="chip" data-act="cabShow" data-s="${k}" aria-pressed="${UI.cab.show === k}">${n}</button>`).join("")}</div>
  ${shown.length ? `<div class="cabinet">${shelves.map(k => `<div class="shelf"><span class="shelf-label">${CATS[k].n}</span>${byCat[k].map(tin).join("")}</div>`).join("")}</div>` : `<div class="empty"><h3>${active.length ? "Nothing matches this filter" : "The shelves are empty"}</h3><p>${active.length ? "Try another filter." : "Add a tea you own, or move one over from your wishlist."}</p></div>`}
  <section style="margin-top:28px"><h2 style="margin-bottom:6px">Archive</h2><p class="muted small" style="margin-bottom:12px">Finished teas stay here with their tasting history.</p>
  ${arch.length ? `<div class="tblwrap"><table class="t"><thead><tr><th>Tea</th><th>Brand</th><th>Bought</th><th>Tastings</th><th></th></tr></thead><tbody>${arch.map(c => `<tr><td>${esc(recName(c))}</td><td>${esc(c.brand || "")}</td><td>${esc(c.purchased || "")}</td><td class="num">${S.journal.filter(j => j.invId === c.id).length}</td><td style="white-space:nowrap"><button class="btn sm" data-act="cabRestore" data-id="${c.id}">Restore</button> <button class="btn sm ghost danger" data-act="cabDel" data-id="${c.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>` : `<p class="small muted">Nothing archived yet.</p>`}</section>`;
}
function cabDetail(c) {
  const t = TEA[c.teaId], sess = S.journal.filter(j => j.invId === c.id);
  openModal(`${sheetHead(esc(recName(c)))}
  <div class="row" style="align-items:flex-start;flex-wrap:nowrap;gap:16px"><div style="width:80px;flex:none">${tinSVG(c.container, CATS[recCat(c)].sw, c.initQty ? c.qty / c.initQty : 1)}</div>
  <div style="min-width:0"><p class="eyebrow">${CATS[recCat(c)].n} · ${esc(c.container)}${c.sample ? " · sample" : ""}</p><p style="font-family:var(--f-display);font-size:2rem;font-weight:600" class="num">${+(+c.qty).toFixed(1)} ${c.unit} <span class="muted" style="font-size:1rem">left${c.initQty ? ` of ${c.initQty}` : ""}</span></p></div></div>
  <dl class="facts" style="margin:14px 0">${[["Brand", c.brand], ["Producer", c.producer], ["Harvest", c.harvest], ["Bought", c.purchased], ["Price", c.price ? `${c.price} ${c.currency || ""}` : ""], ["Best before", c.bestBefore], ["Stored", c.location], ["Notes", c.notes]].filter(x => x[1]).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}<dt>Tastings</dt><dd>${sess.length}</dd></dl>
  <div class="row"><button class="btn pri" data-act="brewInv" data-id="${c.id}">${ic("pot")} Brew</button><button class="btn" data-act="logInv" data-id="${c.id}">${ic("pen")} Log a cup</button>${t ? `<button class="btn" data-act="openTea" data-id="${t.id}">${ic("book")} Library entry</button>` : ""}<button class="btn" data-act="cabEdit" data-id="${c.id}">Edit</button><button class="btn" data-act="cabArchive" data-id="${c.id}">${ic("archive")} Archive</button><button class="btn ghost danger" data-act="cabDel" data-id="${c.id}">${ic("trash")} Delete</button></div>`);
}
function cabForm(rec, pre = {}, onSaved) {
  const e = rec || Object.assign({ teaId: "sencha", brand: "", producer: "", harvest: "", qty: 50, unit: "g", container: "tin", purchased: today(), price: "", currency: "EUR", bestBefore: "", location: "", notes: "", fav: false }, pre);
  const sel = e.teaId && TEA[e.teaId] ? e.teaId : "__custom";
  openModal(`${sheetHead(rec ? "Edit tea" : "Add a tea to the cabinet")}<form class="form" id="cform" autocomplete="off">
    <div class="fgrid"><div class="field" style="grid-column:1/-1"><label for="c_tea">Tea</label>${teaSelect("c_tea", sel)}</div>
    <div class="field" id="ccRow" ${sel === "__custom" ? "" : "hidden"}><label for="c_name">Tea name</label><input type="text" id="c_name" value="${esc(sel === "__custom" ? e.teaName || "" : "")}"></div>
    <div class="field" id="ccCat" ${sel === "__custom" ? "" : "hidden"}><label for="c_cat">Category</label>${catSelect("c_cat", e.cat || "green")}</div></div>
    <div class="fgrid"><div class="field"><label for="c_brand">Brand or shop</label><input type="text" id="c_brand" value="${esc(e.brand)}"></div><div class="field"><label for="c_prod">Producer / garden</label><input type="text" id="c_prod" value="${esc(e.producer)}"></div><div class="field"><label for="c_harv">Harvest</label><input type="text" id="c_harv" value="${esc(e.harvest)}" placeholder="e.g. Spring 2026"></div></div>
    <div class="fgrid"><div class="field"><label for="c_qty">Quantity</label><input type="number" id="c_qty" min="0" step="0.1" value="${esc(e.qty)}" required></div><div class="field"><label for="c_unit">Unit</label><select id="c_unit"><option value="g"${e.unit === "g" ? " selected" : ""}>grams</option><option value="oz"${e.unit === "oz" ? " selected" : ""}>ounces</option></select></div><div class="field"><label for="c_cont">Container</label><select id="c_cont">${["tin", "jar", "pouch"].map(k => `<option${e.container === k ? " selected" : ""}>${k}</option>`).join("")}</select></div></div>
    <div class="fgrid"><div class="field"><label for="c_date">Purchase date</label><input type="date" id="c_date" value="${esc(e.purchased)}"></div><div class="field"><label for="c_price">Price paid</label><input type="number" id="c_price" min="0" step="0.01" value="${esc(e.price)}"></div><div class="field"><label for="c_cur">Currency</label><input type="text" id="c_cur" value="${esc(e.currency)}" maxlength="4"></div><div class="field"><label for="c_bb">Best before</label><input type="date" id="c_bb" value="${esc(e.bestBefore)}"></div></div>
    <div class="field"><label for="c_loc">Storage location</label><input type="text" id="c_loc" value="${esc(e.location)}" placeholder="e.g. Cabinet, top shelf"></div>
    <div class="field"><label for="c_notes">Notes</label><textarea id="c_notes">${esc(e.notes)}</textarea></div>
    <label class="cb"><input type="checkbox" id="c_fav" ${e.fav ? "checked" : ""}> Mark as a favourite</label>
    ${rec ? `<p class="small muted">Changing the quantity here also resets the fill level of the tin.</p>` : ""}
    <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn pri" type="submit">${ic("check")} Save</button></div></form>`);
  $("#c_tea").onchange = ev => { const c = ev.target.value === "__custom"; $("#ccRow").hidden = !c; $("#ccCat").hidden = !c; };
  $("#cform").onsubmit = ev => {
    ev.preventDefault(); const tv = $("#c_tea").value, custom = tv === "__custom";
    if (custom && !$("#c_name").value.trim()) { toast("Give your tea a name"); return; }
    const q = Math.max(0, +$("#c_qty").value || 0);
    const r2 = Object.assign(rec || { id: uid(), archived: false }, { teaId: custom ? null : tv, teaName: custom ? $("#c_name").value.trim() : TEA[tv].n, cat: custom ? $("#c_cat").value : TEA[tv].cat,
      brand: $("#c_brand").value.trim(), producer: $("#c_prod").value.trim(), harvest: $("#c_harv").value.trim(), unit: $("#c_unit").value, container: $("#c_cont").value,
      purchased: $("#c_date").value, price: $("#c_price").value === "" ? "" : +$("#c_price").value, currency: $("#c_cur").value.trim().toUpperCase(), bestBefore: $("#c_bb").value, location: $("#c_loc").value.trim(), notes: $("#c_notes").value.trim(), fav: $("#c_fav").checked });
    if (!rec || rec.qty !== q) { r2.initQty = q; } r2.qty = q;
    if (!rec) S.cabinet.push(r2);
    save(); closeModal(); toast(rec ? "Tea updated" : `${recName(r2)} is on the shelf`); onSaved && onSaved(r2); render();
  };
}

// ================= BREWING =================
function brewSource() {
  const src = S.brew.src || "tea:sencha";
  if (src.startsWith("inv:")) { const c = S.cabinet.find(x => x.id === src.slice(4)); if (c) return { inv: c, tea: TEA[c.teaId] || null, name: recName(c), cat: recCat(c) }; }
  const t = TEA[src.slice(4)] || TEA.sencha; return { inv: null, tea: t, name: t.n, cat: t.cat };
}
function genericTea(cat) { const t = TEAS.find(x => x.cat === cat) || TEA.sencha; return t; }
function ensureBrewParams(reset) {
  const B = S.brew, src = brewSource(), t = src.tea || genericTea(src.cat);
  const st = styles(t); if (!st.includes(B.style)) B.style = st[0];
  if (reset || B.t == null) { const r = recipe(t, B.style); Object.assign(B, { t: r.t, g: r.g, ml: r.ml, s: r.s, add: r.add, n: r.n, inf: 1 }); }
  return { src, t, st };
}
function curSecs() { const B = S.brew; return B.style === "gongfu" ? B.s + (B.add || 0) * (B.inf - 1) : B.style === "western" && B.inf > 1 ? B.s + (B.add || 0) : B.s; }
function potSVG(cat, teaId) {
  const lq = liquor(teaId, cat);
  return `<svg class="pot" viewBox="0 0 400 340" role="img" aria-label="Glass teapot showing the infusion">
   <defs><clipPath id="potclip"><ellipse cx="190" cy="215" rx="112" ry="100"/></clipPath><linearGradient id="potshine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
   <g id="pSteam" class="steam" opacity="0"><path d="M170 92q-10-14 0-28t0-28"/><path d="M190 96q-10-14 0-28t0-28"/><path d="M210 92q-10-14 0-28t0-28"/></g>
   <path d="M296 200q46-6 60-56l14 6q-10 66-70 82z" class="f-glass" stroke="var(--ink3)" stroke-width="2"/>
   <path d="M86 170q-46 0-42 46t48 34" stroke="var(--ink3)" stroke-width="12" fill="none" stroke-linecap="round"/>
   <g clip-path="url(#potclip)">
     <rect id="pWater" x="70" y="315" width="240" height="210" fill="#e9eef0" opacity=".7"/>
     <rect id="pLiq" x="70" y="315" width="240" height="210" fill="${lq}" opacity="0"/>
     <g id="pLeaves">${[[150, 298], [180, 304], [214, 300], [240, 296], [166, 292], [198, 294]].map(([x, y], i) => `<ellipse class="swirl" style="animation-delay:${i * .3}s;animation-play-state:paused" cx="${x}" cy="${y}" rx="11" ry="5" fill="${CATS[cat].sw}" transform="rotate(${i * 30} ${x} ${y})"/>`).join("")}</g>
   </g>
   <ellipse cx="190" cy="215" rx="112" ry="100" class="f-glass" stroke="var(--ink3)" stroke-width="2.5" fill-opacity=".35"/>
   <ellipse cx="190" cy="215" rx="112" ry="100" fill="url(#potshine)"/>
   <path d="M136 122q54-18 108 0v-8q-54-16-108 0z" class="f-wood3"/><ellipse cx="190" cy="112" rx="40" ry="9" class="f-wood"/><circle cx="190" cy="98" r="9" class="f-wood2"/>
   <ellipse cx="190" cy="322" rx="90" ry="8" fill="var(--ink)" opacity=".12"/>
  </svg>`;
}
function V_brew() {
  const { src, t, st } = ensureBrewParams(false); const B = S.brew, T = S.timer;
  const invs = S.cabinet.filter(c => !c.archived);
  const cold = B.style === "cold";
  const rng = (id, label, min, max, step, val, unit) => `<div class="field"><label for="${id}">${label}</label><div class="rng"><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"><output class="num" data-u="${unit}">${val}${unit}</output></div></div>`;
  return roomHead("pot", "Brewing companion", "The Brewing Table", "Pick a tea, adjust the parameters and start a real timer. It keeps accurate time even if you switch rooms or put your phone down.") +
  `<div class="brew"><div class="stack">
    <div class="field"><label for="b_src">Tea</label><select id="b_src">${invs.length ? `<optgroup label="From your cabinet">${invs.map(c => `<option value="inv:${c.id}"${B.src === "inv:" + c.id ? " selected" : ""}>${esc(recName(c))}${c.brand ? " · " + esc(c.brand) : ""} (${+(+c.qty).toFixed(1)} ${c.unit})</option>`).join("")}</optgroup>` : ""}${Object.keys(CATS).map(k => `<optgroup label="Library · ${CATS[k].n}">${TEAS.filter(x => x.cat === k).map(x => `<option value="tea:${x.id}"${B.src === "tea:" + x.id ? " selected" : ""}>${esc(x.n)}</option>`).join("")}</optgroup>`).join("")}</select></div>
    ${!src.tea ? `<p class="note small">This is a custom tea, so the starting recipe uses typical ${CATS[src.cat].n.toLowerCase()} tea settings.</p>` : ""}
    <div class="field"><span>Brewing style</span><div class="seg" role="group" aria-label="Brewing style">${Object.entries(STYLE_N).map(([k, n]) => `<button data-act="bStyle" data-s="${k}" aria-pressed="${B.style === k}" ${st.includes(k) ? "" : "disabled"}>${n}</button>`).join("")}</div></div>
    ${cold ? `<div class="field"><span>Water</span><p class="small">Cold water, steeped in the fridge</p></div>` : rng("b_t", "Water temperature", 40, 100, 1, B.t, " °C")}
    <div class="fgrid">${rng("b_g", "Leaf", 0.5, 15, 0.5, B.g, " g")}${rng("b_ml", "Water", 40, 1000, 10, B.ml, " ml")}</div>
    ${cold ? rng("b_h", "Steep time", 2, 12, 1, Math.round(B.s / 3600), " h") : rng("b_s", B.style === "gongfu" ? "First infusion" : "Steep time", 5, 600, 5, B.s, " s")}
    ${B.style === "gongfu" ? rng("b_add", "Add per infusion", 0, 60, 5, B.add || 0, " s") : ""}
    <div class="row" style="justify-content:space-between"><div class="infu"><span class="small muted">Infusion</span><button class="iconbtn" data-act="bInf" data-d="-1" aria-label="Previous infusion">−</button><b class="num" id="bInf">${B.inf}</b><button class="iconbtn" data-act="bInf" data-d="1" aria-label="Next infusion">${ic("plus")}</button></div>
      <button class="btn sm ghost" data-act="bReset">${ic("reset")} Recommended recipe</button></div>
    <p class="small muted">Ratio: <b class="num">${(B.g / B.ml * 100).toFixed(1)} g per 100 ml</b>. This infusion: <b class="num">${fmtSec(curSecs())}</b>.</p>
    ${t.brewNote && src.tea ? `<p class="small">${esc(t.brewNote)}</p>` : ""}
    <p class="why">${esc(CATS[src.cat].note)}</p>
  </div>
  <div class="pot-stage">
    ${potSVG(src.cat, src.tea ? src.tea.id : null)}
    <div class="digits" id="tDigits" aria-live="off">${fmtTime(T.state === "idle" ? curSecs() * 1000 : timerLeft())}</div>
    <div class="tstate" id="tState">${{ idle: "Ready", run: "Steeping", pause: "Paused", done: "Ready to pour" }[T.state]}</div>
    <div class="row" style="justify-content:center;margin-top:14px" id="tCtl">${timerButtons()}</div>
    <div class="row" style="justify-content:center;margin-top:12px"><label class="cb small"><input type="checkbox" id="b_snd" ${S.settings.sound ? "checked" : ""}> Chime when done</label></div>
    <p class="small muted" style="margin-top:10px">The pot is an illustration of colour, not a simulation of extraction. On iPhone and iPad, sounds only play while the page is open.</p>
  </div></div>`;
}
function timerButtons() {
  const T = S.timer;
  if (T.state === "run") return `<button class="btn pri" data-act="tPause">${ic("pause")} Pause</button><button class="btn" data-act="tReset">${ic("reset")} Reset</button>`;
  if (T.state === "pause") return `<button class="btn pri" data-act="tResume">${ic("play")} Resume</button><button class="btn" data-act="tReset">${ic("reset")} Reset</button>`;
  if (T.state === "done") return `<button class="btn honey" data-act="tLog">${ic("pen")} Log this cup</button><button class="btn" data-act="tNext">${ic("play")} Next infusion</button><button class="btn ghost" data-act="tReset">${ic("reset")}</button>`;
  return `<button class="btn pri" data-act="tStart">${ic("play")} Start steeping</button>`;
}
function timerLeft() { const T = S.timer; return T.state === "run" ? Math.max(0, T.end - Date.now()) : T.state === "pause" ? T.left : T.state === "done" ? 0 : (T.total || 0); }
let audioCtx = null, wakeLock = null;
function chime() { if (!S.settings.sound) return; try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); const t0 = audioCtx.currentTime; [659.3, 830.6, 987.8].forEach((f, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t0 + i * .22); g.gain.linearRampToValueAtTime(.18, t0 + i * .22 + .02); g.gain.exponentialRampToValueAtTime(.001, t0 + i * .22 + 1.4); o.connect(g).connect(audioCtx.destination); o.start(t0 + i * .22); o.stop(t0 + i * .22 + 1.5); }); } catch (e) { } }
function startTimer() {
  const ms = curSecs() * 1000, src = brewSource();
  S.timer = { state: "run", end: Date.now() + ms, total: ms, left: ms, label: src.name, cat: src.cat, teaId: src.tea ? src.tea.id : null };
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume && audioCtx.resume(); } catch (e) { }
  try { navigator.wakeLock && navigator.wakeLock.request("screen").then(l => wakeLock = l).catch(() => { }); } catch (e) { }
  save(); paintTimer(true);
}
function stopWake() { try { wakeLock && wakeLock.release(); } catch (e) { } wakeLock = null; }
function paintTimer(btns) {
  const T = S.timer, left = timerLeft();
  const d = $("#tDigits"); if (d) d.textContent = fmtTime(T.state === "idle" ? curSecs() * 1000 : left);
  const st = $("#tState"); if (st) st.textContent = { idle: "Ready", run: "Steeping", pause: "Paused", done: "Ready to pour" }[T.state];
  if (btns && $("#tCtl")) $("#tCtl").innerHTML = timerButtons();
  const p = T.state === "idle" ? 0 : T.total ? 1 - left / T.total : 1;
  const lvl = T.state === "idle" ? 0 : Math.min(1, p / .06 + .0001);
  const top = 315 - lvl * 185;
  const w = $("#pWater"), l = $("#pLiq");
  if (w) { w.setAttribute("y", top); l.setAttribute("y", top); l.setAttribute("opacity", (Math.min(1, p * 1.1)).toFixed(3)); }
  const s = $("#pSteam"); if (s) s.setAttribute("opacity", T.state === "run" && T.cat !== undefined && S.brew.style !== "cold" ? 1 : 0);
  $$("#pLeaves ellipse").forEach(e => e.style.animationPlayState = T.state === "run" ? "running" : "paused");
  const mt = $("#miniTimer");
  if (T.state === "run" || T.state === "pause" || T.state === "done") { mt.hidden = view === "brew"; mt.innerHTML = `${ic("clock")} <span class="num">${T.state === "done" ? "Ready" : fmtTime(left)}</span>`; } else mt.hidden = true;
}
function tick() {
  const T = S.timer;
  if (T.state === "run" && Date.now() >= T.end) { T.state = "done"; T.left = 0; save(); stopWake(); chime(); toast(`${T.label || "Your tea"} is ready to pour`); try { navigator.vibrate && navigator.vibrate([120, 80, 120]); } catch (e) { } paintTimer(true); return; }
  if (T.state !== "idle") paintTimer(false);
}

// ================= ATLAS =================
const MW = 1000, MH = 426, proj = (lon, lat) => [((lon + 75) / 230 * MW).toFixed(1), ((58 - lat) / 98 * MH).toFixed(1)];
const poly = a => { let d = ""; for (let i = 0; i < a.length; i += 2) { const [x, y] = proj(a[i], a[i + 1]); d += (i ? "L" : "M") + x + " " + y; } return d + "Z"; };
function mapSVG() {
  let grat = "";
  for (let lon = -60; lon <= 150; lon += 30) { const [x] = proj(lon, 0); grat += `<path class="grat" d="M${x} 0V${MH}"/>`; }
  for (let lat = -30; lat <= 50; lat += 20) { const [, y] = proj(0, lat); grat += `<path class="grat" d="M0 ${y}H${MW}"/>`; }
  const [, eq] = proj(0, 0); const [, cn] = proj(0, 23.44); const [, cs] = proj(0, -23.44);
  return `<svg class="map" viewBox="0 0 ${MW} ${MH}" role="img" aria-label="Map of tea regions and tea cultures">
   <defs><filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="2.5"/></filter></defs>
   ${grat}<path d="M0 ${eq}H${MW}" class="grat" style="opacity:.6"/><path d="M0 ${cn}H${MW}M0 ${cs}H${MW}" class="grat" style="stroke-dasharray:1 6"/>
   <text x="8" y="${+cn - 4}" style="font-size:10px;fill:var(--ink3);font-style:italic">Tropic of Cancer</text><text x="8" y="${+eq - 4}" style="font-size:10px;fill:var(--ink3);font-style:italic">Equator</text>
   <g filter="url(#ink)">${LAND.map(a => `<path class="landp" d="${poly(a)}"/>`).join("")}${WATER.map(a => `<path class="waterp" d="${poly(a)}"/>`).join("")}</g>
   <g transform="translate(940 370)"><circle r="30" fill="none" class="s-ink2" stroke-width="1"/><path d="M0-34L6 0 0 34-6 0z" class="f-honey"/><path d="M-34 0L0 6 34 0 0-6z" class="f-ink3"/><text y="-38" text-anchor="middle" style="font-family:var(--f-display);font-size:12px;fill:var(--ink)">N</text></g>
   ${REGIONS.map(r => { const [x, y] = proj(r.lon, r.lat); const got = S.stamps[r.id]; return `<g class="mk${UI.at.sel === r.id ? " sel" : ""}" data-act="region" data-id="${r.id}" tabindex="0" role="button" aria-label="${esc(r.n)}, ${KINDS[r.kind]}"><circle class="o k-${r.kind}" cx="${x}" cy="${y}" r="7"/>${got ? `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--card)"/>` : ""}<text x="${+x + r.dx}" y="${+y + r.dy}">${esc(r.n)}</text></g>`; }).join("")}
  </svg>`;
}
function stampSVG(r, got) {
  const c = got ? { grow: "var(--sage-d)", culture: "var(--rose)", both: "var(--honey)", herbal: "var(--tea)" }[r.kind] : "var(--line)";
  const name = r.n.length > 12 ? r.n.split(" ")[0] : r.n;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="${got ? "0" : "4 4"}"/><circle cx="50" cy="50" r="36" fill="none" stroke="${c}" stroke-width="1.5"/>
  ${got ? `<path d="M34 60c0-14 8-24 30-26 0 18-10 26-30 26zM34 60l18-16" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="50" y="80" text-anchor="middle" style="font-family:var(--f-display);font-size:11px;font-weight:700;letter-spacing:.06em;fill:${c}">${esc(name.toUpperCase())}</text>` : `<text x="50" y="55" text-anchor="middle" style="font-size:22px;fill:var(--ink3)">?</text>`}</svg>`;
}
function V_atlas() {
  const sel = REGIONS.find(r => r.id === UI.at.sel);
  return roomHead("map", "Geography & culture", "The Atlas", "Where tea grows, and where it is loved. Complete a region's two questions to earn its passport stamp.") +
  `<div class="legend">${Object.entries(KINDS).map(([k, n]) => `<span><svg width="14" height="14"><circle cx="7" cy="7" r="6" class="k-${k}" stroke="var(--ink)" stroke-width="1"/></svg>${n}</span>`).join("")}</div>
  <div class="mapbox">${mapSVG()}</div>
  <div class="regbtns">${REGIONS.map(r => `<button class="chip" data-act="region" data-id="${r.id}" aria-pressed="${UI.at.sel === r.id}"><span class="dot" style="background:var(--${{ grow: "sage", culture: "rose", both: "honey", herbal: "tea" }[r.kind]})"></span>${esc(r.n)}${S.stamps[r.id] ? " " + ic("check") : ""}</button>`).join("")}</div>
  <div id="regionPanel" style="margin-top:18px">${sel ? regionPanel(sel) : `<div class="empty"><h3>Choose a destination</h3><p>Tap a marker on the map or a name above. The map scrolls sideways on small screens.</p></div>`}</div>
  <section style="margin-top:28px"><h2 style="margin-bottom:10px">Tea passport · ${Object.keys(S.stamps).length} of ${REGIONS.length}</h2>
  <div class="passport">${REGIONS.map(r => `<div class="stamp ${S.stamps[r.id] ? "got" : ""}">${stampSVG(r, S.stamps[r.id])}<span>${esc(r.n)}</span></div>`).join("")}</div></section>`;
}
function regionPanel(r) {
  const cul = r.culture && CULTURES.find(c => c.id === r.culture);
  return `<article class="paper" style="padding:clamp(16px,3vw,28px)"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><p class="eyebrow">${KINDS[r.kind]}</p><h2 style="font-size:1.9rem">${esc(r.n)}</h2></div>${S.stamps[r.id] ? `<div style="width:76px">${stampSVG(r, true)}</div>` : ""}</div>
   <p style="margin-top:10px;max-width:70ch">${esc(r.blurb)}</p>
   <p style="margin-top:10px"><b>How tea is drunk:</b> ${esc(r.practice)}</p>
   <h3 style="margin:16px 0 8px">Teas from the Library</h3><div class="chips">${r.teas.map(id => `<button class="chip" data-act="openTea" data-id="${id}"><span class="dot" style="background:${CATS[TEA[id].cat].sw}"></span>${esc(TEA[id].n)}</button>`).join("")}${cul ? `<button class="chip" data-act="culture" data-id="${cul.id}">${ic("globe")} ${esc(cul.n.split(" — ")[0])}</button>` : ""}</div>
   <h3 style="margin:18px 0 8px">Passport challenge</h3>
   <div class="stack">${r.q.map((q, i) => { const k = r.id + i, done = S.atlasQ[k]; const ord = shuffleIdx(q.o.length, k);
     return `<div class="check" style="margin:0"><p style="font-weight:600;margin-bottom:8px">${esc(q.q)}</p><div class="opts">${ord.map(oi => `<button class="opt${done && oi === q.a ? " right" : ""}" data-act="atAns" data-r="${r.id}" data-q="${i}" data-o="${oi}" ${done ? "disabled" : ""}>${esc(q.o[oi])}</button>`).join("")}</div>${done ? `<p class="small" style="margin-top:8px">${ic("check")} ${esc(q.x)}</p>` : ""}</div>`; }).join("")}</div>
  </article>`;
}

// ================= MARKET =================
function V_market() {
  const all = S.wish.slice().sort((a, b) => (a.status === "bought") - (b.status === "bought") || b.priority - a.priority);
  const list = UI.mk.show === "open" ? all.filter(w => w.status !== "bought") : all;
  const st = { wanted: "Want to try", ordered: "Ordered", bought: "In the cabinet" };
  return roomHead("basket", "Wishlist", "The Market", "Teas you'd like to try, with your own notes on where to find them. Prices are what you write down; the Atelier never looks up live prices or stock.", `<button class="btn pri" data-act="wishAdd">${ic("plus")} Add a wish</button>`) +
  `<div class="chips" style="margin-bottom:16px"><button class="chip" data-act="mkShow" data-s="open" aria-pressed="${UI.mk.show === "open"}">Still to buy</button><button class="chip" data-act="mkShow" data-s="all" aria-pressed="${UI.mk.show === "all"}">Everything</button></div>
  ${list.length ? `<div class="grid g3">${list.map(w => `<article class="slip"><div class="row" style="justify-content:space-between"><span class="eyebrow">${CATS[recCat(w)].n}</span><span class="prio" title="Priority ${w.priority} of 3">${[1, 2, 3].map(i => `<i class="${i <= w.priority ? "on" : ""}"></i>`).join("")}</span></div>
    <h3>${esc(recName(w))}</h3>
    ${w.vendor ? `<p class="small">${esc(w.vendor)}</p>` : ""}
    ${w.price ? `<p class="num" style="font-family:var(--f-display);font-size:1.3rem">${(+w.price).toFixed(2)} <span class="small muted">${esc(w.currency)}</span></p>` : ""}
    ${w.url ? `<p class="small"><a href="${esc(w.url)}" target="_blank" rel="noopener">Shop link</a></p>` : ""}
    ${w.notes ? `<p class="small muted">${esc(w.notes)}</p>` : ""}
    <div class="row"><span class="tag">${st[w.status]}</span>${w.sample ? `<span class="tag sample">Sample</span>` : ""}</div>
    <div class="row">${w.status !== "bought" ? `<button class="btn sm honey" data-act="wishBuy" data-id="${w.id}">${ic("jar")} Move to cabinet</button>${w.status === "wanted" ? `<button class="btn sm" data-act="wishOrd" data-id="${w.id}">Mark ordered</button>` : ""}` : ""}
    <button class="btn sm" data-act="wishEdit" data-id="${w.id}">Edit</button><button class="btn sm ghost danger" data-act="wishDel" data-id="${w.id}" aria-label="Delete">${ic("trash")}</button></div></article>`).join("")}</div>`
    : `<div class="empty"><h3>Your wishlist is empty</h3><p>Browse the Library and tap "Wishlist" on any tea that catches your eye.</p></div>`}`;
}
function wishForm(rec, pre = {}) {
  const e = rec || Object.assign({ teaId: "orientalbeauty", vendor: "", url: "", price: "", currency: "EUR", priority: 2, notes: "", status: "wanted" }, pre);
  const sel = e.teaId && TEA[e.teaId] ? e.teaId : "__custom";
  openModal(`${sheetHead(rec ? "Edit wish" : "Add to your wishlist")}<form class="form" id="wform" autocomplete="off">
   <div class="fgrid"><div class="field" style="grid-column:1/-1"><label for="w_tea">Tea</label>${teaSelect("w_tea", sel)}</div>
   <div class="field" id="wcRow" ${sel === "__custom" ? "" : "hidden"}><label for="w_name">Tea name</label><input type="text" id="w_name" value="${esc(sel === "__custom" ? e.teaName || "" : "")}"></div><div class="field" id="wcCat" ${sel === "__custom" ? "" : "hidden"}><label for="w_cat">Category</label>${catSelect("w_cat", e.cat || "green")}</div></div>
   <div class="fgrid"><div class="field"><label for="w_vendor">Vendor or brand</label><input type="text" id="w_vendor" value="${esc(e.vendor)}"></div><div class="field"><label for="w_url">Link (optional)</label><input type="url" id="w_url" value="${esc(e.url)}" placeholder="https://"></div></div>
   <div class="fgrid"><div class="field"><label for="w_price">Expected price</label><input type="number" id="w_price" min="0" step="0.01" value="${esc(e.price)}"></div><div class="field"><label for="w_cur">Currency</label><input type="text" id="w_cur" value="${esc(e.currency)}" maxlength="4"></div><div class="field"><label for="w_pri">Priority</label><select id="w_pri">${[[3, "High"], [2, "Medium"], [1, "Someday"]].map(([v, n]) => `<option value="${v}"${+e.priority === v ? " selected" : ""}>${n}</option>`).join("")}</select></div><div class="field"><label for="w_st">Status</label><select id="w_st">${[["wanted", "Want to try"], ["ordered", "Ordered"], ["bought", "Bought"]].map(([v, n]) => `<option value="${v}"${e.status === v ? " selected" : ""}>${n}</option>`).join("")}</select></div></div>
   <div class="field"><label for="w_notes">Notes</label><textarea id="w_notes">${esc(e.notes)}</textarea></div>
   <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn pri" type="submit">${ic("check")} Save</button></div></form>`);
  $("#w_tea").onchange = ev => { const c = ev.target.value === "__custom"; $("#wcRow").hidden = !c; $("#wcCat").hidden = !c; };
  $("#wform").onsubmit = ev => {
    ev.preventDefault(); const tv = $("#w_tea").value, custom = tv === "__custom";
    if (custom && !$("#w_name").value.trim()) { toast("Give your tea a name"); return; }
    let url = $("#w_url").value.trim(); if (url && !/^https?:\/\//i.test(url)) url = "https://" + url;
    const r2 = Object.assign(rec || { id: uid() }, { teaId: custom ? null : tv, teaName: custom ? $("#w_name").value.trim() : TEA[tv].n, cat: custom ? $("#w_cat").value : TEA[tv].cat, vendor: $("#w_vendor").value.trim(), url, price: $("#w_price").value === "" ? "" : +$("#w_price").value, currency: $("#w_cur").value.trim().toUpperCase(), priority: +$("#w_pri").value, status: $("#w_st").value, notes: $("#w_notes").value.trim() });
    if (!rec) S.wish.push(r2); save(); closeModal(); toast(rec ? "Wish updated" : "Added to your wishlist"); render();
  };
}

// ================= ACADEMY =================
function medalSVG(r) {
  const cols = ["#b9a88a", "#7f9460", "#c38a34", "#be867e", "#d8b04a"];
  return `<svg class="medal" viewBox="0 0 100 100" aria-hidden="true"><path d="M34 4h12l6 26H40zM54 4h12l-6 26H48z" fill="var(--rose)"/><circle cx="50" cy="60" r="34" fill="${cols[r]}"/><circle cx="50" cy="60" r="27" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2"/><path d="M38 72c0-16 9-26 26-27 0 18-10 27-26 27zM38 72l15-14" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><text x="50" y="98" text-anchor="middle" style="font-size:0">${r}</text></svg>`;
}
function V_academy() {
  const A = UI.ac;
  if (A.round) return quizView();
  const r = rankIdx(), nx = RANKS[r + 1];
  const pct = nx ? (S.xp - RANKS[r].xp) / (nx.xp - RANKS[r].xp) * 100 : 100;
  const qDone = Object.values(S.quiz).filter(q => q.c).length;
  const perCat = Object.keys(QCATS).map(k => { const all = QUIZ.filter(q => q.cat === k); return [k, all.filter(q => S.quiz[q.id] && S.quiz[q.id].c).length, all.length]; });
  return roomHead("cap", "Learning & progression", "The Tea Academy", "Earn experience by reading, exploring and answering questions. You never need to drink anything to progress, and there are no streaks to keep.") +
  `<div class="split"><div class="stack">
    <div class="card rankcard">${medalSVG(r)}<div style="min-width:0"><p class="eyebrow">Your rank</p><h2 style="font-size:1.8rem">${RANKS[r].n}</h2><div class="prog"><i style="width:${pct}%"></i></div><p class="small muted num">${S.xp} XP${nx ? ` · ${nx.xp - S.xp} to ${nx.n}` : " · the highest rank"}</p></div></div>
    <h2 style="margin-top:8px">Choose a challenge</h2>
    <div class="modes">
      <button class="mode" data-act="qStart" data-m="mixed"><b>${ic("star")} Mixed round</b><small>Eight questions across every topic, easiest unmastered first.</small></button>
      ${Object.entries(QCATS).map(([k, n]) => { const pc = perCat.find(p => p[0] === k); return `<button class="mode" data-act="qStart" data-m="${k}"><b>${n}</b><small class="num">${pc[1]} of ${pc[2]} mastered</small></button>`; }).join("")}
    </div>
    <p class="small muted">Each question earns 10 XP the first time you get it right. Wrong answers just show you the explanation.</p>
  </div>
  <aside class="stack"><div class="card"><p class="eyebrow">Ranks &amp; atelier decorations</p><div class="ladder" style="margin-top:10px">${RANKS.map((x, i) => `<div class="${i <= r ? "got" : ""}">${ic(i <= r ? "check" : "star")}<div><b>${x.n}</b> <span class="muted small num">${x.xp} XP</span>${x.deco ? `<br><span class="small muted">${x.deco}</span>` : ""}</div></div>`).join("")}</div></div>
   <div class="card"><p class="eyebrow">Where XP comes from</p><dl class="facts small" style="margin-top:8px"><dt>+5</dt><dd>Opening a tea for the first time</dd><dt>+5</dt><dd>Reading a tea culture</dd><dt>+15</dt><dd>Completing a science lesson</dd><dt>+10</dt><dd>Mastering a quiz question</dd><dt>+25</dt><dd>Earning a passport stamp</dd></dl><p class="small muted" style="margin-top:8px">${qDone} of ${QUIZ.length} questions mastered.</p></div></aside></div>`;
}
function startRound(mode) {
  let pool = mode === "mixed" ? QUIZ.slice() : QUIZ.filter(q => q.cat === mode);
  const un = pool.filter(q => !(S.quiz[q.id] && S.quiz[q.id].c)), dn = pool.filter(q => S.quiz[q.id] && S.quiz[q.id].c);
  const sh = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  const pick = [...sh(un).sort((a, b) => a.d - b.d), ...sh(dn)].slice(0, 8);
  UI.ac.round = { mode, items: pick.map(q => ({ id: q.id, ord: sh([0, 1, 2, 3]), pick: null })), i: 0 };
  render();
}
function quizView() {
  const R = UI.ac.round, it = R.items[R.i];
  if (!it) { const sc = R.items.filter(x => x.pick === QUIZ.find(q => q.id === x.id).a).length;
    return `<div class="qbox card" style="text-align:center;padding:32px"><p class="eyebrow">Round complete</p><h1 style="margin:8px 0">${sc} of ${R.items.length}</h1><p class="muted">${sc === R.items.length ? "A perfect round." : sc >= R.items.length / 2 ? "Nicely done. The explanations are worth a second look." : "Every wrong answer is a lesson learned."}</p><div class="row" style="justify-content:center;margin-top:18px"><button class="btn pri" data-act="qStart" data-m="${R.mode}">Another round</button><button class="btn" data-act="qQuit">Back to the Academy</button></div></div>`; }
  const q = QUIZ.find(x => x.id === it.id), ans = it.pick !== null;
  return `<div class="qbox"><div class="qmeta"><span>${QCATS[q.cat]} · ${"●".repeat(q.d)}${"○".repeat(3 - q.d)}</span><span class="num">${R.i + 1} / ${R.items.length}</span></div>
   <div class="pips" style="margin-top:8px">${R.items.map((x, i) => { const qq = QUIZ.find(y => y.id === x.id); return `<i class="${i === R.i ? "now" : x.pick === null ? "" : x.pick === qq.a ? "c" : "w"}"></i>`; }).join("")}</div>
   <p class="qtext">${esc(q.q)}</p>
   <div class="opts">${it.ord.map((oi, k) => `<button class="opt${ans && oi === q.a ? " right" : ""}${ans && oi === it.pick && oi !== q.a ? " wrong" : ""}" data-act="qAns" data-o="${oi}" ${ans ? "disabled" : ""}><span class="k">${"ABCD"[k]}</span>${esc(q.o[oi])}</button>`).join("")}</div>
   ${ans ? `<div class="explain"><b>${it.pick === q.a ? "Correct." : "Not quite."}</b> ${esc(q.x)}</div><div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn pri" data-act="qNext">${R.i + 1 < R.items.length ? "Next question" : "See results"}</button></div>` : ""}
   <div class="row" style="margin-top:18px"><button class="btn sm ghost" data-act="qQuit">${ic("back")} Leave round</button></div></div>`;
}

// ================= SETTINGS =================
function settings() {
  let hasB = false; try { hasB = !!localStorage.getItem(BKEY); } catch (e) { }
  const exp = JSON.stringify(Object.assign({}, S, { exportedAt: new Date().toISOString(), app: "The Tea Atelier", contentVersion: CONTENT_VERSION }));
  openModal(`${sheetHead("Settings & backups")}
  <div class="stack">
   ${installBlock()}
   <label class="cb"><input type="checkbox" id="s_snd" ${S.settings.sound ? "checked" : ""}> Play a chime when the brewing timer finishes</label>
   ${!storageOK ? `<p class="note bad small">This browser is blocking storage, so your data will not survive a reload. Export a backup before you leave.</p>` : `<p class="small muted">Everything is saved automatically on this device only. Nothing syncs between devices, so use the backup below to move your data.</p>`}
   <fieldset><legend>Export a backup</legend><p class="small muted" style="margin-bottom:8px">Save a backup file (for example to iCloud Drive with the Files app), or copy the text below into a note. Photos make it larger.</p>
    <textarea id="s_exp" readonly style="width:100%;min-height:90px;font-family:ui-monospace,monospace;font-size:.75rem;border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:8px">${esc(exp)}</textarea>
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="sFile">${ic("archive")} Save backup file</button><button class="btn sm" data-act="sCopy">${ic("copy")} Copy as text</button><span class="small muted num">${(exp.length / 1024).toFixed(0)} KB</span></div></fieldset>
   <fieldset><legend>Restore from a backup</legend><div class="field" style="margin-bottom:8px"><label for="s_file">Open a backup file</label><input type="file" id="s_file" accept=".json,application/json,text/plain"></div><textarea id="s_imp" placeholder="…or paste backup text here" style="width:100%;min-height:80px;font-family:ui-monospace,monospace;font-size:.75rem;border:1px solid var(--line);border-radius:8px;background:var(--paper);padding:8px"></textarea>
    <p id="s_impMsg" class="small" style="margin-top:6px"></p>
    <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sCheck">Check backup</button><button class="btn sm pri" data-act="sImport" id="s_doImp" disabled>Replace my data with this backup</button>${hasB ? `<button class="btn sm" data-act="sUndo">Undo last restore</button>` : ""}</div></fieldset>
   <fieldset><legend>Clean up</legend><div class="row"><button class="btn sm" data-act="sSamples" ${[...S.journal, ...S.cabinet, ...S.wish].some(x => x.sample) ? "" : "disabled"}>Remove sample entries</button><button class="btn sm danger" data-act="sReset">Erase everything</button></div></fieldset>
   <p class="small muted">Encyclopedia content version ${CONTENT_VERSION}. Your records are stored separately from it, and each record keeps its own copy of the tea name, so later content updates never rewrite your history. App version ${APP_VERSION}.</p>
  </div>`);
  $("#s_snd").onchange = e => { S.settings.sound = e.target.checked; save(); };
  $("#s_file").onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { $("#s_imp").value = rd.result; $("[data-act=sCheck]").click(); }; rd.onerror = () => toast("That file couldn't be read."); rd.readAsText(f); };
}
let pendingImport = null;
function validateBackup(txt) {
  let o; try { o = JSON.parse(txt); } catch (e) { return { err: "That isn't valid backup text. Make sure you pasted the whole thing." }; }
  if (!o || typeof o !== "object" || !Array.isArray(o.journal) || !Array.isArray(o.cabinet) || !Array.isArray(o.wish)) return { err: "This doesn't look like a Tea Atelier backup: the journal, cabinet or wishlist is missing." };
  const bad = [...o.journal, ...o.cabinet, ...o.wish].some(x => !x || typeof x !== "object" || !x.id);
  if (bad) return { err: "Some records in this backup are damaged (missing IDs), so it can't be restored safely." };
  return { ok: migrate(o) };
}

// ================= ROUTER & EVENTS =================
const VIEWS = { hub: V_hub, library: V_library, journal: V_journal, cabinet: V_cabinet, brew: V_brew, atlas: V_atlas, market: V_market, academy: V_academy };
let view = "hub";
function go(r) { if (location.hash === "#" + r) { route(); } else location.hash = r; }
function route() { const r = (location.hash || "#hub").slice(1); const nv = VIEWS[r] ? r : "hub"; const changed = nv !== view; view = nv; render(); if (changed) window.scrollTo(0, 0); }
function render() {
  $("#view").innerHTML = VIEWS[view]();
  paintBar(); paintTimer(false);
  if (view === "library" && $("#libq")) $("#libq").oninput = e => { UI.lib.q = e.target.value; $("#libList").innerHTML = libList(); };
  if (view === "journal") { $("#jf").onchange = e => { UI.j.tea = e.target.value; render(); }; $("#js").onchange = e => { UI.j.sort = e.target.value; render(); }; }
  if (view === "brew") bindBrew();
}
function bindBrew() {
  const B = S.brew, busy = () => S.timer.state === "run" || S.timer.state === "pause";
  $("#b_src").onchange = e => { B.src = e.target.value; B.t = null; ensureBrewParams(true); save(); render(); };
  const bindR = (id, key, f = v => v) => { const el = $("#" + id); if (!el) return; el.oninput = () => { B[key] = f(+el.value); const o = el.nextElementSibling; o.textContent = el.value + o.dataset.u; save(); if (!busy()) paintTimer(false); }; el.onchange = () => { if (!busy()) render(); }; };
  bindR("b_t", "t"); bindR("b_g", "g"); bindR("b_ml", "ml"); bindR("b_s", "s"); bindR("b_add", "add"); bindR("b_h", "s", v => v * 3600);
  $("#b_snd").onchange = e => { S.settings.sound = e.target.checked; save(); };
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act],[data-go]"); if (!el) { if (e.target.id === "modal") closeModal(); return; }
  if (el.dataset.go) { go(el.dataset.go); return; }
  const a = el.dataset.act, id = el.dataset.id;
  const A = {
    close: closeModal,
    cat: () => toast(["Bancha, the atelier cat, purrs and stretches.", "Bancha opens one eye, then goes back to sleep.", "Bancha thinks it's time for a cup."][Math.floor(Math.random() * 3)]),
    settings, rank: () => go("academy"),
    openTea: () => { closeModal(); UI.lib = Object.assign(UI.lib, { open: id, lesson: null, culture: null }); if (view !== "library") go("library"); else { render(); window.scrollTo(0, 0); } },
    libback: () => { UI.lib.open = null; UI.lib.lesson = null; UI.lib.culture = null; render(); },
    libtab: () => { UI.lib.tab = el.dataset.t; render(); },
    libcat: () => { UI.lib.cat = el.dataset.c; $$("[data-act=libcat]").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === UI.lib.cat)); $("#libList").innerHTML = libList(); },
    lesson: () => { UI.lib.lesson = id; render(); window.scrollTo(0, 0); },
    culture: () => { UI.lib = Object.assign(UI.lib, { culture: id, open: null, lesson: null, tab: "cultures" }); if (view !== "library") go("library"); else { render(); window.scrollTo(0, 0); } },
    lessonAns: () => { const l = LESSONS.find(x => x.id === id), i = +el.dataset.i;
      if (i === l.q.a) { S.lessons[id] = Date.now(); save(); render(); addXP(15, "Lesson complete"); } else { el.classList.add("wrong"); el.disabled = true; toast("Not quite. Have another look at the lesson."); } },
    fav: () => { S.favs[id] ? delete S.favs[id] : S.favs[id] = true; save(); render(); },
    brewTea: () => { S.brew.src = "tea:" + id; S.brew.t = null; ensureBrewParams(true); save(); go("brew"); },
    logTea: () => { const t = TEA[id], r = recipe(t, styles(t)[0]); jForm(null, { teaId: id, method: styles(t)[0], temp: r.t, g: r.g, ml: r.ml, sec: r.s, invId: (S.cabinet.find(c => c.teaId === id && !c.archived) || {}).id || "" }); },
    cabAdd: () => cabForm(null, id ? { teaId: id } : {}),
    wishAdd: () => wishForm(null, id ? { teaId: id } : {}),
    journalFor: () => { UI.j.tea = id; go("journal"); },
    jNew: () => jForm(null), jEdit: () => jForm(S.journal.find(j => j.id === id)),
    jDel: () => confirmBox("Delete this tasting?", "The record will be removed from your journal. Stock that was subtracted from a tin is not put back.", "Delete tasting", () => { S.journal = S.journal.filter(j => j.id !== id); UI.j.cmp = UI.j.cmp.filter(x => x !== id); save(); render(); toast("Tasting deleted"); }),
    jCmp: () => { const c = UI.j.cmp; if (el.checked) { c.push(id); if (c.length > 2) c.shift(); } else UI.j.cmp = c.filter(x => x !== id); render(); },
    jCompare: () => { const [x, y] = UI.j.cmp.map(i => S.journal.find(j => j.id === i)).filter(Boolean); if (!x || !y) return;
      const rows = [["Tea", recName], ["Date", j => j.date], ["Method", j => STYLE_N[j.method] || ""], ["Infusion", j => j.inf], ["Water", j => j.temp !== "" && j.temp != null ? j.temp + " °C" : ""], ["Leaf", j => j.g ? `${j.g} g / ${j.ml} ml` : ""], ["Steep", j => j.sec ? fmtSec(+j.sec) : ""], ["Aroma", j => j.r ? j.r.aroma : ""], ["Sweetness", j => j.r ? j.r.sweet : ""], ["Bitterness", j => j.r ? j.r.bitter : ""], ["Astringency", j => j.r ? j.r.astr : ""], ["Body", j => j.r ? j.r.body : ""], ["Overall", j => j.overall], ["Notes", j => j.notes]];
      openModal(`${sheetHead("Side by side")}<div class="tblwrap"><table class="t"><tbody>${rows.map(([n, f]) => { const a1 = f(x), b1 = f(y); return `<tr><th>${n}</th><td${a1 !== b1 && typeof a1 === "number" && a1 > b1 ? ' style="font-weight:700"' : ""}>${esc(a1)}</td><td${a1 !== b1 && typeof b1 === "number" && b1 > a1 ? ' style="font-weight:700"' : ""}>${esc(b1)}</td></tr>`; }).join("")}</tbody></table></div>`); },
    cabShow: () => { UI.cab.show = el.dataset.s; render(); },
    cabOpen: () => cabDetail(S.cabinet.find(c => c.id === id)),
    cabEdit: () => cabForm(S.cabinet.find(c => c.id === id)),
    cabArchive: () => { const c = S.cabinet.find(x => x.id === id); c.archived = true; save(); closeModal(); render(); toast(`${recName(c)} moved to the archive`); },
    cabRestore: () => { const c = S.cabinet.find(x => x.id === id); c.archived = false; save(); render(); toast(`${recName(c)} is back on the shelf`); },
    cabDel: () => { const c = S.cabinet.find(x => x.id === id); confirmBox(`Delete ${recName(c)}?`, "It will be removed from your cabinet for good. Your tasting records for it are kept in the journal.", "Delete tea", () => { S.cabinet = S.cabinet.filter(x => x.id !== id); if (S.brew.src === "inv:" + id) { S.brew.src = c.teaId ? "tea:" + c.teaId : "tea:sencha"; S.brew.t = null; } save(); render(); toast("Deleted"); }); },
    brewInv: () => { closeModal(); S.brew.src = "inv:" + id; S.brew.t = null; ensureBrewParams(true); save(); go("brew"); },
    logInv: () => { const c = S.cabinet.find(x => x.id === id); const t = TEA[c.teaId]; const r = t ? recipe(t, styles(t)[0]) : {}; jForm(null, { teaId: c.teaId || "__custom", teaName: c.teaName, cat: c.cat, invId: c.id, method: t ? styles(t)[0] : "western", temp: r.t ?? "", g: r.g ?? "", ml: r.ml ?? "", sec: r.s ?? "", suggestDeduct: true }); },
    bStyle: () => { S.brew.style = el.dataset.s; ensureBrewParams(true); if (S.timer.state !== "run") S.timer = { state: "idle" }; save(); render(); },
    bInf: () => { S.brew.inf = clamp(S.brew.inf + +el.dataset.d, 1, 30); save(); if (S.timer.state !== "run") { S.timer = { state: "idle" }; } render(); },
    bReset: () => { ensureBrewParams(true); S.timer = { state: "idle" }; save(); render(); },
    tStart: startTimer,
    tPause: () => { const T = S.timer; T.left = Math.max(0, T.end - Date.now()); T.state = "pause"; stopWake(); save(); paintTimer(true); },
    tResume: () => { const T = S.timer; T.end = Date.now() + T.left; T.state = "run"; save(); paintTimer(true); },
    tReset: () => { S.timer = { state: "idle" }; stopWake(); save(); paintTimer(true); },
    tNext: () => { S.brew.inf = Math.min(30, S.brew.inf + 1); S.timer = { state: "idle" }; save(); render(); },
    tLog: () => { const B = S.brew, src = brewSource(); jForm(null, { teaId: src.tea && (!src.inv || src.inv.teaId) ? src.tea.id : "__custom", teaName: src.name, cat: src.cat, method: B.style, inf: B.inf, temp: B.style === "cold" ? "" : B.t, g: B.g, ml: B.ml, sec: curSecs(), invId: src.inv ? src.inv.id : "", suggestDeduct: !!src.inv }); },
    region: () => { UI.at.sel = id; render(); const p = $("#regionPanel"); p && p.scrollIntoView({ behavior: "smooth", block: "start" }); },
    atAns: () => { const r = REGIONS.find(x => x.id === el.dataset.r), qi = +el.dataset.q, q = r.q[qi], o = +el.dataset.o;
      if (o === q.a) { S.atlasQ[r.id + qi] = true; save(); const all = r.q.every((_, i) => S.atlasQ[r.id + i]);
        if (all && !S.stamps[r.id]) { S.stamps[r.id] = Date.now(); save(); render(); addXP(25, `${r.n} stamp earned`); } else { render(); toast("Correct"); } }
      else { el.classList.add("wrong"); el.disabled = true; toast("Not quite. Try another answer."); } },
    mkShow: () => { UI.mk.show = el.dataset.s; render(); },
    wishEdit: () => wishForm(S.wish.find(w => w.id === id)),
    wishOrd: () => { S.wish.find(w => w.id === id).status = "ordered"; save(); render(); },
    wishDel: () => confirmBox("Remove this wish?", "It will be deleted from your wishlist.", "Remove", () => { S.wish = S.wish.filter(w => w.id !== id); save(); render(); }),
    wishBuy: () => { const w = S.wish.find(x => x.id === id);
      cabForm(null, { teaId: w.teaId || "__custom", teaName: w.teaName, cat: w.cat, brand: w.vendor, price: w.price, currency: w.currency || "EUR", notes: w.notes }, inv => { w.status = "bought"; w.invId = inv.id; save(); }); },
    qStart: () => startRound(el.dataset.m),
    qQuit: () => { UI.ac.round = null; render(); },
    qAns: () => { const R = UI.ac.round, it = R.items[R.i], q = QUIZ.find(x => x.id === it.id); it.pick = +el.dataset.o;
      const rec = S.quiz[q.id] || { c: false, n: 0 }; rec.n++; const first = !rec.c && it.pick === q.a; if (it.pick === q.a) rec.c = true; S.quiz[q.id] = rec; save(); render(); if (first) addXP(10, "Question mastered"); },
    qNext: () => { UI.ac.round.i++; render(); window.scrollTo(0, 0); },
    sFile: () => { try { const blob = new Blob([JSON.stringify(Object.assign({}, S, { exportedAt: new Date().toISOString(), app: "The Tea Atelier", contentVersion: CONTENT_VERSION }))], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `tea-atelier-backup-${today()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); S.settings.lastBackup = Date.now(); save(); toast("Backup file saved"); } catch (er) { toast("Saving a file isn't possible here. Use Copy as text instead."); } },
    sInstall: () => { if (!PWA.prompt) return; PWA.prompt.prompt(); PWA.prompt.userChoice.finally(() => { PWA.prompt = null; closeModal(); render(); }); },
    sUpdate: () => { if (PWA.waiting) { PWA.waiting.postMessage("skipWaiting"); } else location.reload(); },
    hideInstall: () => { S.settings.hideInstall = true; save(); render(); },
    sCopy: () => { const t = $("#s_exp"); const done = () => toast("Backup copied"); try { navigator.clipboard.writeText(t.value).then(done, () => { t.select(); toast("Selected. Use your device's Copy."); }); } catch (er) { t.select(); toast("Selected. Use your device's Copy."); } },
    sCheck: () => { const r = validateBackup($("#s_imp").value.trim()), m = $("#s_impMsg");
      if (r.err) { pendingImport = null; m.textContent = r.err; m.style.color = "var(--bad)"; $("#s_doImp").disabled = true; }
      else { pendingImport = r.ok; m.style.color = "var(--good)"; m.textContent = `Looks good: ${r.ok.journal.length} tastings, ${r.ok.cabinet.length} teas, ${r.ok.wish.length} wishes, ${r.ok.xp} XP.`; $("#s_doImp").disabled = false; } },
    sImport: () => { if (!pendingImport) return; const data = pendingImport;
      confirmBox("Replace your data?", "Your current journal, cabinet, wishlist and progress will be replaced by the backup. A copy of what you have now is kept so you can undo this once.", "Replace my data", () => { try { localStorage.setItem(BKEY, JSON.stringify(S)); } catch (er) { } S = data; save(); pendingImport = null; render(); toast("Backup restored"); }); },
    sUndo: () => confirmBox("Undo the last restore?", "Your data goes back to how it was just before the last restore.", "Undo restore", () => { try { const b = migrate(JSON.parse(localStorage.getItem(BKEY))); if (b) { S = b; save(); localStorage.removeItem(BKEY); render(); toast("Restore undone"); } } catch (er) { toast("The earlier copy couldn't be read."); } }, false),
    sSamples: () => confirmBox("Remove sample entries?", "All entries marked as samples will be deleted from your journal, cabinet and wishlist.", "Remove samples", () => { S.journal = S.journal.filter(x => !x.sample); S.cabinet = S.cabinet.filter(x => !x.sample); S.wish = S.wish.filter(x => !x.sample); if ((S.brew.src || "").startsWith("inv:smp")) { S.brew.src = "tea:sencha"; S.brew.t = null; } save(); render(); toast("Samples removed"); }),
    sReset: () => confirmBox("Erase everything?", "This deletes every tasting, tea, wish, stamp and all your progress on this device. It can't be undone unless you have a backup.", "Erase everything", () => { const fresh = defaults(); fresh.journal = []; fresh.cabinet = []; fresh.wish = []; S = fresh; save(); render(); toast("The atelier is fresh and empty"); }),
    ftag: () => el.setAttribute("aria-pressed", el.getAttribute("aria-pressed") !== "true")
  };
  if (A[a]) { if (el.tagName !== "INPUT") e.preventDefault(); A[a](); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#modal").hidden) closeModal();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("g[data-go],g[data-act]")) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
});
document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
window.addEventListener("hashchange", route);
window.addEventListener("storage", e => { if (e.key === KEY) { const n = load(); if (n) { S = n; render(); } } });

// ================= INSTALL & OFFLINE =================
const APP_VERSION = "1.2.0";
const PWA = { prompt: null, waiting: null, offlineReady: false,
  standalone: (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true,
  ios: /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) };
function installBlock() {
  const status = PWA.standalone ? "Installed on this device." : PWA.offlineReady ? "Ready to work offline in this browser." : "Offline files are still downloading.";
  return `<fieldset><legend>Install &amp; offline</legend><p class="small">${status}</p>
    ${!PWA.standalone ? `<p class="small muted" style="margin-top:6px">${PWA.ios ? "iPhone and iPad: open this page in Safari, tap Share, then Add to Home Screen. Data saved in Safari and in the home-screen app are kept separately, so make a backup first if you've already added teas here." : "Use your browser's Install option, or the button below when it appears."}</p>` : ""}
    <div class="row" style="margin-top:8px">${PWA.prompt ? `<button class="btn sm pri" data-act="sInstall">Install the atelier</button>` : ""}${PWA.waiting ? `<button class="btn sm honey" data-act="sUpdate">Update to the new version</button>` : ""}</div></fieldset>`;
}
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(reg => {
      const watch = w => { if (!w) return; w.addEventListener("statechange", () => { if (w.state === "installed") { if (navigator.serviceWorker.controller) { PWA.waiting = w; showUpdate(); } else { PWA.offlineReady = true; toast("The atelier is ready to use offline"); } } }); };
      if (reg.waiting && navigator.serviceWorker.controller) { PWA.waiting = reg.waiting; showUpdate(); }
      if (reg.active && navigator.serviceWorker.controller) PWA.offlineReady = true;
      reg.addEventListener("updatefound", () => watch(reg.installing));
      document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => { }); });
    }).catch(() => { });
    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (PWA.waiting && !reloading) { reloading = true; save(); location.reload(); } });
  });
}
function showUpdate() {
  const t = $("#toast"); if ($("#updBar")) return;
  const d = document.createElement("div"); d.id = "updBar"; d.style.pointerEvents = "auto"; d.style.display = "flex"; d.style.gap = "10px"; d.style.alignItems = "center";
  d.innerHTML = `A new version of the atelier is ready. <button class="btn sm honey" data-act="sUpdate">Update</button>`; t.appendChild(d);
}
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); PWA.prompt = e; if (view === "hub") render(); });
window.addEventListener("appinstalled", () => { PWA.prompt = null; toast("Installed. You'll find the atelier on your home screen."); });
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }

// boot
$("#roomnav").innerHTML = ROOMS.map(r => `<a href="#${r.id}" data-r="${r.id}">${ic(r.ic)}<span>${r.n.replace("The ", "")}</span></a>`).join("");
if (S.timer.state === "run" && Date.now() >= S.timer.end) { S.timer.state = "done"; save(); }
route();
setInterval(tick, 250);
