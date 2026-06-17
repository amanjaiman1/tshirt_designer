import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DesignController } from "./DesignController";

interface DesignerContextValue {
  /** The live canvas controller, or `null` until the canvas has mounted. */
  controller: DesignController | null;
  setController: (controller: DesignController | null) => void;
}

const DesignerContext = createContext<DesignerContextValue | null>(null);

/**
 * Bridges the Fabric canvas (which creates the controller) and the customizer
 * panel (which calls it). The canvas registers the controller here on mount;
 * the panel reads it. Reactive layer/selection state lives in the Zustand store.
 */
export function DesignerProvider({ children }: { children: ReactNode }) {
  const [controller, setController] = useState<DesignController | null>(null);
  const value = useMemo(() => ({ controller, setController }), [controller]);
  return <DesignerContext.Provider value={value}>{children}</DesignerContext.Provider>;
}

export function useDesigner(): DesignerContextValue {
  const ctx = useContext(DesignerContext);
  if (!ctx) throw new Error("useDesigner must be used within a DesignerProvider");
  return ctx;
}
