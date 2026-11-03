// Type definitions for unicode-font-styles 1.0.0

export type StyleId =
  | "bold" | "italic" | "boldItalic" | "script" | "boldScript"
  | "fraktur" | "boldFraktur" | "doubleStruck" | "monospace"
  | "sans" | "sansBold" | "sansItalic" | "sansBoldItalic"
  | "circled" | "smallCaps" | "fullwidth" | "squared" | "negativeSquared"
  | "parenthesized" | "circledNegative" | "superscript" | "subscript";

export type EffectId =
  | "underline" | "doubleUnderline" | "strikethrough" | "slash"
  | "overline" | "circle" | "square" | "keycap";

export interface StyleSupports {
  upper: boolean;
  lower: boolean;
  digits: boolean;
}

export interface StyleInfo {
  id: StyleId;
  label: string;
  /** Which character classes have real styled forms in Unicode. */
  supports: StyleSupports;
  /** Source characters with no styled form; they pass through unchanged. */
  missing: string;
  notes?: string;
}

export interface StyleSet {
  label: string;
  u?: string;
  l?: string;
  d?: string;
  ex?: Record<string, string>;
}

export interface ZalgoOptions {
  /** Marks per character, 1 to 8. Default 3. */
  intensity?: number;
  /** Add marks from the "above" zone. */
  up?: boolean;
  /** Add marks from the "through" zone. */
  mid?: boolean;
  /** Add marks from the "below" zone. */
  down?: boolean;
}

export interface Frame {
  name: string;
  left: string;
  right: string;
}

export interface Effect {
  label: string;
  mark: string;
}

export declare const VERSION: string;

/** Convert plain text into a Unicode style. Throws on an unknown style id. */
export declare function convert(text: string, style: StyleId): string;

/**
 * Turn fancy Unicode text back into plain text. Handles every style in
 * this library plus the common output of other generators. Small caps
 * unstyle to lowercase (the case information is not stored in the text).
 */
export declare function unstyle(text: string): string;

/** Remove combining marks and zero-width characters (undoes zalgo/effects). */
export declare function stripZalgo(text: string): string;

/** Glitch text. Pass a number for the classic behaviour, or options to pick mark zones. */
export declare function zalgo(text: string, intensityOrOptions?: number | ZalgoOptions): string;

/** Layer a combining-mark effect over (already styled) text. Throws on an unknown effect id. */
export declare function effect(text: string, effectId: EffectId): string;

/** Wrap text in one of the decorative frames, by index. */
export declare function frame(text: string, index: number): string;

/** Insert hair spaces between characters. */
export declare function spaced(text: string): string;

/** The unlimited engine: mixed style + effect + frame combinations. Same seed, same output. */
export declare function combos(text: string, count?: number, seed?: number): string[];

/** Flip text upside down (turned letters + grapheme-safe reversal). */
export declare function upsideDown(text: string): string;

/** Reverse text by grapheme cluster: emoji sequences and flags stay intact. */
export declare function reverse(text: string): string;

/** Split text into grapheme clusters. */
export declare function graphemes(text: string): string[];

/** All styles with honest coverage metadata. */
export declare function listStyles(): StyleInfo[];

/** One style's metadata, or null for an unknown id. */
export declare function getStyle(styleId: string): StyleInfo | null;

export declare const SETS: Record<StyleId, StyleSet>;
export declare const META: Record<StyleId, { supports: StyleSupports; missing: string; notes?: string }>;
export declare const FRAMES: Frame[];
export declare const EFFECTS: Record<EffectId, Effect>;
export declare const SYMBOLS: string[];
export declare const UPSIDE_DOWN: Record<string, string>;

declare const api: {
  VERSION: string;
  convert: typeof convert;
  unstyle: typeof unstyle;
  stripZalgo: typeof stripZalgo;
  zalgo: typeof zalgo;
  effect: typeof effect;
  frame: typeof frame;
  spaced: typeof spaced;
  combos: typeof combos;
  upsideDown: typeof upsideDown;
  reverse: typeof reverse;
  graphemes: typeof graphemes;
  listStyles: typeof listStyles;
  getStyle: typeof getStyle;
  SETS: Record<StyleId, StyleSet>;
  META: Record<StyleId, { supports: StyleSupports; missing: string; notes?: string }>;
  FRAMES: Frame[];
  EFFECTS: Record<EffectId, Effect>;
  SYMBOLS: string[];
  UPSIDE_DOWN: Record<string, string>;
};

export default api;
