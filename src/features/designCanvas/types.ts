/**
 * Shared types for the 2D design canvas — the source of truth (ARCHITECTURE §2).
 * Kept framework-agnostic so the Zustand store can mirror canvas state without
 * importing Fabric at runtime.
 */

/** The kinds of layer a user can place on the garment. */
export type LayerKind = "text" | "image";

/** Horizontal alignment options exposed for text layers. */
export type TextAlign = "left" | "center" | "right";

/**
 * Lightweight, serialisable description of a single layer. Mirrored into the
 * store so the customizer UI (layer list, selection) stays reactive without
 * touching live Fabric objects directly.
 */
export interface LayerMeta {
  id: string;
  kind: LayerKind;
  /** Human label shown in the layer list (e.g. "Club name"). */
  name: string;
  visible: boolean;
  locked: boolean;
}

/**
 * The editable properties of the currently-selected text layer, surfaced to the
 * customizer's controlled inputs. `null` in the store when no text is selected.
 */
export interface TextLayerProps {
  text: string;
  fontFamily: string;
  /** Font size in design (print) coordinates. */
  fontSize: number;
  fill: string;
  textAlign: TextAlign;
  bold: boolean;
  italic: boolean;
}

/**
 * A snapshot of canvas state pushed into the store on every meaningful change.
 * `layers` is ordered top-most first (matching how the UI list reads).
 */
export interface DesignSnapshot {
  layers: LayerMeta[];
  selectedId: string | null;
  selectedKind: LayerKind | null;
  selectedText: TextLayerProps | null;
}
