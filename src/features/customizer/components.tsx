import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/** Shared entrance easing — DESIGN.md §6 ("expo-out"). */
const EXPO = [0.16, 1, 0.3, 1] as const;

/** Stagger container for panel sections. */
export const panelStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

export const panelItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO } },
};

/** A labelled section of the customizer. */
export function Section({
  title,
  index,
  children,
  action,
}: {
  title: string;
  index: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <motion.section variants={panelItem} className="border-b border-white/10 px-5 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">
          <span className="text-accent">{index}</span>
          {title}
        </h2>
        {action}
      </header>
      {children}
    </motion.section>
  );
}

/** A small label above a control group. */
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
      {children}
    </span>
  );
}

type PillVariant = "primary" | "ghost" | "accent";

const PILL_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40";

const PILL_VARIANT: Record<PillVariant, string> = {
  primary: "bg-white/[0.06] text-paper hover:bg-white/[0.12] ring-1 ring-white/10",
  ghost: "text-paper/70 hover:text-paper hover:bg-white/[0.06]",
  accent: "bg-accent text-ink hover:brightness-95",
};

/** A motion-aware button with hover/tap micro-interactions. */
export function PillButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
  ariaLabel,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: PillVariant;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.18, ease: EXPO }}
      className={`${PILL_BASE} ${PILL_VARIANT[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

/** A compact square icon button (layer actions). */
export function IconButton({
  children,
  onClick,
  ariaLabel,
  active = false,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={`grid h-8 w-8 place-items-center rounded-lg text-paper/70 ring-1 transition-colors duration-200 hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "bg-accent/90 text-ink ring-accent"
          : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.1]"
      }`}
    >
      {children}
    </motion.button>
  );
}

/** A row of colour swatches plus a custom-colour input. */
export function SwatchRow({
  colors,
  value,
  onChange,
  label,
}: {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
  label: string;
}) {
  const normalized = value?.toLowerCase();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((c) => {
        const selected = c.toLowerCase() === normalized;
        return (
          <motion.button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={`${label}: ${c}`}
            aria-pressed={selected}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15, ease: EXPO }}
            className={`h-8 w-8 rounded-full ring-1 ring-white/15 ${
              selected ? "ring-2 ring-accent ring-offset-2 ring-offset-ink" : ""
            }`}
            style={{ backgroundColor: c }}
          />
        );
      })}
      <label
        className="relative grid h-8 w-8 cursor-pointer place-items-center rounded-full ring-1 ring-white/15"
        title="Custom colour"
        style={{
          background:
            "conic-gradient(from 0deg, #ff004c, #ffb800, #00d4ff, #7a2bff, #ff004c)",
        }}
      >
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label}: custom colour`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span className="pointer-events-none text-xs font-bold text-white mix-blend-difference">
          +
        </span>
      </label>
    </div>
  );
}

/** Generic segmented control (used for text alignment). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: ReactNode; aria: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/10"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-label={o.aria}
            aria-pressed={active}
            className={`relative grid h-8 min-w-9 place-items-center rounded-lg px-2 text-sm transition-colors duration-200 ${
              active ? "text-ink" : "text-paper/60 hover:text-paper"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ duration: 0.25, ease: EXPO }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** A labelled range slider with a live value readout. */
export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <span className="font-mono text-xs text-paper/70">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="slider-accent h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15"
      />
    </div>
  );
}
