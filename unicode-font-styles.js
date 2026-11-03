/*
 * unicode-font-styles.js
 * Free Unicode font styles library by Iris Labs (https://fonti.cool)
 * Convert plain text into fancy Unicode fonts for Instagram bios,
 * Discord names, TikTok captions, gaming names and WhatsApp.
 * MIT License. Use it anywhere, free forever.
 *
 * Usage (browser):  <script src="unicode-font-styles.js"></script>
 *                   FontiStyles.convert("Hello", "boldScript")
 * Usage (Node):     const { convert } = require("unicode-font-styles");
 * Usage (ESM):      import { convert, unstyle } from "unicode-font-styles";
 *
 * Version 1.0.0. Changes from the 0.x single-file releases:
 * - unstyle(): turn fancy text back into plain text (the decoder merged in)
 * - 4 new styles: parenthesized, circledNegative, superscript, subscript,
 *   each with honest metadata about the letters Unicode does not have
 * - upsideDown() and reverse(), both grapheme-cluster safe
 * - zalgo() takes an options object (up / mid / down), plus stripZalgo()
 * - 3 new effects: circle, square, keycap (combining enclosing marks)
 * - listStyles() now reports what each style supports and what is missing
 *
 * Two things every builder of these tables learns the hard way:
 * 1. The Mathematical Alphanumeric Symbols block (U+1D400-U+1D7FF) has
 *    HOLES. Some letters were already encoded in the older Letterlike
 *    Symbols block, so their slots in the maths block are permanently
 *    unassigned. Simple offset arithmetic returns those empty slots and
 *    users see boxes. The ex maps below are checked first.
 * 2. Almost all of these characters live outside the Basic Multilingual
 *    Plane, so in JavaScript each one is a surrogate pair: "\u{1D41A}".length
 *    is 2. Count code points (Array.from(text).length), not .length, or
 *    your character limits will lie to your users.
 *
 * Accessibility note: screen readers announce many of these characters by
 * their full Unicode names, or skip them. Use styled text as decoration,
 * never as the only copy of important information, and never for a name or
 * hashtag that other people need to search for.
 */
