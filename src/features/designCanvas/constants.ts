import type { LayerKind, TextAlign } from "./types";

/**
 * The 2D canvas is authored in a fixed "design space" that maps 1:1 to the
 * print area (ARCHITECTURE §2 — 4500×5400 @ 300 DPI is a 5:6 ratio). We keep a
 * comfortable working resolution here and let the on-screen canvas zoom to fit
 * its container, so object coordinates are resolution-independent and Part 3's
 * high-DPI export is a simple multiplier.
 */
export const DESIGN_WIDTH = 1500;
export const DESIGN_HEIGHT = 1800;
export const DESIGN_ASPECT = DESIGN_WIDTH / DESIGN_HEIGHT; // 5:6

/** Centre of the print area in design coordinates. */
export const DESIGN_CENTER_X = DESIGN_WIDTH / 2;
export const DESIGN_CENTER_Y = DESIGN_HEIGHT / 2;

/**
 * Curated font menu. The first three are the Fontshare faces already loaded by
 * the app (DESIGN.md §4); the rest are ubiquitous system fonts that need no
 * network fetch — a pragmatic, always-available set for member-authored text.
 */
export interface FontOption {
  label: string;
  /** CSS font-family value handed to Fabric. */
  value: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { label: "Clash Display", value: "Clash Display" },
  { label: "General Sans", value: "General Sans" },
  { label: "JetBrains Mono", value: "JetBrains Mono" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
];

/** Quick swatches for text colour — owned palette + practical neutrals. */
export const TEXT_COLORS = [
  "#0E0E0F",
  "#F4F1EA",
  "#C6F432",
  "#5B3DF5",
  "#C5705D",
  "#FFFFFF",
];

/** Garment base colours offered in the customizer (shared with the 3D preview). */
export const GARMENT_COLORS: { name: string; value: string }[] = [
  { name: "Paper", value: "#F4F1EA" },
  { name: "Ink", value: "#16161A" },
  { name: "Bone", value: "#E9E4D8" },
  { name: "Slate", value: "#3A3F47" },
  { name: "Lime", value: "#C6F432" },
  { name: "Violet", value: "#5B3DF5" },
  { name: "Clay", value: "#C5705D" },
  { name: "Forest", value: "#2E4434" },
];

/** A field a user can drop with one tap — sensible defaults per role. */
export interface QuickTextField {
  /** Layer label shown in the list. */
  name: string;
  /** Placeholder copy the user then edits. */
  text: string;
  fontFamily: string;
  /** Size in design coordinates. */
  fontSize: number;
  align: TextAlign;
  bold: boolean;
}

export const QUICK_TEXT_FIELDS: QuickTextField[] = [
  { name: "Club / society name", text: "YOUR CLUB", fontFamily: "Clash Display", fontSize: 150, align: "center", bold: true },
  { name: "Member name", text: "Member Name", fontFamily: "General Sans", fontSize: 96, align: "center", bold: false },
  { name: "Role", text: "Role / Title", fontFamily: "JetBrains Mono", fontSize: 60, align: "center", bold: false },
  { name: "Number", text: "00", fontFamily: "Clash Display", fontSize: 320, align: "center", bold: true },
];

/** A multi-layer starter laid out for group merch (the killer use-case). */
export interface PresetLayer {
  name: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  align: TextAlign;
  bold: boolean;
  fill: string;
  /** Vertical position as a fraction of the design height (0–1). */
  topRatio: number;
}

export interface DesignPreset {
  id: string;
  label: string;
  description: string;
  layers: PresetLayer[];
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: "club-tagline",
    label: "Club name + tagline",
    description: "A bold club name with a supporting line underneath.",
    layers: [
      {
        name: "Club name",
        text: "YOUR CLUB",
        fontFamily: "Clash Display",
        fontSize: 170,
        align: "center",
        bold: true,
        fill: "#0E0E0F",
        topRatio: 0.4,
      },
      {
        name: "Tagline",
        text: "est. 2026 · stay kinetic",
        fontFamily: "JetBrains Mono",
        fontSize: 52,
        align: "center",
        bold: false,
        fill: "#5B3DF5",
        topRatio: 0.56,
      },
    ],
  },
  {
    id: "member-role-batch",
    label: "Member name + role + batch year",
    description: "Personalise each member's piece — name, role and batch.",
    layers: [
      {
        name: "Member name",
        text: "Member Name",
        fontFamily: "Clash Display",
        fontSize: 130,
        align: "center",
        bold: true,
        fill: "#0E0E0F",
        topRatio: 0.42,
      },
      {
        name: "Role",
        text: "Core Team · Design",
        fontFamily: "General Sans",
        fontSize: 64,
        align: "center",
        bold: false,
        fill: "#0E0E0F",
        topRatio: 0.54,
      },
      {
        name: "Batch year",
        text: "BATCH OF 2026",
        fontFamily: "JetBrains Mono",
        fontSize: 48,
        align: "center",
        bold: false,
        fill: "#5B3DF5",
        topRatio: 0.62,
      },
    ],
  },
];

/** Nudge step (design units) for arrow-key movement; ×5 with Shift. */
export const NUDGE_STEP = 12;

export const LAYER_KIND_LABEL: Record<LayerKind, string> = {
  text: "Text",
  image: "Image",
};
