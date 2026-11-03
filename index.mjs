// ESM entry point for unicode-font-styles.
// The library core is a single dependency-free file that works as a
// CommonJS module and as a browser global; this wrapper gives bundlers
// and Node ESM real named exports on top of it.
import api from "./unicode-font-styles.js";

export const VERSION = api.VERSION;
export const convert = api.convert;
export const unstyle = api.unstyle;
export const stripZalgo = api.stripZalgo;
export const zalgo = api.zalgo;
export const effect = api.effect;
export const frame = api.frame;
export const spaced = api.spaced;
export const combos = api.combos;
export const upsideDown = api.upsideDown;
export const reverse = api.reverse;
export const graphemes = api.graphemes;
export const listStyles = api.listStyles;
export const getStyle = api.getStyle;
export const SETS = api.SETS;
export const META = api.META;
export const FRAMES = api.FRAMES;
export const EFFECTS = api.EFFECTS;
export const SYMBOLS = api.SYMBOLS;
export const UPSIDE_DOWN = api.UPSIDE_DOWN;

export default api;