(function (global) {
  "use strict";

  var VERSION = "1.0.0";

  var UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var LO = "abcdefghijklmnopqrstuvwxyz";
  var DG = "0123456789";

  function range(base, count) {
    var out = "";
    for (var i = 0; i < count; i++) out += String.fromCodePoint(base + i);
    return out;
  }

  /* Each set: u = uppercase map, l = lowercase map, d = digit map,
     ex = exceptions for letters Unicode placed outside the range.
     A missing map means that case passes through unchanged, and META
     below says so honestly. Gap letters inside a map are stored as the
     plain letter itself, so they also pass through unchanged. */
  var SETS = {
    bold:           { label: "Bold",             u: range(0x1D400, 26), l: range(0x1D41A, 26), d: range(0x1D7CE, 10) },
    italic:         { label: "Italic",           u: range(0x1D434, 26), l: range(0x1D44E, 26), ex: { h: "\u210E" } },
    boldItalic:     { label: "Bold Italic",      u: range(0x1D468, 26), l: range(0x1D482, 26) },
    script:         { label: "Script (Cursive)", u: range(0x1D49C, 26), l: range(0x1D4B6, 26),
                      ex: { B: "\u212C", E: "\u2130", F: "\u2131", H: "\u210B", I: "\u2110", L: "\u2112", M: "\u2133", R: "\u211B", e: "\u212F", g: "\u210A", o: "\u2134" } },
    boldScript:     { label: "Bold Script",      u: range(0x1D4D0, 26), l: range(0x1D4EA, 26) },
    fraktur:        { label: "Fraktur (Gothic)", u: range(0x1D504, 26), l: range(0x1D51E, 26),
                      ex: { C: "\u212D", H: "\u210C", I: "\u2111", R: "\u211C", Z: "\u2128" } },
    boldFraktur:    { label: "Bold Fraktur",     u: range(0x1D56C, 26), l: range(0x1D586, 26) },
    doubleStruck:   { label: "Double-Struck",    u: range(0x1D538, 26), l: range(0x1D552, 26), d: range(0x1D7D8, 10),
                      ex: { C: "\u2102", H: "\u210D", N: "\u2115", P: "\u2119", Q: "\u211A", R: "\u211D", Z: "\u2124" } },
    monospace:      { label: "Monospace",        u: range(0x1D670, 26), l: range(0x1D68A, 26), d: range(0x1D7F6, 10) },
    sans:           { label: "Sans",             u: range(0x1D5A0, 26), l: range(0x1D5BA, 26), d: range(0x1D7E2, 10) },
    sansBold:       { label: "Sans Bold",        u: range(0x1D5D4, 26), l: range(0x1D5EE, 26), d: range(0x1D7EC, 10) },
    sansItalic:     { label: "Sans Italic",      u: range(0x1D608, 26), l: range(0x1D622, 26) },
    sansBoldItalic: { label: "Sans Bold Italic", u: range(0x1D63C, 26), l: range(0x1D656, 26) },
    circled:        { label: "Circled",          u: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ",
                                                  l: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ", d: "⓪①②③④⑤⑥⑦⑧⑨" },
    smallCaps:      { label: "Small Caps",       u: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ" },
    fullwidth:      { label: "Fullwidth (Vaporwave)", u: range(0xFF21, 26), l: range(0xFF41, 26), d: range(0xFF10, 10) },
    squared:        { label: "Squared",          u: range(0x1F130, 26) },
    negativeSquared:{ label: "Black Squared",    u: range(0x1F170, 26) },
    parenthesized:  { label: "Parenthesized",    u: range(0x1F110, 26), l: range(0x249C, 26), d: "0⑴⑵⑶⑷⑸⑹⑺⑻⑼" },
    circledNegative:{ label: "Black Circled",    u: range(0x1F150, 26), d: "⓿❶❷❸❹❺❻❼❽❾" },
    superscript:    { label: "Superscript (Tiny)", u: "ᴬᴮCᴰᴱFᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿSᵀᵁⱽᵂXYZ",
                                                  l: "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ", d: "⁰¹²³⁴⁵⁶⁷⁸⁹" },
    subscript:      { label: "Subscript (Tiny)", l: "ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz", d: range(0x2080, 10) }
  };

  /* Honest metadata: which character classes each style really covers,
     and which source characters have no styled form in Unicode at all.
     supports.digits means digits 0-9 all have styled forms. */
  var META = {
    bold:           { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    italic:         { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    boldItalic:     { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    script:         { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    boldScript:     { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    fraktur:        { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789",
                      notes: "Unicode has no fraktur digits anywhere; digits pass through unchanged. Do not substitute double-struck digits, they read as a different style." },
    boldFraktur:    { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789",
                      notes: "Unicode has no bold fraktur digits; digits pass through unchanged." },
    doubleStruck:   { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    monospace:      { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    sans:           { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    sansBold:       { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    sansItalic:     { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    sansBoldItalic: { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789" },
    circled:        { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    smallCaps:      { supports: { upper: true,  lower: true,  digits: false }, missing: "0123456789",
                      notes: "Small caps are assembled from phonetic letters. Q uses the lookalike ǫ, and Unicode has no small capital X at all, so X stays a plain x. Unstyling small caps returns lowercase, the case information is lost." },
    fullwidth:      { supports: { upper: true,  lower: true,  digits: true  }, missing: "" },
    squared:        { supports: { upper: true,  lower: false, digits: false }, missing: "abcdefghijklmnopqrstuvwxyz0123456789",
                      notes: "Unicode has squared capital letters only; lowercase and digits pass through unchanged." },
    negativeSquared:{ supports: { upper: true,  lower: false, digits: false }, missing: "abcdefghijklmnopqrstuvwxyz0123456789",
                      notes: "Unicode has black squared capital letters only; lowercase and digits pass through unchanged." },
    parenthesized:  { supports: { upper: true,  lower: true,  digits: true  }, missing: "0",
                      notes: "There is no parenthesized zero in Unicode; 0 passes through unchanged." },
    circledNegative:{ supports: { upper: true,  lower: false, digits: true  }, missing: "abcdefghijklmnopqrstuvwxyz",
                      notes: "Black circled lowercase letters do not exist in Unicode; lowercase passes through unchanged. Digits 1-9 use the dingbat forms." },
    superscript:    { supports: { upper: true,  lower: true,  digits: true  }, missing: "CFQSXYZq",
                      notes: "Superscript capitals C, F, Q, S, X, Y, Z and small q do not exist in Unicode; those letters pass through unchanged." },
    subscript:      { supports: { upper: false, lower: true,  digits: true  }, missing: "ABCDEFGHIJKLMNOPQRSTUVWXYZbcdfgqwyz",
                      notes: "Subscript capitals do not exist in Unicode, and subscript small letters exist only for a, e, h, i, j, k, l, m, n, o, p, r, s, t, u, v, x. Everything else passes through unchanged." }
  };

  function convertWith(set, text) {
    var U = set.u ? Array.from(set.u) : null;
    var L = set.l ? Array.from(set.l) : null;
    var D = set.d ? Array.from(set.d) : null;
    return Array.from(String(text)).map(function (ch) {
      if (set.ex && set.ex[ch]) return set.ex[ch];
      var i = UP.indexOf(ch); if (i >= 0) return U ? U[i] : ch;
      i = LO.indexOf(ch); if (i >= 0) return L ? L[i] : (set === SETS.smallCaps && U ? U[i] : ch);
      i = DG.indexOf(ch); if (i >= 0) return D ? D[i] : ch;
      return ch;
    }).join("");
  }

  function convert(text, styleId) {
    var set = SETS[styleId];
    if (!set) throw new Error("Unknown style: " + styleId);
    return convertWith(set, text);
  }

  /* ------------------------------------------------------------------ *
   * Unstyling: fancy text back to plain text.
   * The reverse table is GENERATED by inverting the encoder tables above,
   * so the two directions can never drift apart. NFKD alone cannot do
   * this job: it folds math letters, circled letters and fullwidth forms,
   * but it does nothing to small caps, superscripts or subscripts, and it
   * unfolds parenthesized letters into "(a)" with the brackets kept.
   * Order: reverse table, NFKD, strip combining marks, reverse table.
   * ------------------------------------------------------------------ */
  var REVERSE = null;
  function buildReverse() {
    var map = {};
    Object.keys(SETS).forEach(function (id) {
      var set = SETS[id];
      [["u", UP], ["l", LO], ["d", DG]].forEach(function (pair) {
        if (!set[pair[0]]) return;
        var chars = Array.from(set[pair[0]]);
        var src = pair[1];
        for (var i = 0; i < chars.length; i++) {
          var fancy = chars[i];
          var plain = src[i];
          if (fancy !== plain && !map[fancy]) map[fancy] = (id === "smallCaps") ? plain.toLowerCase() : plain;
        }
      });
      if (set.ex) Object.keys(set.ex).forEach(function (plain) {
        if (!map[set.ex[plain]]) map[set.ex[plain]] = plain;
      });
    });
    return map;
  }

  var MARK_RANGES = [
    [0x0300, 0x036F], [0x0489, 0x0489], [0x1AB0, 0x1AFF], [0x1DC0, 0x1DFF],
    [0x20D0, 0x20FF], [0xFE20, 0xFE2F],
    [0x200B, 0x200B], [0x200C, 0x200C], [0x200D, 0x200D], [0xFEFF, 0xFEFF]
  ];

  function isMark(cp) {
    for (var i = 0; i < MARK_RANGES.length; i++) {
      if (cp >= MARK_RANGES[i][0] && cp <= MARK_RANGES[i][1]) return true;
    }
    return false;
  }

  /* Remove combining marks and zero-width characters (undoes zalgo and
     the layered effects). Plain letters and emoji bases are kept. */
  function stripZalgo(text) {
    return Array.from(String(text)).filter(function (ch) {
      return !isMark(ch.codePointAt(0));
    }).join("");
  }

  function unstyle(text) {
    if (!REVERSE) REVERSE = buildReverse();
    var pass = function (t) {
      return Array.from(t).map(function (ch) { return REVERSE[ch] || ch; }).join("");
    };
    var out = pass(String(text));
    out = out.normalize("NFKD");
    out = stripZalgo(out);
    out = pass(out);
    return out;
  }

  /* Split into grapheme clusters so reversal never tears an emoji
     sequence, a flag, or a base letter plus its combining marks. */
  function graphemes(text) {
    var t = String(text);
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      var seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      return Array.from(seg.segment(t), function (s) { return s.segment; });
    }
    return Array.from(t);
  }

  function reverse(text) {
    return graphemes(text).reverse().join("");
  }

  /* Upside-down text: flip each character with the turned-letter table,
     then reverse the order (grapheme safe). Letters with no turned form
     in Unicode pass through unchanged. */
  var UPSIDE_DOWN = {
    A: "∀", B: "ꐐ", C: "Ɔ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I",
    J: "ſ", K: "ʞ", L: "˥", M: "Ɯ", N: "N", O: "O", P: "d", Q: "b", R: "ᴚ",
    S: "S", T: "⊥", U: "∩", V: "Ʌ", W: "M", X: "X", Y: "⅄", Z: "Z",
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ",
    j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ",
    s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    "6": "9", "9": "6",
    ".": "˙", ",": "'", "'": ",", "!": "¡", "?": "¿",
    "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
    "<": ">", ">": "<", "&": "⅋", "_": "‾"
  };

  function upsideDown(text) {
    var flipped = graphemes(text).map(function (g) {
      return Array.from(g).map(function (ch) { return UPSIDE_DOWN[ch] || ch; }).join("");
    });
    return flipped.reverse().join("");
  }

  /* Glitch text: adds combining marks to each letter.
     zalgo(text) or zalgo(text, intensity) keeps the original behaviour:
     marks from the whole combining block, seeded so output is stable.
     zalgo(text, { intensity, up, mid, down }) picks mark zones. */
  var ZALGO_UP = [0x0300,0x0301,0x0302,0x0303,0x0304,0x0305,0x0306,0x0307,0x0308,0x0309,0x030A,0x030B,0x030C,0x030D,0x030E,0x030F,0x0310,0x0311,0x0312,0x0313,0x0314,0x033D,0x033E,0x033F,0x0342,0x0343,0x0344,0x0346,0x034A,0x034B,0x034C,0x0350,0x0351,0x0352,0x0357,0x035B,0x035D,0x035E,0x035F,0x0360,0x0361];
  var ZALGO_MID = [0x0315,0x031B,0x0321,0x0322,0x0327,0x0328,0x0334,0x0335,0x0336,0x034F,0x035C,0x0362];
  var ZALGO_DOWN = [0x0316,0x0317,0x0318,0x0319,0x031C,0x031D,0x031E,0x031F,0x0320,0x0323,0x0324,0x0325,0x0326,0x0329,0x032A,0x032B,0x032C,0x032D,0x032E,0x032F,0x0330,0x0331,0x0332,0x0333,0x0339,0x033A,0x033B,0x033C,0x0345,0x0347,0x0348,0x0349,0x034D,0x034E,0x0353,0x0354,0x0355,0x0356,0x0359,0x035A];

  function zalgo(text, intensityOrOptions) {
    var intensity = 3;
    var marks = null;
    if (typeof intensityOrOptions === "number") {
      intensity = intensityOrOptions;
    } else if (intensityOrOptions && typeof intensityOrOptions === "object") {
      if (typeof intensityOrOptions.intensity === "number") intensity = intensityOrOptions.intensity;
      marks = [];
      if (intensityOrOptions.up) marks = marks.concat(ZALGO_UP);
      if (intensityOrOptions.mid) marks = marks.concat(ZALGO_MID);
      if (intensityOrOptions.down) marks = marks.concat(ZALGO_DOWN);
      if (!marks.length) marks = null;
    }
    intensity = Math.max(1, Math.min(8, intensity || 3));
    if (!marks) {
      marks = [];
      for (var cp = 0x0300; cp <= 0x036F; cp++) marks.push(cp);
    }
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    return Array.from(String(text)).map(function (ch) {
      if (ch === " " || ch === "\n") return ch;
      var out = ch;
      for (var i = 0; i < intensity; i++) out += String.fromCodePoint(marks[Math.floor(rnd() * marks.length)]);
      return out;
    }).join("");
  }

  /* Decorative frames for names: wrap already-styled text. */
  var FRAMES = [
    { name: "Royal Gothic",  left: "꧁༺ ", right: " ༻꧂" },
    { name: "Star Ribbon",   left: "★彡 ", right: " 彡★" },
    { name: "Sparkle",       left: "✧ ", right: " ✧" },
    { name: "Crown",         left: "♛ ", right: " ♛" },
    { name: "Bolt",          left: "⚡ ", right: " ⚡" },
    { name: "Hearts",        left: "♡ ", right: " ♡" },
    { name: "Moon Star",     left: "☾⋆⁺₊✧ ", right: " ✧₊⁺⋆☽" },
    { name: "Double Line",   left: "═ ", right: " ═" },
    { name: "Arrows",        left: "➤ ", right: " ➤" },
    { name: "Flower",        left: "✿ ", right: " ✿" },
    { name: "Blossom",       left: "❀ ", right: " ❀" },
    { name: "Music",         left: "♪ ", right: " ♪" },
    { name: "Melody",        left: "♫ ", right: " ♫" },
    { name: "Diamond",       left: "◆ ", right: " ◆" },
    { name: "Dots",          left: "● ", right: " ●" },
    { name: "Cloud",         left: "☁ ", right: " ☁" },
    { name: "Ornament",      left: "❖ ", right: " ❖" },
    { name: "Fleur",         left: "⚜ ", right: " ⚜" },
    { name: "Full Hearts",   left: "♥ ", right: " ♥" },
    { name: "Hollow Stars",  left: "☆ ", right: " ☆" },
    { name: "Knight",        left: "♞ ", right: " ♞" },
    { name: "Yin Yang",      left: "☯ ", right: " ☯" },
    { name: "Cross",         left: "✚ ", right: " ✚" },
    { name: "Sparkle Trail", left: "⋆｡˚ ", right: " ˚｡⋆" }
  ];

  function frame(text, index) {
    var f = FRAMES[index % FRAMES.length];
    return f.left + text + f.right;
  }

  /* Combining-mark effects, layered on top of any converted style. */
  var EFFECTS = {
    underline:     { label: "Underline",     mark: "\u0332" },
    doubleUnderline:{ label: "Double Underline", mark: "\u0333" },
    strikethrough: { label: "Strikethrough", mark: "\u0336" },
    slash:         { label: "Slash",         mark: "\u0338" },
    overline:      { label: "Overline",      mark: "\u0305" },
    circle:        { label: "Enclosing Circle", mark: "\u20DD" },
    square:        { label: "Enclosing Square", mark: "\u20DE" },
    keycap:        { label: "Keycap",        mark: "\u20E3" }
  };

  function effect(text, effectId) {
    var e = EFFECTS[effectId];
    if (!e) throw new Error("Unknown effect: " + effectId);
    return Array.from(String(text)).map(function (ch) {
      return (ch === " " || ch === "\n") ? ch : ch + e.mark;
    }).join("");
  }

  function spaced(text) {
    return Array.from(String(text)).join("\u200A");
  }

  /* Single symbols used as light decorations in combos. */
  var SYMBOLS = ["✦", "★", "♡", "☾", "✿", "⚡", "♛", "❖", "♪", "☁", "✧", "♥", "☆", "❀", "☯", "♞"];

  function mulberry(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /*
   * The unlimited engine: every call mixes a base style with a frame,
   * an effect and decorations in a new combination, so the supply of
   * styles never runs out. Pass any seed; different seed, new styles.
   */
  function combos(text, count, seed) {
    var rnd = mulberry(seed || 1);
    var ids = Object.keys(SETS);
    var effectIds = Object.keys(EFFECTS);
    var seen = {};
    var out = [];
    var guard = 0;
    while (out.length < (count || 24) && guard < (count || 24) * 30) {
      guard++;
      var styled = convertWith(SETS[ids[Math.floor(rnd() * ids.length)]], text);
      var roll = rnd();
      if (roll < 0.18) styled = spaced(styled);
      else if (roll < 0.42) styled = effect(styled, effectIds[Math.floor(rnd() * effectIds.length)]);
      else if (roll < 0.50) styled = zalgo(styled, 1);
      var wrap = rnd();
      var finalText;
      if (wrap < 0.45) finalText = frame(styled, Math.floor(rnd() * FRAMES.length));
      else if (wrap < 0.75) { var s = SYMBOLS[Math.floor(rnd() * SYMBOLS.length)]; finalText = s + " " + styled + " " + s; }
      else finalText = styled;
      if (!seen[finalText]) { seen[finalText] = true; out.push(finalText); }
    }
    return out;
  }

  function listStyles() {
    return Object.keys(SETS).map(function (id) {
      var meta = META[id];
      var entry = { id: id, label: SETS[id].label, supports: meta.supports, missing: meta.missing };
      if (meta.notes) entry.notes = meta.notes;
      return entry;
    });
  }

  function getStyle(styleId) {
    var all = listStyles();
    for (var i = 0; i < all.length; i++) if (all[i].id === styleId) return all[i];
    return null;
  }

  var api = {
    VERSION: VERSION,
    convert: convert,
    unstyle: unstyle,
    stripZalgo: stripZalgo,
    zalgo: zalgo,
    effect: effect,
    frame: frame,
    spaced: spaced,
    combos: combos,
    upsideDown: upsideDown,
    reverse: reverse,
    graphemes: graphemes,
    listStyles: listStyles,
    getStyle: getStyle,
    SETS: SETS,
    META: META,
    FRAMES: FRAMES,
    EFFECTS: EFFECTS,
    SYMBOLS: SYMBOLS,
    UPSIDE_DOWN: UPSIDE_DOWN
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.FontiStyles = api;
})(typeof window !== "undefined" ? window : globalThis);
