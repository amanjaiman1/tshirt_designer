import * as fabric from "fabric";
import {
  DESIGN_CENTER_X,
  DESIGN_CENTER_Y,
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  NUDGE_STEP,
  type DesignPreset,
  type QuickTextField,
} from "./constants";
import type {
  DesignSnapshot,
  LayerKind,
  LayerMeta,
  TextAlign,
  TextLayerProps,
} from "./types";

/** Fabric object decorated with the metadata our UI needs. */
type DesignObject = fabric.FabricObject & {
  layerId: string;
  layerKind: LayerKind;
  layerName: string;
};

/** Cosmetic control styling so selection handles match the brand (DESIGN.md). */
const CONTROL_STYLE: Partial<fabric.FabricObject> = {
  cornerColor: "#C6F432",
  cornerStrokeColor: "#0E0E0F",
  borderColor: "#C6F432",
  cornerStyle: "circle",
  transparentCorners: false,
  cornerSize: 16,
  borderScaleFactor: 1.5,
  padding: 8,
};

const SYSTEM_FONTS = new Set([
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
]);

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `layer_${Date.now().toString(36)}_${idCounter}`;
}

function isDesignObject(obj: fabric.FabricObject): obj is DesignObject {
  return typeof (obj as DesignObject).layerId === "string";
}

/** Best-effort: make sure a web font is ready before Fabric measures/renders it. */
async function ensureFontLoaded(family: string): Promise<void> {
  if (SYSTEM_FONTS.has(family)) return;
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`400 64px "${family}"`),
      document.fonts.load(`700 64px "${family}"`),
    ]);
  } catch {
    /* font service hiccup — Fabric falls back gracefully */
  }
}

/**
 * Owns the live Fabric.js canvas — the source of truth (ARCHITECTURE §2). React
 * never mutates Fabric objects directly; it calls these methods, and the
 * controller pushes a serialisable snapshot back out via `onSnapshot` so the
 * Zustand store / UI stay in sync.
 */
export class DesignController {
  private canvas: fabric.Canvas;
  private onSnapshot: (snapshot: DesignSnapshot) => void;
  private disposed = false;
  private dropIndex = 0;

  constructor(canvas: fabric.Canvas, onSnapshot: (snapshot: DesignSnapshot) => void) {
    this.canvas = canvas;
    this.onSnapshot = onSnapshot;

    canvas.selectionColor = "rgba(198, 244, 50, 0.12)";
    canvas.selectionBorderColor = "#C6F432";
    canvas.selectionLineWidth = 1.5;
    canvas.preserveObjectStacking = true;
    canvas.uniformScaling = true;

    const emit = () => this.emit();
    canvas.on("object:added", emit);
    canvas.on("object:removed", emit);
    canvas.on("object:modified", emit);
    canvas.on("text:changed", emit);
    canvas.on("selection:created", emit);
    canvas.on("selection:updated", emit);
    canvas.on("selection:cleared", emit);
  }

  // ── Sizing ────────────────────────────────────────────────────────────────

  /**
   * Fit the on-screen canvas to its container while keeping the fixed design
   * coordinate space. Objects are authored at print resolution; only the zoom
   * (viewport transform) changes for display.
   */
  resize(displayWidth: number, displayHeight: number): void {
    if (this.disposed || displayWidth <= 0 || displayHeight <= 0) return;
    const zoom = displayWidth / DESIGN_WIDTH;
    this.canvas.setDimensions({ width: displayWidth, height: displayHeight });
    this.canvas.setZoom(zoom);
    this.canvas.requestRenderAll();
  }

  // ── Garment base ────────────────────────────────────────────────────────

  setBackgroundColor(color: string): void {
    if (this.disposed) return;
    this.canvas.backgroundColor = color;
    this.canvas.requestRenderAll();
  }

  // ── Adding layers ─────────────────────────────────────────────────────────

  private styleAndRegister(obj: fabric.FabricObject, kind: LayerKind, name: string): DesignObject {
    obj.set(CONTROL_STYLE);
    const decorated = obj as DesignObject;
    decorated.layerId = nextId();
    decorated.layerKind = kind;
    decorated.layerName = name;
    return decorated;
  }

  /** Slightly cascade new layers so successive drops don't perfectly overlap. */
  private nextDropY(): number {
    const span = DESIGN_HEIGHT * 0.18;
    const y = DESIGN_CENTER_Y - span / 2 + (this.dropIndex % 5) * (span / 4);
    this.dropIndex += 1;
    return y;
  }

