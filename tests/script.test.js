/**
 * ShitClaude — Full Test Suite
 * Extracts pure logic via new Function() + tests DOM via happy-dom
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR  = resolve(__dirname, "../zh");
const JS_RAW   = readFileSync(resolve(SRC_DIR, "script.js"), "utf-8");
const HTML     = readFileSync(resolve(SRC_DIR, "index.html"), "utf-8");

// Extract testable module from script.js
function loadModule(mockCtx = {}) {
  // Strip DOM-dependent init code, wrap in function that returns exports
  const body = JS_RAW
    .replace(/\/\/ ─── Init[\s\S]*$/, ""); // remove init + __test block

  const fn = new Function(
    "document", "window", "navigator", "screen", "Intl",
    "performance", "requestAnimationFrame", "console", "fetch", "AbortSignal",
    "localStorage",
    `${body}\nreturn { COUNTRIES, ICONS, I18N, parseRegion, detectFonts, measureEmojiWidth, detectWebGL, detectNumberFormat, detectDateFormat, detectScreen, scoreCountries, sameZoneFamily, getRisk };`
  );

  const doc = mockCtx.document || {
    createElement: () => ({ getContext: () => null, measureText: () => ({ width: 0 }), font: "" }),
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const mockStorage = { getItem: () => "zh", setItem: () => {} };
  return fn(
    doc,
    mockCtx.window || {},
    mockCtx.navigator || { language: "en-US", languages: ["en-US"], keyboard: null },
    mockCtx.screen || { width: 1920, height: 1080 },
    mockCtx.Intl || Intl,
    { now: () => Date.now() },
    () => {},
    console,
    mockCtx.fetch || (async () => ({})),
    mockCtx.AbortSignal || { timeout: () => ({}) },
    mockStorage,
  );
}

const M = loadModule();

function makeFacts(overrides) {
  return {
    locale: "en-US", timeZone: "America/New_York",
    languages: ["en-US"], intlRegion: "US", hour12: true,
    offsetMinutes: 300, fonts: [], emojiWidth: 100, webgl: "",
    numberFmt: { decimal: ".", group: "," }, dateFmt: "MDY",
    keyboard: "QWERTY", screen: { width: 1920, height: 1080, dpr: 1 },
    ...overrides,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. COUNTRIES Database
// ═════════════════════════════════════════════════════════════════════════════
describe("COUNTRIES database", () => {
  it("has 11 countries", () => assert.equal(M.COUNTRIES.length, 11));
  it("every country has required fields", () => {
    const req = ["code","name","emoji","zones","offsets","languages","intlRegions","fonts","webgl","numberFormats","dateFormats","keyboard","dpiRange"];
    for (const c of M.COUNTRIES) for (const f of req) assert.ok(c[f] !== undefined, `${c.code} missing "${f}"`);
  });
  it("every code is 2-letter lowercase", () => {
    for (const c of M.COUNTRIES) assert.match(c.code, /^[a-z]{2}$/);
  });
  it("no duplicate codes", () => {
    const codes = M.COUNTRIES.map((c) => c.code);
    assert.equal(new Set(codes).size, codes.length);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. parseRegion
// ═════════════════════════════════════════════════════════════════════════════
describe("parseRegion", () => {
  it("zh-CN → CN", () => assert.equal(M.parseRegion("zh-CN"), "CN"));
  it("en-US → US", () => assert.equal(M.parseRegion("en-US"), "US"));
  it("en-GB → GB", () => assert.equal(M.parseRegion("en-GB"), "GB"));
  it("zh (no region) → empty", () => assert.equal(M.parseRegion("zh"), ""));
  it("empty string → empty", () => assert.equal(M.parseRegion(""), ""));
  it("ja → empty", () => assert.equal(M.parseRegion("ja"), ""));
  it("zh-Hans-CN → CN", () => assert.equal(M.parseRegion("zh-Hans-CN"), "CN"));
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. sameZoneFamily
// ═════════════════════════════════════════════════════════════════════════════
describe("sameZoneFamily", () => {
  it("Asia/Shanghai = Asia/Chongqing", () => assert.ok(M.sameZoneFamily("Asia/Shanghai", "Asia/Chongqing")));
  it("Europe/London = Europe/Paris", () => assert.ok(M.sameZoneFamily("Europe/London", "Europe/Paris")));
  it("Asia ≠ America", () => assert.ok(!M.sameZoneFamily("Asia/Shanghai", "America/New_York")));
  it("empty → false", () => assert.ok(!M.sameZoneFamily("", "Asia/Shanghai")));
  it("null/undefined → false", () => assert.ok(!M.sameZoneFamily(null, undefined)));
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. getRisk
// ═════════════════════════════════════════════════════════════════════════════
describe("getRisk", () => {
  it("75 → 高风险 ceo-gun", () => { const r = M.getRisk(75); assert.equal(r.text, "高风险"); assert.ok(r.mascot.includes("ceo-gun")); });
  it("60 → 中风险 ceo-suspect", () => { const r = M.getRisk(60); assert.equal(r.text, "中风险"); assert.ok(r.mascot.includes("ceo-suspect")); });
  it("20 → 低风险 ceo-happy", () => { const r = M.getRisk(20); assert.equal(r.text, "低风险"); assert.ok(r.mascot.includes("ceo-happy")); });
  it("0 → 低风险", () => assert.equal(M.getRisk(0).text, "低风险"));
  it("100 → 高风险", () => assert.equal(M.getRisk(100).text, "高风险"));
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. scoreCountries — Client-side
// ═════════════════════════════════════════════════════════════════════════════
describe("scoreCountries — client-side", () => {
  it("CN timezone → 25 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ timeZone: "Asia/Shanghai" }), null);
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.score >= 25, `got ${cn.score}`);
    assert.ok(cn.hits.some((h) => h.label === "系统时区"));
  });
  it("zh-CN language → +15 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ languages: ["zh-CN"], timeZone: "Europe/London", intlRegion: "GB" }), null);
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.hits.some((h) => h.label === "浏览器语言" && h.value === 15));
  });
  it("DE number format → +5 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ numberFmt: { decimal: ",", group: "." } }), null);
    const de = ranked.find((c) => c.code === "de");
    assert.ok(de.hits.some((h) => h.label === "数字格式"));
  });
  it("JP YMD date → +5 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ dateFmt: "YMD" }), null);
    const jp = ranked.find((c) => c.code === "jp");
    assert.ok(jp.hits.some((h) => h.label === "日期格式"));
  });
  it("DE QWERTZ keyboard → +4 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ keyboard: "QWERTZ" }), null);
    const de = ranked.find((c) => c.code === "de");
    assert.ok(de.hits.some((h) => h.label === "键盘布局"));
  });
  it("FR AZERTY keyboard → +4 pts", () => {
    const ranked = M.scoreCountries(makeFacts({ keyboard: "AZERTY" }), null);
    const fr = ranked.find((c) => c.code === "fr");
    assert.ok(fr.hits.some((h) => h.label === "键盘布局"));
  });
  it("DPR 2 → +3 DPI for CN", () => {
    const ranked = M.scoreCountries(makeFacts({ screen: { width: 1920, height: 1080, dpr: 2 } }), null);
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.hits.some((h) => h.label === "屏幕 DPI"));
  });
  it("score capped at 100", () => {
    const ranked = M.scoreCountries(makeFacts({
      timeZone: "Asia/Shanghai", languages: ["zh-CN"], intlRegion: "CN",
      fonts: ["PingFang SC"], webgl: "Apple M1", numberFmt: { decimal: ".", group: "," },
      dateFmt: "YMD", keyboard: "QWERTY", screen: { width: 1920, height: 1080, dpr: 2 },
      emojiWidth: 150, offsetMinutes: -480,
    }), null);
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.score <= 100, `got ${cn.score}`);
  });
  it("sorted descending", () => {
    const ranked = M.scoreCountries(makeFacts({ timeZone: "Asia/Shanghai" }), null);
    for (let i = 1; i < ranked.length; i++)
      assert.ok(ranked[i-1].score >= ranked[i].score);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. scoreCountries — Server-side
// ═════════════════════════════════════════════════════════════════════════════
describe("scoreCountries — server-side", () => {
  const srv = (o) => ({ status: "ok", countryCode: "CN", isProxy: false, isDatacenter: false, org: "China Telecom", ...o });

  it("IP match → +25", () => {
    const ranked = M.scoreCountries(makeFacts({}), srv());
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.hits.some((h) => h.label.includes("IP 定位")));
    assert.ok(cn.score >= 25);
  });
  it("residential IP → +12", () => {
    const ranked = M.scoreCountries(makeFacts({}), srv());
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.hits.some((h) => h.label === "住宅 IP ✓"));
  });
  it("proxy IP → +6 only", () => {
    const ranked = M.scoreCountries(makeFacts({}), srv({ isProxy: true }));
    const cn = ranked.find((c) => c.code === "cn");
    const h = cn.hits.find((x) => x.label.includes("VPN"));
    assert.ok(h); assert.equal(h.value, 6);
  });
  it("datacenter IP → +6 only", () => {
    const ranked = M.scoreCountries(makeFacts({}), srv({ isDatacenter: true }));
    const cn = ranked.find((c) => c.code === "cn");
    const h = cn.hits.find((x) => x.label.includes("数据中心"));
    assert.ok(h); assert.equal(h.value, 6);
  });
  it("ASN match → +5", () => {
    const ranked = M.scoreCountries(makeFacts({}), srv());
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(cn.hits.some((h) => h.label === "运营商区域"));
  });
  it("unavailable → no server hits", () => {
    const ranked = M.scoreCountries(makeFacts({ timeZone: "Asia/Shanghai" }), { status: "unavailable" });
    const cn = ranked.find((c) => c.code === "cn");
    assert.ok(!cn.hits.some((h) => h.label.includes("IP")));
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. DOM elements
// ═════════════════════════════════════════════════════════════════════════════
describe("DOM elements", () => {
  const EL = [
    ".score-ring","#scoreValue","#riskBadge","#verdict","#rescanButton",
    "#signals","#countryTitle","#countryGrid","#mascot",
    "#serverDetail","#matchBadge",".server-panel",".trust-strip",
    ".locale-switch",".brand",
  ];
  for (const s of EL) {
    it(`${s} exists`, () => {
      const w = new Window({ url: "http://localhost:8080/zh/" });
      w.document.write(HTML);
      w.document.close();
      assert.ok(w.document.querySelector(s), `${s} not found`);
      w.close();
    });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. Branding
// ═════════════════════════════════════════════════════════════════════════════
describe("Branding", () => {
  const w = new Window({ url: "http://localhost:8080/zh/" });
  w.document.write(HTML); w.document.close();
  const html = w.document.documentElement.outerHTML;

  it("title has ShitClaude", () => assert.ok(w.document.querySelector("title").textContent.includes("ShitClaude")));
  it("brand is ShitClaude", () => {
    const spans = w.document.querySelectorAll(".brand span");
    assert.equal(spans[spans.length - 1].textContent, "ShitClaude");
  });
  it("no 'Fuck Claude'", () => assert.ok(!html.includes("Fuck Claude")));
  it("no 'GoShitClaude'", () => assert.ok(!html.includes("GoShitClaude")));
  w.close();
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. Locale switch
// ═════════════════════════════════════════════════════════════════════════════
describe("Locale switch", () => {
  const w = new Window({ url: "http://localhost:8080/zh/" });
  w.document.write(HTML); w.document.close();
  it("has English + 中文 links", () => {
    const links = w.document.querySelectorAll(".locale-switch a");
    const t = Array.from(links).map((a) => a.textContent.trim());
    assert.ok(t.includes("English")); assert.ok(t.includes("中文"));
  });
  it("中文 is active", () => {
    const a = w.document.querySelector(".locale-switch a.active");
    assert.equal(a.textContent.trim(), "中文");
  });
  w.close();
});

// ═════════════════════════════════════════════════════════════════════════════
// 10. Trust strip
// ═════════════════════════════════════════════════════════════════════════════
describe("Trust strip", () => {
  const w = new Window({ url: "http://localhost:8080/zh/" });
  w.document.write(HTML); w.document.close();
  it("has 4 badges", () => assert.equal(w.document.querySelectorAll(".trust-strip span").length, 4));
  it("mentions 14 dimensions", () => assert.ok(w.document.querySelector(".trust-strip").textContent.includes("14 维度")));
  w.close();
});

// ═════════════════════════════════════════════════════════════════════════════
// 11. Screen detection
// ═════════════════════════════════════════════════════════════════════════════
describe("detectScreen", () => {
  it("returns width/height/dpr", () => {
    const m = loadModule({ screen: { width: 2560, height: 1440 } });
    const s = m.detectScreen();
    assert.equal(s.width, 2560);
    assert.equal(s.height, 1440);
    assert.equal(s.dpr, 1); // default
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 12. Number format detection
// ═════════════════════════════════════════════════════════════════════════════
describe("detectNumberFormat", () => {
  it("returns decimal and group", () => {
    const nf = M.detectNumberFormat();
    assert.ok(nf.decimal); assert.ok(nf.group);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 13. Date format detection
// ═════════════════════════════════════════════════════════════════════════════
describe("detectDateFormat", () => {
  it("returns MDY, DMY, or YMD", () => {
    const df = M.detectDateFormat();
    assert.ok(["MDY", "DMY", "YMD"].includes(df), `unexpected: ${df}`);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 14. i18n translations
// ═════════════════════════════════════════════════════════════════════════════
describe("i18n", () => {
  it("I18N has both zh and en", () => {
    assert.ok(M.I18N.zh, "missing zh");
    assert.ok(M.I18N.en, "missing en");
  });

  it("zh and en have same keys", () => {
    const zhKeys = Object.keys(M.I18N.zh).sort();
    const enKeys = Object.keys(M.I18N.en).sort();
    assert.deepEqual(zhKeys, enKeys, `mismatch: ${JSON.stringify({ zh: zhKeys, en: enKeys })}`);
  });

  it("risk text translates correctly", () => {
    const mZh = loadModule();
    // Default lang is zh
    assert.equal(mZh.getRisk(80).text, "高风险");
    assert.equal(mZh.getRisk(50).text, "中风险");
    assert.equal(mZh.getRisk(10).text, "低风险");
  });

  it("scoreCountries signal labels are translatable via SIGNAL_KEY", () => {
    const ranked = M.scoreCountries(makeFacts({ timeZone: "Asia/Shanghai" }), null);
    const cn = ranked.find((c) => c.code === "cn");
    for (const hit of cn.hits) {
      // Every hit label should either be in SIGNAL_KEY or be an IP/dynamic label
      const isTranslatable = M.I18N.zh[SIGNAL_KEY_MAP[hit.label]] !== undefined
        || hit.label.startsWith("IP 定位")
        || hit.label.startsWith("住宅")
        || hit.label.startsWith("VPN");
      assert.ok(isTranslatable, `untranslatable label: "${hit.label}"`);
    }
  });
});

// SIGNAL_KEY is module-scoped, expose for test
const SIGNAL_KEY_MAP = {
  "系统时区": "s_timezone", "相近时区": "s_timezoneNear",
  "浏览器语言": "s_lang", "语言族": "s_langFamily",
  "Intl 区域": "s_intl", "地区字体": "s_font",
  "GPU 渲染器": "s_webgl", "数字格式": "s_number",
  "日期格式": "s_date", "键盘布局": "s_keyboard",
  "屏幕 DPI": "s_dpi", "Emoji 渲染": "s_emoji",
  "时区偏移": "s_offset", "住宅 IP ✓": "s_residential",
  "运营商区域": "s_asn", "VPN/数据中心 IP": "s_vpn",
};
