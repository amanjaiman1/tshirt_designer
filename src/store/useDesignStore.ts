import { create } from "zustand";

/**
 * Foundation design state. In Part 2 this expands into the full Fabric.js
 * source-of-truth model (ARCHITECTURE §2). For now it holds the garment colour
 * so the hero preview is already interactive.
 */
export interface DesignState {
  /** Hex colour applied to the garment base. */
  garmentColor: string;
  setGarmentColor: (color: string) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  garmentColor: "#F4F1EA",
  setGarmentColor: (garmentColor) => set({ garmentColor }),
}));
