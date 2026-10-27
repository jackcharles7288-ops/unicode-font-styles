/*
 * unicode-font-styles.js
 * Free Unicode font styles library by Iris Labs (https://fonti.cool)
 * Convert plain text into fancy Unicode fonts for Instagram bios,
 * Discord names, TikTok captions, gaming names and WhatsApp.
 * MIT License. Use it anywhere, free forever.
 *
 * Usage (browser):  <script src="unicode-font-styles.js"></script>
 *                   FontiStyles.convert("Hello", "boldScript")
 * Usage (Node):     const { convert } = require("./unicode-font-styles.js");
 */
(function (global) {
  "use strict";

  var UP = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var LO = "abcdefghijklmnopqrstuvwxyz";
  var DG = "0123456789";

  function range(base, count) {
    var out = "";
    for (var i = 0; i < count; i++) out += String.fromCodePoint(base + i);
    return out;
  }

  /* Each set: u = uppercase map, l = lowercase map, d = digit map,
     ex = exceptions for letters Unicode placed outside the range. */
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
    negativeSquared:{ label: "Black Squared",    u: range(0x1F170, 26) }
  };

  function convertWith(set, text) {
    var U = Array.from(set.u);
    var L = set.l ? Array.from(set.l) : null;
    var D = set.d ? Array.from(set.d) : null;
    return Array.from(String(text)).map(function (ch) {
      if (set.ex && set.ex[ch]) return set.ex[ch];
      var i = UP.indexOf(ch); if (i >= 0) return U[i];
      i = LO.indexOf(ch); if (i >= 0) return L ? L[i] : ch;
      i = DG.indexOf(ch); if (i >= 0) return D ? D[i] : ch;
      return ch;
    }).join("");
  }

  function convert(text, styleId) {
    var set = SETS[styleId];
    if (!set) throw new Error("Unknown style: " + styleId);
    return convertWith(set, text);
  }

  /* Light glitch text: adds combining marks above and below each letter. */
  function zalgo(text, intensity) {
    intensity = Math.max(1, Math.min(8, intensity || 3));
    var marks = [];
    for (var cp = 0x0300; cp <= 0x036F; cp++) marks.push(String.fromCodePoint(cp));
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    return Array.from(String(text)).map(function (ch) {
      if (ch === " " || ch === "\n") return ch;
      var out = ch;
      for (var i = 0; i < intensity; i++) out += marks[Math.floor(rnd() * marks.length)];
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
    overline:      { label: "Overline",      mark: "\u0305" }
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
    return Object.keys(SETS).map(function (id) { return { id: id, label: SETS[id].label }; });
  }

  var api = { convert: convert, zalgo: zalgo, frame: frame, effect: effect, spaced: spaced, combos: combos, listStyles: listStyles, SETS: SETS, FRAMES: FRAMES, EFFECTS: EFFECTS, SYMBOLS: SYMBOLS };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.FontiStyles = api;
})(typeof window !== "undefined" ? window : globalThis);
