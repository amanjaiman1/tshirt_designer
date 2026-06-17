import { create } from "zustand";
import type {
  DesignSnapshot,
  LayerKind,
  LayerMeta,
  TextLayerProps,
} from "@/features/designCanvas/types";

/**
 * Design state — the reactive mirror of the Fabric.js source-of-truth canvas
 * (ARCHITECTURE §2). The live canvas lives in the DesignController (outside
 * React); this store holds the serialisable view of it that the UI binds to:
 * the garment colour, the layer list, and the current selection. Keeping it
 * here means both the customizer panel and (in Part 3) the 3D preview read from
 * one place.
 */
export interface DesignState {
  /** Hex colour applied to the garment base (drives the 2D canvas + 3D mesh). */
  garmentColor: string;
  setGarmentColor: (color: string) => void;

  /** Layers, top-most first — mirrors the canvas stacking order for the UI. */
  layers: LayerMeta[];
  /** Id of the selected layer, or `null` when nothing is selected. */
  selectedId: string | null;
  /** Kind of the selected layer (drives which controls are shown). */
  selectedKind: LayerKind | null;
  /** Editable props of the selected text layer, or `null` if not text. */
  selectedText: TextLayerProps | null;

  /** Replace the canvas-derived slice of state in one atomic update. */
  applySnapshot: (snapshot: DesignSnapshot) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  garmentColor: "#F4F1EA",
  setGarmentColor: (garmentColor) => set({ garmentColor }),

  layers: [],
  selectedId: null,
  selectedKind: null,
  selectedText: null,

  applySnapshot: ({ layers, selectedId, selectedKind, selectedText }) =>
    set({ layers, selectedId, selectedKind, selectedText }),
}));
