import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/Magnetic";

const NAV = [
  { label: "How it works", to: "/#how" },
  { label: "For clubs", to: "/#clubs" },
  { label: "For societies", to: "/#societies" },
];

export function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-edge flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2" aria-label="Tshirt Designer home">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 ease-expo group-hover:rotate-[18deg]">
            <span className="font-display text-lg leading-none">t.</span>
          </span>
          <span className="font-display text-xl tracking-tightest">
            tshirt<span className="text-violet">.</span>designer
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a key={item.label} href={item.to} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <Magnetic>
          <Link
            to="/design"
            data-cursor="hover"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-violet"
          >
            Start designing
            <span aria-hidden>→</span>
          </Link>
        </Magnetic>
      </div>
    </motion.header>
  );
}