  private buildTextbox(opts: {
    text: string;
    fontFamily: string;
    fontSize: number;
    align: TextAlign;
    bold: boolean;
    fill: string;
    left: number;
    top: number;
  }): fabric.Textbox {
    return new fabric.Textbox(opts.text, {
      left: opts.left,
      top: opts.top,
      originX: "center",
      originY: "center",
      width: DESIGN_WIDTH * 0.82,
      fontFamily: opts.fontFamily,
      fontSize: opts.fontSize,
      fill: opts.fill,
      textAlign: opts.align,
      fontWeight: opts.bold ? "bold" : "normal",
      fontStyle: "normal",
      lineHeight: 1.05,
      editable: true,
      centeredRotation: true,
      splitByGrapheme: false,
    });
  }

  async addQuickText(field: QuickTextField): Promise<void> {
    if (this.disposed) return;
    await ensureFontLoaded(field.fontFamily);
    const textbox = this.buildTextbox({
      text: field.text,
      fontFamily: field.fontFamily,
      fontSize: field.fontSize,
      align: field.align,
      bold: field.bold,
      fill: "#0E0E0F",
      left: DESIGN_CENTER_X,
      top: this.nextDropY(),
    });
    this.styleAndRegister(textbox, "text", field.name);
    this.canvas.add(textbox);
    this.canvas.setActiveObject(textbox);
    this.canvas.requestRenderAll();
    this.emit();
  }

  /** Replace the design with a multi-layer group preset (clears existing layers). */
  async applyPreset(preset: DesignPreset): Promise<void> {
    if (this.disposed) return;
    await Promise.all(preset.layers.map((l) => ensureFontLoaded(l.fontFamily)));
    this.clearAll();
    let last: fabric.Textbox | null = null;
    for (const layer of preset.layers) {
      const textbox = this.buildTextbox({
        text: layer.text,
        fontFamily: layer.fontFamily,
        fontSize: layer.fontSize,
        align: layer.align,
        bold: layer.bold,
        fill: layer.fill,
        left: DESIGN_CENTER_X,
        top: DESIGN_HEIGHT * layer.topRatio,
      });
      this.styleAndRegister(textbox, "text", layer.name);
      this.canvas.add(textbox);
      last = textbox;
    }
    if (last) this.canvas.setActiveObject(last);
    this.canvas.requestRenderAll();
    this.emit();
  }

  /** Load an uploaded image/logo file and place it centred on the garment. */
  async addImageFromFile(file: File): Promise<void> {
    if (this.disposed) return;
    const dataUrl = await readFileAsDataURL(file);
    const img = await fabric.FabricImage.fromURL(dataUrl);
    if (this.disposed) return;

    const maxDim = DESIGN_WIDTH * 0.55;
    const natural = Math.max(img.width ?? 1, img.height ?? 1);
    const scale = natural > maxDim ? maxDim / natural : 1;
    img.set({
      originX: "center",
      originY: "center",
      left: DESIGN_CENTER_X,
      top: this.nextDropY(),
      scaleX: scale,
      scaleY: scale,
      centeredRotation: true,
    });
    const name = file.name.replace(/\.[^.]+$/, "").slice(0, 28) || "Logo";
    this.styleAndRegister(img, "image", name);
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.requestRenderAll();
    this.emit();
  }

  // ── Editing the selected text layer ────────────────────────────────────────

  async updateSelectedText(patch: Partial<TextLayerProps>): Promise<void> {
    if (this.disposed) return;
    const obj = this.canvas.getActiveObject();
    if (!obj || !isText(obj)) return;

    if (patch.fontFamily) await ensureFontLoaded(patch.fontFamily);
    if (this.disposed) return;

    if (patch.text !== undefined) obj.set("text", patch.text);
    if (patch.fontFamily !== undefined) obj.set("fontFamily", patch.fontFamily);
    if (patch.fontSize !== undefined) obj.set("fontSize", patch.fontSize);
    if (patch.fill !== undefined) obj.set("fill", patch.fill);
    if (patch.textAlign !== undefined) obj.set("textAlign", patch.textAlign);
    if (patch.bold !== undefined) obj.set("fontWeight", patch.bold ? "bold" : "normal");
    if (patch.italic !== undefined) obj.set("fontStyle", patch.italic ? "italic" : "normal");

    obj.initDimensions?.();
    obj.setCoords();
    this.canvas.requestRenderAll();
    this.emit();
  }

  // ── Layer management ───────────────────────────────────────────────────────

  private findById(id: string): DesignObject | undefined {
    return this.canvas.getObjects().find((o) => isDesignObject(o) && o.layerId === id) as
      | DesignObject
      | undefined;
  }

  selectById(id: string): void {
    if (this.disposed) return;
    const obj = this.findById(id);
    if (!obj) return;
    this.canvas.setActiveObject(obj);
    this.canvas.requestRenderAll();
    this.emit();
  }

  deselect(): void {
    if (this.disposed) return;
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emit();
  }

