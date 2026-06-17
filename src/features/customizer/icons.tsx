/**
 * Minimal line icons (DESIGN.md §2 — custom/line icons, never stock emoji).
 * Stroke inherits `currentColor`; sized 1em so they scale with text.
 */
type IconProps = { className?: string };

const base = {
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const TextIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 6h16M9 6v13M15 6v13" />
  </svg>
);

export const ImageIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="M21 16l-5-5L5 21" />
  </svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);

export const CopyIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);

export const UpIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const DownIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const EyeIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);

export const EyeOffIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M3 3l18 18M10.6 10.7a2.6 2.6 0 0 0 3.7 3.6M9.4 5.2A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3 3.6M6.2 6.3A17 17 0 0 0 2 12s4 7 10 7a9.4 9.4 0 0 0 3.4-.6" />
  </svg>
);

export const LockIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const UnlockIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 7.5-1.9" />
  </svg>
);

export const PlusIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const UploadIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 16V4M7 9l5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
  </svg>
);

export const BoldIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
  </svg>
);

export const ItalicIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M19 5h-6M11 19H5M15 5l-4 14" />
  </svg>
);

export const LayersIcon = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5" />
  </svg>
);
