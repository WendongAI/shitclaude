/* ========================================================================
   ShitClaude — Multi-Country Profile Scanner v2
   14 detection dimensions: 11 client-side + 3 server-side (IP geo)
   ======================================================================== */

// ─── Country database ────────────────────────────────────────────────────────
const COUNTRIES = [
  {
    code: "cn", name: "中国", emoji: "🇨🇳",
    zones: ["Asia/Shanghai", "Asia/Chongqing", "Asia/Harbin", "Asia/Urumqi"],
    offsets: [-480],
    languages: ["zh", "zh-CN", "zh-Hans", "zh-Hans-CN"],
    intlRegions: ["CN"],
    fonts: ["PingFang SC", "Microsoft YaHei", "SimHei", "Noto Sans CJK SC"],
    fontLabel: "已安装中文字体",
    webgl: ["Intel Iris OpenGL Engine", "Apple M1", "Apple M2", "AMD Radeon Pro", "NVIDIA GeForce GTX 1050", "NVIDIA GeForce MX"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["YMD", "MDY"],
    keyboard: ["QWERTY"],
    dpiRange: [2, 3],
  },
  {
    code: "gb", name: "英国", emoji: "🇬🇧",
    zones: ["Europe/London"],
    offsets: [0, -60],
    languages: ["en-GB", "cy-GB", "gd-GB"],
    intlRegions: ["GB"],
    fonts: ["Aptos", "Calibri", "Gill Sans", "Cambria"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce RTX", "AMD Radeon RX"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["DMY"],
    keyboard: ["QWERTY"],
    dpiRange: [1, 2],
  },
  {
    code: "ca", name: "加拿大", emoji: "🇨🇦",
    zones: ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Halifax", "America/Winnipeg"],
    offsets: [210, 240, 300, 360, 420, 480],
    languages: ["en-CA", "fr-CA"],
    intlRegions: ["CA"],
    fonts: ["Aptos", "Calibri", "Cambria"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce", "AMD Radeon"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["MDY", "YMD"],
    keyboard: ["QWERTY"],
    dpiRange: [1, 2],
  },
  {
    code: "au", name: "澳大利亚", emoji: "🇦🇺",
    zones: ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide"],
    offsets: [-480, -570, -600, -630, -660],
    languages: ["en-AU"],
    intlRegions: ["AU"],
    fonts: ["Aptos", "Calibri", "Gill Sans"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce", "AMD Radeon"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["DMY"],
    keyboard: ["QWERTY"],
    dpiRange: [1, 2],
  },
  {
    code: "sg", name: "新加坡", emoji: "🇸🇬",
    zones: ["Asia/Singapore"],
    offsets: [-480],
    languages: ["en-SG", "zh-SG", "ms-SG", "ta-SG"],
    intlRegions: ["SG"],
    fonts: ["Aptos", "Calibri", "PingFang SC", "Noto Sans CJK SC"],
    webgl: ["Intel Iris OpenGL Engine", "Apple M1", "Apple M2"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["DMY", "YMD"],
    keyboard: ["QWERTY"],
    dpiRange: [2, 3],
  },
  {
    code: "jp", name: "日本", emoji: "🇯🇵",
    zones: ["Asia/Tokyo"],
    offsets: [-540],
    languages: ["ja", "ja-JP"],
    intlRegions: ["JP"],
    fonts: ["Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans CJK JP"],
    webgl: ["Intel Iris OpenGL Engine", "Apple M1", "Apple M2"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["YMD"],
    keyboard: ["QWERTY"],
    dpiRange: [2, 3],
  },
  {
    code: "kr", name: "韩国", emoji: "🇰🇷",
    zones: ["Asia/Seoul"],
    offsets: [-540],
    languages: ["ko", "ko-KR"],
    intlRegions: ["KR"],
    fonts: ["Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans CJK KR"],
    webgl: ["Intel Iris OpenGL Engine", "Apple M1", "Apple M2", "NVIDIA GeForce"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["YMD"],
    keyboard: ["QWERTY"],
    dpiRange: [2, 3],
  },
  {
    code: "de", name: "德国", emoji: "🇩🇪",
    zones: ["Europe/Berlin"],
    offsets: [-60, -120],
    languages: ["de", "de-DE", "de-AT", "de-CH"],
    intlRegions: ["DE", "AT", "CH"],
    fonts: ["Aptos", "Calibri", "Segoe UI", "DIN Alternate"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce RTX", "AMD Radeon RX"],
    numberFormats: { decimal: ",", group: "." },
    dateFormats: ["DMY"],
    keyboard: ["QWERTZ"],
    dpiRange: [1, 2],
  },
  {
    code: "fr", name: "法国", emoji: "🇫🇷",
    zones: ["Europe/Paris"],
    offsets: [-60, -120],
    languages: ["fr", "fr-FR", "fr-BE", "fr-CH"],
    intlRegions: ["FR", "BE", "CH"],
    fonts: ["Aptos", "Calibri", "Helvetica Neue"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce RTX", "AMD Radeon RX"],
    numberFormats: { decimal: ",", group: " " },
    dateFormats: ["DMY"],
    keyboard: ["AZERTY"],
    dpiRange: [1, 2],
  },
  {
    code: "br", name: "巴西", emoji: "🇧🇷",
    zones: ["America/Sao_Paulo", "America/Fortaleza", "America/Manaus"],
    offsets: [120, 180, 240, 300],
    languages: ["pt-BR"],
    intlRegions: ["BR"],
    fonts: ["Aptos", "Calibri", "Segoe UI"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce", "AMD Radeon"],
    numberFormats: { decimal: ",", group: "." },
    dateFormats: ["DMY"],
    keyboard: ["QWERTY"],
    dpiRange: [1, 2],
  },
  {
    code: "in", name: "印度", emoji: "🇮🇳",
    zones: ["Asia/Kolkata", "Asia/Calcutta"],
    offsets: [-330],
    languages: ["en-IN", "hi-IN", "ta-IN", "bn-IN"],
    intlRegions: ["IN"],
    fonts: ["Aptos", "Calibri", "Nirmala UI", "Kohinoor Devanagari"],
    webgl: ["Intel(R) UHD Graphics", "NVIDIA GeForce", "AMD Radeon"],
    numberFormats: { decimal: ".", group: "," },
    dateFormats: ["DMY", "MDY"],
    keyboard: ["QWERTY"],
    dpiRange: [1, 2],
  },
];

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ICONS = {
  clock:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm0-2.2A7.8 7.8 0 1 0 12 4.2a7.8 7.8 0 0 0 0 15.6Zm1-8.2 3.5 2.1-1.1 1.8-4.6-2.8V7h2.2v4.6Z" fill="currentColor"/></svg>',
  globe:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm6.7-11h-3a15 15 0 0 0-1.1-5 7.8 7.8 0 0 1 4.1 5ZM12 4.2c-.8 1.1-1.6 3.5-1.8 6.8h3.6C13.6 7.7 12.8 5.3 12 4.2ZM10.2 13c.2 3.3 1 5.7 1.8 6.8.8-1.1 1.6-3.5 1.8-6.8h-3.6Zm-.8-7A7.8 7.8 0 0 0 5.3 11h3A15 15 0 0 1 9.4 6Zm-4.1 7a7.8 7.8 0 0 0 4.1 5 15 15 0 0 1-1.1-5h-3Zm9.3 5a7.8 7.8 0 0 0 4.1-5h-3a15 15 0 0 1-1.1 5Z" fill="currentColor"/></svg>',
  type:     '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v3h-2.3l-.3-1H13v13h2.7v2H8.3v-2H11V6H7.6l-.3 1H5V4Z" fill="currentColor"/></svg>',
  sliders:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h8.2a2.8 2.8 0 0 0 5.6 0H21v2h-2.2a2.8 2.8 0 0 0-5.6 0H5V7Zm0 8h2.2a2.8 2.8 0 0 0 5.6 0H21v2h-8.2a2.8 2.8 0 0 0-5.6 0H5v-2Z" fill="currentColor"/></svg>',
  smile:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20ZM8.4 9.8a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Zm7.2 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Zm.4 3.7c-.8 1.2-2.1 2-4 2s-3.2-.8-4-2l-1.8 1.1c1.2 1.9 3.2 3 5.8 3s4.6-1.1 5.8-3L16 13.5Z" fill="currentColor"/></svg>',
  gpu:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2v8h16V8H4Zm2 2h4v4H6v-4Z" fill="currentColor"/></svg>',
  num:      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h2v16H5V4Zm4 0h2l4 10V4h2v16h-2l-4-10v10H9V4Z" fill="currentColor"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10Z" fill="currentColor"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v1h14V6a1 1 0 0 0-1-1H6Zm-1 5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8H5Zm3 2h2v2H8v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-8 4h6v2H8v-2Z" fill="currentColor"/></svg>',
  screen:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 0v10h14V5H5Zm5 13h4v2h-4v-2Z" fill="currentColor"/></svg>',
  ip:       '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 4.9 14.3l-1.4-1A6 6 0 1 0 12 18a6 6 0 0 0 4.9-2.7l-1.4-1A4 4 0 1 1 12 8a4 4 0 0 1 0 8 4 4 0 0 1 0-8Z" fill="currentColor"/></svg>',
  shield:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6.1c0 5.1 3.4 9.9 8 11.9 4.6-2 8-6.8 8-11.9V5l-8-3Zm0 2.2L18 6.6v4.5c0 4.1-2.7 7.9-6 9.7-3.3-1.8-6-5.6-6-9.7V6.6l6-2.4Z" fill="currentColor"/></svg>',
  server:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4Zm0 2h16v4H4V5Zm0 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H4Zm0 2h16v4H4v-4Z" fill="currentColor"/></svg>',
};

// ─── DOM refs ────────────────────────────────────────────────────────────────
const el = {
  scoreRing:    document.querySelector(".score-ring"),
  scoreValue:   document.querySelector("#scoreValue"),
  riskBadge:    document.querySelector("#riskBadge"),
  verdict:      document.querySelector("#verdict"),
  rescanButton: document.querySelector("#rescanButton"),
  signals:      document.querySelector("#signals"),
  signalsBlock: document.querySelector("#signalsBlock"),
  countryTitle: document.querySelector("#countryTitle"),
  countryGrid:  document.querySelector("#countryGrid"),
  mascot:       document.querySelector("#mascot"),
  serverSignals: document.querySelector("#serverSignals"),
  serverDetail:  document.querySelector("#serverDetail"),
  matchBadge:   document.querySelector("#matchBadge"),
};

// ─── Client-side: Browser Facts ──────────────────────────────────────────────
function getBrowserFacts() {
  const locale    = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "";
  const timeZone  = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const languages = Array.from(new Set([navigator.language, ...(navigator.languages || [])].filter(Boolean)));
  const intlRegion = parseRegion(locale);
  const hour12    = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hour12;
  const offsetMinutes = new Date().getTimezoneOffset();
  const fonts     = detectFonts(COUNTRIES.flatMap((c) => c.fonts));
  const emojiWidth = measureEmojiWidth();
  const webgl     = detectWebGL();
  const numberFmt = detectNumberFormat();
  const dateFmt   = detectDateFormat();
  const keyboard  = detectKeyboardLayout();
  const screen    = detectScreen();

  return { locale, timeZone, languages, intlRegion, hour12, offsetMinutes, fonts, emojiWidth, webgl, numberFmt, dateFmt, keyboard, screen };
}

function parseRegion(locale) {
  const parts = String(locale).split("-");
  return parts.find((p) => /^[A-Z]{2}$/.test(p)) || "";
}

// ─── Client-side: Font detection via Canvas ──────────────────────────────────
function detectFonts(fontNames) {
  const uniqueFonts = Array.from(new Set(fontNames));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  const sample = "mmmmmmmmmmlliWWWW@@@国字かな한글";
  const baseFonts = ["monospace", "serif", "sans-serif"];
  const baseWidths = Object.fromEntries(
    baseFonts.map((base) => { ctx.font = `72px ${base}`; return [base, ctx.measureText(sample).width]; })
  );
  return uniqueFonts.filter((font) =>
    baseFonts.some((base) => {
      ctx.font = `72px "${font}", ${base}`;
      return Math.abs(ctx.measureText(sample).width - baseWidths[base]) > 0.5;
    })
  );
}

// ─── Client-side: Emoji width ────────────────────────────────────────────────
function measureEmojiWidth() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = "48px system-ui, Apple Color Emoji, Segoe UI Emoji, sans-serif";
  return Math.round(ctx.measureText("🐶🇬🇧✨").width);
}

// ─── Client-side: WebGL renderer ─────────────────────────────────────────────
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return "";
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
  } catch {
    return "";
  }
}

// ─── Client-side: Number format ──────────────────────────────────────────────
function detectNumberFormat() {
  try {
    const parts = new Intl.NumberFormat().formatToParts(1234567.89);
    const decimal = parts.find((p) => p.type === "decimal")?.value || ".";
    const group   = parts.find((p) => p.type === "group")?.value || ",";
    return { decimal, group };
  } catch {
    return { decimal: ".", group: "," };
  }
}

// ─── Client-side: Date format preference ─────────────────────────────────────
function detectDateFormat() {
  try {
    const fmt = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
    const parts = fmt.formatToParts(new Date(2025, 5, 15)); // June 15, 2025
    const order = parts.filter((p) => ["month", "day", "year"].includes(p.type)).map((p) => p.type);
    const key = order.map((t) => t.charAt(0).toUpperCase()).join("");
    if (key === "MDY") return "MDY";
    if (key === "DMY") return "DMY";
    if (key === "YMD") return "YMD";
    return key;
  } catch {
    return "MDY";
  }
}

// ─── Client-side: Keyboard layout (Z vs Q position) ─────────────────────────
async function detectKeyboardLayout() {
  try {
    if (!navigator.keyboard?.getLayoutMap) return "";
    const layout = await navigator.keyboard.getLayoutMap();
    const zKey = layout.get("KeyZ");
    const qKey = layout.get("KeyQ");
    if (zKey === "y" || zKey === "Y") return "QWERTZ";
    if (qKey === "a" || qKey === "A") return "AZERTY";
    return "QWERTY";
  } catch {
    return "";
  }
}

// ─── Client-side: Screen DPI ─────────────────────────────────────────────────
function detectScreen() {
  return {
    width:  screen.width,
    height: screen.height,
    dpr:    window.devicePixelRatio || 1,
  };
}

// ─── Server-side: IP Geolocation ─────────────────────────────────────────────
async function getServerFacts() {
  try {
    const res = await fetch("/api/geo", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    console.warn("API fetch failed:", e);
    return { status: "unavailable", country: "Unknown", countryCode: "??", region: "", city: "", timezone: "", isp: "", org: "", as: "", isProxy: false, isDatacenter: false };
  }
}

// ─── Scoring Engine ──────────────────────────────────────────────────────────
function scoreCountries(facts, serverFacts) {
  return COUNTRIES.map((country) => {
    let score = 0;
    const hits = [];

    // ─── Client-side signals ───────────────────────────────────────────────

    // 1. System timezone (25 pts)
    const zoneHit = country.zones.includes(facts.timeZone);
    if (zoneHit) {
      score += 25;
      hits.push({ label: "系统时区", value: 25, icon: "clock" });
    } else if (country.zones.some((z) => sameZoneFamily(z, facts.timeZone))) {
      score += 10;
      hits.push({ label: "相近时区", value: 10, icon: "clock", tone: "gold" });
    }

    // 2. Browser language (15 pts)
    const langHit = facts.languages.find((l) => country.languages.some((t) => l.toLowerCase() === t.toLowerCase()));
    if (langHit) {
      score += 15;
      hits.push({ label: "浏览器语言", value: 15, icon: "globe" });
    } else if (country.languages.some((t) => facts.languages.some((l) => l.slice(0, 2) === t.slice(0, 2)))) {
      score += 7;
      hits.push({ label: "语言族", value: 7, icon: "globe", tone: "gold" });
    }

    // 3. Intl region (8 pts)
    if (country.intlRegions.includes(facts.intlRegion)) {
      score += 8;
      hits.push({ label: "Intl 区域", value: 8, icon: "sliders" });
    }

    // 4. Font detection (12 pts)
    const fontHits = facts.fonts.filter((f) => country.fonts.includes(f));
    if (fontHits.length) {
      score += 12;
      hits.push({ label: country.fontLabel || "地区字体", value: 12, icon: "type" });
    }

    // 5. WebGL renderer (8 pts)
    if (facts.webgl && country.webgl.some((g) => facts.webgl.includes(g))) {
      score += 8;
      hits.push({ label: "GPU 渲染器", value: 8, icon: "gpu" });
    }

    // 6. Number format (5 pts)
    if (facts.numberFmt.decimal === country.numberFormats.decimal && facts.numberFmt.group === country.numberFormats.group) {
      score += 5;
      hits.push({ label: "数字格式", value: 5, icon: "num" });
    }

    // 7. Date format (5 pts)
    if (country.dateFormats.includes(facts.dateFmt)) {
      score += 5;
      hits.push({ label: "日期格式", value: 5, icon: "calendar" });
    }

    // 8. Keyboard layout (4 pts)
    if (facts.keyboard && country.keyboard.includes(facts.keyboard)) {
      score += 4;
      hits.push({ label: "键盘布局", value: 4, icon: "keyboard" });
    }

    // 9. Screen DPI (3 pts)
    if (facts.screen.dpr >= country.dpiRange[0] && facts.screen.dpr <= country.dpiRange[1]) {
      score += 3;
      hits.push({ label: "屏幕 DPI", value: 3, icon: "screen" });
    }

    // 10. Emoji width (2 pts)
    if (facts.emojiWidth > 115) {
      score += 2;
      hits.push({ label: "Emoji 渲染", value: 2, icon: "smile", tone: "gold" });
    }

    // 11. Timezone offset (3 pts)
    if ((country.offsets || []).includes(facts.offsetMinutes)) {
      score += 3;
      hits.push({ label: "时区偏移", value: 3, icon: "clock", tone: "gold" });
    }

    // ─── Server-side signals ──────────────────────────────────────────────
    if (serverFacts && serverFacts.status === "ok") {
      const serverCountry = (serverFacts.countryCode || "").toUpperCase();

      // 12. IP geolocation match (25 pts)
      if (serverCountry === country.code.toUpperCase()) {
        score += 25;
        hits.push({ label: `IP 定位 · ${serverFacts.country}`, value: 25, icon: "ip" });
      }

      // 13. VPN / Proxy detection (12 pts — penalty if proxy, bonus if clean + matches)
      if (serverFacts.isProxy || serverFacts.isDatacenter) {
        if (serverCountry === country.code.toUpperCase()) {
          score += 6;  // proxy but still matches = half credit
          hits.push({ label: "VPN/数据中心 IP", value: 6, icon: "shield", tone: "gold" });
        }
        // mismatched proxy = 0 for this signal
      } else if (serverCountry === country.code.toUpperCase()) {
        score += 12;
        hits.push({ label: "住宅 IP ✓", value: 12, icon: "shield" });
      }

      // 14. ASN / ISP region (5 pts)
      if (serverFacts.org && country.code.toUpperCase() === serverCountry) {
        score += 5;
        hits.push({ label: "运营商区域", value: 5, icon: "server", tone: "gold" });
      }
    }

    return { ...country, score: Math.min(100, score), hits };
  }).sort((a, b) => b.score - a.score);
}

function sameZoneFamily(a, b) {
  if (!a || !b) return false;
  return a.split("/")[0] === b.split("/")[0];
}

// ─── Signal descriptions (for explanation panel) ─────────────────────────────
const SIGNAL_DESC = [
  { key: "s_timezone", weight: 25, icon: "clock", badge: true,
    zh: "Claude 同款 Intl.DateTimeFormat 读到的系统时区，与 Asia/Shanghai 等中国时区比对。",
    en: "Same Intl.DateTimeFormat timezone Claude reads, compared against China zones like Asia/Shanghai." },
  { key: "s_lang", weight: 15, icon: "globe",
    zh: "检查 navigator.languages；首选 zh-CN / 简体中文得分最高。",
    en: "Checks navigator.languages; zh-CN / Simplified Chinese scores highest." },
  { key: "s_intl", weight: 8, icon: "sliders",
    zh: "浏览器用于日期/数字格式化的 locale region。",
    en: "Browser locale region used for date/number formatting." },
  { key: "s_font", weight: 12, icon: "type",
    zh: "用 canvas 宽度探测微软雅黑、苹方等简繁中文字体。",
    en: "Canvas width detects Chinese fonts like PingFang SC, Microsoft YaHei, Noto Sans CJK." },
  { key: "s_webgl", weight: 8, icon: "gpu",
    zh: "通过 WebGL 渲染器识别 GPU 型号，不同地区 GPU 分布不同。",
    en: "GPU model via WebGL renderer; distribution varies by region." },
  { key: "s_number", weight: 5, icon: "num",
    zh: "数字格式化：小数点和千位分隔符（如 1.000,00 vs 1,000.00）。",
    en: "Number format: decimal separator and grouping (e.g. 1.000,00 vs 1,000.00)." },
  { key: "s_date", weight: 5, icon: "calendar",
    zh: "日期格式偏好：MDY（美式）/ DMY（欧式）/ YMD（东亚）。",
    en: "Date format preference: MDY (US) / DMY (EU) / YMD (East Asia)." },
  { key: "s_keyboard", weight: 4, icon: "keyboard",
    zh: "键盘布局：QWERTY / QWERTZ（德语）/ AZERTY（法语）。",
    en: "Keyboard layout: QWERTY / QWERTZ (German) / AZERTY (French)." },
  { key: "s_dpi", weight: 3, icon: "screen",
    zh: "屏幕 DPI（devicePixelRatio），Retina 屏幕在东亚更普及。",
    en: "Screen DPI (devicePixelRatio); Retina displays more common in East Asia." },
  { key: "s_emoji", weight: 2, icon: "smile",
    zh: "Emoji 渲染风格，Apple/Google/Microsoft 渲染宽度不同。",
    en: "Emoji rendering style; Apple/Google/Microsoft render at different widths." },
  { key: "s_offset", weight: 3, icon: "clock",
    zh: "getTimezoneOffset() 是否为 UTC+8 等中国偏移。",
    en: "Whether getTimezoneOffset() returns UTC+8 or other Chinese offsets." },
  { key: "s_ip", weight: 25, icon: "ip", isFn: true,
    zh: (c) => `IP 地理定位归属国（${c || "?"}），最直接的风控信号。`,
    en: (c) => `IP geolocation country (${c || "?"}), the most direct risk signal.` },
  { key: "s_vpn", weight: 12, icon: "shield",
    zh: "检测到 VPN/代理或数据中心 IP 时半分扣减。",
    en: "VPN/proxy or datacenter IP detected — half credit deduction." },
  { key: "s_asn", weight: 5, icon: "server",
    zh: "IP 运营商 ASN 与目标国家匹配加分。",
    en: "IP ASN/ISP matches target country." },
];

function renderSignalCards(hits) {
  const grid = document.querySelector("#signalCardGrid");
  if (!grid) return;
  const bestCountry = hits.length ? hits[0] : null;
  const bestName = bestCountry?.name || "—";

  grid.innerHTML = SIGNAL_DESC.map((s) => {
    const hit = bestCountry?.hits?.find((h) => {
      const key = SIGNAL_KEY[h.label];
      return key === s.key || (s.isFn && h.label.includes("IP 定位"));
    });
    const value = hit ? `+${hit.value}` : "—";
    const desc = typeof s.zh === "function" ? s.zh(bestName) : s.zh;
    return `
      <div class="signal-card">
        <div class="signal-card-icon">${ICONS[s.icon] || ""}</div>
        <div class="signal-card-left">
          <div class="signal-card-top">
            <span class="signal-card-name">${t(s.key)}</span>
            <span class="signal-card-weight">${s.weight}分</span>
            ${s.badge ? '<span class="signal-card-badge">Claude 同款</span>' : ''}
          </div>
          <span class="signal-card-desc">${currentLang === "en" ? (typeof s.en === "function" ? s.en(bestName) : s.en) : desc}</span>
        </div>
        <span class="signal-card-value">${value}</span>
      </div>`;
  }).join("");
}

// ─── i18n ────────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem("shitclaude-lang") || "zh";

const I18N = {
  zh: {
    // Page
    title: "你会被封号吗？该死的 Claude！",
    subtitle: "14 维度 Claude 多国画像检测 — 客户端指纹 + 服务端 IP 交叉验证",
    // Trust strip
    trust1: "14 维度检测",
    trust2: "客户端 + 服务端交叉验证",
    trust3: "结果零上传",
    trust4: "开源代码",
    // Scan
    scanning: "扫描中",
    scanningDesc: "正在检测你的 Claude 多国画像",
    pending: "待检测",
    pendingDesc: "点击下方按钮开始检测",
    startScan: "开始检测",
    rescan: "重新扫描",
    loadingIP: "正在获取 IP 信息...",
    noSignal: "暂无强命中",
    // Risk
    highRisk: "高风险",
    midRisk: "中风险",
    lowRisk: "低风险",
    // Verdict
    certainty75: "你绝对是",
    certainty45: "你很像",
    certainty0: "你暂时不像",
    verdictTpl: (name) => `你是「${name} Claude 用户」吗`,
    countryTitleTpl: (name, score) => `最像 ${name}，综合命中 ${score}/100`,
    // Signals
    s_timezone: "系统时区",
    s_timezoneNear: "相近时区",
    s_lang: "浏览器语言",
    s_langFamily: "语言族",
    s_intl: "Intl 区域",
    s_font: "地区字体",
    s_webgl: "GPU 渲染器",
    s_number: "数字格式",
    s_date: "日期格式",
    s_keyboard: "键盘布局",
    s_dpi: "屏幕 DPI",
    s_emoji: "Emoji 渲染",
    s_offset: "时区偏移",
    s_ip: (country) => `IP 定位 · ${country}`,
    s_vpn: "VPN/数据中心 IP",
    s_residential: "住宅 IP ✓",
    s_asn: "运营商区域",
    // Server panel
    serverTitle: "🌐 服务端 IP 检测",
    serverSub: "通过 IP 地理定位 + 客户端指纹交叉验证",
    serverSignal: "服务端信号",
    apiUnreachable: "API 不可达",
    localEnv: "本地环境",
    ipAddr: "IP 地址",
    ipCountry: "IP 归属国",
    cityTimezone: "城市 / 时区",
    ipType: "IP 类型",
    ipProxy: "代理/VPN ⚠️",
    ipDC: "数据中心 ⚠️",
    ipResidential: "住宅 IP ✓",
    isp: "运营商",
    matchOk: "🔗 客户端指纹与 IP 归属国一致",
    matchWarn: "🔒 检测到 VPN/代理，IP 与指纹可能不一致",
    matchMismatch: "⚠️ 客户端指纹与 IP 归属国不一致",
    // Country panel
    eyebrow: "非美国 Claude 画像",
    countryTitleDefault: "正在匹配最像的国家",
    // Principle panel
    principleTitle: "检测原理",
    principleP1: "Claude Code 通过 <code>ANTHROPIC_BASE_URL</code> 指向端点时，据公开逆向分析，它会读取<strong>操作系统时区</strong>与<strong>中转 hostname</strong>，再把结果用 Unicode 隐写术藏进 system prompt——「Today's date」那一行的日期分隔符和 4 种几乎一样的撇号变体，编码了你是否像中国用户。",
    principleP2: "网页读不到 Claude Code 能读的全部信息，但关键信号完全一致：本工具读取同一个系统时区，再叠加浏览器语言、中文字体、Intl locale、GPU 渲染器、数字/日期格式、键盘布局、屏幕 DPI、IP 归属地等指纹，加权得分。",
    principleP3: "得分 ≥75 计为高风险；分档：<strong>低 0–44</strong>、<strong>中 45–74</strong>、<strong>高 75–100</strong>。",
    // FAQ
    faqTitle: "常见问题",
    faq1Q: "Claude 真的会检查我的时区吗？",
    faq1A: "是的。Claude Code 在每次请求时会读取系统时区，这是最核心的风控信号。本工具的时区检测与 Claude 读取的是完全相同的 API。",
    faq2Q: "这个分数就是 Claude 的真实判定吗？",
    faq2A: "不完全是。本工具模拟了 Claude 可能使用的浏览器端信号，但 Claude 服务端还有 IP 地理定位、支付方式、手机号等额外维度。分数仅反映你的浏览器暴露了多少地区特征。",
    faq3Q: "怎么降低分数？",
    faq3A: "理论上可以修改浏览器时区设置（Chrome flags）、切换系统语言、移除中文字体等。但这只是「伪装」，Claude 还会通过 IP 和支付方式判断你的实际位置。",
    faq4Q: "会上传我的数据吗？",
    faq4A: "不会。所有检测都在浏览器本地完成，IP 查询通过 Vercel Serverless Function 中转，不会存储任何数据。",
    // Privacy
    privacyText: '🔒 <strong>隐私说明</strong>：大多数检测都在你的浏览器本地完成，扫描结果不会离开你的设备。服务端仅用于 IP 地理定位查询，不会记录或存储检测结果。详情见 <a href="../privacy/">隐私政策</a>。',
    // Signal explanation
    signalExplainTitle: "检测哪些信号",
    signalExplainSub: "14 项区域指纹，加权得出 0–100 风险分。",
  },
  en: {
    title: "Will You Get Banned? Damn Claude!",
    subtitle: "14-Dimension Claude Profile Scanner — Client Fingerprint + Server IP Cross-Validation",
    trust1: "14 Dimensions",
    trust2: "Client + Server Cross-Validation",
    trust3: "Zero Data Upload",
    trust4: "Open Source",
    scanning: "Scanning",
    scanningDesc: "Scanning your Claude profile...",
    pending: "Pending",
    pendingDesc: "Click the button below to start detection",
    startScan: "Start Scan",
    rescan: "Rescan",
    loadingIP: "Fetching IP info...",
    noSignal: "No strong signal",
    highRisk: "High Risk",
    midRisk: "Medium Risk",
    lowRisk: "Low Risk",
    certainty75: "You are definitely",
    certainty45: "You look like",
    certainty0: "You don't look like",
    verdictTpl: (name) => `Are you a "${name} Claude User"?`,
    countryTitleTpl: (name, score) => `Best match: ${name} — Score ${score}/100`,
    s_timezone: "System Timezone",
    s_timezoneNear: "Nearby Timezone",
    s_lang: "Browser Language",
    s_langFamily: "Language Family",
    s_intl: "Intl Region",
    s_font: "Regional Fonts",
    s_webgl: "GPU Renderer",
    s_number: "Number Format",
    s_date: "Date Format",
    s_keyboard: "Keyboard Layout",
    s_dpi: "Screen DPI",
    s_emoji: "Emoji Rendering",
    s_offset: "Timezone Offset",
    s_ip: (country) => `IP Location · ${country}`,
    s_vpn: "VPN/Datacenter IP",
    s_residential: "Residential IP ✓",
    s_asn: "ISP Region",
    serverTitle: "🌐 Server IP Detection",
    serverSub: "IP geolocation + client fingerprint cross-validation",
    serverSignal: "Server Signal",
    apiUnreachable: "API Unreachable",
    localEnv: "Local Environment",
    ipAddr: "IP Address",
    ipCountry: "IP Country",
    cityTimezone: "City / Timezone",
    ipType: "IP Type",
    ipProxy: "Proxy/VPN ⚠️",
    ipDC: "Datacenter ⚠️",
    ipResidential: "Residential IP ✓",
    isp: "ISP",
    matchOk: "🔗 Client fingerprint matches IP country",
    matchWarn: "🔒 VPN/Proxy detected — IP may not match fingerprint",
    matchMismatch: "⚠️ Client fingerprint does NOT match IP country",
    eyebrow: "Non-US Claude Profile",
    countryTitleDefault: "Matching closest country...",
    // Principle panel
    principleTitle: "Detection Principle",
    principleP1: "When Claude Code points to an endpoint via <code>ANTHROPIC_BASE_URL</code>, public reverse engineering shows it reads the <strong>OS timezone</strong> and <strong>relay hostname</strong>, then hides the results using Unicode steganography in the system prompt — the date separator and 4 nearly identical apostrophe variants in the 'Today's date' line encode whether you appear to be a Chinese user.",
    principleP2: "Web pages can't access everything Claude Code can read, but the key signals are identical: this tool reads the same system timezone, then overlays browser language, Chinese fonts, Intl locale, GPU renderer, number/date format, keyboard layout, screen DPI, IP geolocation and other fingerprints, weighted into a score.",
    principleP3: "Score ≥75 is high risk; tiers: <strong>Low 0–44</strong>, <strong>Medium 45–74</strong>, <strong>High 75–100</strong>.",
    // FAQ
    faqTitle: "FAQ",
    faq1Q: "Does Claude really check my timezone?",
    faq1A: "Yes. Claude Code reads the system timezone with every request — it's the core risk signal. This tool uses the exact same API that Claude reads.",
    faq2Q: "Is this score Claude's actual verdict?",
    faq2A: "Not exactly. This tool simulates browser-side signals Claude may use, but Claude's server also has IP geolocation, payment method, phone number and other dimensions. The score only reflects how many regional traits your browser exposes.",
    faq3Q: "How to lower the score?",
    faq3A: "You can theoretically modify browser timezone settings (Chrome flags), switch system language, remove Chinese fonts, etc. But this is just 'disguise' — Claude also determines your actual location via IP and payment method.",
    faq4Q: "Will my data be uploaded?",
    faq4A: "No. All detection runs locally in the browser. IP queries go through a Vercel Serverless Function relay with no data stored.",
    // Privacy
    privacyText: '🔒 <strong>Privacy</strong>: Most checks run locally in your browser. Scan results do not leave your device. The server is only used for IP geolocation and does not store scan results. See the <a href="../privacy/">privacy policy</a>.',
    // Signal explanation
    signalExplainTitle: "What Signals Are Detected",
    signalExplainSub: "14 regional fingerprints, weighted into a 0–100 risk score.",
  },
};

function t(key) {
  const val = I18N[currentLang]?.[key] ?? I18N.zh[key] ?? key;
  return typeof val === "function" ? val : val;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("shitclaude-lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = t("title");

  // Update static DOM text
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Trust strip
  const trustSpans = $$(".trust-strip span");
  if (trustSpans.length >= 4) {
    trustSpans[0].childNodes[trustSpans[0].childNodes.length - 1].textContent = t("trust1");
    trustSpans[1].childNodes[trustSpans[1].childNodes.length - 1].textContent = t("trust2");
    trustSpans[2].childNodes[trustSpans[2].childNodes.length - 1].textContent = t("trust3");
    trustSpans[3].childNodes[trustSpans[3].childNodes.length - 1].textContent = t("trust4");
  }

  // Risk badge + verdict
  if ($("#riskBadge")) $("#riskBadge").textContent = t("scanning");
  if ($("#verdict")) $("#verdict").textContent = t("scanningDesc");

  // Rescan button
  updateRescanButton();

  // Server panel
  const serverH2 = $(".server-panel-header h2");
  if (serverH2) serverH2.textContent = t("serverTitle");
  const serverSub = $(".server-panel-subtitle");
  if (serverSub) serverSub.textContent = t("serverSub");

  // Country panel
  const eyebrow = $(".eyebrow");
  if (eyebrow) eyebrow.textContent = t("eyebrow");
  if ($("#countryTitle")) $("#countryTitle").textContent = t("countryTitleDefault");

  // Principle panel
  const principleH2 = $(".principle-panel h2");
  if (principleH2) principleH2.textContent = t("principleTitle");
  const principlePs = $$(".principle-content p");
  if (principlePs.length >= 3) {
    principlePs[0].innerHTML = t("principleP1");
    principlePs[1].innerHTML = t("principleP2");
    principlePs[2].innerHTML = t("principleP3");
  }

  // FAQ panel
  const faqH2 = $(".faq-panel h2");
  if (faqH2) faqH2.textContent = t("faqTitle");
  const faqItems = $$(".faq-item");
  if (faqItems.length >= 4) {
    faqItems[0].querySelector("summary").textContent = t("faq1Q");
    faqItems[0].querySelector("p").textContent = t("faq1A");
    faqItems[1].querySelector("summary").textContent = t("faq2Q");
    faqItems[1].querySelector("p").textContent = t("faq2A");
    faqItems[2].querySelector("summary").textContent = t("faq3Q");
    faqItems[2].querySelector("p").textContent = t("faq3A");
    faqItems[3].querySelector("summary").textContent = t("faq4Q");
    faqItems[3].querySelector("p").textContent = t("faq4A");
  }

  // Privacy panel
  const privacyP = $(".privacy-panel p");
  if (privacyP) privacyP.innerHTML = t("privacyText");

  // Signal explanation panel
  const signalH2 = $(".signals-explain h2");
  if (signalH2) signalH2.textContent = t("signalExplainTitle");
  const signalSub = $(".signals-explain-sub");
  if (signalSub) signalSub.textContent = t("signalExplainSub");

  // Locale switch active state
  $$(".locale-switch a").forEach((a) => {
    a.classList.toggle("active",
      (lang === "zh" && a.textContent.trim() === "中文") ||
      (lang === "en" && a.textContent.trim() === "English")
    );
    a.setAttribute("aria-current", a.classList.contains("active") ? "page" : "false");
  });

  // Re-render with new language
  render();
}

// Map signal labels to i18n keys
const SIGNAL_KEY = {
  "系统时区": "s_timezone", "相近时区": "s_timezoneNear",
  "浏览器语言": "s_lang", "语言族": "s_langFamily",
  "Intl 区域": "s_intl", "地区字体": "s_font",
  "GPU 渲染器": "s_webgl", "数字格式": "s_number",
  "日期格式": "s_date", "键盘布局": "s_keyboard",
  "屏幕 DPI": "s_dpi", "Emoji 渲染": "s_emoji",
  "时区偏移": "s_offset", "住宅 IP ✓": "s_residential",
  "运营商区域": "s_asn", "VPN/数据中心 IP": "s_vpn",
};

// ─── Risk level ──────────────────────────────────────────────────────────────
function getRisk(score) {
  if (score >= 75) return { text: t("highRisk"), className: "", mascot: "../public/mascot/ceo-gun.png" };
  if (score >= 45) return { text: t("midRisk"), className: "medium", mascot: "../public/mascot/ceo-suspect.png" };
  return { text: t("lowRisk"), className: "low", mascot: "../public/mascot/ceo-happy.png" };
}

// ─── Server detail panel ─────────────────────────────────────────────────────
function renderServerDetail(serverFacts, bestCountry) {
  if (!el.serverDetail) return;

  if (!serverFacts || serverFacts.status !== "ok") {
    el.serverDetail.innerHTML = `
      <div class="server-item">
        <span class="server-icon">${ICONS.server}</span>
        <span class="server-label">${t("serverSignal")}</span>
        <span class="server-value muted">${serverFacts?.status === "unavailable" ? t("apiUnreachable") : t("localEnv")}</span>
      </div>`;
    return;
  }

  const match = serverFacts.countryCode?.toUpperCase() === bestCountry.code.toUpperCase();
  const flag = match ? "✅" : "⚠️";

  el.serverDetail.innerHTML = `
    <div class="server-item">
      <span class="server-icon">${ICONS.ip}</span>
      <span class="server-label">${t("ipAddr")}</span>
      <span class="server-value">${serverFacts.ip || "—"}</span>
    </div>
    <div class="server-item">
      <span class="server-icon">${ICONS.globe}</span>
      <span class="server-label">${t("ipCountry")}</span>
      <span class="server-value">${flag} ${serverFacts.country} (${serverFacts.countryCode})</span>
    </div>
    <div class="server-item">
      <span class="server-icon">${ICONS.sliders}</span>
      <span class="server-label">${t("cityTimezone")}</span>
      <span class="server-value">${serverFacts.city || "—"} · ${serverFacts.timezone || "—"}</span>
    </div>
    <div class="server-item">
      <span class="server-icon">${ICONS.shield}</span>
      <span class="server-label">${t("ipType")}</span>
      <span class="server-value ${serverFacts.isProxy ? 'warn' : 'ok'}">${serverFacts.isProxy ? t("ipProxy") : serverFacts.isDatacenter ? t("ipDC") : t("ipResidential")}</span>
    </div>
    <div class="server-item">
      <span class="server-icon">${ICONS.server}</span>
      <span class="server-label">${t("isp")}</span>
      <span class="server-value">${serverFacts.isp || "—"}</span>
    </div>`;

  // Cross-validation badge
  if (el.matchBadge) {
    if (serverFacts.countryCode?.toUpperCase() === bestCountry.code.toUpperCase()) {
      el.matchBadge.textContent = t("matchOk");
      el.matchBadge.className = "match-badge match-ok";
    } else if (serverFacts.isProxy || serverFacts.isDatacenter) {
      el.matchBadge.textContent = t("matchWarn");
      el.matchBadge.className = "match-badge match-warn";
    } else {
      el.matchBadge.textContent = t("matchMismatch");
      el.matchBadge.className = "match-badge match-mismatch";
    }
    el.matchBadge.hidden = false;
  }
}

// ─── Render ──────────────────────────────────────────────────────────────────
function showInitialState() {
  el.riskBadge.textContent = t("pending");
  el.riskBadge.className = "risk-badge pending";
  el.verdict.textContent = t("pendingDesc");
  el.mascot.src = "../public/mascot/ceo-happy.png";
  if (el.signalsBlock) el.signalsBlock.hidden = true;
  updateRescanButton();
}

async function render() {
  try {
    // Show scanning state
    el.riskBadge.textContent = t("scanning");
    el.riskBadge.className = "risk-badge";
    el.verdict.textContent = t("scanningDesc");
    if (el.signalsBlock) el.signalsBlock.hidden = false;

    const facts = getBrowserFacts();

    // Show loading state
    if (el.signals) el.signals.innerHTML = `<span class="signal neutral">${t("loadingIP")}</span>`;

    // Fetch server-side data (parallel with client detection)
    let serverFacts;
    try {
      serverFacts = await getServerFacts();
    } catch (e) {
      serverFacts = { status: "unavailable", country: "Unknown", countryCode: "??" };
    }

  // Score with all signals
  const ranked  = scoreCountries(facts, serverFacts);
  const best    = ranked[0];
  const risk    = getRisk(best.score);
  const certaintyKey = best.score >= 75 ? "certainty75" : best.score >= 45 ? "certainty45" : "certainty0";

  // Animate score
  animateScore(best.score);
  el.riskBadge.textContent = risk.text;
  el.riskBadge.className   = `risk-badge ${risk.className}`.trim();
  el.mascot.src = risk.mascot;
  el.verdict.textContent   = t("verdictTpl")(best.name);
  if (el.countryTitle) el.countryTitle.textContent = t("countryTitleTpl")(best.name, best.score);

  // Render signal chips (translate labels)
  const signals = best.hits.length ? best.hits : [{ label: t("noSignal"), value: 0, icon: "sliders", tone: "neutral" }];
  el.signals.innerHTML = signals
    .map((s) => {
      let label;
      if (SIGNAL_KEY[s.label]) {
        label = t(SIGNAL_KEY[s.label]);
      } else if (typeof s.label === "function") {
        label = s.label;
      } else if (s.label.startsWith("IP 定位")) {
        const country = s.label.split(" · ")[1] || "";
        label = t("s_ip")(country);
      } else {
        label = s.label;
      }
      return `
      <span class="signal ${s.tone || ""}">
        ${ICONS[s.icon] || ICONS.sliders}
        <span>${label}</span>
        <strong>+${s.value}</strong>
      </span>`;
    })
    .join("");

  // Render country ranking
  if (el.countryGrid) {
    el.countryGrid.innerHTML = ranked
      .slice(0, 8)
      .map((c, i) => `
        <span class="country-chip ${i === 0 ? "active" : ""}">
          <span>${c.emoji}</span>
          <span>${c.name}</span>
          <strong>${c.score}</strong>
        </span>`)
      .join("");
  }

  // Render server-side detail
  renderServerDetail(serverFacts, best);

  // Render signal explanation cards
  renderSignalCards(best.hits);

  } catch (e) {
    console.error("Render error:", e);
  }
}

// ─── Score animation ─────────────────────────────────────────────────────────
function animateScore(target) {
  const start = Number(el.scoreValue.textContent) || 0;
  const duration = 620;
  const startTime = performance.now();
  function frame(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    el.scoreValue.textContent = value;
    el.scoreRing.style.setProperty("--score", value);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ─── Init ────────────────────────────────────────────────────────────────────
let hasScanned = false;

function updateRescanButton() {
  const rescanSpan = el.rescanButton.querySelector("span");
  if (rescanSpan) rescanSpan.textContent = hasScanned ? t("rescan") : t("startScan");
}

el.rescanButton.addEventListener("click", async () => {
  hasScanned = true;
  updateRescanButton();
  await render();
});
document.querySelectorAll(".locale-switch a").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const lang = a.textContent.trim() === "中文" ? "zh" : "en";
    if (lang !== currentLang) setLanguage(lang);
  });
});
window.addEventListener("DOMContentLoaded", () => {
  showInitialState();
});

// ─── Test API (expose internals for automated testing) ───────────────────────
window.__test = {
  COUNTRIES,
  ICONS,
  el,
  parseRegion,
  detectFonts,
  measureEmojiWidth,
  detectWebGL,
  detectNumberFormat,
  detectDateFormat,
  detectKeyboardLayout,
  detectScreen,
  getServerFacts,
  scoreCountries,
  sameZoneFamily,
  getRisk,
  renderServerDetail,
  animateScore,
  render,
};