  deleteSelected(): void {
    if (this.disposed) return;
    const active = this.canvas.getActiveObjects();
    if (active.length === 0) return;
    active.forEach((o) => this.canvas.remove(o));
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emit();
  }

  duplicateSelected(): void {
    if (this.disposed) return;
    const obj = this.canvas.getActiveObject();
    if (!obj || !isDesignObject(obj)) return;
    void obj.clone().then((clone: fabric.FabricObject) => {
      if (this.disposed) return;
      const src = obj as DesignObject;
      const dupe = this.styleAndRegister(clone, src.layerKind, `${src.layerName} copy`);
      dupe.set({ left: (obj.left ?? 0) + 40, top: (obj.top ?? 0) + 40 });
      this.canvas.add(dupe);
      this.canvas.setActiveObject(dupe);
      this.canvas.requestRenderAll();
      this.emit();
    });
  }

  bringForward(id: string): void {
    const obj = this.findById(id);
    if (!obj) return;
    this.canvas.bringObjectForward(obj);
    this.canvas.requestRenderAll();
    this.emit();
  }

  sendBackward(id: string): void {
    const obj = this.findById(id);
    if (!obj) return;
    this.canvas.sendObjectBackwards(obj);
    this.canvas.requestRenderAll();
    this.emit();
  }

  toggleVisibility(id: string): void {
    const obj = this.findById(id);
    if (!obj) return;
    obj.visible = obj.visible === false;
    if (!obj.visible) this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emit();
  }

  toggleLock(id: string): void {
    const obj = this.findById(id);
    if (!obj) return;
    const locked = obj.selectable !== false;
    obj.selectable = !locked;
    obj.evented = !locked;
    obj.lockMovementX = locked;
    obj.lockMovementY = locked;
    obj.lockRotation = locked;
    obj.lockScalingX = locked;
    obj.lockScalingY = locked;
    if (locked) this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emit();
  }

  /** Keyboard nudge of the active object in design units. */
  nudge(dx: number, dy: number, large = false): void {
    if (this.disposed) return;
    const obj = this.canvas.getActiveObject();
    if (!obj) return;
    const step = NUDGE_STEP * (large ? 5 : 1);
    obj.set({ left: (obj.left ?? 0) + dx * step, top: (obj.top ?? 0) + dy * step });
    obj.setCoords();
    this.canvas.requestRenderAll();
    this.emit();
  }

  clearAll(): void {
    if (this.disposed) return;
    this.canvas.getObjects().slice().forEach((o) => this.canvas.remove(o));
    this.canvas.discardActiveObject();
    this.dropIndex = 0;
    this.canvas.requestRenderAll();
    this.emit();
  }

  hasActiveTextEditing(): boolean {
    const obj = this.canvas.getActiveObject();
    return Boolean(obj && isText(obj) && obj.isEditing);
  }

  // ── Snapshot ────────────────────────────────────────────────────────────

  private emit(): void {
    if (this.disposed) return;
    const objects = this.canvas.getObjects().filter(isDesignObject);
    // Top-most first for the UI list (Fabric stores bottom→top).
    const layers: LayerMeta[] = objects
      .slice()
      .reverse()
      .map((o) => ({
        id: o.layerId,
        kind: o.layerKind,
        name: o.layerName,
        visible: o.visible !== false,
        locked: o.selectable === false,
      }));

    const active = this.canvas.getActiveObject();
    let selectedId: string | null = null;
    let selectedKind: LayerKind | null = null;
    let selectedText: TextLayerProps | null = null;

    if (active && isDesignObject(active)) {
      selectedId = active.layerId;
      selectedKind = active.layerKind;
      if (isText(active)) {
        const weight = active.fontWeight;
        selectedText = {
          text: active.text ?? "",
          fontFamily: typeof active.fontFamily === "string" ? active.fontFamily : "General Sans",
          fontSize: Math.round(active.fontSize ?? 0),
          fill: typeof active.fill === "string" ? active.fill : "#0E0E0F",
          textAlign: (active.textAlign as TextAlign) ?? "center",
          bold: weight === "bold" || Number(weight) >= 600,
          italic: active.fontStyle === "italic",
        };
      }
    }

    this.onSnapshot({ layers, selectedId, selectedKind, selectedText });
  }

  /** Push the current state immediately (used right after mount). */
  syncNow(): void {
    this.emit();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Cancel any pending render so Fabric's dispose() runs destroy()
    // synchronously — this fully reverses the DOM before React StrictMode's
    // immediate re-mount, avoiding "already initialized" errors / stray nodes.
    this.canvas.cancelRequestedRender();
    void this.canvas.dispose();
  }
}

function isText(obj: fabric.FabricObject): obj is fabric.Textbox {
  return obj.type === "textbox" || obj instanceof fabric.Textbox;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
