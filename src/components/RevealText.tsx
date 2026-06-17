import { motion, useReducedMotion, type Variants } from "framer-motion";

interface RevealTextProps {
  text: string;
  className?: string;
  /** Delay before the stagger begins (seconds). */
  delay?: number;
}

/**
 * Kinetic headline reveal (DESIGN.md §6): each word rises from behind a mask in
 * a staggered sequence with the signature expo easing. Under reduced motion the
 * text simply appears. Renders a <span> (use `className="block"` for line breaks).
 */
export function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: delay },
    },
  };
  const word: Variants = {
    hidden: { y: reduced ? 0 : "110%" },
    visible: {
      y: 0,
      transition: { duration: reduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span className={className} variants={container} initial="hidden" animate="visible">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
