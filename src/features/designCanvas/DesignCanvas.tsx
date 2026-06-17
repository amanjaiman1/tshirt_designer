import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useDesignStore } from "@/store/useDesignStore";
import { DesignController } from "./DesignController";
import { useDesigner } from "./DesignerContext";
import { DESIGN_ASPECT, DESIGN_HEIGHT, DESIGN_WIDTH } from "./constants";

const STAGE_PADDING = 24;

/**
 * The 2D design canvas — Fabric.js, the source of truth (ARCHITECTURE §2). The
 * canvas is authored in a fixed design/print coordinate space and zoomed to fit
 * its container, so it stays crisp and resolution-independent on any screen.
 * Layer state flows out to the Zustand store via the controller's snapshots;
 * the garment colour flows in from the store as the canvas background.
 */
export function DesignCanvas() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<DesignController | null>(null);

  const { setController } = useDesigner();
  const applySnapshot = useDesignStore((s) => s.applySnapshot);
  const garmentColor = useDesignStore((s) => s.garmentColor);

  // ── Create / dispose the Fabric canvas ──────────────────────────────────
  useEffect(() => {
    const el = canvasElRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;

    const canvas = new fabric.Canvas(el, {
      backgroundColor: useDesignStore.getState().garmentColor,
      preserveObjectStacking: true,
      controlsAboveOverlay: true,
      enableRetinaScaling: true,
    });

    const controller = new DesignController(canvas, applySnapshot);
    controllerRef.current = controller;
    setController(controller);

    const fit = () => {
      const aw = stage.clientWidth - STAGE_PADDING * 2;
      const ah = stage.clientHeight - STAGE_PADDING * 2;
      if (aw <= 0 || ah <= 0) return;
      let w = Math.min(aw, ah * DESIGN_ASPECT);
      w = Math.max(0, Math.floor(w));
      const h = Math.floor(w / DESIGN_ASPECT);
      controller.resize(w, h);
    };
    fit();
    controller.syncNow();

    const ro = new ResizeObserver(fit);
    ro.observe(stage);

    return () => {
      ro.disconnect();
      setController(null);
      controllerRef.current = null;
      controller.dispose();
    };
    // applySnapshot/setController are stable; run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Garment colour → canvas background ──────────────────────────────────
  useEffect(() => {
    controllerRef.current?.setBackgroundColor(garmentColor);
  }, [garmentColor]);

  // ── Keyboard interactions (a11y) ────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const controller = controllerRef.current;
      if (!controller) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const inField =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable === true;
      if (inField || controller.hasActiveTextEditing()) return;

      switch (e.key) {
        case "Delete":
        case "Backspace":
          e.preventDefault();
          controller.deleteSelected();
          break;
        case "Escape":
          controller.deselect();
          break;
        case "ArrowLeft":
          e.preventDefault();
          controller.nudge(-1, 0, e.shiftKey);
          break;
        case "ArrowRight":
          e.preventDefault();
          controller.nudge(1, 0, e.shiftKey);
          break;
        case "ArrowUp":
          e.preventDefault();
          controller.nudge(0, -1, e.shiftKey);
          break;
        case "ArrowDown":
          e.preventDefault();
          controller.nudge(0, 1, e.shiftKey);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ padding: STAGE_PADDING }}
    >
      {/* The print-area frame — a subtle paper card the design sits on. */}
      <div
        className="relative shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
        style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}` }}
      >
        <canvas ref={canvasElRef} aria-label="Garment design canvas" />
      </div>
    </div>
  );
}
