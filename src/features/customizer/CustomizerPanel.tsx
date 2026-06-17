import { useRef, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDesignStore } from "@/store/useDesignStore";
import { useDesigner } from "@/features/designCanvas/DesignerContext";
import {
  DESIGN_PRESETS,
  FONT_OPTIONS,
  GARMENT_COLORS,
  QUICK_TEXT_FIELDS,
  TEXT_COLORS,
} from "@/features/designCanvas/constants";
import {
  FieldLabel,
  IconButton,
  panelItem,
  panelStagger,
  PillButton,
  Section,
  SwatchRow,
} from "./components";
import {
  BoldIcon,
  CopyIcon,
  DownIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  ItalicIcon,
  LockIcon,
  PlusIcon,
  TextIcon,
  TrashIcon,
  UnlockIcon,
  UploadIcon,
  UpIcon,
} from "./icons";
import { SelectedLayerEditor } from "./SelectedLayerEditor";

/**
 * The customizer control panel (ROADMAP Part 2). Reads reactive design state
 * from the Zustand store and drives the Fabric source-of-truth canvas through
 * the DesignController. Styled per DESIGN.md (studio dark surface, owned
 * palette, Fontshare type) — no default/unstyled components.
 */
export function CustomizerPanel() {
  const { controller } = useDesigner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const garmentColor = useDesignStore((s) => s.garmentColor);
  const setGarmentColor = useDesignStore((s) => s.setGarmentColor);
  const layers = useDesignStore((s) => s.layers);
  const selectedId = useDesignStore((s) => s.selectedId);
  const selectedKind = useDesignStore((s) => s.selectedKind);
  const selectedText = useDesignStore((s) => s.selectedText);

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && controller) void controller.addImageFromFile(file);
    // Reset so re-selecting the same file fires change again.
    e.target.value = "";
  };

  return (
    <motion.div
      variants={panelStagger}
      initial="hidden"
      animate="visible"
      className="flex h-full flex-col"
    >
      {/* ── Garment base colour ───────────────────────────────────────── */}
      <Section index="01" title="Garment">
        <FieldLabel>Base colour</FieldLabel>
        <SwatchRow
          colors={GARMENT_COLORS.map((c) => c.value)}
          value={garmentColor}
          onChange={setGarmentColor}
          label="Garment colour"
        />
      </Section>

      {/* ── Group presets ─────────────────────────────────────────────── */}
      <Section index="02" title="Group presets">
        <p className="mb-3 text-xs leading-relaxed text-paper/45">
          Drop in a ready-made layout for club &amp; team merch, then edit the text.
        </p>
        <div className="flex flex-col gap-2">
          {DESIGN_PRESETS.map((preset) => (
            <PillButton
              key={preset.id}
              variant="primary"
              className="w-full justify-start text-left"
              onClick={() => controller?.applyPreset(preset)}
            >
              <span className="flex flex-col">
                <span>{preset.label}</span>
                <span className="text-xs font-normal text-paper/45">{preset.description}</span>
              </span>
            </PillButton>
          ))}
        </div>
      </Section>

      {/* ── Add layers ────────────────────────────────────────────────── */}
      <Section index="03" title="Add to design">
        <FieldLabel>Quick fields</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_TEXT_FIELDS.map((field) => (
            <PillButton
              key={field.name}
              variant="primary"
              className="justify-start text-left text-[13px]"
              onClick={() => controller?.addQuickText(field)}
            >
              <TextIcon className="shrink-0 text-accent" />
              <span className="truncate">{field.name}</span>
            </PillButton>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <PillButton
            variant="ghost"
            className="w-full justify-center ring-1 ring-white/10"
            onClick={() =>
              controller?.addQuickText({
                name: "Text",
                text: "Your text",
                fontFamily: "General Sans",
                fontSize: 90,
                align: "center",
                bold: false,
              })
            }
          >
            <PlusIcon /> Add custom text
          </PillButton>

          <PillButton
            variant="accent"
            className="w-full justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon /> Upload logo / image
          </PillButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            onChange={onUpload}
            className="sr-only"
            aria-label="Upload a logo or image"
          />
        </div>
      </Section>

      {/* ── Selected layer editor ─────────────────────────────────────── */}
      <Section index="04" title="Selected layer">
        <AnimatePresence mode="wait" initial={false}>
          {selectedId ? (
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <SelectedLayerEditor
                key={selectedId}
                selectedKind={selectedKind}
                selectedText={selectedText}
                fonts={FONT_OPTIONS}
                textColors={TEXT_COLORS}
                onChange={(patch) => controller?.updateSelectedText(patch)}
              />

              {/* Common actions for any selected layer */}
              <div className="mt-5 flex items-center gap-2">
                <IconButton ariaLabel="Bring layer forward" onClick={() => controller?.bringForward(selectedId)}>
                  <UpIcon />
                </IconButton>
                <IconButton ariaLabel="Send layer backward" onClick={() => controller?.sendBackward(selectedId)}>
                  <DownIcon />
                </IconButton>
                <IconButton ariaLabel="Duplicate layer" onClick={() => controller?.duplicateSelected()}>
                  <CopyIcon />
                </IconButton>
                <div className="flex-1" />
                <IconButton ariaLabel="Delete layer" onClick={() => controller?.deleteSelected()}>
                  <TrashIcon />
                </IconButton>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs leading-relaxed text-paper/40"
            >
              Select a layer on the canvas or in the list below to edit it. Drag to move, use the
              handles to scale &amp; rotate, or arrow keys to nudge.
            </motion.p>
          )}
        </AnimatePresence>
      </Section>

      {/* ── Layers list ───────────────────────────────────────────────── */}
      <Section index="05" title="Layers">
        {layers.length === 0 ? (
          <p className="text-xs text-paper/40">No layers yet — add text or a logo above.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {layers.map((layer) => {
                const active = layer.id === selectedId;
                return (
                  <motion.li
                    key={layer.id}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ring-1 transition-colors duration-200 ${
                      active
                        ? "bg-accent/10 ring-accent/60"
                        : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => controller?.selectById(layer.id)}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                      aria-label={`Select layer ${layer.name}`}
                      aria-pressed={active}
                    >
                      <span className={`shrink-0 ${active ? "text-accent" : "text-paper/55"}`}>
                        {layer.kind === "text" ? (
                          <TextIcon className="text-base" />
                        ) : (
                          <ImageIcon className="text-base" />
                        )}
                      </span>
                      <span
                        className={`truncate text-sm ${
                          layer.visible ? "text-paper" : "text-paper/40 line-through"
                        }`}
                      >
                        {layer.name}
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-1">
                      <IconButton
                        ariaLabel={layer.visible ? `Hide ${layer.name}` : `Show ${layer.name}`}
                        onClick={() => controller?.toggleVisibility(layer.id)}
                      >
                        {layer.visible ? <EyeIcon /> : <EyeOffIcon />}
                      </IconButton>
                      <IconButton
                        ariaLabel={layer.locked ? `Unlock ${layer.name}` : `Lock ${layer.name}`}
                        active={layer.locked}
                        onClick={() => controller?.toggleLock(layer.id)}
                      >
                        {layer.locked ? <LockIcon /> : <UnlockIcon />}
                      </IconButton>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}

        {layers.length > 0 && (
          <motion.div variants={panelItem} className="mt-4">
            <PillButton
              variant="ghost"
              className="w-full justify-center text-paper/60 ring-1 ring-white/10"
              onClick={() => controller?.clearAll()}
            >
              <TrashIcon /> Clear all layers
            </PillButton>
          </motion.div>
        )}
      </Section>

      <div className="px-5 py-6 text-[11px] leading-relaxed text-paper/35">
        <BoldIcon className="mr-1 inline align-[-2px]" />
        <ItalicIcon className="mr-2 inline align-[-2px]" />
        Tip: bold / italic, font, size &amp; colour live in the selected-layer panel. Press{" "}
        <kbd className="rounded bg-white/10 px-1">Delete</kbd> to remove,{" "}
        <kbd className="rounded bg-white/10 px-1">Esc</kbd> to deselect, arrow keys to nudge.
      </div>
    </motion.div>
  );
}
