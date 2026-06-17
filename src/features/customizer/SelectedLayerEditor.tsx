import type { FontOption } from "@/features/designCanvas/constants";
import type { LayerKind, TextAlign, TextLayerProps } from "@/features/designCanvas/types";
import { FieldLabel, IconButton, RangeField, Segmented, SwatchRow } from "./components";
import { BoldIcon, ImageIcon, ItalicIcon } from "./icons";

const ALIGN_OPTIONS: { value: TextAlign; label: string; aria: string }[] = [
  { value: "left", label: "↤", aria: "Align left" },
  { value: "center", label: "↔", aria: "Align centre" },
  { value: "right", label: "↦", aria: "Align right" },
];

/**
 * Controls for the currently-selected layer. For text layers it exposes the
 * full type system (content, font, size, colour, alignment, weight/style); for
 * images it explains the on-canvas transform handles. Driven entirely by the
 * store snapshot, mutating the canvas through `onChange`.
 */
export function SelectedLayerEditor({
  selectedKind,
  selectedText,
  fonts,
  textColors,
  onChange,
}: {
  selectedKind: LayerKind | null;
  selectedText: TextLayerProps | null;
  fonts: FontOption[];
  textColors: string[];
  onChange: (patch: Partial<TextLayerProps>) => void;
}) {
  if (selectedKind === "image") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
        <ImageIcon className="mt-0.5 shrink-0 text-lg text-accent" />
        <p className="text-xs leading-relaxed text-paper/55">
          Image layer selected. Drag to reposition, use the corner handles to scale and the top
          handle to rotate. Arrow keys nudge it into place.
        </p>
      </div>
    );
  }

  if (!selectedText) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Text content */}
      <div>
        <FieldLabel>Text</FieldLabel>
        <textarea
          value={selectedText.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={2}
          aria-label="Layer text"
          className="w-full resize-none rounded-xl bg-white/[0.04] px-3 py-2.5 text-sm text-paper ring-1 ring-white/10 transition-colors placeholder:text-paper/30 focus:ring-accent"
          placeholder="Type your text…"
        />
      </div>

      {/* Font family */}
      <div>
        <FieldLabel>Font</FieldLabel>
        <div className="relative">
          <select
            value={selectedText.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            aria-label="Font family"
            className="w-full appearance-none rounded-xl bg-white/[0.04] px-3 py-2.5 text-sm text-paper ring-1 ring-white/10 focus:ring-accent"
            style={{ fontFamily: selectedText.fontFamily }}
          >
            {fonts.map((f) => (
              <option key={f.value} value={f.value} className="bg-ink text-paper">
                {f.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-paper/40">
            ▾
          </span>
        </div>
      </div>

      {/* Size */}
      <RangeField
        label="Size"
        value={selectedText.fontSize}
        min={16}
        max={480}
        step={2}
        onChange={(v) => onChange({ fontSize: v })}
      />

      {/* Alignment + weight/style */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <FieldLabel>Align</FieldLabel>
          <Segmented
            label="Text alignment"
            value={selectedText.textAlign}
            onChange={(v) => onChange({ textAlign: v })}
            options={ALIGN_OPTIONS}
          />
        </div>
        <div>
          <FieldLabel>Style</FieldLabel>
          <div className="flex items-center gap-2">
            <IconButton
              ariaLabel="Bold"
              active={selectedText.bold}
              onClick={() => onChange({ bold: !selectedText.bold })}
            >
              <BoldIcon />
            </IconButton>
            <IconButton
              ariaLabel="Italic"
              active={selectedText.italic}
              onClick={() => onChange({ italic: !selectedText.italic })}
            >
              <ItalicIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Colour */}
      <div>
        <FieldLabel>Colour</FieldLabel>
        <SwatchRow
          colors={textColors}
          value={selectedText.fill}
          onChange={(c) => onChange({ fill: c })}
          label="Text colour"
        />
      </div>
    </div>
  );
}
